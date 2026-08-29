# SCSS規約

## 命名規則

- BEMプレフィックス：各mock_siteごとに固定（例：`sp-` for suisopot）
- SCSSネスト3階層以内：超えたらBEM設計を見直す

## 単位と計算関数

- フォントサイズ・余白は`rem()`関数を使用する：Figma等のpx値をそのまま記述し、コンパイル時にremへ変換させる

```scss
// utilities等に定義しておく関数の例
@use "sass:math";
@function rem($px) {
  @return math.div($px, 16) * 1rem;
}
```

## 冗長な記述を避ける

- `font-family`は`body`への設定のみとし、各コンポーネントでの個別指定は禁止
- セクション共通タイトル構造は`@mixin section-heading`を使用する
- SPメディアクエリ内でPCと同じ値を再宣言しない（差分のみ記述）
- センタリングは`margin-inline: auto`を使用する（`margin-left: auto; margin-right: auto;`は禁止）
- `!important`禁止（緊急時のみ、コメント必須）

## レスポンシブの余白パターン

- 外側の`section`コンテナには小さなpadding（16px等）のみ設定する
- 横幅は内側のコンテナで`max-width` + `margin-inline: auto`で頭打ちにする
- 外側に大きな固定padding（例：`padding: 0 130px`）は禁止

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

新規mock_siteプロジェクト作成時、必ず以下を`main.scss`の先頭で読み込む：

```scss
@use "../shared/reset";      // box-sizing / scroll / img / a / ul,ol / button
@use "../shared/utilities";  // pc-only / sp-only
```

共有ファイル置き場所：`src/styles/mock_site/shared/`
