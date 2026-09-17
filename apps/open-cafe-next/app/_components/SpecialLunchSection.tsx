import Image from "next/image";
import { HeadingGroup } from "@/components/heading/HeadingGroup";
import type { SpecialLunch } from "@/lib/queries/top";
import { SPECIAL_LUNCH_CONTENT } from "./content";

// WordPressの原本の実寸（メニューと同じ 735×735。表示は最大260px）
const LUNCH_IMAGE_SIZE = 735;

// 4品の記号（ACFの枠 a〜d の順）
const LUNCH_LETTERS = ["A", "B", "C", "D"];

interface SetItem {
  label: string;
  /** 文字の絵（手書き風の「パスタ」等） */
  labelSrc: string;
  labelWidth: number;
  labelHeight: number;
  photoSrc: string;
  photoWidth: number;
  photoHeight: number;
  /**
   * 白い台（PC 200×190 / SP 103×98）の中の位置。FigmaのSPはPCをそのまま縮めた値なので、台に対する%で持つ
   * （例：パスタの写真はPCで左14・上5・幅172 → 7% / 2.63% / 86%）
   */
  labelClassName: string;
  photoClassName: string;
}

// Figma: set-menu__detail 19709:8138（PC）/ 19710:3391（SP）
const SET_ITEMS: SetItem[] = [
  {
    label: "パスタ",
    labelSrc: "/images/home/label-pasta.svg",
    labelWidth: 68,
    labelHeight: 25,
    photoSrc: "/images/home/lunch-pasta.webp",
    photoWidth: 258,
    photoHeight: 218,
    labelClassName: "top-[calc(165/190*100%)] left-[calc(65/200*100%)] w-[34%]",
    photoClassName: "top-[calc(5/190*100%)] left-[7%] w-[86%]",
  },
  {
    label: "サラダ",
    labelSrc: "/images/home/label-salad.svg",
    labelWidth: 70,
    labelHeight: 23,
    photoSrc: "/images/home/lunch-salad.webp",
    photoWidth: 225,
    photoHeight: 218,
    labelClassName: "top-[calc(167/190*100%)] left-[calc(65/200*100%)] w-[35%]",
    photoClassName: "top-[calc(10/190*100%)] left-[12.5%] w-[75%]",
  },
  {
    label: "ドリンク",
    labelSrc: "/images/home/label-drink.svg",
    labelWidth: 85,
    labelHeight: 22,
    photoSrc: "/images/home/lunch-drink.webp",
    photoWidth: 240,
    photoHeight: 180,
    labelClassName: "top-[calc(168/190*100%)] left-[29%] w-[42.5%]",
    // Figmaでは160×155の枠の中で、写真（縦横比4:3）を上から8.58%に置いている → 台の上から 14＋13.3＝27.3px
    photoClassName: "top-[calc(27.3/190*100%)] left-[10%] w-[80%]",
  },
];

interface SpecialLunchSectionProps {
  lunches: SpecialLunch[];
}

/**
 * SPECIAL LUNCH SET（Figma: PC special-lunchset 19709:8089 / SP 19710:3189）。
 * 4品（A〜D）はWordPressの固定ページ「TOP」、セットの中身と価格はFigmaの原稿で固定
 */
export function SpecialLunchSection({ lunches }: SpecialLunchSectionProps) {
  return (
    <section
      aria-labelledby="top-special-lunch-heading"
      className="relative flex flex-col items-center gap-[60px] bg-base-dark py-[60px] md:px-10 xl:py-20"
    >
      {/* 葉っぱ：右上から画面の外へはみ出す */}
      <Image
        src="/images/home/leaves.webp"
        alt=""
        aria-hidden="true"
        width={302}
        height={342}
        loading="lazy"
        className="pointer-events-none absolute -top-[170px] -right-[33px] h-auto w-[119px] xl:-top-[130px] xl:-right-[34px] xl:w-[201px]"
      />

      <div id="top-special-lunch-heading" className="w-full">
        <HeadingGroup en={SPECIAL_LUNCH_CONTENT.headingEn} ja={SPECIAL_LUNCH_CONTENT.headingJa} />
      </div>

      <div className="relative flex w-full max-w-[1200px] flex-col items-center gap-5 bg-white px-5 pt-10 pb-5 md:gap-[60px] md:px-10 md:pt-[60px] md:pb-10">
        {/* 吹き出し：Figmaでは4度傾けて、SPは見出しの右上・PCは白い枠の右上に重ねている。
            傾けた外枠の位置から、傾ける前の絵の位置に直した値。
            PCの位置は lg から（768pxでは白い枠が狭く、中央のリボンに重なったため） */}
        <Image
          src="/images/home/balloon-lunch.svg"
          alt={SPECIAL_LUNCH_CONTENT.balloon}
          width={299}
          height={140}
          loading="lazy"
          className="pointer-events-none absolute -top-[237px] -right-[17px] h-auto w-[200px] rotate-4 lg:-top-[50px] lg:-right-5 lg:w-[299px]"
        />

        <Ribbon />

        <ul className="grid w-full grid-cols-2 gap-x-[19px] gap-y-5 md:grid-cols-4 md:gap-x-[27px] md:gap-y-0">
          {lunches.map((lunch, index) => (
            // PCはB・Dを40px下げて互い違いにする（Figma: menu-item の pt-40）
            <li key={LUNCH_LETTERS[index]} className={`flex flex-col gap-4 ${index % 2 === 1 ? "lg:pt-10" : ""}`}>
              <Image
                src={lunch.imageSrc}
                // WPから来る写真は飾り扱い（/rules/headless-wordpress.md）。品名は直下の文字が伝える
                alt=""
                width={LUNCH_IMAGE_SIZE}
                height={LUNCH_IMAGE_SIZE}
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
              {/* 記号と品名はPCの大きさ（49px・18px）を xl から。1024pxではカードが196pxで、PCの大きさだと品名が3行に折れた */}
              <div className="flex items-center gap-1.5 xl:gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center bg-contrast font-patua text-[19px]/none tracking-[0.12em] text-white xl:size-[49px] xl:text-[32px]/none">
                  {LUNCH_LETTERS[index]}
                </span>
                <h3 className="min-w-0 flex-1 text-sm/[1.5] font-bold text-contrast xl:text-lg/[1.5]">
                  {lunch.name}
                </h3>
              </div>
            </li>
          ))}
        </ul>

        <SetMenu />
      </div>
    </section>
  );
}

/** 白い枠の上端にまたがる黒いリボン（Figma: img_ribbon-text）。左右の切り欠きは本体の後ろに敷く */
function Ribbon() {
  return (
    <div className="absolute -top-[25px] left-1/2 -translate-x-1/2 md:-top-5">
      <Image
        src="/images/home/ribbon-left.svg"
        alt=""
        aria-hidden="true"
        width={31}
        height={37}
        loading="lazy"
        className="absolute top-[7px] -left-[19px] h-[37px] w-[31px]"
      />
      <Image
        src="/images/home/ribbon-right.svg"
        alt=""
        aria-hidden="true"
        width={31}
        height={37}
        loading="lazy"
        className="absolute top-[7px] -right-[19px] h-[37px] w-[31px]"
      />
      <p className="relative flex h-[37px] items-center bg-contrast px-2.5 text-sm/[1.5] font-bold whitespace-nowrap text-white md:text-lg/[1.5]">
        {SPECIAL_LUNCH_CONTENT.ribbon}
      </p>
    </div>
  );
}

/**
 * セットの中身と価格（Figma: set-menu 19709:8093 / 19710:3390）。
 * 〜xl は中身の下に価格を中央揃えで置く（SP）。xl〜は横に並べて価格を右揃え（PC）。
 * 白い台はSP 103×98、lg〜はPCの200×190（lgなら横700pxが白い枠に入る）
 */
function SetMenu() {
  return (
    <div className="flex w-full flex-col items-center gap-5 rounded-lg bg-[#f7f6f4] py-5 xl:h-[230px] xl:flex-row xl:justify-between xl:px-[70px]">
      {/* 背景の #f7f6f4 はルールセットの色（cr-*）に無いので、名前を作らずFigmaの値のまま置く */}
      <ul className="flex items-center lg:gap-3">
        {SET_ITEMS.map((item, index) => (
          <li key={item.label} className="flex items-center lg:gap-3">
            {index > 0 && (
              // 「＋」は並びの区切りを表す絵。読み上げでは品名の並びだけで伝わるので飾り扱い
              <Image
                src="/images/home/icon-plus.svg"
                alt=""
                aria-hidden="true"
                width={26}
                height={26}
                loading="lazy"
                className="size-[13px] lg:size-[26px]"
              />
            )}
            <div className="relative h-[98px] w-[103px] lg:h-[190px] lg:w-[200px]">
              <Image
                src={item.photoSrc}
                alt=""
                aria-hidden="true"
                width={item.photoWidth}
                height={item.photoHeight}
                loading="lazy"
                className={`absolute h-auto ${item.photoClassName}`}
              />
              {/* 手書き風の文字の絵なので alt に文言を書く */}
              <Image
                src={item.labelSrc}
                alt={item.label}
                width={item.labelWidth}
                height={item.labelHeight}
                loading="lazy"
                className={`absolute h-auto ${item.labelClassName}`}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-center text-contrast xl:items-end xl:gap-3.5">
        <p className="text-center text-base/[1.5] font-bold xl:text-right xl:text-xl/[1.5]">
          {SPECIAL_LUNCH_CONTENT.setName[0]}
          <br />
          {SPECIAL_LUNCH_CONTENT.setName[1]}
        </p>
        <div className="flex flex-col items-center gap-3 xl:items-end xl:gap-3.5">
          <div className="flex flex-col items-center gap-2.5 xl:w-[213px] xl:items-start">
            <p className="font-damion text-[40px]/none font-normal whitespace-nowrap xl:text-6xl/none">
              {SPECIAL_LUNCH_CONTENT.price} yen
            </p>
            {/* 点線（Figma: リピートグリッド 17）。点の絵を横に並べる。
                SPは12px間隔で幅148px（13個）、PCは11.62px間隔で幅213px（19個）。点を1つ目の位置に合わせるため、背景を左へずらす */}
            <div
              aria-hidden="true"
              className="h-1 w-[148px] bg-[url(/images/home/dot.svg)] bg-size-[12px_4px] bg-position-[-4px_0] bg-repeat-x xl:w-[213px] xl:bg-size-[11.62px_4px] xl:bg-position-[-3.87px_0]"
            />
          </div>
          <p className="text-xs/[20px] font-bold xl:text-sm/[20px]">{SPECIAL_LUNCH_CONTENT.hours}</p>
        </div>
      </div>
    </div>
  );
}
