## コーディング規約

- 変数名は意図を表す（`x`, `temp`, `data` などの曖昧名を避ける）
- セマンティックなマークアップ：`div`や`span`の乱用を避け、意味に沿った適切なHTMLタグ（`article`, `section`, `nav`, `time`等）を使う
- マジックナンバーは避け、変数化する
- コメントは「why」を書く（コードで分かる「what」は書かない）。TODO/FIXMEは残すならissue番号を付ける
- 画像は`width` / `height` / `alt` / `loading`属性を必須とする
- 装飾要素は`aria-hidden="true"`を付ける
- 状態を持つコンポーネントはイベントハンドラを明示する

## ディレクトリ規則

- 画像: `public/mock_site/{ディレクトリ名}/images/`
- コンポーネント: `src/components/mock_site/{ディレクトリ名}/`
- スタイル: `src/styles/mock_site/{ディレクトリ名}/`
- ページ: `src/pages/mock_site/{ディレクトリ名}/`
- レイアウト: `src/layouts/mock_site/{ディレクトリ名}/`

## 制作実績のサムネイル

`src/components/projects.astro` に載せるサイトのサムネイルは `public/<サイト名>.webp`、**1150×670**。

- 公開した本番サイトのトップをヘッドレスChromeで撮る。**カンプと同じ幅（例：1280×746）で撮ってから縮小する**。
  1150pxで直接撮ると、サイトによってはヘッダーがスマホ表示に切り替わる
- 自動で動く部分は `--force-prefers-reduced-motion` で止め、`--virtual-time-budget` で画像の読み込みを待つ
- `cwebp -q 90 -resize 1150 670 <撮った画像> -o public/<サイト名>.webp`

## 詳細ルール

- SCSSの書き方：`/rules/scss.md`
- TypeScriptの書き方：`/rules/typescript.md`
