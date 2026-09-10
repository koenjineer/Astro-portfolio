# global-standard-next プロジェクト引き継ぎメモ

## プロジェクト概要

デイトラ卒業制作課題（人材会社「グローバルスタンダード」のコーポレートサイト）のデザインを流用し、
**ヘッドレスWordPress + Next.js** 構成でポートフォリオ用サイトを構築する。
提出・レビュー対象外の個人学習・ポートフォリオ目的。

## 確定済みの技術スタック

| 項目 | 内容 |
|---|---|
| フロントエンド | Next.js（SSG、`output: 'export'`） |
| バックエンド | WordPress（ローカルのみ、DB非公開） |
| API連携 | WPGraphQL + WPGraphQL for ACF |
| フォーム | 送信しない（架空の会社なので送信先を作らない。詳細は `docs/progress.md`） |
| デプロイ先 | Vercel |
| スタイリング | Tailwind CSS（既存Astroポートフォリオと統一） |
| ローカルWP環境 | Local（旧Local by Flywheel） |

## コーディング規約

- 変数名は意図を表す（`x`, `temp`, `data` などの曖昧名を避ける）
- セマンティックなマークアップ：`div`や`span`の乱用を避け、意味に沿った適切なHTMLタグ（`article`, `section`, `nav`, `time`等）を使う
- マジックナンバーは避け、変数化する
- コメントは「why」を書く（コードで分かる「what」は書かない）。TODO/FIXMEは残すならissue番号を付ける
- 画像は`width` / `height` / `alt` / `loading`属性を必須とする（Next.jsの`<Image>`コンポーネントでは`width`/`height`/`alt`が必須パラメータのため自然に強制される）
- 装飾要素は`aria-hidden="true"`を付ける

## 詳細ルール

プロジェクトを横断する決まりごとは `/rules/` にある。**着手前に読む。**

- TypeScriptの書き方：`/rules/typescript.md`
- ヘッドレスWordPress（WP側の設定と罠）：`/rules/headless-wordpress.md`
- 静的書き出しとVercelへの手元ビルド：`/rules/nextjs-static-export.md`

## リポジトリ構成

既存Astroポートフォリオ（`github.com/koenjineer/Astro-portfolio`）と**同一リポジトリ**内、
`apps/`配下に配置する。

```
Astro-portfolio/（リポジトリルート）
├── CLAUDE.md                    ← 運用ルールのみ
├── rules/
│   ├── scss.md                  ← Astro専用
│   ├── typescript.md            ← 両プロジェクト共通
│   ├── headless-wordpress.md    ← WP側の設定と罠
│   └── nextjs-static-export.md  ← 静的書き出しとVercelへの手元ビルド
│
└── apps/
    ├── astro-portfolio/         ← 既存Astro
    │   └── CLAUDE.md
    └── global-standard-next/    ← 本プロジェクト
        ├── CLAUDE.md            ← このファイル
        ├── docs/                ← progress.md（進捗）/ design-rules.md（デザイン）/ wordpress.md（WP側）
        ├── app/                 ← ページ本体（+ ページ固有の_components/）
        ├── components/          ← 共通部品（layout/ · icons/ · form/）
        ├── lib/                 ← WPGraphQL接続・クエリ
        └── public/images/       ← common/ とページ別ディレクトリ
```

Vercelは本プロジェクト用に新規プロジェクトとして追加し、Root Directoryを
`apps/global-standard-next`に指定する。既存Astroのデプロイ設定には触れない。

WordPress側の状態・確認済みクエリ・管理画面のハマりどころは `docs/wordpress.md`。

## デプロイ

公開URL: <https://global-standard-next.vercel.app>（2026-09-08 初回公開）

**Vercel上でビルドすることはできない。**
`output: "export"` はビルド時にWordPressからデータを取りに行くが、WordPressは
ユーザーのMac内（`global-standard-cms.local`）にしかなく、Vercelのビルドサーバーからは
見えないため。そこで**手元でビルドし、できた成果物だけを上げる**運用にした。

記事や事例を直したら、**リポジトリのルートで**この2つを叩く（Localの起動が必須）。

```
npx vercel@latest build --prod
npx vercel@latest deploy --prebuilt --prod
```

このやり方の引っかかりどころ（ルートで実行する理由・`--prebuilt` が読む場所・
`NEXT_PUBLIC_SITE_URL` を手元に置く理由）は `/rules/nextjs-static-export.md` にまとめた。

`vercel.json` でGit連携の自動デプロイを止めてある（2026-09-10）。Vercel上のビルドは必ず失敗し、
PRのたびに赤い失敗表示が出て本物の失敗と見分けられなくなっていたため。

このプロジェクト固有の値：

- Vercelプロジェクト名 `global-standard-next` / Root Directory `apps/global-standard-next`
- `.env.local` に `NEXT_PUBLIC_WORDPRESS_API_URL` と `NEXT_PUBLIC_SITE_URL` の2つが必要

## 進め方の合意事項

- 架空の会社のサイトなので、全ページ `noindex, nofollow`（`app/layout.tsx`のmetadata）。
  検索結果に出す用途はないため、デプロイ後もこの設定は外さない。
  robots.txtでのブロックはしない（クロール自体を止めるとnoindexが読まれず逆効果になるため）
- WordPressから取得するのは、更新頻度が高く管理画面で直したい情報だけに絞る。
  サービスページではFAQのみを取得し、3コースの紹介文は固定テキストで持つ（2026-09-06 決定）

## Figmaデザイン参照

ファイルキーは `PTtMblDobjSLBSz9HlUEn9`。URLは
`https://www.figma.com/design/PTtMblDobjSLBSz9HlUEn9/?node-id=<id>&m=dev` の形になる。

全8ページ実装済みなので、あとでデザインを見直したいとき用にnode-idだけ残す。

| 参照先 | PC | SP |
|---|---|---|
| ルールセット（カラー・フォント・ホバー） | 14592-6198 | — |
| コンポーネント置き場 | 14662-3153 | — |
| トップ | 14562-1943 | 14623-4771 |
| トップのWordPress連携の仕様書 | 14676-5943 | — |
| サービス | 14591-2032 | 14591-2023 |
| 導入事例 | 14591-3155 | 14591-3146 |
| お知らせ一覧 | 14502-3023 | 14662-8527 |
| お知らせ詳細 | 14662-3124 | 14662-3144 |
| お知らせ詳細のブロック指示書 | 14584-8638 | 14584-3661 |
| 記事15件の原稿／サムネイル11枚 | 14724-4127 / 14724-4272 | — |
| 当社について | 14566-2980 | 14589-13104 |
| 資料ダウンロード（入力／完了） | 14592-4744 / 14592-5331 | 14592-4735 / 14592-5270 |
| お問い合わせ（入力／完了） | 14592-5542 / 14592-5968 | 14592-5533 / 14592-5883 |

カンプを見るときに引っかかる点：

- お知らせ一覧のPC版には**空フレーム（14592-6194）が重なっている**。中身のある方を見る
- 導入事例に**詳細ページは無い**（カードに事例の全文が載っており、詳細への導線がない）。
  カテゴリーボタンはページ内アンカー、各セクション末尾のボタンは `/service#<コースslug>` へ飛ぶ
- サービスのコース名は**カンプ側でページごとに文言が違う**（トップだけ長い）。
  揃えずデザインどおりに分けてある。経緯は `docs/progress.md`

カラー・フォント・ホバーの決まりごとは `docs/design-rules.md` にまとめている。

## コンポーネント配置のルール

Figmaの「コンポーネント置き場」（node-id=14662-3153）に定義された共通部品に対応する。

- **2ページ以上で使う部品** → `components/`（`@/components/...` で参照）
  - `components/layout/`：SiteHeader / SiteFooter / PageHero / Breadcrumb
  - `components/icons/`：ArrowRightIcon / ChevronRightIcon / SelectArrowIcon
    （塗りは`currentColor`。親の文字色に追従させる）
  - `components/form/`：FormField（ラベル＋入力欄。`control`でinput/select/textareaを出し分ける）
    / AgreementCheckbox
- **1ページでしか使わない部品** → `app/<page>/_components/`
- PC/SPはFigmaでは別コンポーネントだが、コードでは**1コンポーネント内でTailwindのレスポンシブクラスで出し分ける**
- 共通部品が使う画像は `public/images/common/`、ページ固有の画像は `public/images/<page>/`
  - 共通部品でも**ページごとに絵が変わる画像はページ側に置き、propsで渡す**
    （PageHeroの背景写真がこれ。common/ に残すのは全ページ共通の装飾・アイコンだけ）
  - 記事・事例と対になる画像（`case/` のロゴ、`news/` のサムネイル）は、
    トップページからも読むが**元のページのディレクトリに置く**。common/ は共通部品用に保つ
- favicon は `app/icon.png`、OGP画像は `app/opengraph-image.png`（Next.jsの規約名）

## 進捗

各ページの経緯・判断・積み残しは `docs/progress.md`。
