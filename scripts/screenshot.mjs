#!/usr/bin/env node
/**
 * suisopot LP 自動スクショ + pixelmatch 2段diff スクリプト
 *
 * 使い方:
 *   pnpm screenshot {section}  // 1セクションだけ
 *   pnpm screenshot --all      // 全セクション
 *   pnpm screenshot --check    // セットアップ動作確認のみ
 *
 * 出力:
 *   .claude/handoff/screenshots/{section}/
 *     local-pc__YYYY-MM-DD_HH-MM-SS.png
 *     local-sp__YYYY-MM-DD_HH-MM-SS.png
 *     diff-pc__YYYY-MM-DD_HH-MM-SS.png
 *     diff-sp__YYYY-MM-DD_HH-MM-SS.png
 *     report.json
 *
 * 前提:
 *   - pnpm preview で http://localhost:4321 が起動済み
 *   - Figma スクショは事前に figma-pc__*.png / figma-sp__*.png 配置済み
 */

import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(ROOT, '.claude/handoff/screenshots');

// セクションごとのURLハッシュ・bbox情報
// FIGMA_BBOX: テキストノードの bounding box（マスク用）。Figma metadata から手動 or 自動取得
// 注: bboxはPNG画像座標系（Figma座標と同じ）
const SECTIONS = {
  header:     { hash: '',          mode: 'pc-sp' },
  fv:         { hash: '#home',     mode: 'pc-sp' },
  cta:        { hash: '#cta',      mode: 'pc-sp' },
  onayami:    { hash: '#onayami',  mode: 'pc-sp' },
  kaiketu:    { hash: '#kaiketu',  mode: 'pc-sp' },
  point:      { hash: '#point',    mode: 'pc-sp' },
  'cta-second': { hash: '#cta-second', mode: 'pc-sp' },
  room:       { hash: '#room',     mode: 'pc-sp' },
};

const BASE_URL = process.env.BASE_URL || 'http://localhost:4321/mock_site/suisopot/';

const VIEWPORTS = {
  pc: { width: 1440, height: 900, deviceScaleFactor: 1 },
  sp: { width: 390, height: 844, deviceScaleFactor: 2 }, // iPhone 13相当
};

const PIXELMATCH_OPTS = {
  threshold: 0.1,   // 差分検出感度（0-1、低いほど厳格）
  alpha: 0.5,       // 差分画像の透明度
  diffColor: [255, 0, 0],
};

const TEXT_MASK_PADDING = 6; // bboxパディング(px)

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
}

function clearOldFiles(dir, prefix) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) {
    if (f.startsWith(prefix)) fs.unlinkSync(path.join(dir, f));
  }
}

function readPNG(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return PNG.sync.read(fs.readFileSync(filePath));
}

function writePNG(filePath, png) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, PNG.sync.write(png));
}

/**
 * 2画像の pixelmatch を実行。サイズ違いはスキップ。
 * @returns { diffPixels, totalPixels, diffPng, diffPercentage }
 */
function diffImages(imgA, imgB) {
  if (!imgA || !imgB) return null;
  if (imgA.width !== imgB.width || imgA.height !== imgB.height) {
    return { error: `size mismatch: ${imgA.width}x${imgA.height} vs ${imgB.width}x${imgB.height}` };
  }
  const { width, height } = imgA;
  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(imgA.data, imgB.data, diff.data, width, height, PIXELMATCH_OPTS);
  const totalPixels = width * height;
  return {
    diffPixels,
    totalPixels,
    diffPercentage: (diffPixels / totalPixels) * 100,
    diffPng: diff,
  };
}

/**
 * テキスト bbox をマスクして diff (Layout-only)
 * 現状は bbox 情報未取得のため Figma metadata 連携は将来実装。
 * 今は full diff のみを返し、layout-only は full と同値とする（プレースホルダ）。
 * 将来：Figma metadata から bbox 取得 → padding + 黒塗り → 再diff
 */
function diffImagesLayoutOnly(imgA, imgB, textBoxes = []) {
  if (!imgA || !imgB) return null;
  if (textBoxes.length === 0) {
    // bbox未取得時は通常diffと同じ
    return diffImages(imgA, imgB);
  }
  // bboxを padding 付きで両画像にマスク (黒塗り)
  const maskedA = maskPng(imgA, textBoxes, TEXT_MASK_PADDING);
  const maskedB = maskPng(imgB, textBoxes, TEXT_MASK_PADDING);
  return diffImages(maskedA, maskedB);
}

function maskPng(src, boxes, padding) {
  const { width, height } = src;
  const out = new PNG({ width, height });
  src.data.copy(out.data);
  for (const box of boxes) {
    const x0 = Math.max(0, box.x - padding);
    const y0 = Math.max(0, box.y - padding);
    const x1 = Math.min(width, box.x + box.width + padding);
    const y1 = Math.min(height, box.y + box.height + padding);
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const i = (y * width + x) * 4;
        out.data[i] = 0;
        out.data[i + 1] = 0;
        out.data[i + 2] = 0;
        out.data[i + 3] = 255;
      }
    }
  }
  return out;
}

/**
 * 判定ロジック
 */
function judge(fullPct, layoutPct) {
  if (fullPct < 2 && layoutPct < 2) return '✅ 自動OK (差異ゼロ)';
  if (fullPct < 5 && layoutPct < 2) return '✅ フォント差のみ、許容OK';
  if (fullPct < 5 && layoutPct < 5) return '🟧 PM目視で diff画像を確認';
  return '❌ レイアウト崩れ、修正必須';
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────

async function captureSection(browser, sectionName, sectionDef, mode) {
  const sectionDir = path.join(SCREENSHOTS_DIR, sectionName);
  fs.mkdirSync(sectionDir, { recursive: true });

  // 古いファイルを削除（毎回上書き原則）
  clearOldFiles(sectionDir, `local-${mode}__`);
  clearOldFiles(sectionDir, `diff-${mode}__`);

  const context = await browser.newContext({
    viewport: VIEWPORTS[mode],
  });
  const page = await context.newPage();
  const url = BASE_URL + sectionDef.hash;
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500); // フォント・画像描画安定待ち

  const ts = timestamp();
  const localPath = path.join(sectionDir, `local-${mode}__${ts}.png`);

  // セクション要素のみキャプチャ。'fv'なら'.sp-fv'などのセレクタ運用
  // 当面はビューポート全体（要セレクタ運用に切替予定）
  if (sectionDef.hash) {
    try {
      const el = await page.$(sectionDef.hash);
      if (el) {
        await el.screenshot({ path: localPath });
      } else {
        await page.screenshot({ path: localPath, fullPage: false });
      }
    } catch {
      await page.screenshot({ path: localPath, fullPage: false });
    }
  } else {
    await page.screenshot({ path: localPath, fullPage: false });
  }

  await context.close();

  // Figma スクショを探す（最新のfigma-{mode}__*.pngを使用）
  const figmaFiles = fs.readdirSync(sectionDir)
    .filter((f) => f.startsWith(`figma-${mode}__`))
    .sort();
  const figmaLatest = figmaFiles[figmaFiles.length - 1];

  if (!figmaLatest) {
    return { section: sectionName, mode, localPath, error: 'Figma スクショ未配置 (figma-*__*.png)' };
  }

  const figmaPath = path.join(sectionDir, figmaLatest);
  const figmaImg = readPNG(figmaPath);
  const localImg = readPNG(localPath);

  if (!figmaImg || !localImg) {
    return { section: sectionName, mode, error: 'PNG読み込み失敗' };
  }

  // サイズ違い対応: localをfigmaサイズにcrop or skip
  let comparable = true;
  if (figmaImg.width !== localImg.width || figmaImg.height !== localImg.height) {
    comparable = false;
  }

  let fullResult = null;
  let layoutResult = null;
  let judgement = 'サイズ不一致のため比較不能';

  if (comparable) {
    fullResult = diffImages(figmaImg, localImg);
    // bbox情報は将来取得。今はテキスト boxes 空配列
    layoutResult = diffImagesLayoutOnly(figmaImg, localImg, []);

    const diffPath = path.join(sectionDir, `diff-${mode}__${ts}.png`);
    writePNG(diffPath, fullResult.diffPng);

    judgement = judge(fullResult.diffPercentage, layoutResult.diffPercentage);
  }

  return {
    section: sectionName,
    mode,
    localPath,
    figmaPath,
    fullDiffPercentage: fullResult?.diffPercentage,
    layoutDiffPercentage: layoutResult?.diffPercentage,
    judgement,
    sizeMismatch: !comparable,
    figmaSize: figmaImg ? `${figmaImg.width}x${figmaImg.height}` : null,
    localSize: localImg ? `${localImg.width}x${localImg.height}` : null,
  };
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--check')) {
    console.log('✅ Playwright + pixelmatch セットアップOK');
    console.log(`   sections: ${Object.keys(SECTIONS).length}`);
    console.log(`   base URL: ${BASE_URL}`);
    console.log(`   output: ${SCREENSHOTS_DIR}`);
    process.exit(0);
  }

  const targetSections = args.includes('--all')
    ? Object.keys(SECTIONS)
    : args.filter((a) => !a.startsWith('--'));

  if (targetSections.length === 0) {
    console.error('使い方: pnpm screenshot {section} or --all or --check');
    console.error('セクション:', Object.keys(SECTIONS).join(', '));
    process.exit(1);
  }

  const browser = await chromium.launch();
  const reports = [];

  for (const sectionName of targetSections) {
    const sectionDef = SECTIONS[sectionName];
    if (!sectionDef) {
      console.warn(`⚠ 未定義セクション: ${sectionName}`);
      continue;
    }

    for (const mode of ['pc', 'sp']) {
      console.log(`📸 ${sectionName} [${mode}] 撮影中...`);
      const result = await captureSection(browser, sectionName, sectionDef, mode);
      reports.push(result);

      if (result.error) {
        console.log(`   ❌ ${result.error}`);
      } else if (result.sizeMismatch) {
        console.log(`   ⚠ サイズ不一致: Figma=${result.figmaSize} / Local=${result.localSize}`);
      } else {
        console.log(`   Full: ${result.fullDiffPercentage.toFixed(2)}% / Layout: ${result.layoutDiffPercentage.toFixed(2)}%`);
        console.log(`   ${result.judgement}`);
      }
    }
  }

  await browser.close();

  // レポート保存
  const reportPath = path.join(SCREENSHOTS_DIR, 'report.json');
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(reports, null, 2));

  console.log(`\n📄 レポート: ${reportPath}`);
}

main().catch((e) => {
  console.error('❌ エラー:', e);
  process.exit(1);
});
