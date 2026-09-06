# WordPress側のメモ

ローカルのWordPress（Local）側の状態と、触るときの注意点。
Next.js側の実装だけを進める場合は読まなくてよい。

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

## お知らせのアイキャッチ画像の扱い

投稿15件のうち11件にアイキャッチ画像を設定してある（ファイル名は `thumb-01.webp` 〜 `thumb-11.webp`）。
残り4件は未設定で、Figmaどおり「Global Standard」のプレースホルダー画像が出る。

Next.js側は **アイキャッチのURLをそのまま使わず、ファイル名だけを取り出して
`public/images/news/<ファイル名>` を読む**（`lib/queries/news.ts` の `toThumbnailSrc`）。
WordPressはユーザーのMac内にしか無く、Vercelに置いた静的サイトの閲覧者からは
`global-standard-cms.local` の画像に到達できないため。

つまり **「どの記事にどの画像か」だけをWordPressに持たせ、画像の実体はリポジトリから配る**。
画像を差し替えるときは、同じファイル名の画像を `public/images/news/` にも置くこと。
新しいファイル名でアップロードした場合も同様（置き忘れると画像が404になる）。

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
