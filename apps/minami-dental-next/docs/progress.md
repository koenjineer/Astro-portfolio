# 進捗

## 2026-09-10 土台づくり（ブランチ `feat/minami-dental-scaffold`）

やったこと：

- `apps/global-standard-next` から設定ファイルを写してアプリを作成（create-next-appは使わない）。
  `next.config.ts` に `trailingSlash: true` を追加（URL設計が全て末尾スラッシュ付きのため）
- `lib/`：GraphQL接続、画像パスの置き換え（`lib/images.ts`）、お知らせ・ブログ共通のページ送り
  （`lib/pagination.ts`）、日付の整形（`lib/dates.ts`）、4種類のクエリ（`lib/queries/`）
- WordPressのアイキャッチ（ブログ11・診療案内8・スタッフ7）を `public/images/` へコピー。
  各記事のアイキャッチのファイル名がすべて揃っていることを照合済み
- `app/page.tsx` は疎通確認用の仮ページ（4種類の件数と先頭3件を並べるだけ）。
  ホームを実装するときに丸ごと置き換える
- `pnpm lint`・`pnpm build` が通り、書き出しに `minami-dental-cms.local` が残らないことを確認

判断したこと：

- 並び順：お知らせ・ブログは投稿日の降順、診療案内・スタッフはslugの昇順（詳細は `docs/wordpress.md`）
- ブログ・診療案内・スタッフは代わりの画像を持たず、アイキャッチ未設定ならビルドを止める。
  お知らせだけは全件アイキャッチ無しなので、代わりの画像（パスだけ決定済み・ファイル未作成）を使う
- カテゴリ一覧はWordPressから取る（0件のカテゴリと `uncategorized` は除く）。表示順は未決定
- 診療案内01〜03の説明文は別の診療（入れ歯・矯正・ホワイトニング）の文面に見えるが、
  **このままでよい**（ユーザー確認済み）。実装時に指摘し直さない

## 次のアクション

1. Figma URLを受け取り、1ページずつ実装する（作業範囲はページごとにユーザーが決める）
2. お知らせの代わりの画像をFigmaから書き出して置く（`lib/queries/news.ts` の `NEWS_FALLBACK_THUMBNAIL` のパス）
3. お知らせ・ブログの1ページの件数、カテゴリの表示順をFigmaから決める
4. 最初のページを実装するときに、共通部品の置き場所を `CLAUDE.md` に追記する
