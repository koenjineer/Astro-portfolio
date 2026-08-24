# 素材・アセット取り扱い

## 公式スキルが先（必須・最重要）

`get_design_context` を呼ぶ前に、Figma 公式スキル **`figma-design-to-code`** を読み込まなければならない（MANDATORY prerequisite）。

- 入手先：`Skill` で `figma:figma-design-to-code`。無ければ MCP リソース `skill://figma/figma-design-to-code/SKILL.md` を読む
- 呼び出し時は `skillNames` に `figma-design-to-code`（リソース経由なら `resource:figma-design-to-code`）を渡す

**このスキルが規定済みの内容を本ルールに再記述しない。** 具体的には以下はスキル側が担保する。

- アイコン・画像を書き出しアセットから描画する義務（描き直し・省略・プレースホルダ置換の禁止）
- outer box と inner leaf のジオメトリ保持（寸法・padding・アスペクト比）
- 既存コンポーネント・トークンの再利用
- 返却コードを「参考」として扱いプロジェクト規約に合わせること
- G1〜G5 のセルフチェックゲート

本ルールに残すのは、**スキルに無いプロジェクト固有の上乗せ分**だけとする。

---

## Figma MCP ツール使い分け

`get_design_context` が主。**`get_metadata` / `get_screenshot` を `get_design_context` の代用にしてはならない**（公式スキルの明示的な禁止事項）。この2つは方向づけ（ノード選定）と検証にのみ使う。

| ツール | 用途 | 使用タイミング |
|---|---|---|
| `get_design_context` | **主**。構造＋参考コード＋画像URL | セクション本実装時 |
| `get_metadata` | 方向づけ（子ノードIDを探す） | Phase 0 のみ |
| `get_variable_defs` | 色・タイポの変数定義 | **`_variables.scss` 作成前に必須** |
| `get_screenshot` | 検証用のレンダリング済みPNG | 視覚比較の参照画像取得時 |
| `download_assets` | ノード配下の**元画像**＋ベクターSVG | 素材を実ファイルとして落とすとき |
| `get_motion_context` | モーション定義 | アニメーションのあるノード実装時 |
| `get_libraries` / `search_design_system` | ライブラリ・共通部品の確認 | サイクル開始時に1回 |

モーション実装時は公式スキル `figma-implement-motion` を併用する。

### 重要な落とし穴

- 色・タイポは `get_variable_defs` を **`_variables.scss` 作成前** に必ず呼ぶ
- `_variables.scss` に追加できるのは実値確認した色・数値のみ。追加時は根拠コメントを付与する
- 親ノードの `get_metadata` が応答超過する場合：子ノード単位で分割呼び出し
- **大セクション（高さ > 1000px）は `get_design_context` を子ノード単位で分割呼び出し**（親ノード単体では 25,000 トークン超となり実装担当が読めない）
- asset URL は **約7日で失効**する。コミットするコードには実バイトを落として使う

---

## スクショ取得時の解像度（必須）

`get_screenshot` の `maxDimension` は **既定 1024px**。指定しないと 1440px の PC フレームが 1024px に縮小されて返り、拡大による劣化が pixelmatch 差異率に混入する。

- **PC フレーム：`maxDimension: 1440` 以上を明示する**
- SP フレーム（390px）も実寸以上を明示する
- セクションを単独でレンダリングしたい場合は `contentsOnly: true`（浮き要素・重なり要素を除外）

---

## 画像取得モード（Phase 0 で確定）

### A モード（カンプ系・素材未登録）
- 写真：`get_screenshot` で取得（白背景OK）
- 装飾・カットアウト：**ユーザー手動エクスポート必須**

### B モード（プロダクション系）
- 全画像：`get_design_context` / `download_assets` から取得

### C モード（混在）
- 写真：`get_screenshot`
- 装飾・カットアウト：ユーザー手動エクスポート

> **次サイクル Phase 0 で `download_assets` を検証すること。** `rawImages`（アップされた元画像）と `svgAssets` が透過を保って取得できるなら、A/C モードとユーザー手動エクスポートは撤廃できる可能性が高い。透過が必要なノード1つで試し、結果を improvement.md に記録する。検証前にこのモード判定を削除してはならない。

---

## ユーザー手動エクスポート依頼

PM が `.claude/handoff/user-exports/REQUEST.md` に以下形式で依頼する。

```markdown
## ユーザー手動エクスポート依頼

### Figma で以下を「Background OFF」で PNG エクスポートしてください
配置先: `.claude/handoff/user-exports/`

| # | ノード ID | ファイル名 | 判定根拠 |
|---|---|---|---|
| 1 | 121:3741 | fv-product.png | 製品カットアウト、白背景NG |

### Figma での手順
1. 対象ノードを選択 → 右パネル下部「Export」
2. Format: PNG, Scale: 1x
3. **「Background」チェックを OFF にする** ⚠️ 重要
4. Export → 上記ファイル名で `.claude/handoff/user-exports/` に配置
```

---

## 変換・保存ルール

```bash
cwebp -q 90 input.png -o output.webp   # alpha は自動保持
dwebp output.webp -o check.png && file check.png  # RGBA確認
```

RGBA でなければ alpha が失われている → 要再変換。

| Figma内部フォーマット | 主な用途 | 保存方法 |
|---|---|---|
| SVG（ベクター） | アイコン・線・図形・ロゴ | `.svg` のまま保存・使用 |
| PNG / JPEG（ラスター） | 写真・背景画像・イラスト | `cwebp` で `.webp` に変換 |

**禁止：** PNG の中身を `.webp` 拡張子でそのまま保存しない。SVG をラスタライズして `.webp` に変換しない。

---

## Figma API レート制限（必須遵守）

Professional プランの上限目安：**10 回/分・200 回/日**

### 超過時の対応
- 当日中の Figma MCP 呼び出しを全て即時停止
- 既存アセット・spec.md・手動エクスポート済み素材で作業を継続
- 翌日リセット後に再開

### 消費抑制ルール
1. **同じノードへの重複呼び出し禁止**：取得済み情報は再取得しない
2. **探索的 `get_metadata` は Phase 0 のみ**
3. **Phase 0 で一括取得**：全セクションのメタデータ・スクショ・変数定義をまとめて完了させる
4. **開発担当の呼び出しは実装対象ノードに限定**：構造探索は行わない
