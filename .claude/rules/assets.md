# 素材・アセット取り扱い

## Figma MCP ツール使い分け

| ツール | 用途 | 使用タイミング |
|---|---|---|
| `get_metadata` | 構造把握（軽量） | セクション着手時、子ノードIDを探したい時 |
| `get_variable_defs` | 色・タイポグラフィのFigma変数定義を取得 | **`_variables.scss` 作成前に必須** |
| `get_design_context` | 構造＋参考コード＋画像URL | セクション本実装時 |
| `get_screenshot` | レンダリング済みPNG（写真・マスク画像） | 写真ベース画像 / `get_design_context` が空PNGを返したとき |
| `get_libraries` | 購読中のデザインライブラリ確認 | サイクル開始時に1回確認 |
| `search_design_system` | コンポーネント・変数の横断検索 | 共通化対象を探すとき |

### 重要な落とし穴

- 写真・マスク画像の場合 `get_design_context` が返すasset URLは **空の透明PNG** になることがある
- ファイルサイズが極端に小さい (< 5KB) ときは要疑い → `get_screenshot` で取り直す
- 色・タイポは `get_variable_defs` を **`_variables.scss` 作成前** に必ず呼ぶ
- `_variables.scss` に追加できるのは `get_variable_defs` か `get_design_context` で**実値確認した色・数値のみ**。追加時は根拠コメントを付与する（推測値の混入を防ぐ）
- 親ノードの `get_metadata` が応答超過する場合：子ノード単位で分割呼び出し
- **大セクション（高さ > 1000px）は `get_design_context` を子ノード単位で分割呼び出し**（親ノード単体では 25,000 トークン超となり実装担当が読めない）

---

## 画像取得モード（Phase 0 で確定）

### A モード（カンプ系・素材未登録）
- 写真：MCP `get_screenshot` で取得（白背景OK）
- 装飾・カットアウト：**ユーザー手動エクスポート必須**

### B モード（プロダクション系）
- 全画像：MCP `get_design_context` から asset URL 取得 → curl

### C モード（混在）
- 写真：MCP `get_screenshot`
- 装飾・カットアウト：ユーザー手動エクスポート

---

## ユーザー手動エクスポート依頼

PM が `.claude/handoff/user-exports/REQUEST.md` に以下形式で依頼：

```markdown
## ユーザー手動エクスポート依頼

### Figma で以下を「Background OFF」で PNG エクスポートしてください
配置先: `.claude/handoff/user-exports/`

| # | ノード ID | ファイル名 | 判定根拠 |
|---|---|---|---|
| 1 | 121:3741 | fv-product.png | 製品カットアウト、白背景NG |

### Figma での手順
1. 対象ノードを選択
2. 右パネル下部「Export」セクション
3. Format: PNG, Scale: 1x
4. **「Background」チェックを OFF にする** ⚠️ 重要
5. Export → 上記ファイル名で保存
6. `.claude/handoff/user-exports/` に配置
```

---

## 変換・保存ルール

### cwebp 変換

```bash
cwebp -q 90 input.png -o output.webp   # alpha は自動保持
dwebp output.webp -o check.png && file check.png  # RGBA確認
```

RGBA でなければ alpha が失われている → 要再変換。

### フォーマット対応表

| Figma内部フォーマット | 主な用途 | 保存方法 |
|---|---|---|
| SVG（ベクター） | アイコン・線・図形・ロゴ | `.svg` のまま保存・使用 |
| PNG / JPEG（ラスター） | 写真・背景画像・イラスト | `cwebp` で `.webp` に変換 |

**禁止：** PNGの中身を `.webp` という拡張子でそのまま保存しない。SVGをラスタライズして `.webp` に変換しない。

---

## Figma API レート制限（必須遵守）

Professional プランの上限目安：**10 回/分・200 回/日**

### 超過時の対応
- 当日中の Figma MCP 呼び出しを全て即時停止
- 既存アセット・spec.md・手動エクスポート済み素材で作業を継続
- 翌日リセット後に再開

### 消費抑制ルール（PM・全担当）
1. **同じノードへの重複呼び出し禁止**：取得済み情報は再取得しない
2. **探索的 `get_metadata` は Phase 0 のみ**：担当者が構造を知りたい場合は spec.md のノードID を使う
3. **Phase 0 で一括取得**：全セクションのメタデータ・スクショ・変数定義をまとめて完了させる
4. **開発担当の呼び出しは実装対象ノードの `get_design_context` に限定**：構造探索は行わない
