# 2026-09-17 Vercelへの公開（ブランチ `feat/portfolio-open-cafe`）

https://open-cafe-next.vercel.app （Vercelプロジェクト `open-cafe-next`）

手順は `/rules/nextjs-static-export.md` のとおり。リポジトリのルートで叩いた。

1. `vercel link --yes --project open-cafe-next`（新規作成）→ `vercel pull --yes --environment=production`
2. **新規プロジェクトは Root Directory と Framework が空**だった（`.vercel/project.json` が `null`）。
   VercelのAPIで `rootDirectory: apps/open-cafe-next`・`framework: nextjs` を入れてから `vercel pull` し直した
3. プレビュー（`vercel build` → `vercel deploy --prebuilt`）で本番ドメインを確定し、
   `.env.local` に `NEXT_PUBLIC_SITE_URL` を足した
4. `vercel build --prod` → `vercel deploy --prebuilt --prod`

ルートの `.vercel` の紐付けは global-standard-next から open-cafe-next に変わった。
他の2サイトを出し直すときは張り替える。

## 確認したこと

公開前（書き出し）：

- `open-cafe-cms.local` の残り 0件、`out/index.html` の `localhost` 0件、OGP画像が本番URL
- 書き出した39ページすべてに `noindex, nofollow`
- お問い合わせの `<form>` が `action="javascript:`（入力内容がURLに出ない）

公開後（本番URL）：

- 主要ルートが200：`/`・`/concept/`・`/menu/`・`/genre/breadsweets/`・`/news/`・`/news/page/2/`・`/news/post-10/`・
  `/archives/category/campaign/`・`/products/`・`/shop/`・`/contact/`・`/contact/thanks/`。無いURLは404
- `/opengraph-image.png`・`/icon.png` が200
- トップと記事ページに `noindex, nofollow`、記事ページにCMSのホスト名 0件
- トップの画像（`/images/common/`・`/images/home/`）がすべて200
