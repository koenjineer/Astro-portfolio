# コーディング規約（詳細）

## 命名規則・型定義

- BEMプレフィックス：各mock_siteごとに固定（例：`sp-` for suisopot）
- 変数名は意図を表す（`x`, `temp`, `data` などの曖昧名禁止）
- TypeScript：`any` 禁止、props 等は必ず `interface` で型定義

## マークアップ・コード品質

- **セマンティックなマークアップ**：`div` や `span` の乱用を避け、意味に沿った適切なHTMLタグ（`article`, `section`, `nav`, `time` 等）を使用する
- **モダンなスタイリング**：`grid`, `gap`, 擬似クラス（`:is()` 等）や論理プロパティを活用し、CSSの記述量を最小限に抑える
- **マジックナンバー禁止**：変数化必須（例：`$spacing-lg: rem(32)`）
- **DRY**：3回繰り返したら共通化（mixin / コンポーネント化）
- **SCSS ネスト3階層以内**：超えたら BEM 設計を見直す
- **`!important` 禁止**（緊急時のみ、コメント必須）

## コンポーネント設計

- 画像は **width / height / alt / loading 属性必須**
- 装飾要素は **`aria-hidden="true"` 必須**
- 状態を持つコンポーネントは **イベントハンドラを明示**

## コメント

- **why を書く、what は書かない**（コードで分かることはコメント不要）
- 「TODO」「FIXME」はPR前に解消、残すならissue番号付き

## SCSS 既存ルール

### 単位と計算関数

- **フォントサイズ・余白は `rem()` 関数を使用する**：Figmaなどのpx値をそのまま記述し、コンパイル時にremに変換させる。
  ```scss
  // utilities等に定義しておく関数の例
  @use "sass:math";
  @function rem($px) {
    @return math.div($px, 16) * 1rem;
  }
  ```

### 冗長な記述を避ける

- `font-family` は **`body` への設定のみ** とし、各コンポーネントでの個別指定は禁止
- セクション共通タイトル構造は `@mixin section-heading` を使用する
- SPメディアクエリ内でPCと同じ値を再宣言しない（差分のみ記述）
- センタリングは `margin-inline: auto` を使用（`margin-left: auto; margin-right: auto;` は禁止）

### レスポンシブの余白パターン

- 外側の section コンテナには **小さな padding（16px 等）** のみ設定する
- 横幅は **内側のコンテナで `max-width` + `margin-inline: auto`** で頭打ちにする
- 外側に大きな固定 padding（例：`padding: 0 130px`）は **禁止**

```scss
// ✅ 正しい
.section {
  padding: 88px 16px;
}
.section__inner {
  max-width: 1180px;
  margin-inline: auto;
}

// ❌ 悪い例
.section {
  padding: 88px 130px;
}
```

## 共有スタイル（mock_site共通）

新規mock_siteプロジェクト作成時、必ず以下を `main.scss` の先頭で読み込む：

```scss
@use "../shared/reset"; // box-sizing / scroll / img / a / ul,ol / button
@use "../shared/utilities"; // pc-only / sp-only
```

共有ファイル置き場所: `src/styles/mock_site/shared/`
