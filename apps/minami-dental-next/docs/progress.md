# 進捗

完了済みの作業の経緯と判断は `progress-log.md`（古い順）。2026-09-10〜11の分は `progress-log-archive.md`。
ここには最新の記録と、プロジェクトの締めくくりを置く。

## 2026-09-12 初回公開（ブランチ `feat/portfolio-minami`）

<https://minami-dental-next.vercel.app>（Vercelプロジェクトはユーザーがダッシュボードで作成）。
手元で `vercel build --prod` → `deploy --prebuilt --prod`（手順と注意点は `../CLAUDE.md`）。
`NEXT_PUBLIC_SITE_URL` を `.env.local` に入れてOGP画像を本番URLに直した。
**この行はGitに入らない**ので、環境を作り直したときは入れ直すこと（無いと `localhost` に戻る）。

公開後に確認済み：主要8ルートと記事ページが200、OGP画像が本番URLで開ける、
書き出し53ページすべてに `noindex, nofollow`、`minami-dental-cms.local` の残りが0件、画像も読み込めている。

引っかかった点：**ルートの `.vercel` は一度に1プロジェクトしかリンクできない**。
Global Standard を指していたので張り替えた（`/rules/nextjs-static-export.md` に書き足した）。

## プロジェクト終了（2026-09-12）

実装（全7ページ）・公開・ポートフォリオの制作実績への掲載まで終わり、**このプロジェクトはここで終了する。**

次のヘッドレスWordPress + Next.js案件で使える知見は `/rules/` へ切り出した
（`headless-wordpress.md` / `nextjs-static-export.md` / `tailwind.md` / `design-to-code.md`）。
このプロジェクト固有の記録は `wordpress.md`・`design-rules.md`・`components.md` に残してある。

やり残し（必須ではない。やるならユーザーの作業）：

- **お知らせ本文の誤字**：「させていただきいます」が15件すべてに残っている。
  管理画面で直す（コードでは書き換えない）
- ブログの詳細は、Figmaだと最後の見出しが「定期検診を受診しましょう」で「WEB予約」がリンクだが、
  WordPressは「まとめ」でリンク無し。blog-10・11 の日付もFigmaと違う（`wordpress.md`）
- 公開した本番サイトの通し確認（ページ間のリンク切れ・固定ボタンの重なり・タブのfavicon）。
  公開直後に主要ルートが200で返ることと画像が読めることは確認済み
