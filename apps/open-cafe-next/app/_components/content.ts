/**
 * TOPページの固定の原稿（Figma: 【PC】TOP 19709:8911 / 【SP】TOP 19710:4041 に表示されている文章）。
 * 年に何度も変わる文章ではないので、WordPressには入れない（/rules/headless-wordpress.md「WordPressから取る情報の線引き」）。
 * 改行はFigmaの位置で配列に分け、画面側で <br /> を挟む
 */

/** ファーストビューのキャッチコピー。SPは3行、md〜は2行（1行目と2行目をつなげる） */
export const CATCH_COPY_LINES = ["パスタとコーヒーが", "とってもおいしい、", "ほっと落ち着くのんびり空間。"];

export const CONCEPT_CONTENT = {
  headingEn: "concept",
  headingJa: "当店のこだわり",
  /** 見出しの改行はPC・SPで同じ位置 */
  leadLines: ["最高のコーヒーと、", "時の流れを味わうことができる", "手作りカフェ"],
  paragraphs: [
    "自家焙煎の新鮮な豆から丁寧に抽出したコーヒーが奏でる香りと味わいを、温もり溢れる手作りの店内で堪能していただける当店。ゆったりと流れる時間のなかで、雑味のないクリアな味をじっくりと味わえば、慌ただしい日常を忘れ、心ほどけるひとときをお過ごしいただけます。",
    "訪れるたびに心満たされる特別な余韻は、ここでしか味わえない最上のくつろぎです。それは、忙しさに追われる日常をそっと解きほぐす、至福の瞬間でもあります。",
  ],
};

export const SPECIAL_LUNCH_CONTENT = {
  headingEn: "special lunch set",
  headingJa: "今月のスペシャルランチセット",
  ribbon: "お好きなパスタをお選びください",
  /** 吹き出しの絵に描かれている文言。絵の alt に使う */
  balloon: "パスタ、サラダ、ドリンクのお得なセット☆",
  setName: ["スペシャルランチセット", "【選べる3品】"],
  /** 画面では後ろに「 yen」を付け、Damionで「1,280 yen」と表示する */
  price: "1,280",
  hours: "(11:00 AM〜14:00 PMまで)",
};

/** ギャラリー（Instagram連携はせず、Figmaの写真4枚を固定で置く。ユーザー決定） */
export const GALLERY_CONTENT = {
  headingEn: "gallery",
  headingJa: "ギャラリー",
  balloon: "インスタグラムも毎日投稿してます！",
  /**
   * 架空のカフェで実在のアカウントが無いので、押せる見た目を保つ仮リンクにする（ユーザー決定）。
   * ギフトの「ショップで確認する」と同じ考え方
   */
  instagramHref: "https://www.instagram.com/",
  images: [
    { src: "/images/home/gallery1.webp", alt: "テラス席のあるカフェの店先" },
    { src: "/images/home/gallery2.webp", alt: "バジルとトマトをのせたピザ" },
    { src: "/images/home/gallery3.webp", alt: "皿に盛りつけたラザニア" },
    { src: "/images/home/gallery4.webp", alt: "店頭に並んだ砂糖がけのドーナツ" },
  ],
};
