import type { ReactNode } from "react";
import { SectionHeading } from "@/components/heading/SectionHeading";
import { ContentWidth } from "@/components/layout/ContentWidth";
import { MediaBlock } from "@/components/layout/MediaBlock";

interface PolicyItem {
  /** 英字の小見出し（POLICY / FEATURE） */
  eyebrow: string;
  /** 2行に分ける所には <br /> を入れるので、文字列ではなくJSXで持つ */
  title: ReactNode;
  /** 段落の間はFigmaどおり1行空ける。段落の中の改行もFigmaと同じ位置で入れる */
  paragraphs: ReactNode[];
  imageSrc: string;
  imageAlt: string;
  /** 写真を画面のどちら側の端に付けるか（PCは写真と文章の左右もこれで入れ替わる） */
  imageSide: "left" | "right";
  /** 1つ目だけ後ろに飾りを敷く */
  hasDeco: boolean;
}

// ポリシーと特徴はWordPressに無い固定の文言なので、コードに持つ
const POLICY_ITEMS: PolicyItem[] = [
  {
    eyebrow: "POLICY",
    title: "コミュニケーションから始まる最適な医療提供",
    paragraphs: [
      <>
        当院ではまず患者様から詳しくお話を伺います。
        <br />
        難しい言葉は使わず、実際に感じている小さな違和感からあらゆる可能性を考え、最適な治療方法をご提案いたします。
      </>,
      <>
        「どこよりも本音で話せる歯医者さん」を目指し、スタッフ一同、「人間力の向上」にも努めております。
      </>,
    ],
    imageSrc: "/images/about/policy-01.webp",
    imageAlt: "レントゲン写真を見せながら説明する歯科医師",
    imageSide: "left",
    hasDeco: true,
  },
  {
    eyebrow: "FEATURE",
    title: (
      <>
        「医療技術の追求」と
        <br />
        「通いやすさ」
      </>
    ),
    paragraphs: [
      <>
        歯の治療において、小さな違和感は大きなストレスにつながります。私たちは常に快適な歯科医療技術の研究を行っております。
        <br />
        また、「通いやすさ」も医院選びの重要なポイントと考え、2019年のリニューアルを機に更に駅の近くへ場所を移しました。
      </>,
      <>
        朝から夜までお仕事をされている方のために診療時間を見直し、平日でもご利用いただけるようにいたしました。
      </>,
    ],
    imageSrc: "/images/about/policy-02.webp",
    imageAlt: "リニューアルした受付とエントランス",
    imageSide: "right",
    hasDeco: false,
  },
];

/** ポリシーと特徴（Figma: policy）。見出しは幅の上限の中、写真と文章のブロックは画面の端まで使う */
export function PolicySection() {
  return (
    <section id="policy" className="flex flex-col gap-10 lg:gap-[60px]">
      <ContentWidth>
        <SectionHeading>ポリシーと特徴</SectionHeading>
      </ContentWidth>

      <div className="flex flex-col gap-[100px] lg:gap-[120px]">
        {POLICY_ITEMS.map((item) => (
          <MediaBlock key={item.eyebrow} {...item} />
        ))}
      </div>
    </section>
  );
}
