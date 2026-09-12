# 共通部品の置き場所

`apps/minami-dental-next` の部品をどこに置いたかの記録。決まり自体は姉妹サイト
`apps/global-standard-next` と同じで、**次のプロジェクトでもこの形を使う**。

- **2ページ以上で使う部品** → `components/`（`@/components/...` で参照）
  - `components/layout/`：SiteHeader（＋SpMenu・spMenuInert）/ SiteFooter（＋FooterSitemap）/ PageHero / Breadcrumb /
    ReserveFixedButton（PC右端）/ SpReserveBar（SP下端）/ BackToTop / TelNumber /
    ContentWidth（本文の幅：左右20px＋幅の上限1000pxで中央。当院について・スタッフ紹介・診療案内・ホーム）/
    MediaBlock（写真＋文章のブロックと水色の飾り。当院についてのポリシーと特徴・ホームのCONCEPT）/
    WaveBand（上下の波＋水色の帯。診療案内の帯・ホームの診療案内）/
    MedicalTimeCard（診療時間表の白いカード。フッター・ホーム）/
    FormPageShell（WEB予約・お問い合わせの外枠。ページ上部の見出しだけ引数）。
    案内とフォームの並び FormPageSections も同じファイル。ナビ6項目は navItems.ts
  - 電話番号は発信リンクにしない（架空の番号が実在した場合の誤発信を避けるため。表示だけの TelNumber を使う）
  - `components/icons/`：塗り・線は `currentColor`（親の文字色に追従させ、色違いのSVGを増やさない）
  - `components/form/`：FormField（`control` でinput/select/textareaを出し分け）/ ChoiceGroup / FieldLabel /
    SubmitButton（「送　信」ボタン）/
    NoSendForm（送信しないフォームの外側：見出し＋区切り線の枠＋送信ボタン）/ ContactInfoFields（お名前〜メールの4項目）
  - `components/heading/`：SectionHeading（斜線の飾り付き見出し。WEB予約・お問い合わせ・当院について・スタッフ紹介・診療案内・ホーム）
  - `components/archive/`：お知らせ・ブログ共通。ArchiveListPage（一覧・カテゴリー別の組み立て。取得は各セクション側）/
    archiveMetaTitle（`<title>` の並べ方）/ ArchivePageShell（外枠・2段組み）/ ArchiveCard（一覧と新着記事のカード）/
    CategoryTag / ArchiveSidebar / ArchivePagination / ArticleNav（前後の記事）/ ArchiveArticle（記事の本体＋ entry-content.css）。
    記事・カテゴリー・URLの作り方は引数（`types.ts` の `ArchiveRoutes`）で受け取り、お知らせ・ブログ固有の名前やパスを中に持たない
- **1ページでしか使わない部品** → `app/<page>/_components/`
- PC/SPはFigmaでは別コンポーネントだが、コードでは1つの部品の中でTailwindのレスポンシブクラスで出し分ける
- 画面幅の切り替えは、ヘッダー（ナビ・SPメニュー）と固定ボタン類が `xl`（1280px）、それ以外は `lg`（1024px）。
  ヘッダーはナビ6項目＋電話番号で約1115px必要で、1024pxでは入らないため。
  例外はスタッフ紹介のカードとホームの診療案内カードで、どちらもタブレットは `md`（768px）から2列にする
  （Figmaにタブレットのデザインが無く、1列のままだと大きくなりすぎるため。`/rules/design-to-code.md`）
- ヘッダー・フッター・固定ボタン類は `app/layout.tsx` で全ページに入る（各ページでは置かない）
