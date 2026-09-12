# WordPress側の状態（minami-dental-cms）

一般論（プラグイン・管理画面の罠・画像の扱いの考え方）は `/rules/headless-wordpress.md`。
ここにはこのプロジェクト固有の状態だけを書く。

## エンドポイント

`http://minami-dental-cms.local/graphql`（`.env.local` の `NEXT_PUBLIC_WORDPRESS_API_URL`）

**httpsではなくhttp**（理由は `/rules/headless-wordpress.md`）。

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
- お知らせのカテゴリーは**作った順**（`orderby: TERM_ID, order: ASC`＝診療日（ID 10）→その他（ID 11））。
  Figmaのサイドバーがこの順で、名前順の既定だと「その他→診療日」と逆になる。WPGraphQLで効くことを確認済み（2026-09-11）。
- ブログのカテゴリーは**Figmaの順をコードに持つ**（歯科コラム `column` → 患者様の声 `voice` → 小児歯科 `pediatric`、
  `lib/queries/blog.ts`）。作った順（TERM_ID：column 7 → pediatric 8 → voice 9）だと後ろの2つがFigmaと逆になり、
  名前順とも合わないため（ユーザー決定、2026-09-12）。並び順に無いカテゴリーが増えたら、一番下に作った順で付く

データ上の注意：

- ACFのテキスト欄は未入力だと `null`。スタッフ04の出身地、03の好きな食べ物が未入力
- 画像の代替テキスト（`altText`）は全件空
- 診療案内の `description` は2段落を改行（`\r\n`）1つで区切って入れている（表示では段落ごとに分ける）
- 記事本文（`content`）に `minami-dental-cms.local` へのリンク・画像は含まれていない（2026-09-10確認）
- お知らせの本文は全記事「h2・h3・段落」だけで、空の段落（`<p></p>`）が3〜4個ずつ残っている（表示ではCSSで消す）。
  本文の文章が見出し（h3）に入っている箇所と誤字は、ユーザーが管理画面で直す（コードでは書き換えない）

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
{ categories(first: 100, where: {hideEmpty: true, orderby: TERM_ID, order: ASC}) { nodes { name slug } } }
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

| 種類 | 置き場所 | ファイル | 元の寸法 |
|---|---|---|---|
| ブログ | `public/images/blog/` | image1〜11.webp（WPと同じ名前のまま、600×315に縮めて置く。一覧のカードでしか使わず、PCの表示264×153の2倍が収まる大きさ） | 1800×945 |
| 診療案内 | `public/images/medical/` | medical_1.webp, medical_11〜17.webp | 630×473 |
| スタッフ | `public/images/staff/` | staff21〜27.webp | 420×420 |
| お知らせ | `public/images/news/` | アイキャッチ無し。全記事共通の代わりの画像 thumb-fallback.webp（Figmaのカードの青地＋ロゴ） | 1200×630（600×315に縮めて書き出し） |

差し替え時の注意：

- 差し替えたら**同じファイル名でリポジトリにも置く**（`/rules/headless-wordpress.md`）。
  ブログの画像は、置く前に600×315へ縮める（`cwebp -q 90 -resize 600 315`）
- ブログ・診療案内・スタッフでアイキャッチを外すと、代わりの画像が無いのでビルドが止まる（意図どおり）
- 診療タイプ・職種が未設定の診療案内・スタッフもビルドが止まる（どのグループにも置けないため）
