# minami-dental-next プロジェクト引き継ぎメモ

## プロジェクト概要

架空の歯科医院「みなみ歯科」のサイトを、**ヘッドレスWordPress + Next.js** 構成で作る
ポートフォリオ用サイト。構成は `apps/global-standard-next` と同じ
（WordPressはローカルのみ、Next.jsで静的書き出し、Vercelへ手元ビルドで上げる）。

## 確定済みの技術スタック

| 項目 | 内容 |
|---|---|
| フロントエンド | Next.js（SSG、`output: 'export'`、`trailingSlash: true`） |
| バックエンド | WordPress（ローカルのみ、DB非公開） |
| API連携 | WPGraphQL + WPGraphQL for ACF |
| フォーム | 送信しない（お問い合わせ・WEB予約とも。下記「合意事項」） |
| デプロイ先 | Vercel（手元ビルド） |
| スタイリング | Tailwind CSS v4 |
| ローカルWP環境 | Local（旧Local by Flywheel） |

## コーディング規約

- 変数名は意図を表す（`x`, `temp`, `data` などの曖昧名を避ける）
- セマンティックなマークアップ：`div`や`span`の乱用を避け、意味に沿った適切なHTMLタグ（`article`, `section`, `nav`, `time`等）を使う
- マジックナンバーは避け、変数化する
- コメントは「why」を書く（コードで分かる「what」は書かない）。TODO/FIXMEは残すならissue番号を付ける
- 画像は`width` / `height` / `alt` / `loading`属性を必須とする
- 装飾要素は`aria-hidden="true"`を付ける

## 詳細ルール

プロジェクトを横断する決まりごとは `/rules/` にある。**着手前に読む。**

- TypeScriptの書き方：`/rules/typescript.md`
- ヘッドレスWordPress（WP側の設定と罠）：`/rules/headless-wordpress.md`
- 静的書き出しとVercelへの手元ビルド：`/rules/nextjs-static-export.md`

WordPress側の状態（投稿タイプ・GraphQL名・件数・確認済みクエリ・画像の置き場所）は `docs/wordpress.md`。

## ディレクトリ構成

```
apps/minami-dental-next/
├── CLAUDE.md            ← このファイル
├── docs/                ← progress.md（進捗）/ wordpress.md（WP側）/ design-rules.md（色・フォント・ホバー）
├── app/                 ← ページ本体（今は疎通確認用の仮ホームだけ）
├── lib/
│   ├── graphql-client.ts
│   ├── images.ts        ← WPの画像URL → リポジトリ内の画像パス
│   ├── pagination.ts    ← ページ送り・前後記事・一覧URL（お知らせ・ブログ共通）
│   ├── dates.ts         ← WPの日付 → 表示用／datetime用
│   └── queries/         ← news / blog / medical / staff
└── public/images/       ← blog/ · medical/ · staff/（WPのアイキャッチと同じファイル名）
```

共通部品（ヘッダー等）の置き場所は、最初のページを実装するときに決めて追記する。

## URL設計

すべて末尾スラッシュ付き。一覧のURLは `lib/pagination.ts` の `listHref` で作る。

| URL | ページ | データ |
|---|---|---|
| `/` | ホーム | — |
| `/about/` | 当院について | 固定テキスト |
| `/medical/` | 診療案内 | medical（診療タイプでグループ。詳細ページなし） |
| `/staff/` | スタッフ紹介 | staff（職種でグループ。詳細ページなし） |
| `/news/`・`/news/page/2/` | お知らせ一覧 | posts |
| `/news/category/{slug}/` | お知らせ カテゴリ別 | posts |
| `/news/{slug}/` | お知らせ詳細 | posts |
| `/blog/`・`/blog/page/2/` | スタッフブログ一覧 | blog |
| `/blog/category/{slug}/` | スタッフブログ カテゴリ別 | blog |
| `/blog/{slug}/` | スタッフブログ詳細 | blog |
| `/contact/`・`/contact/thanks/` | お問い合わせ（入力／完了） | — |
| `/reservation/`・`/reservation/thanks/` | WEB予約（入力／完了） | — |

1ページの件数はFigmaを見て、各ページの実装時に決める。

## デプロイ

**Vercel上でビルドすることはできない。**
ビルド時にWordPressからデータを取りに行くが、WordPressはユーザーのMac内
（`minami-dental-cms.local`）にしかなく、Vercelのビルドサーバーからは見えないため。
**手元でビルドし、できた成果物だけを上げる。** リポジトリのルートで叩く（Localの起動が必須）。

```
npx vercel@latest build --prod
npx vercel@latest deploy --prebuilt --prod
```

引っかかりどころ（ルートで実行する理由・`--prebuilt` が読む場所・
`NEXT_PUBLIC_SITE_URL` を手元に置く理由）は `/rules/nextjs-static-export.md`。

このプロジェクト固有の値：

- Vercelプロジェクト名 `minami-dental-next` / Root Directory `apps/minami-dental-next`（**未作成**）
- `.env.local` に `NEXT_PUBLIC_WORDPRESS_API_URL` が必要。公開URLが決まったら `NEXT_PUBLIC_SITE_URL` も足す
- 公開前に `grep -rl "minami-dental-cms.local" out/` が0件であることを確かめる
- `vercel.json` でGit連携の自動デプロイを止めてある。Vercelプロジェクトを作った時点から
  失敗表示が出ないよう、プロジェクト作成前に置いた

## 進め方の合意事項

- 架空の歯科医院のサイトなので、全ページ `noindex, nofollow`（`app/layout.tsx`のmetadata）。
  デプロイ後もこの設定は外さない。robots.txtでのブロックはしない
  （クロール自体を止めるとnoindexが読まれず逆効果になるため）
- お問い合わせ・WEB予約とも**送信しない**。`onSubmit` で `preventDefault()` して完了ページへ移るだけで、
  入力内容はブラウザの外へ一切出ない（`action` + `method="get"` はURLに入力が残るので使わない）

## Figmaデザイン参照

ファイルキーは `LGBTD8kxfANEORjJbp1Y6R`。URLは
`https://www.figma.com/design/LGBTD8kxfANEORjJbp1Y6R/?node-id=<id>&m=dev` の形になる。

| 参照先 | PC | SP |
|---|---|---|
| ルールセット / ホバーデザイン / フォームコンポーネント | 25322-13320 / 25307-6855 / 25329-14929 | — |
| 共通レイアウト | 25356-15205 | 25356-16791 |
| メインコンポーネント置き場（**未受領だが同じセクションにある**） | 25356-16203 | — |
| ホーム | 25322-22876 | 25324-7238 |
| 当院について | 25324-8031 | 25326-8423 |
| 診療案内 | 25327-8728 | 25328-11259 |
| スタッフ紹介 | 25329-12035 | 25329-11958 |
| お知らせ 一覧 / カテゴリー一覧 / 詳細 | 25346-9801 / 25457-8171 / 25356-14218 | 25346-9708 / 25457-8145 / 25356-14104 |
| スタッフブログ 一覧 / カテゴリー一覧 / 詳細 | 25329-12391 / 25354-13293 / 25347-9336 | 25329-12314 / 25354-13200 / 25347-9243 |
| お問い合わせ（入力／完了） | 25329-12747 / 25332-8088 | 25329-12670 / 25332-7992 |
| WEB予約（入力／完了） | 25332-8554 / 25333-8578 | 25332-8458 / 25333-8501 |
| SPメニュー / SP固定の予約ボタン | — | 25399-14651 / 25399-14096 |
| WordPress連携のブロック指示書 / ブログ記事一覧（原稿） | 25458-7443 / 25494-7440 | — |
| 素材（下層ページ上部 / ファーストビュー / 装飾 / ブログのサムネイル / OGP・favicon） | 25329-11933 / 25322-12590 / 25356-16670 / 25494-11030 / 25494-11012 | 25329-11946 / 25322-13270 / 25356-16777 / — / — |

カラー・フォント・影・ホバーの決まりごとは `docs/design-rules.md` にまとめている。

## 進捗

経緯・判断・次のアクションは `docs/progress.md`。
