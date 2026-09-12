import { SectionHeading } from "@/components/heading/SectionHeading";
import { WaveBand } from "@/components/layout/WaveBand";
import { MedicalGuideCard, type MedicalGuideItem } from "./MedicalGuideCard";

/**
 * カード2枚は「一般診療」「特殊診療」という大きなくくりで、WordPressの診療タイプ（general / special）とは
 * 並びが噛み合わない（Figmaの「一般診療」に入っている入れ歯はWPではspecial、虫歯・インプラント・審美歯科は
 * WPに無い）。WPから組み立てるとFigmaと違う文言になるので、固定の文言としてコードに持つ
 */
const MEDICAL_GUIDE_ITEMS: MedicalGuideItem[] = [
  {
    title: "一般診療",
    description: "虫歯・入れ歯・小児歯科",
    imageSrc: "/images/home/medical-general.webp",
    imageWidth: 400,
    imageHeight: 267,
  },
  {
    title: "特殊診療",
    description: (
      <>
        インプラント・ホワイトニング
        <br />
        予防歯科・口腔外科・審美歯科
      </>
    ),
    imageSrc: "/images/home/medical-special.webp",
    imageWidth: 460,
    imageHeight: 290,
  },
];

/** ホームの診療案内（Figma: bg-section-pc / bg-section-sp）。帯と波は診療案内ページと同じ WaveBand に任せる */
export function MedicalGuideSection() {
  return (
    <section>
      <WaveBand>
        <SectionHeading>診療案内</SectionHeading>

        {/* 1列のままだとタブレット幅でカードが横に伸びすぎるので、768pxから2列にする（スタッフ紹介と同じ考え方） */}
        <ul className="grid gap-5 md:grid-cols-2 lg:gap-20">
          {MEDICAL_GUIDE_ITEMS.map((item) => (
            <MedicalGuideCard key={item.title} item={item} />
          ))}
        </ul>

        {/* Figmaでは角丸なしの白い帯 */}
        <div className="bg-white px-5 py-[17px] lg:px-10 lg:py-[35px]">
          <p className="text-sm/[1.7]">
            当院では、患者さんの歯の健康状態や治療方針を丁寧にカウンセリングし、十分ご理解していただいた上で治療いたします。
            <br />
            痛みに配慮することと、可能な限り削らない・抜かない治療に努めております。
            <br />
            <span className="text-accent">
              ※特殊性の高い矯正治療などは保険の適応外となります。
              これらの治療を行う際は事前に詳細と費用のご説明いたします。
            </span>
          </p>
        </div>
      </WaveBand>
    </section>
  );
}
