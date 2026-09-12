# Next.jsの静的書き出し（`output: "export"`）と、Vercelへの手元ビルド

ビルド時にCMSからデータを取り、完全な静的HTMLとして書き出す構成の決まりごと。
`global-standard-next`・`minami-dental-next`（ともに2026-09、Next.js 16 / React 19 / Tailwind CSS v4）で
実際に踏んだことだけを書く。

関連：WP側は `/rules/headless-wordpress.md`、Tailwindの書き方は `/rules/tailwind.md`、
カンプに答えが書かれていないときの決め方は `/rules/design-to-code.md`。

## 静的書き出しの制約

`next.config.ts` は最小限これだけ。

```ts
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true }, // 静的書き出しではImage最適化が使えない
  trailingSlash: true,           // URLを末尾スラッシュ付きに統一する
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

### OGP画像とfaviconは `app/` に決まった名前で置くだけ

`app/opengraph-image.png`（＋説明文の `app/opengraph-image.alt.txt`）と `app/icon.png` は、
Next.jsが自動で `<head>` に入れる。`layout.tsx` に書く必要はない。

### 公開はするが検索結果に出したくないなら `noindex`。robots.txtでは止めない

ポートフォリオ用の架空サイトのように、**公開はするが検索結果に載せたくない**場合は、
全ページのメタデータに `noindex, nofollow` を入れる（`app/layout.tsx` の `metadata`）。

**robots.txt でクロールを止めてはいけない。** クロール自体を止めると `noindex` が
読まれないまま検索結果に載りうる（逆効果）。クロールは許して `noindex` を読ませる。

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

引っかかる5点：

- **リポジトリのルートで実行する。** Vercelプロジェクトの Root Directory が
  `apps/<name>` のとき、アプリのディレクトリで叩くとパスが二重になって落ちる
  （`apps/<name>/apps/<name>/package.json` が無い、というエラー）
- **`--prebuilt` が読むのは `out/` ではなく `.vercel/output/`。**
  だから `pnpm build` ではなく `vercel build` を使う
- **`.vercel` を `.gitignore` に入れる。** `vercel pull` で**本番の環境変数**が
  ここに降りてくる。`.gitignore` は**ディレクトリが作られる前に**直すこと。
  追跡が始まってから足しても外れない（`git rm -r --cached` が必要になる）
- **ルートの `.vercel` は一度に1プロジェクトしかリンクできない。** モノレポの2つ目を公開するとき、
  ルートで `vercel link` すると1つ目の紐付けが上書きされる（次に1つ目を出すときは張り替え直す）。
  `vercel link --yes --project <name>` は Root Directory を持ってこないので、続けて
  `vercel pull --yes --environment=production` を叩き、`.vercel/project.json` に
  `rootDirectory` を降ろすこと。無いとルートをビルドしようとして落ちる
- **Git連携の自動デプロイを `vercel.json` で止める。** 止めないと、プッシュやPRのたびに
  VercelがビルドしようとしてCMSに届かず失敗し、PRに赤い失敗表示が出続ける。
  本番は直前の成功デプロイが残るので実害は無いが、**本物の失敗と見分けられなくなる**。
  Root Directory側（`apps/<name>/vercel.json`）に置く。手元の `vercel build` / `deploy --prebuilt` は止まらない。
  **Vercelプロジェクトを作る前に置いておく**と、作った時点から失敗表示が出ない
  ```json
  { "$schema": "https://openapi.vercel.sh/vercel.json", "git": { "deploymentEnabled": false } }
  ```

初回は本番URLが分からないので、**プレビュー→URL確定→`.env.local`に記入→
ビルドし直し→本番**の順に回す。プレビューは `--prod` を外して
`vercel build` / `vercel deploy --prebuilt`（ターゲットが違うと混ぜられない）。

公開前に書き出しを検査しておく。

```
grep -rl "<CMSのホスト名>" out/     # ローカルCMSのURLが漏れていないか
grep -c "localhost" out/index.html  # OGPのURLが差し替わっているか
```

公開後は本番URLで5点を確かめる。

1. 主要なルートと記事ページが200で返る
2. OGP画像が本番URLで開ける
3. 書き出した全ページに `noindex, nofollow` が入っている
4. CMSのホスト名の残りが0件
5. 画像が読み込めている

## そのほか、実装中に踏んだ罠

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

### 共通部品を抜き出すときは、書き出しHTMLの一致を確かめる

1ページの都合で共通部品を触ると、完成済みのページが黙って変わる。
目視では気づけないので、**書き出したHTMLを突き合わせる**。

完成済みのページから部品を抜き出すだけ（見た目を変えない共通化）なら、
**抜き出しの前後でHTMLは完全一致する**はず。一致しなければ意図しない変更が混ざっている。

```
pnpm build && cp -r out /tmp/before   # 抜き出す前
# 共通化する
pnpm build && diff -r /tmp/before out # 差分ゼロなら安全
```

見た目を変える変更なら一致しないので、**変わってよいページにだけ差分が出ているか**を見る。
完成済みのページが増えるほど効く。今回はホームを作るとき、先に完成していた
4ページのHTMLが完全一致することを確かめてから先へ進んだ。
