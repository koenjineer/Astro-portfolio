# 進捗

完了済みの作業の経緯と判断は `progress-log.md`（古い順）。2026-09-10〜11の分は `progress-log-archive.md`。
ここには最新の記録と次のアクションだけを置く。

## 2026-09-12 初回公開（ブランチ `feat/portfolio-minami`）

<https://minami-dental-next.vercel.app>（Vercelプロジェクトはユーザーがダッシュボードで作成）。
手元で `vercel build --prod` → `deploy --prebuilt --prod`（手順と注意点は `../CLAUDE.md`）。
`NEXT_PUBLIC_SITE_URL` を `.env.local` に入れてOGP画像を本番URLに直した。
**この行はGitに入らない**ので、環境を作り直したときは入れ直すこと（無いと `localhost` に戻る）。

公開後に確認済み：主要8ルートと記事ページが200、OGP画像が本番URLで開ける、
書き出し53ページすべてに `noindex, nofollow`、`minami-dental-cms.local` の残りが0件、画像も読み込めている。

引っかかった点：**ルートの `.vercel` は一度に1プロジェクトしかリンクできない**。
Global Standard を指していたので張り替えた（`/rules/nextjs-static-export.md` に書き足した）。

## 次のアクション

1. **全ページの通し確認**：7ページすべてが実装済み。公開した本番サイトを実機のChromeで頭から見て、
   ヘッダー・フッター・固定ボタンの重なりや、ページ間のリンク切れがないかを確かめる
2. **WordPressの原稿の直し（ユーザー作業・任意）**：ブログの詳細はFigmaだと最後の見出しが「定期検診を受診しましょう」で
   「WEB予約」がリンクだが、WordPressは「まとめ」でリンク無し。blog-10・11 の日付もFigmaと違う（`docs/wordpress.md`）。
   **お知らせの本文の誤字**：「させていただきいます」が15件すべてに残っている。管理画面で直す（コードでは書き換えない）
3. 実機のChromeで開き、タブにfaviconが出ていることを確かめる（素材の書き出しの確認の残り）
