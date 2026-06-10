# 品質確認

## 視覚比較フロー（Playwright + pixelmatch）

### セットアップ

```bash
pnpm add -D playwright pixelmatch pngjs
pnpm exec playwright install chromium
```

スクリプト：`scripts/screenshot.mjs`（PMが用意）
- PC（1440px）+ SP（390px）で自動撮影
- 各セクションごとに `local-{pc|sp}__{timestamp}.png` を保存
- pixelmatch で Figma スクショと自動 diff
- 差異率を JSON で出力

### 運用ルーチン

1. 開発担当が実装完了報告
2. PM が `pnpm preview` でビルド済みサイトを立ち上げ
3. PM が `pnpm screenshot {section}` 実行（自動撮影+diff）
4. pixelmatch 差異率を確認：
   - 0〜2% → 自動 OK、ユーザー承認へ
   - 2〜5% → PM 目視確認、許容できれば承認、否なら差し戻し
   - 5%以上 → 開発担当に差し戻し
5. ユーザー最終承認 → 次セクションへ

### ファイル名規約

```
.claude/handoff/screenshots/{section}/
  figma-pc__YYYY-MM-DD_HH-MM-SS.png
  figma-sp__YYYY-MM-DD_HH-MM-SS.png
  local-pc__YYYY-MM-DD_HH-MM-SS.png
  local-sp__YYYY-MM-DD_HH-MM-SS.png
  diff-pc__YYYY-MM-DD_HH-MM-SS.png
  diff-sp__YYYY-MM-DD_HH-MM-SS.png
```

撮影時：そのフォルダ内の既存ファイルを全削除してから保存。

### 修正回数上限

1セクションあたり修正 **3回** まで。上限到達したらエスカレーション報告。

---

## 2段diff（フォント差 vs レイアウト崩れの判別）

テキスト量が多いセクションではフォントレンダリング差だけで差異率が 2% を超えることがある。

### 判定ルール

| Full diff | Layout-only diff | 判定 |
|---|---|---|
| <2% | <2% | ✅ 自動 OK |
| 2-5% | <2% | ✅ フォント差のみ、許容 OK |
| 2-5% | 2-5% | 🟧 PM 目視で diff 画像を確認 |
| ≥5% | ≥2% | ❌ レイアウト崩れ、修正必須 |

マスク境界に **4-8px のパディング** を設けてエッジノイズを防ぐ。

---

## エスカレーション報告

修正3回上限到達 / 実装不可能 / PM単独判断不可な状況で `.claude/handoff/escalation.md` を作成：

```markdown
## エスカレーション報告：[セクション名] [状況]

### 現状
- 残差異: N件 / pixelmatch 差異率: X% / 該当スクショ: handoff/screenshots/{section}/

### 試した修正案（3回分）
1. 1回目: [試した内容] → [結果と差異率]
2. 2回目: [試した内容] → [結果と差異率]
3. 3回目: [試した内容] → [結果と差異率]

### 推定原因
[PM の見立て]

### 選択肢
- **A**: もう1回試す（具体案：...）
- **B**: 現状で許容して次へ（影響：...）
- **C**: このセクションを一旦保留、Phase 完了後に再対応
- **D**: 別アプローチ提案（具体案：...）

### PM の推奨
[推奨選択肢と理由]
```
