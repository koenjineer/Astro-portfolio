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
| トップページ「View more」 | 矢印が右に伸びる | **未実装**（トップページ実装時に対応） |

矢印は `components/icons/ArrowRightIcon.tsx`（塗りが `currentColor`）を使う。
親の文字色に追従するので、色反転のために色違いのSVGファイルを増やさなくてよい。

**SPメニュー内のボタンにはホバーを付けない。** タッチ端末では発火せず、
かつ `lg:hidden` でPC幅では表示されないため。

## 導入事例カードのホバー（未実装）

トップページの導入事例カードは、ホバーで**矢印アイコンが黄色に変わり、右にズレる**。
トップページ実装時に対応する。
