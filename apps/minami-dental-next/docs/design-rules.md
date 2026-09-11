# デザインルールセット

Figma「ルールセット」（[node-id=25322-13320](https://www.figma.com/design/LGBTD8kxfANEORjJbp1Y6R/?node-id=25322-13320&m=dev)）・
「ホバーデザイン」（[node-id=25307-6855](https://www.figma.com/design/LGBTD8kxfANEORjJbp1Y6R/?node-id=25307-6855&m=dev)）・
「フォームコンポーネント」（[node-id=25329-14929](https://www.figma.com/design/LGBTD8kxfANEORjJbp1Y6R/?node-id=25329-14929&m=dev)）
で定義された、サイト全体に適用する決まりごと。

## カラー

`app/globals.css` の `@theme inline` に登録済み。Figmaの変数名をそのままトークン名にしている。

| Figma変数 | 値 | Tailwindクラス | 主な使い道 |
|---|---|---|---|
| `color-main` | `#1391e6` | `bg-main` / `text-main` / `border-main` | ボタンの枠・塗り、ナビのホバー |
| `color-main-dark` | `#0060a0` | `bg-main-dark` | 塗りつぶしボタン（WEB予約）のホバー |
| `color-main-light` | `#dff1fd` | `bg-main-light` | 下向き矢印ボタンのホバー背景 |
| `color-accent` | `#ee5a6d` | `text-accent` / `bg-accent` | 強調 |
| `color-contrast` | `#393939` | `text-contrast` | 本文（`body` の既定の文字色） |
| `color-contrast-light` | `#888888` | `text-contrast-light` | 日付・補足などの薄い文字 |
| `color-base` | `#ffffff` | **登録しない** → `text-white` / `bg-white` を使う | 背景・反転文字 |

`color-base` を登録しない理由：`--color-base` を足すと文字色の `text-base` が生成され、
文字サイズ16pxを指す既存の `text-base` と名前が衝突して意味が判別できなくなるため。

## フォント

`app/layout.tsx` で `next/font/google` から読み込む。

| 用途 | 書体 | 太さ |
|---|---|---|
| 日本語・英語とも | M PLUS Rounded 1c | Medium(500) / Bold(700) |

- 本文の既定は `body { font-weight: 500 }`（`app/globals.css`）。**Regular(400)は読み込まない。**
  ルールセットに無い太さを使うとブラウザが擬似的に作った字形になるため、太さの指定は
  `font-medium`（500）と `font-bold`（700）だけにする（`font-normal` などは付けない）。

## 影

| Figma | 値 | Tailwindクラス |
|---|---|---|
| デフォルトシャドウ | `0 3px 6px #00000029` | `shadow-default` |

## ホバー

共通の約束：

- 色は `transition-colors`、矢印の移動や画像の拡大は `transition-transform` で動かし、
  どれにも `motion-reduce:transition-none` を添える
  （Tailwind v4 の `transition-transform` は `transform, translate, scale, rotate` をまとめて対象にするので、
  `translate-x-*` / `scale-*` もこれで動く。`transition-[transform]` と書くと `translate` / `scale` が外れて動かない）
- **同じ要素**で色と動きを両方変えるときは `transition-[color,translate]` のように1つのクラスにまとめる。
  `transition-colors` と `transition-transform` を並べると、どちらも同じ `transition-property` を
  上書きするので後に来た方しか効かない
- ホバーと同じ見た目を `focus-visible:` にも付ける（キーボード操作でも同じ変化が見えるように）

「Figmaの注記」はFigmaに書かれた文言そのまま。「カンプから読んだ見た目」は注記に無く、
通常／ホバーの2つの絵を見比べて読み取ったもの（実装時に `get_design_context` で値を確かめる）。
「実装した場所」はページ実装のたびに埋める。

| 部品（Figmaの名前） | Figmaの注記 | カンプから読んだ見た目 | 実装した場所 |
|---|---|---|---|
| ボタン・矢印つき（`button-utility-pc`） | 色が変わり、矢印が少し右に移動 | 白地・`main` 枠 → `main` 塗り・白文字 | 未実装 |
| お問い合わせボタン（`button-contact-pc`、封筒アイコン） | 色が変わる | 白地・`main` 枠 → `main` 塗り・白文字 | フッター（`components/layout/SiteFooter.tsx`） |
| WEB予約ボタン（`button-reserve-pc`、パソコンとスマホのアイコン） | 色が変わる | `main` 塗り → `main-dark` 塗り | フッター（同上） |
| 下向き矢印ボタン（`button-arrow-down-pc`、「一般歯科」など） | 色が変わり、下向きの矢印を表示 | 白地・`main` 枠 → `main-light` 地 | 未実装 |
| PC右端固定の予約ボタン（`button-reserve-fixed`、縦長） | 色が変わる | `main` 塗り → `main-dark` 塗り | `components/layout/ReserveFixedButton.tsx` |
| お知らせの行（`news-link-pc`、日付＋タイトル＋右矢印） | 色が変わり、矢印が少し右に移動 | 文字が `main` に | 未実装 |
| 診療案内カード（写真＋白文字） | フィルターが濃くなり、画像が少し拡大、枠線を表示 | — | 未実装 |
| トップのブログカード（`top-blog-card-pc`） | 文字の色が変化し、サムネイル画像が少し拡大 | 文字が `main` に | 未実装 |
| ブログ一覧のカード（`archive-blog-card-pc`） | 同上 | 同上＋サムネイル1.1倍（ホバーの絵の 290.4/264） | `components/archive/ArchiveCard.tsx`（お知らせ・ブログの一覧） |
| サイドバーのブログカード（`sidebar-blog-card-pc`） | 同上 | 同上＋サムネイル1.1倍（132/120） | 同上の `variant="sidebar"`（お知らせ・ブログのサイドバー） |
| グローバルナビ（`header-nav`、アイコン＋文字の6項目） | 文字とアイコンの色が変化し下線を表示（ホバーと現在地で共通） | 文字・アイコンが `main` に | `components/layout/SiteHeader.tsx`（下線は `::after`） |
| フォームの送信ボタン（フォームコンポーネント内の `button-contact-pc`） | （注記なし。「通常」「ホバー」の見出しのみ） | 白地・`main` 枠 → `main` 塗り・白文字 | `components/form/SubmitButton.tsx`（WEB予約・お問い合わせ） |

Figmaにホバーの無い部品：ページトップへ戻る（`BackToTop`）は、「枠線＋白地」のボタンに合わせて
`main` で塗り矢印を白にした。パンくず・フッターのサイトマップは色を変えない（指定が無いため）。
電話番号は発信リンクにしていない（架空の番号の誤発信を避けるため）ので、ホバーも付けない。
お知らせ（ブログ共通）のページ送り・前後の記事ボタンは、枠線のボタンを `main` 塗り・白文字に、塗りのボタンを `main-dark` にした。
サイドバーのカテゴリーは文字が `main` になり三角が右へ、「当院について」は矢印が右へ動く。
記事本文のリンクは、ふだん `main`（下線付き）、ホバー・フォーカス時 `main-dark`。
スタッフ紹介のカードと写真の帯はホバーなし（カードはリンクではなく、帯は飾り。帯は動きを減らす設定だと止まる）。

画像の拡大は、はみ出しを隠すため画像の外側の枠に `overflow-hidden` を付ける。
アイコンは塗りを `currentColor` にしておくと親の文字色に追従するので、
色が反転するたびに色違いのSVGファイルを増やさなくてよい。

## グローバルナビの現在地

Figmaでは**ホバーと現在地が同じ見た目**（文字とアイコンの色が変わり、下線が出る）。
今いるページの項目には常時その見た目を当て、`aria-current="page"` を付ける。
見た目で区別できない分、読み上げソフトには `aria-current` で現在地を伝える。

## フォーム

Figma「フォームコンポーネント」にあるもの：入力欄（入力前／入力後）・ラジオ・チェックボックス・
送信ボタン（通常／ホバー）。

Figmaには「バリデーションエラー時の見栄えは Contact Form 7 の標準で問題ない」とあるが、
このサイトはフォームを**送信しない**構成で Contact Form 7 も使わないため当てはまらない。
**入力漏れの表示はブラウザ標準の吹き出し**（`required`）にする（2026-09-11 ユーザー確定）。独自のエラー表示は作らない。

- チェックボックスの「1つ以上必須」はHTMLに標準の指定が無い。`required` を全部に付けると「全部必須」になるので、
  1つも選ばれていない間だけ先頭の1つに `setCustomValidity` で文言を渡し、同じ吹き出しで止める（`ChoiceGroup`）
- 入力欄の地 `#f6f6f6`・線とplaceholderの `#c2c2c2` はFigmaの色変数ではない生の色なので、トークンに足さず部品の中で持つ

## SP

タッチ端末ではホバーが発火しないので、**SPにしかない部品（SPメニュー・SP固定の予約ボタンなど）には
ホバーを付けない。**
