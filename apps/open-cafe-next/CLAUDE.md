# open-cafe-next プロジェクト引き継ぎメモ

## プロジェクト概要

架空のカフェ「OPEN CAFE」のサイトを、**ヘッドレスWordPress + Next.js** 構成で作る
ポートフォリオ用サイト。構成は `apps/minami-dental-next` と同じ
（WordPressはローカルのみ、Next.jsで静的書き出し、Vercelへ手元ビルドで上げる）。
架空デモなので、全体ルールのCloudflare固定の対象外。

## 確定済みの技術スタック

| 項目 | 内容 |
|---|---|
| フロントエンド | Next.js 16（SSG、`output: 'export'`、`trailingSlash: true`）/ React 19 |
| バックエンド | WordPress（ローカルのみ、DB非公開） |
| API連携 | WPGraphQL + WPGraphQL for ACF（`graphql-request`） |
| フォーム | 送信しない（お問い合わせ。`/rules/nextjs-static-export.md`） |
| デプロイ先 | Vercel（手元ビルド） |
| スタイリング | Tailwind CSS v4 |
| ローカルWP環境 | Local（サイト名 `open-cafe-cms`） |

## コーディング規約

- 変数名は意図を表す（`x`, `temp`, `data` などの曖昧名を避ける）
- セマンティックなマークアップ：`div`や`span`の乱用を避け、意味に沿った適切なHTMLタグを使う
- マジックナンバーは避け、変数化する
- コメントは「why」を書く（コードで分かる「what」は書かない）
- 画像は`width` / `height` / `alt` / `loading`属性を必須とする
- 装飾要素は`aria-hidden="true"`を付ける

## 詳細ルール

プロジェクトを横断する決まりごとは `/rules/` にある。**着手前に読む。**

- TypeScriptの書き方：`/rules/typescript.md`
- ヘッドレスWordPress（WP側の設定と罠）：`/rules/headless-wordpress.md`
- 静的書き出しとVercelへの手元ビルド：`/rules/nextjs-static-export.md`
- Tailwind CSS v4の書き方と罠：`/rules/tailwind.md`
- カンプに答えが書かれていないときの決め方：`/rules/design-to-code.md`
- プルリクエストの自動チェック（CI）：`/rules/ci.md`

WordPress側の状態（投稿タイプ・GraphQL名・件数・確認済みクエリ）は `docs/wordpress.md`。
進み具合と未決事項は `docs/progress.md`。

## ディレクトリ構成

```
apps/open-cafe-next/
├── CLAUDE.md            ← このファイル
├── docs/                ← wordpress.md（WP側）/ progress.md（記録と未決事項）
├── app/
│   ├── layout.tsx       ← フォント・noindex・metadataBase・タイトルの型（「ページ名 | OPEN CAFE」）・フッター・BackToTop
│   ├── page.tsx         ← 疎通確認用の仮ページ。TOP実装時に丸ごと置き換える
│   ├── icon.png / opengraph-image.png（＋.alt.txt）
│   ├── contact/         ← 入力・thanks/（完了）。_components/ に外枠とフォーム
│   ├── products/        ← ギフト・贈り物。_components/ に GiftCard（大・小）と WrappingNotice（ラッピング案内）
│   └── shop/            ← 店舗情報。_components/ に ShopSection（1店舗分）
├── components/
│   ├── layout/          ← SubPageLayout（下層ページ共通の外枠）/ PageHero（下層上部＋画面右上に固定のメニューボタン）/ DrawerMenu / drawerMenuInert.ts（開いている間ドロワー以外を inert）/ Breadcrumb / SiteFooter / SnsIcons / BackToTop
│   ├── heading/         ← HeadingGroup（英字＋日本語の見出し）/ BarHeading（左に縦棒の付く見出し）
│   ├── shop/            ← ShopInfoList（住所・TELなどの表。フッターと店舗情報ページで共有）
│   ├── ui/              ← Button（デフォルトボタン：ホバーで右下に凹む）
│   └── form/            ← NoSendForm / FormField / ChoiceGroup / FieldLabel / SubmitButton
└── lib/
    ├── site.ts          ← サイト名・ナビ項目・フッターの店舗情報・店舗の並び順（Figmaの文言を固定で持つ）
    ├── graphql-client.ts
    ├── images.ts        ← WPの画像URL → リポジトリ内の画像パス（アイキャッチ・ACF画像の両方）
    ├── images.server.ts ← 上に加えて public/ に実物が無ければビルドを止める（ビルド時専用。今はギフトと店舗が使う）
    ├── dates.ts         ← WPの日付 → 表示用／datetime用
    └── queries/         ← news / menu / products / shops / top
```

画像は `public/images/common/`（全ページ共通の飾り・アイコン・地図）と
`public/images/firstview/`（下層上部の写真。ページ着手時に `<ページ>-pc.webp` / `-sp.webp` を足す）、
ページ固有のもの（`public/images/products/`・`public/images/shop/`）。
PC/SPは1コンポーネント内で出し分け、切り替えは `md`（768px）。理由は `docs/progress.md`。

## URL設計

すべて末尾スラッシュ付き。

| URL | ページ | データ |
|---|---|---|
| `/` | TOP | Pick UPニュース（最新1件）・今月のスペシャルランチ（`top`）・グランドメニュー・ギャラリー・お知らせ |
| `/concept/` | コンセプト | 固定テキスト |
| `/menu/` | メニュー一覧 | `dishes`（ジャンルでグループ分け） |
| `/genre/{slug}/` | メニュー ジャンル別 | `dishes` |
| `/news/` | お知らせ一覧 | `posts` |
| `/archives/category/{slug}/` | お知らせ カテゴリ別（指示書どおり） | `posts` |
| `/news/{slug}/` | お知らせ詳細 | `post` |
| `/products/` | ギフト・贈り物一覧（詳細ページなし。「ショップで確認する」は同じページを指す仮リンク。`docs/progress.md`） | `products` |
| `/shop/` | 店舗情報 | `shops` |
| `/contact/`・`/contact/thanks/` | お問い合わせ（入力／完了。送信しない） | — |

お知らせ詳細は、指示書ではルート直下（`/{slug}/`）だったが、`/concept/` 等と衝突するので
`/news/{slug}/` に変えた（Owner確認済み、minami-dental-nextと同じ判断）。

1ページの件数・ページ送りの有無は未決（Figmaを見て決める。`docs/progress.md`）。

## デプロイ

**Vercel上でビルドすることはできない。** ビルド時にWordPress（ユーザーのMac内の
`open-cafe-cms.local`）を読みに行くため。**手元でビルドし、成果物だけを上げる**
（リポジトリのルートで `vercel build` → `vercel deploy --prebuilt`。Localの起動が必須）。
手順と引っかかりどころは `/rules/nextjs-static-export.md`。

- `vercel.json` でGit連携の自動デプロイを止めてある（Vercelプロジェクト作成前に置いた）
- `.env.local` に `NEXT_PUBLIC_WORDPRESS_API_URL` が必要。公開時は `NEXT_PUBLIC_SITE_URL` も足す。
  **Gitに入らない**ので、環境を作り直したら入れ直す
- 公開前に `grep -rl "open-cafe-cms.local" out/` が0件であることを確かめる
- 公開URL・Vercelプロジェクト名：未作成

## 進め方の合意事項

- 架空のカフェのサイトなので、全ページ `noindex, nofollow`（`app/layout.tsx`のmetadata）。
  **デプロイ後もこの設定は外さない**
- ページは1ブランチ1ページで進める。ギャラリー（Instagram）の方針はTOPページ着手時に決める

## Figmaデザイン参照

ファイルキー：`dg9N8E30Qd7jBBmwgw41HB`

| 参照先 | PC | SP |
|---|---|---|
| ルールセット（フォント・色・ボタン・ホバー） | 19719:11092 | — |
| OGP・favicon | 19731:5690（OGP 19745:4708 / favicon 19786:4751） | — |
| 下層トップ背景画像（contact は PC 19719:11609 / SP 19719:11597、gift は PC 19719:11606 / SP 19719:11593、shop は PC 19719:11605 / SP 19719:11589） | 19719:11600 | 19719:11599 |
| ドロワーメニュー | 19742:14510 | 19709:7335 |
| TOPでスクロール後にドロワーボタンを出す | 19742:13912 | — |
| TOP | | |
| コンセプト | | |
| メニュー 一覧 / ジャンル別 | | |
| お知らせ 一覧 / カテゴリ別 / 詳細 | | |
| ギフト・贈り物（商品写真は「【ギフト】サムネイル画像」19731:5426） | 19719:9551 | 19719:9558 |
| 店舗情報 | 19719:6384 | 19719:6391 |
| お問い合わせ（入力／完了） | 19719:10545 / 19719:10222 | 19719:10556 / 19719:10229 |

共通部品のFigmaは、お問い合わせPCの中のインスタンス（mainvisual-pc 19719:10546、pankuzu-pc 19719:10547、
footer-pc 19719:10553）を見る。
