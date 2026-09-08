# Next.jsの静的書き出し（`output: "export"`）と、Vercelへの手元ビルド

ビルド時にCMSからデータを取り、完全な静的HTMLとして書き出す構成の決まりごと。
`global-standard-next`（2026-09、Next.js 16 / React 19 / Tailwind CSS v4）で
実際に踏んだことだけを書く。WP側の話は `/rules/headless-wordpress.md`。

## 静的書き出しの制約

`next.config.ts` は最小限これだけ。

```ts
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true }, // 静的書き出しではImage最適化が使えない
};
```

**サーバーが無いので使えないもの**：ISR、Server Actions、Route Handlers、
middleware、`next/image` の最適化。すべてビルド時に完結させる。

### `generateStaticParams` は1ページ目も返す

ページ送りを `/news/page/2` のようにルートで分けると、`/news/page/1` は
どこからもリンクしないので返したくなる。だが**空配列を返すとビルドが止まる**。
1ページ目も含めて返し、リンクは張らない。

### フォームは送信先が無い

サーバーが無いので、フォームは送信できない。デモサイトなら**送信しない**のが素直。

- `onSubmit` で `preventDefault()` してから完了ページへ移動するだけ
- **`action` + `method="get"` は使わない。** 氏名やメールアドレスがURLに残る
- 必須項目に `required` を付ければ、ブラウザ標準のバリデーションが止めてくれる
- 結果として**入力内容がブラウザの外へ一切出ない**。これは説明できる利点になる

外部フォームサービス（Formspreeなど）を使うかは、
「架空サイトの入力を外部に保存させたいか」で判断する。

### `metadataBase` はビルド時に読まれる

OGP画像の絶対URLは `metadataBase` から作られ、これは**ビルド時**に評価される。

```ts
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const metadata: Metadata = { metadataBase: new URL(SITE_URL), /* ... */ };
```

→ **手元でビルドする運用なら、Vercelの管理画面に入れても効かない。**
手元の `.env.local` に置く。`.env.local` はGitに入らないので、
環境を作り直したら入れ直すこと（忘れると `localhost` のURLが本番に出る）。

## Vercelへのデプロイ（CMSが手元にしか無い場合）

**この節は「CMSがローカルにしか無く、Vercelのビルドサーバーから見えない」構成に限る。**
CMSを公開サーバーへ置くなら、通常のGit連携ビルドでよい。

ビルド時にCMSを見に行くので、**Vercel上ではビルドできない**。
手元でビルドし、成果物だけを上げる。**リポジトリのルートで**叩く。

```
npx vercel@latest build --prod
npx vercel@latest deploy --prebuilt --prod
```

引っかかる3点：

- **リポジトリのルートで実行する。** Vercelプロジェクトの Root Directory が
  `apps/<name>` のとき、アプリのディレクトリで叩くとパスが二重になって落ちる
  （`apps/<name>/apps/<name>/package.json` が無い、というエラー）
- **`--prebuilt` が読むのは `out/` ではなく `.vercel/output/`。**
  だから `pnpm build` ではなく `vercel build` を使う
- **`.vercel` を `.gitignore` に入れる。** `vercel pull` で**本番の環境変数**が
  ここに降りてくる。`.gitignore` は**ディレクトリが作られる前に**直すこと。
  追跡が始まってから足しても外れない（`git rm -r --cached` が必要になる）

初回は本番URLが分からないので、**プレビュー→URL確定→`.env.local`に記入→
ビルドし直し→本番**の順に回す。プレビューは `--prod` を外して
`vercel build` / `vercel deploy --prebuilt`（ターゲットが違うと混ぜられない）。

公開前に書き出しを検査しておくと安全。

```
grep -rl "<CMSのホスト名>" out/    # ローカルCMSのURLが漏れていないか
grep -rc "localhost" out/index.html # OGPのURLが差し替わっているか
```

## そのほか、実装中に踏んだ罠

### Tailwind v4の `translate-x-*` は `transform` ではない

Tailwind v4の `translate-x-*` は `translate` プロパティに書き出す。
`transition-[color,transform]` と書いても**何も動かない**。
`transition-[color,translate]` にする。

### CMSが組み立てた本文へのCSSは、クラスではなくタグ名で当てる

管理画面で足されるブロックにクラスを付けて回ることはできない。
記事本文用のCSSは `article h2`、`article blockquote` のように**タグ名を狙う**。
スコープを効かせるため、本文だけに読み込む専用のCSSファイルに分ける。

### 共通部品の幅を変えたら、ブレークポイントを測り直す

ヘッダーのような共通部品に要素を足すと、**必要幅の総和**が増えて
特定の画面幅で折り返す。カンプが1280pxで描かれているなら、
その寸法は**カンプと同じ幅以上だけ**に当て（`xl:`）、
それ未満は詰める（`lg:`）。

必要幅は次のように測れる。

```js
const h = document.querySelector('header');
h.querySelectorAll('*').forEach(e => e.style.whiteSpace = 'nowrap');
h.style.width = 'max-content';
h.getBoundingClientRect().width; // 折り返さずに必要な幅
```

### 共通部品の変更は全ページに効く

1ページの都合で共通部品を触ると、完成済みのページが黙って変わる。
触ったら**別のページでも1枚は確認する**。
