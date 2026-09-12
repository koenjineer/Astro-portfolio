# デザインルールセット

Figma「ルールセット」（[node-id=14592-6198](https://www.figma.com/design/PTtMblDobjSLBSz9HlUEn9/%E6%9E%B6%E7%A9%BA%E3%82%B3%E3%83%BC%E3%83%9B%E3%82%9A%E3%83%AC%E3%83%BC%E3%83%88%E3%82%B5%E3%82%A4%E3%83%88_20250715--%E3%82%B3%E3%83%94%E3%83%BC-?node-id=14592-6198&m=dev)）
で定義された、サイト全体に適用する決まりごと。

## カラー

`app/globals.css` の `@theme inline` に登録済み。Figmaの変数名をそのままトークン名にしている。

| Figma変数 | 値 | Tailwindクラス |
|---|---|---|
| `color-main` | `#023e78` | `bg-main` / `text-main` / `border-main` |
| `color-main-dark` | `#002a52` | `bg-main-dark`（塗りつぶしボタンのホバー） |
| `color-main-light` | `#edf3f8` | `bg-main-light`（サービス02の斜め背景） |
| `color-contrast` | `#1a1a1a` | `text-contrast`（本文） |
| `color-contrast-light` | `#888888` | `text-contrast-light`（パンくず等） |
| `color-accent-1` | `#fff400` | `bg-accent-1` / `text-accent-1` / `border-accent-1` |
| `color-accent-2` | `#e61264` | `text-accent-2`（FAQの開状態） |
| `color-base` | `#ffffff` | **登録しない** → `text-white` / `bg-white` を使う |

`color-base` を登録しない理由：`--color-base` を足すと文字色の `text-base` が生成され、
文字サイズ16pxを指す既存の `text-base` と名前が衝突して意味が判別できなくなるため。

## フォント

`app/layout.tsx` で `next/font/google` から読み込む。

| 用途 | 書体 | 太さ |
|---|---|---|
| 日本語・本文 | Noto Sans JP | Medium(500) / Bold(700) |
| 英字見出し | Fira Sans | Medium Italic(500) |

- 本文の既定は `body { font-weight: 500 }`（`app/globals.css`）。Regular(400)は読み込まない。
- ルールセットには Fira Sans の Bold Italic もあるが、使う箇所がまだ無いため未読み込み。
  必要になった時点で `firaSans` の `weight` に `"700"` を追加する。

## ボタンのホバー

共通：色は `transition-colors duration-300`、矢印の移動は `transition-transform duration-300`、
どちらも `motion-reduce:transition-none` を添える。ホバーと同じ見た目を `focus-visible:` にも付ける。

| パターン | ホバー時 | 実装場所 |
|---|---|---|
| 枠線+白背景 | 背景を `main` で塗りつぶし、文字を白に | `components/layout/SiteHeader.tsx`「資料ダウンロード」 |
| 背景塗りつぶし | 背景を `main-dark` に濃くする | `components/layout/SiteHeader.tsx`「お問い合わせ」 |
| 矢印つき（白背景） | 背景を `main` で塗りつぶし、文字とアイコンを白に反転。矢印を右へ+10px | `app/service/_components/ServicePrograms.tsx`「お申し込みはこちら」 |
| 矢印つき（画像上・黄枠） | 背景を `accent-1` で塗りつぶし、文字とアイコンを `main` に反転。矢印を右へ+8px | `components/layout/SiteFooter.tsx`「View more」 |
| ページ送りの数字 | 背景 `#f8f8f8` を `main` で塗りつぶし、文字を白に | `app/news/_components/NewsPagination.tsx` |
| サイドバーのカテゴリ | 文字を `main` に。シェブロンを右へ+4px | `app/news/_components/NewsSidebar.tsx` |
| お知らせ一覧の行 | タイトルの文字を `main` に（行全体がリンク） | `app/news/_components/NewsListItem.tsx` |
| 前後の記事ボタン | 背景を `main` で塗りつぶし、文字を白に | `app/news/_components/NewsArticleNav.tsx` |
| 記事本文中のリンク | 文字を `main-dark` に濃くする | `app/news/_components/entry-content.css` |
| トップページ「View more」 | 線が丸を突き抜けて右へ伸びる（SPは丸の右端から16px、PCは20px） | `app/_components/ViewMoreLink.tsx` |
| グローバルナビ | 文字を `main` に。1pxの下線を出す | `components/layout/SiteHeader.tsx` |

「ページ送りの数字」から「記事本文中のリンク」までの5つと「グローバルナビ」は
Figmaに指定が無く、上の4パターンの考え方を当てはめて決めたもの。

## グローバルナビの現在地

今いるページのナビ項目は、文字を `main` にして**2pxの下線**を常時出す
（`aria-current="page"` も付ける）。ホバーの下線は1pxなので、太さで
「今いるページ」と「指しているだけのページ」を見分けられる。
現在地の項目にはホバーのclassを当てない。あとから来る `hover:` が勝って細くなるため。

下層ページ（`/news/<slug>`、`/news/page/2` など）でも親の項目を現在地として光らせる。
トップだけは完全一致で判定する（`/` はすべてのパスの先頭に一致してしまうため）。

SPメニューでも同じ下線を出す（白）。ホバーは付けない。

資料ダウンロード・お問い合わせはナビではなくCTAボタンなので、その2ページでは
どの項目も光らない。

矢印は `components/icons/ArrowRightIcon.tsx`、シェブロンは
`components/icons/ChevronRightIcon.tsx`（どちらも塗りが `currentColor`）を使う。
親の文字色に追従するので、色反転のために色違いのSVGファイルを増やさなくてよい。
シェブロンはページ送りの「次へ」と「前へ」でも使い、「前へ」は `rotate-180` で向きを変える。

## トップへ戻るボタン

`components/layout/BackToTop.tsx`。Figmaではフッター内に置かれているが、実装では
**画面右下に追従**させ、300px以上スクロールすると現れる（`SiteFooter` から描画）。

アイコン `icon-top-pc.svg` は輪も矢印も白一色で、暗いフッター専用に作られている。
追従させると本文の白地や写真の上に乗って見えなくなるため、`rounded-full bg-main` で
紺の丸を敷いている。ホバーは「背景塗りつぶし」パターン（`main-dark`）。

`z-30`：SPメニュー（`z-40`、ヘッダー `z-50` の内側）より下に潜らせ、メニューを開いている
間はボタンが上に乗らないようにする。

## ページ内リンクのスクロール

ページ内アンカー（導入事例のカテゴリーボタン等）は、`app/layout.tsx` の `<html>` に付けた
`motion-safe:scroll-smooth` でなめらかにスクロールする。
`motion-safe:` なので、OSで「視差効果を減らす」を有効にしている人には従来どおり瞬時に移動する
（ホバーに `motion-reduce:transition-none` を添えるのと同じ考え方）。

**SPメニュー内のボタンにはホバーを付けない。** タッチ端末では発火せず、
かつ `lg:hidden` でPC幅では表示されないため。

## 導入事例カードのホバー

トップページの導入事例カードは、ホバーで**矢印アイコンが `accent-1` に変わり、右へ10pxズレる**
（`app/_components/HomeCaseCard.tsx`）。

移す対象は `transition-[color,translate]` と書く。Tailwind v4の `translate-x-*` は
`transform` ではなく `translate` プロパティを使うため、`transition-[color,transform]` だと動かない
（角括弧なしの `transition-transform` なら動く。`/rules/tailwind.md`）。

「View more」の線が伸びる方も同じ理由で `transition-[right]`。丸・線・矢先を
別々の要素で描いているのは、1枚のSVGでは線だけを伸ばせないため。
