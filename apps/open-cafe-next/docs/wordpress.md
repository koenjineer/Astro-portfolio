# WordPress側の状態（open-cafe-cms）

一般論（プラグイン・管理画面の罠・画像の扱いの考え方）は `/rules/headless-wordpress.md`。
ここにはこのプロジェクト固有の状態だけを書く。

## エンドポイント

`http://open-cafe-cms.local/graphql`（`.env.local` の `NEXT_PUBLIC_WORDPRESS_API_URL`）

**httpsではなくhttp**（Localの自己署名証明書をNode.jsのビルドが拒否するため。ローカル限定）。
公開イントロスペクションは無効なので、`__type` でスキーマは調べられない。実クエリで確かめる。

導入済みのプラグインは5つ（ACF / CPT UI / WPGraphQL / WPGraphQL for ACF / Post Types Order）。
指示書にあったSmash Balloon（Instagram）・Contact Form 7等はヘッドレス構成のため入れていない。

## 投稿タイプ・タクソノミー・ACF

| 管理画面の名前 | 投稿タイプ | GraphQL名（単数／複数） | タクソノミー（GraphQL単数／複数） | ACF |
|---|---|---|---|---|
| お知らせ | 標準の投稿 | `post` / `posts` | 標準のカテゴリ（`category` / `categories`） | なし |
| メニュー | `menu` | `dish` / `dishes` | ジャンル `genre`（`genre` / `genres`） | `dishFields { price }` |
| ギフト・贈り物 | `products` | `product` / `products` | なし | `products { price }` |
| 店舗情報 | `shop` | `shop` / `shops` | なし | `shopFields { address tel email time holiday count }` |
| 固定ページ「TOP」 | 標準の固定ページ | `page` | なし | `top { a b c d }`（各 `{ image name }`） |

- **メニューのGraphQL名が `dish` なのは、`Menu`／`MenuItem` がWPGraphQLの予約語だから**
  （WordPress標準のナビゲーションメニューが使っている）
- ギフトのACFグループのGraphQL名 `products` は、投稿タイプの複数形と同じ綴り。
  `products { nodes { products { price } } }` のように入れ子で同じ名前が2回出る
- ジャンルの単数形 `genre` は `genre(id: "pasta", idType: SLUG) { name }` で通ることを確認（2026-09-15）
- **ACFの画像欄はConnection型**。`image { sourceUrl }` ではなく `image { node { sourceUrl } }`
- TOPの `a`〜`d` はGroup型で、子フィールドのGraphQL Field Nameが自動で1文字に縮む不具合があった。
  8か所（画像×4・名前×4）を手で `image` / `name` に直してある

## ターム（名前とslug）

| タクソノミー | ターム（slug）と件数 |
|---|---|
| お知らせのカテゴリ | キャンペーン（`campaign`）4 / イベント情報（`event`）4 / 期間限定メニュー（`limit`）3 / 営業時間（`open`）4 |
| `genre`（親） | パスタ（`pasta`）5 / サラダ（`salad`）5 / パン&スイーツ（`breadsweets`）5 / ドリンク（`drink`）14 |
| `genre`（ドリンクの子） | コーヒー（`coffee`）6 / 紅茶（`tea`）3 / ソフトドリンク（`softdrink`）5 |

- ジャンルは**7件**（引き継ぎ書の「6件」は誤り）。作った順（TERM_ID）は上の表の順
- **ドリンクの品には親と子の両方のジャンルが付いている**（例：ドリンク＋ソフトドリンク）。
  コードでは料理を親ジャンルで、ドリンクを子ジャンルで分ける（`lib/queries/menu.ts`）

## 投入したデータ（2026-09-15確認）

| 種類 | 件数 | slug | アイキャッチ |
|---|---|---|---|
| お知らせ | 15 | `post-01`〜`post-15`（01が最新、2024-04-22〜2024-12-17） | 10件あり。**5件（02・03・06・11・15。営業時間の4件＋キャンペーンの03）は無し** |
| メニュー | 29 | タイトルと同じ日本語 | 料理15品はあり（img_pasta1〜5 等）。**ドリンク14品は無し** |
| ギフト | 9 | タイトルと同じ日本語 | 全件あり（img_item1〜8, img_item33） |
| 店舗 | 3 | タイトルと同じ日本語（全角スペース入り） | 全件あり（`map_kichijoji`〜。**名前に反して中身は店内の写真**） |
| TOPのランチ | 4 | — | 全件あり（メニューと同じ img_pasta1・4・2・5） |

データ上の注意：

- **`dishFields.price` は29品すべて入力済み**（2026-09-16、Figmaの価格と一致）。`null` の品があるとビルドが止まる
- `products.price` は数値（1000〜4000）
- **ギフトの並びは投稿日時の古い順（`orderby: {field: DATE, order: ASC}`）でFigmaと一致する**（2026-09-16確認）
- 店舗の `address`・`time` は2行を改行（`\r\n`）で区切った1つの文字列
- メニュー・ギフト・店舗のslugは日本語。詳細ページが無いのでURLには使わない。並びは別の方法で決める
  （**メニューは menu_order**（下の節）、ギフトは投稿日順、**店舗は `lib/site.ts` の `SHOP_TITLE_ORDER` で固定**：吉祥寺→阿佐ヶ谷→中野）
- **お知らせ本文（`content`）の全15件に `open-cafe-cms.local` の画像
  （img_firstview_concept、`srcset` の派生サイズ付き）が入っている**。詳細ページでそのまま出すと公開先で切れる

## メニューの並び順とプラグイン「Post Types Order」

- 「Post Types Order」の**自動並び替え（autosort）が有効**。GraphQLの `orderby` に何を指定しても
  **menu_order 順に上書きされる**（DATE・SLUGを書いても効かない）。クエリには意図が読めるよう `MENU_ORDER` と書く
- メニューの menu_order はFigmaの並びに振り直し済み（0＝オリーブとトマトのペペロンチーノ〜28＝ミックスジュース。
  パスタ→サラダ→パン&スイーツ→コーヒー→紅茶→ソフトドリンク）。**並びを変えるときは管理画面のドラッグで直す**
- GraphQLの `menuOrder` フィールドはメニュー（`dish`）では取れない。並びは結果の順番で確かめる
- autosort は他の投稿タイプにも効きうる。**ギフトの投稿日順・お知らせの新しい順が崩れていないか、並びを触ったら確かめる**

## 疎通確認できたクエリ

実際に使っている形は `lib/queries/` の各ファイル。

```graphql
{ genres(first: 100, where: {orderby: TERM_ID, order: ASC, hideEmpty: true}) { nodes { name slug parent { node { slug } } } } }
```

```graphql
{
  dishes(first: 100, where: {orderby: {field: MENU_ORDER, order: ASC}}) {
    nodes { title slug dishFields { price } genres { nodes { name slug parent { node { slug } } } } featuredImage { node { sourceUrl } } }
  }
}
```

```graphql
{ shops(first: 100) { nodes { title shopFields { address tel email time holiday count } featuredImage { node { sourceUrl } } } } }
```

お知らせの一覧のクエリでは抜粋（`excerpt`）も取る（TOPの大きいカード用。`<p>…本文の冒頭… [&hellip;]</p>` の形で返る）。

TOPはタイトル検索（`pages(where: {title: "TOP"})`）でも取れるが、同名ページが増えると取り違えるので
URIで1件に決める。

```graphql
{
  page(id: "top", idType: URI) {
    top {
      a { image { node { sourceUrl } } name }
      b { image { node { sourceUrl } } name }
      c { image { node { sourceUrl } } name }
      d { image { node { sourceUrl } } name }
    }
  }
}
```

お知らせの1件は `post(id: $slug, idType: SLUG)`、カテゴリは
`categories(where: {hideEmpty: true, orderby: TERM_ID, order: ASC})`。

## 画像の置き場所

WordPressには「どの記事にどの画像か」だけを持たせ、実体はリポジトリの `public/images/` から配る
（`lib/images.ts`）。元画像はLocalの `wp-content/uploads/2026/09/`。
コードが指している置き場所（フォルダは各ページの実装時に作る）：

| 種類 | 置き場所 |
|---|---|
| お知らせ | `/images/news/` |
| メニュー | `/images/menu/` |
| ギフト | `/images/products/` |
| 店舗の店内写真 | `/images/shop/`（WPの原本をそのまま置いている。二重に圧縮しないため） |
| TOPのランチ | `/images/menu/`（メニューと同じファイルを共有する。ユーザー決定） |

ギフト・店舗・TOPのランチは、画像が外れるとビルドが止まる（意図どおり）。
ギフト・店舗・メニューの料理・TOPのランチは、`public/` に画像の実物が無くてもビルドが止まる（`lib/images.server.ts`）。
メニューは料理（ドリンク以外）だけ画像が必須で、実物が無くても止まる。
お知らせは画像の無い記事が最初からあるので止めない（代わりのロゴ画像を出す）。
