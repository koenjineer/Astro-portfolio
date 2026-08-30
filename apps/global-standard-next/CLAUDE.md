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
        ├── src/
        └── next.config.js
```

Vercelは本プロジェクト用に新規プロジェクトとして追加し、Root Directoryを
`apps/global-standard-next`に指定する。既存Astroのデプロイ設定には触れない。

## WordPress側の状態（完成済み）

- カスタム投稿タイプ「研修事例」（スラッグ: `case`、GraphQL名: `case`/`cases`）
- タクソノミー「研修コース」（スラッグ: `business`、GraphQL名: `businessCourse`/`businessCourses`、階層型）
  - ターム3件: ビジネス英語研修 / 異文化コミュニケーション / ビジネス留学プログラム
- ACFフィールドグループ「導入事例」（GraphQL Type Name: `CaseFields`）
  - `businessField`, `before`, `reason`, `after`
- ACFフィールドグループ「サービス」（GraphQL Type Name: `ServiceFaqFields`、固定ページ「サービス」に紐付け）
  - `question1`〜`question8`, `answer1`〜`answer8`（全16フィールド）
- 固定ページ「サービス」、投稿15件（お知らせ）、研修事例9社分のデータ投入済み

## WPGraphQL疎通確認済みのクエリ例

### 研修事例一覧
```graphql
{
  cases(first: 5) {
    nodes {
      title
      caseFields {
        businessField
        before
        reason
        after
      }
      businessCourses {
        nodes {
          name
        }
      }
    }
  }
}
```

### サービスページのFAQ
```graphql
{
  pages(where: {title: "サービス"}) {
    nodes {
      title
      serviceFaqFields {
        question1
        answer1
        question2
        answer2
        # ... question8/answer8まで同様
      }
    }
  }
}
```

エンドポイント: `http://global-standard-cms.local/graphql`
GraphiQL IDE: `http://global-standard-cms.local/wp-admin/admin.php?page=graphiql-ide`

## ハマりどころ（同じミスを繰り返さないための記録）

WordPress管理画面での作業中、以下の設定漏れ・不具合が発生し修正した。
Next.js側の実装には直接関係ないが、WP側を追加で触る場合は要注意。

1. **CPT UIでカスタムタクソノミー作成時**、「階層（Hierarchical）」が既定でFalseになっており、
   投稿編集画面でチェックボックス式の選択UIにならず自由入力のタグ形式になっていた。
   → Trueに変更して解決。

2. **CPT UI・ACFとも「GraphQLに表示する」設定と「GraphQL用の名前」が、
   日本語ラベルとは別に明示的な設定が必要**。日本語のまま放置すると、
   投稿タイプ自体やACFフィールドグループがGraphQLスキーマに登録されない、
   またはフィールド名が数字だけの壊れた値になる不具合が起きた。
   → 投稿タイプ・タクソノミー・ACFフィールドグループそれぞれで、GraphQL名を英数字に設定する。

3. **ACFの個別フィールドのGraphQL Field Name欄は、JavaScriptでのDOM直接操作（`input.value`書き換え）では
   保存時に反映されない**（Reactのcontrolled component仕様のため）。
   実際のUI操作（クリック→選択→タイプ）でないと変更が保存されないことを確認済み。

## 進め方の合意事項

- 1ページずつ、データ取得→表示→確認のサイクルで進める（一括で雛形だけ先に作らない）
- 着手順は「サービス」ページから（ACFのQ&Aが完全に動作確認済みのため、最初の「動くページ」を作りやすい）
- 次に共通レイアウト（header/footer/breadcrumb）→残り7ページ→Swiper→Formspree→デプロイ
- 実装を始める前に、Planモードで作業内容を提示し、承認を得てから進める

## Figmaデザイン参照

### サービスページ

- PC版: https://www.figma.com/design/PTtMblDobjSLBSz9HlUEn9/%E6%9E%B6%E7%A9%BA%E3%82%B3%E3%83%BC%E3%83%9B%E3%82%9A%E3%83%AC%E3%83%BC%E3%83%88%E3%82%B5%E3%82%A4%E3%83%88_20250715--%E3%82%B3%E3%83%94%E3%83%BC-?node-id=14591-2032&m=dev
- SP版: https://www.figma.com/design/PTtMblDobjSLBSz9HlUEn9/%E6%9E%B6%E7%A9%BA%E3%82%B3%E3%83%BC%E3%83%9B%E3%82%9A%E3%83%AC%E3%83%BC%E3%83%88%E3%82%B5%E3%82%A4%E3%83%88_20250715--%E3%82%B3%E3%83%94%E3%83%BC-?node-id=14591-2023&m=dev

レイヤー構成（PC/SP共通）：`header`, `lower-mainvisual`, `breadcrumb`,
`Frame`（サービス紹介セクション、01/02/03の3コース）, `flow`（導入の流れ）,
`faq`（よくある質問、ACF `serviceFaqFields` の16項目に対応）, `footer`

（このFigma参照URLは、サービスページの実装が完了しても個別には削除しない。
プロジェクト完了時にルートCLAUDE.mdの「有効性」原則に従い一括棚卸しする）

## 次のアクション

1. 「サービス」ページのデータ取得・実装（Figma参照URLに基づく）
