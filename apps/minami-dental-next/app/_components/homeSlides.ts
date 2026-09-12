export interface HomeSlide {
  pcSrc: string;
  spSrc: string;
  /** 書き出した写真の実寸。fv-02 だけ元の写真が小さく、他より低い解像度で入っている */
  pcWidth: number;
  pcHeight: number;
  spWidth: number;
  spHeight: number;
}

/** メインビジュアルで切り替える写真3枚（Figma: 【PC】/【SP】ファーストビュー画像） */
export const HOME_SLIDES: HomeSlide[] = [
  {
    pcSrc: "/images/home/fv-01-pc.webp",
    spSrc: "/images/home/fv-01-sp.webp",
    pcWidth: 1740,
    pcHeight: 780,
    spWidth: 670,
    spHeight: 894,
  },
  {
    pcSrc: "/images/home/fv-02-pc.webp",
    spSrc: "/images/home/fv-02-sp.webp",
    pcWidth: 1207,
    pcHeight: 541,
    spWidth: 624,
    spHeight: 832,
  },
  {
    pcSrc: "/images/home/fv-03-pc.webp",
    spSrc: "/images/home/fv-03-sp.webp",
    pcWidth: 1740,
    pcHeight: 780,
    spWidth: 670,
    spHeight: 894,
  },
];
