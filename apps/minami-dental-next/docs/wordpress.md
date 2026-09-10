# WordPress側の状態（minami-dental-cms）

一般論（プラグイン・管理画面の罠・画像の扱いの考え方）は `/rules/headless-wordpress.md`。
ここにはこのプロジェクト固有の状態だけを書く。

## エンドポイント

`http://minami-dental-cms.local/graphql`（`.env.local` の `NEXT_PUBLIC_WORDPRESS_API_URL`）

**httpsではなくhttp。** Localのhttpsは自己署名証明書で、Nodeが接続を拒否しうるため。

## 投稿タイプ・タクソノミー・ACF

| 管理画面の名前 | 投稿タイプ | GraphQL名（単数／複数） | タクソノミー（GraphQL複数形） | ACF |
|---|---|---|---|---|
| お知らせ | 標準の投稿 | `post` / `posts` | 標準のカテゴリ（`categories`） | なし |
| スタッフブログ | `blog` | `blog` / `blogs` | `blogCategory`（`blogCategories`） | なし |
| 診療案内 | `plan` | `medical` / `medicals` | `medicalType`（`medicalTypes`） | `medicalFields { lead description }` |
| スタッフ | `staffs` | `staff` / `staffs` | `job`（`jobs`） | `staffFields { birthplace hobby food }` |

投稿タイプのスラッグ（`plan`・`staffs`）とGraphQL名（`medical`・`staff`）が違う点に注意。

## ターム（名前とslug）

| タクソノミー | ターム（slug） |
|---|---|
| お知らせのカテゴリ | 診療日（`open`）7件 / その他（`other`）8件 / 未分類（`uncategorized`）0件＝表示しない |
| `blogCategory` | 小児歯科（`pediatric`）4件 / 患者様の声（`voice`）4件 / 歯科コラム（`column`）3件 |
| `medicalType` | 一般診療（`general`）3件 / 特殊診療（`special`）5件 |
| `job` | 歯科衛生士（`hygienist-staffs`）2人 / 歯科助手（`assistant-staffs`）5人 |

## 投入したデータ（2026-09-10時点）

| 種類 | 件数 | slug | 日付 | アイキャッチ |
|---|---|---|---|---|
| お知らせ | 15 | news-01〜15（01が最新） | 2024-02-18〜2024-12-10 | **全件なし** |
| ブログ | 11 | blog-01〜11（01が最新） | 2024-03-18〜2024-12-12 | 全件あり |
| 診療案内 | 8 | 01〜08 | 全件 2026-09-10（入力日） | 全件あり |
| スタッフ | 7 | 01〜07 | 全件 2026-09-10（入力日） | 全件あり |

並び順の決め方：

- お知らせ・ブログは**投稿日の降順**（slugの連番とも一致）
- 診療案内・スタッフは投稿日が入力順で意味を持たないので、**slugの昇順**（`orderby: {field: SLUG, order: ASC}`）
- グループの並びはslug順で最初に出てくる順（一般診療→特殊診療、歯科衛生士→歯科助手）。
  WordPressのターム一覧は名前順で返り、歯科助手が先に来るので使わない

データ上の注意：

- ACFのテキスト欄は未入力だと `null`。スタッフ04の出身地、03の好きな食べ物が未入力
- 画像の代替テキスト（`altText`）は全件空
- 診療案内の `description` のうち、01（一般歯科）・02（小児歯科）・03（予防歯科）は
  **別の診療の説明文が入っている**ように見える（入れ歯・矯正・ホワイトニングの文）。
  ページ実装前に管理画面で直すかを決める
- 記事本文（`content`）に `minami-dental-cms.local` へのリンク・画像は含まれていない（2026-09-10確認）

## 疎通確認できたクエリ

一覧（お知らせ。ブログは `blogs` / `blogCategories` に置き換えるだけ）：

```graphql
{
  posts(first: 100, where: {orderby: {field: DATE, order: DESC}}) {
    nodes { title slug date categories { nodes { name slug } } featuredImage { node { sourceUrl } } }
  }
}
```

1件（`idType: SLUG` が無いとslugをIDとして解釈して見つからない）：

```graphql
query BlogPost($slug: ID!) {
  blog(id: $slug, idType: SLUG) { title slug date content blogCategories { nodes { name slug } } }
}
```

カテゴリ（`hideEmpty: true` で `uncategorized` のような0件のタームが消える）：

```graphql
{ categories(first: 100, where: {hideEmpty: true}) { nodes { name slug } } }
```

診療案内（スタッフは `staffs` / `staffFields` / `jobs` に置き換える）：

```graphql
{
  medicals(first: 100, where: {orderby: {field: SLUG, order: ASC}}) {
    nodes { title slug medicalFields { lead description } medicalTypes { nodes { name slug } } featuredImage { node { sourceUrl } } }
  }
}
```

実際に使っている形は `lib/queries/` の各ファイル。

## 画像の置き場所

WordPressには「どの記事にどの画像か」だけを持たせ、実体はリポジトリの `public/images/` から配る
（`lib/images.ts`）。元画像はLocalの `wp-content/uploads/2026/09/` にある。
コピーするのは**元画像だけ**で、`-300x200` のようなサイズ違いの派生ファイルは不要。

| 種類 | 置き場所 | ファイル | 元の寸法 |
|---|---|---|---|
| ブログ | `public/images/blog/` | image1〜11.webp | 1800×945 |
| 診療案内 | `public/images/medical/` | medical_1.webp, medical_11〜17.webp | 630×473 |
| スタッフ | `public/images/staff/` | staff21〜27.webp | 420×420 |
| お知らせ | 未作成 | アイキャッチ無し。代わりの画像1枚をFigmaから書き出して置く予定 | — |

差し替え時の注意：

- 管理画面でアイキャッチを差し替えたら、**同じファイル名の画像をリポジトリにも置く**。
  置き忘れると本番で404になる（ローカルの開発サーバーでは気づけない）
- ブログ・診療案内・スタッフでアイキャッチを外すと、代わりの画像が無いのでビルドが止まる（意図どおり）
- 診療タイプ・職種が未設定の診療案内・スタッフもビルドが止まる（どのグループにも置けないため）
