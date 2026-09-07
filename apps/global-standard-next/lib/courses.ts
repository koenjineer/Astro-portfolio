export interface Course {
  /** WordPressのタクソノミー`business`のスラッグ。ページ内アンカーのidにも使う */
  slug: string;
  title: string;
  englishName: string;
}

/**
 * 研修コースの3種。サービスページのカード見出しと、導入事例のセクション見出し・
 * カテゴリーボタン・カード内の「研修コース：」で同じ文言を使うため1か所にまとめる。
 * 配列の順序がそのまま両ページでの表示順になる（Figmaと同じ01→02→03の順）。
 */
export const COURSES: Course[] = [
  {
    slug: "business-english-training",
    title: "ビジネス英語研修",
    englishName: "Business English Training",
  },
  {
    slug: "cross-cultural-communication",
    title: "異文化コミュニケーション",
    englishName: "Cross-cultural communication",
  },
  {
    slug: "business-study-abroad-program",
    title: "ビジネス留学プログラム",
    englishName: "Business study abroad program",
  },
];
