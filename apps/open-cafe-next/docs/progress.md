# 進捗

ページごとの記録は `docs/progress/` に分けてある（1ブランチ1ページで進めるので、作るたびに1ファイル増える）。
このファイルには**目次と未決事項**だけを置く。

| ページ | 記録 |
|---|---|
| 土台づくり（データ取得の部品・仮ページ・CI） | `docs/progress/scaffold.md` |
| 共通部分＋お問い合わせ（色・フォント・下層上部・ドロワー・パンくず・フッター） | `docs/progress/contact.md` |
| ギフト・贈り物 | `docs/progress/products.md` |
| 店舗情報 | `docs/progress/shop.md` |
| お知らせ（一覧・カテゴリ別・詳細） | `docs/progress/news.md` |
| メニュー（一覧・ジャンル別） | `docs/progress/menu.md` |

PC/SPの切り替えは `md`（768px）が既定。お知らせのサイドバーと、メニューのタブの200px固定・ドリンクの写真は `lg`（1024px）で、
理由と実測値は `docs/progress/news.md`・`docs/progress/menu.md`。

## 未決事項（Figma・原稿を見て決める）

- **TOPのドロワーボタン（19742:13912）**：TOPはファーストビューを過ぎたらドロワーボタンを出す指示。TOP実装時に作る
- **ギャラリー（Instagram）の実装方法**：TOPページ着手時に決める（ユーザー決定）
- **TOPのランチ画像の置き場所**：メニューの画像（`public/images/menu/` に同じ img_pasta* がある）と共有するか（今は `/images/home/` を指す）。
  TOP実装時に `getSpecialLunches` も `requireExistingLocalImageSrc` に切り替える
