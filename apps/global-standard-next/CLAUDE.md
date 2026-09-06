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
| フォーム | Formspree（無料枠） |
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

- TypeScriptの書き方：`/rules/typescript.md`

## リポジトリ構成

既存Astroポートフォリオ（`github.com/koenjineer/Astro-portfolio`）と**同一リポジトリ**内、
`apps/`配下に配置する。

```
Astro-portfolio/（リポジトリルート）
├── CLAUDE.md                    ← 運用ルールのみ
├── rules/
│   ├── scss.md                  ← Astro専用
│   └── typescript.md            ← 両プロジェクト共通
│
└── apps/
    ├── astro-portfolio/         ← 既存Astro
    │   └── CLAUDE.md
    └── global-standard-next/    ← 本プロジェクト
        ├── CLAUDE.md            ← このファイル
        ├── docs/                ← progress.md（進捗）/ design-rules.md（デザイン）/ wordpress.md（WP側）
        ├── app/                 ← ページ本体（+ ページ固有の_components/）
        ├── components/          ← 共通部品（layout/ · icons/）
        ├── lib/                 ← WPGraphQL接続・クエリ
        └── public/images/       ← common/ とページ別ディレクトリ
```

Vercelは本プロジェクト用に新規プロジェクトとして追加し、Root Directoryを
`apps/global-standard-next`に指定する。既存Astroのデプロイ設定には触れない。

WordPress側の状態・確認済みクエリ・管理画面のハマりどころは `docs/wordpress.md`。

## ⚠️ デプロイの制約（未解決）

**Vercel上でビルドすることはできない。**
`output: "export"` はビルド時にWordPressからデータを取りに行くが、WordPressは
ユーザーのMac内（`global-standard-cms.local`）にしかなく、Vercelのビルドサーバーからは見えないため。

対応案（デプロイ着手時に決める。現時点の推奨は1）：

1. ローカルで `pnpm build` し、できた `out/` をVercelに上げる（無料・WPを公開しなくてよい。
   記事を直すたびにローカルでビルドし直す運用になる）
2. WordPressを公開サーバーへ移す（費用と手間がかかる）
3. ビルド時にWPのデータをJSONへ書き出し、リポジトリに含める

## 進め方の合意事項

- 1ページずつ、データ取得→表示→確認のサイクルで進める（一括で雛形だけ先に作らない）
- 実装を始める前に、Planモードで作業内容を提示し、承認を得てから進める
- 架空の会社のサイトなので、全ページ `noindex, nofollow`（`app/layout.tsx`のmetadata）。
  検索結果に出す用途はないため、デプロイ後もこの設定は外さない。
  robots.txtでのブロックはしない（クロール自体を止めるとnoindexが読まれず逆効果になるため）
- WordPressから取得するのは、更新頻度が高く管理画面で直したい情報だけに絞る。
  サービスページではFAQのみを取得し、3コースの紹介文は固定テキストで持つ（2026-09-06 決定）

## Figmaデザイン参照

### ルールセット（カラー・フォント・ホバー）

サイト全体の決まりごとは `docs/design-rules.md` にまとめている（Figma node-id=14592-6198）。
新しいページを実装する際は先にこれを読む。

### サービスページ

- PC版: https://www.figma.com/design/PTtMblDobjSLBSz9HlUEn9/%E6%9E%B6%E7%A9%BA%E3%82%B3%E3%83%BC%E3%83%9B%E3%82%9A%E3%83%AC%E3%83%BC%E3%83%88%E3%82%B5%E3%82%A4%E3%83%88_20250715--%E3%82%B3%E3%83%94%E3%83%BC-?node-id=14591-2032&m=dev
- SP版: https://www.figma.com/design/PTtMblDobjSLBSz9HlUEn9/%E6%9E%B6%E7%A9%BA%E3%82%B3%E3%83%BC%E3%83%9B%E3%82%9A%E3%83%AC%E3%83%BC%E3%83%88%E3%82%B5%E3%82%A4%E3%83%88_20250715--%E3%82%B3%E3%83%94%E3%83%BC-?node-id=14591-2023&m=dev

レイヤー構成（PC/SP共通）：`header`, `lower-mainvisual`, `breadcrumb`,
`Frame`（サービス紹介セクション、01/02/03の3コース）, `flow`（導入の流れ）,
`faq`（よくある質問、ACF `serviceFaqFields` の16項目に対応）, `footer`

### 導入事例ページ

- PC版: https://www.figma.com/design/PTtMblDobjSLBSz9HlUEn9/%E6%9E%B6%E7%A9%BA%E3%82%B3%E3%83%BC%E3%83%9B%E3%82%9A%E3%83%AC%E3%83%BC%E3%83%88%E3%82%B5%E3%82%A4%E3%83%88_20250715--%E3%82%B3%E3%83%94%E3%83%BC-?node-id=14591-3155&m=dev
- SP版: https://www.figma.com/design/PTtMblDobjSLBSz9HlUEn9/%E6%9E%B6%E7%A9%BA%E3%82%B3%E3%83%BC%E3%83%9B%E3%82%9A%E3%83%AC%E3%83%BC%E3%83%88%E3%82%B5%E3%82%A4%E3%83%88_20250715--%E3%82%B3%E3%83%94%E3%83%BC-?node-id=14591-3146&m=dev

**詳細ページは存在しない**（カードに事例の全文が載っており、詳細への導線がない）。
カテゴリーボタン3つはページ内アンカー、各セクション末尾のボタンは
サービスページの該当コース（`/service#<コースslug>`）へ飛ぶ。

### お知らせページ

一覧のPC版は空フレーム（node-id=14592-6194）が重なっているので、中身のある方を見る。

- 一覧 PC版: node-id=14502-3023 ／ 一覧 SP版: node-id=14662-8527
- 詳細 PC版: node-id=14662-3124 ／ 詳細 SP版: node-id=14662-3144
- 詳細のブロック指示書: PC node-id=14584-8638 ／ SP node-id=14584-3661
- 記事15件の原稿: node-id=14724-4127 ／ サムネイル11枚: node-id=14724-4272

### 当社についてページ

- PC版: node-id=14566-2980 ／ SP版: node-id=14589-13104

（このFigma参照URLは、該当ページの実装が完了しても個別には削除しない。
プロジェクト完了時にルートCLAUDE.mdの「有効性」原則に従い一括棚卸しする）

## コンポーネント配置のルール

Figmaの「コンポーネント置き場」（node-id=14662-3153）に定義された共通部品に対応する。

- **2ページ以上で使う部品** → `components/`（`@/components/...` で参照）
  - `components/layout/`：SiteHeader / SiteFooter / PageHero / Breadcrumb
  - `components/icons/`：ArrowRightIcon / ChevronRightIcon
    （塗りは`currentColor`。親の文字色に追従させる）
- **1ページでしか使わない部品** → `app/<page>/_components/`
- PC/SPはFigmaでは別コンポーネントだが、コードでは**1コンポーネント内でTailwindのレスポンシブクラスで出し分ける**
- 共通部品が使う画像は `public/images/common/`、ページ固有の画像は `public/images/<page>/`
  - 共通部品でも**ページごとに絵が変わる画像はページ側に置き、propsで渡す**
    （PageHeroの背景写真がこれ。common/ に残すのは全ページ共通の装飾・アイコンだけ）
  - 記事・事例と対になる画像（`case/` のロゴ、`news/` のサムネイル）は、
    トップページからも読むが**元のページのディレクトリに置く**。common/ は共通部品用に保つ
- favicon は `app/icon.png`、OGP画像は `app/opengraph-image.png`（Next.jsの規約名）

## 進捗・次のアクション

実装したページの経緯・積み残し・次に着手するページは `docs/progress.md` にまとめている。
1ページ実装するたびにそちらへ追記する。
