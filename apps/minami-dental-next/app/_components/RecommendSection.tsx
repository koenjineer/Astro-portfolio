import type { ReactNode } from "react";
import { SectionHeading } from "@/components/heading/SectionHeading";
import { SVG_BASE_PROPS } from "@/components/icons/SmallIcons";
import { ContentWidth } from "@/components/layout/ContentWidth";

// 書き出したSVGの実寸（Figmaの表示サイズと同じ）
const LABEL_WIDTH = 182;
const LABEL_HEIGHT = 32;
const ICON_WIDTH = 227;
const ICON_HEIGHT = 220;

interface RecommendItem {
  /** 「＼ おすすめ01 ／」の飾り文字。文字を図にしたものなので alt で読ませる */
  order: string;
  labelSrc: string;
  iconSrc: string;
  /** 青い吹き出しの中の言葉 */
  title: string;
  description: ReactNode;
}

// おすすめの3項目はWordPressに無い固定の文言なので、コードに持つ
const RECOMMEND_ITEMS: RecommendItem[] = [
  {
    order: "おすすめ01",
    labelSrc: "/images/home/recommend-label-01.svg",
    iconSrc: "/images/home/recommend-icon-01.svg",
    title: "痛くない歯科医療の追求",
    description: (
      <>
        歯の治療において、小さな違和感は大きなストレスにつながります。
        <br />
        私たちは常に快適な歯科医療技術の研究を行っております。
      </>
    ),
  },
  {
    order: "おすすめ02",
    labelSrc: "/images/home/recommend-label-02.svg",
    iconSrc: "/images/home/recommend-icon-02.svg",
    title: "駅から徒歩3分",
    // 「機に」：Figmaは「期に」だが、当院についてのページで同じ文の同じ誤字を直しているので表記を揃える
    description:
      "「通いやすさ」も医院選びの重要なポイントと考え、2019年のリニューアルを機に更に駅の近くへ場所を移しました。",
  },
  {
    order: "おすすめ03",
    labelSrc: "/images/home/recommend-label-03.svg",
    iconSrc: "/images/home/recommend-icon-03.svg",
    title: "夜20:30まで営業",
    description: (
      <>
        朝から夜までお仕事をされている方のために、診療時間を見直しました。
        <br />
        <span className="text-accent">
          ※駆け込みでも対応可能ですが、事前にご連絡いただけるとスムーズです。
        </span>
      </>
    ),
  },
];

/** 当院の3つのおすすめ（Figma: recommend）。PCは3列、1024px未満は1列に縦積み */
export function RecommendSection() {
  return (
    <section className="py-[100px] lg:py-[120px]">
      <ContentWidth>
        <div className="flex flex-col gap-10 lg:gap-[60px]">
          <SectionHeading>当院の3つのおすすめ</SectionHeading>

          {/* PCは 290px×3＋間65px＝1000px。1024〜1280px幅では間だけが縮む */}
          <ul className="flex flex-col items-center gap-[60px] lg:flex-row lg:items-start lg:justify-between lg:gap-[65px]">
            {RECOMMEND_ITEMS.map((item) => (
              <RecommendCard key={item.order} item={item} />
            ))}
          </ul>
        </div>
      </ContentWidth>
    </section>
  );
}

interface RecommendCardProps {
  item: RecommendItem;
}

function RecommendCard({ item }: RecommendCardProps) {
  return (
    // 320px幅の画面でも収まるよう、Figmaの290pxは上限として扱う
    <li className="flex w-full max-w-[290px] flex-col items-center">
      {/* 素のimg：SVGは next/image を通しても最適化されないので、そのまま置く */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.labelSrc}
        alt={item.order}
        width={LABEL_WIDTH}
        height={LABEL_HEIGHT}
        loading="lazy"
        className="h-8 w-[182px]"
      />

      {/* 絵は青い吹き出しの下に潜り込ませる（Figmaの重なり27px） */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.iconSrc}
        alt=""
        aria-hidden="true"
        width={ICON_WIDTH}
        height={ICON_HEIGHT}
        loading="lazy"
        className="mt-[15px] h-[220px] w-[227px]"
      />

      {/* 下向きの三角は吹き出しの中に浮かせる。下の余白（17.9px）は三角の分 */}
      <div className="relative -mt-[27px] w-full pb-[17.9px]">
        <h3 className="flex h-11 items-center justify-center rounded-[22px] bg-main px-[21px] text-center text-xl/[1.6] font-bold tracking-[0.08em] whitespace-nowrap text-white">
          {item.title}
        </h3>
        <SpeechBubbleTail className="absolute top-[38.4px] left-1/2 -translate-x-1/2 text-main" />
      </div>

      <p className="mt-[22px] w-full text-sm/[1.7]">{item.description}</p>
    </li>
  );
}

/** 青い吹き出しの下向きの三角（Figma: 吹き出し）。飾りなので読み上げの対象から外す */
function SpeechBubbleTail({ className }: { className?: string }) {
  return (
    <svg
      {...SVG_BASE_PROPS}
      width={15.6842}
      height={16.9297}
      viewBox="0 0 15.6842 16.9297"
      fill="currentColor"
      className={`rotate-180 ${className ?? ""}`}
    >
      <path d="M6.01937 1.17676C6.72802 -0.392254 8.95613 -0.392253 9.66479 1.17676L15.5046 14.1065C16.1025 15.4302 15.1344 16.9297 13.6819 16.9297H2.0023C0.549794 16.9297 -0.418295 15.4302 0.179585 14.1065L6.01937 1.17676Z" />
    </svg>
  );
}
