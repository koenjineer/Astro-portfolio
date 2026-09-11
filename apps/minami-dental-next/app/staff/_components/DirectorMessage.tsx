import Image from "next/image";
import type { ReactNode } from "react";
import { SectionHeading } from "@/components/heading/SectionHeading";
import { UnderlineHeading } from "./UnderlineHeading";

// 書き出した写真の実寸（Figmaの 460×613 を2倍で書き出している）
const DIRECTOR_IMAGE_WIDTH = 920;
const DIRECTOR_IMAGE_HEIGHT = 1226;

interface CareerItem {
  year: string;
  /** 2行になる所には <br /> を入れるので、文字列ではなくJSXで持つ */
  description: ReactNode;
}

// 院長のあいさつはWordPressに無い固定の文言なので、コードに持つ
const CAREER_ITEMS: CareerItem[] = [
  { year: "2004年", description: "東京医科歯科大学歯学部 卒業" },
  {
    year: "2008年",
    description: (
      <>
        東京歯科大学歯学研究科大学院修了
        <br />
        博士(歯学)取得
      </>
    ),
  },
  { year: "2012年", description: "みなみ歯科クリニック 開院" },
];

const QUALIFICATIONS = ["歯科医師臨床研修指導歯科医", "博士(歯学)", "衛生検査技師"];

/**
 * 院長のあいさつ。SPは「文章 → 写真 → 経歴・資格」の縦並び、PCは左に文章と経歴・資格、右に写真の2段組み。
 * DOMの順番は1つにしてグリッドで写真だけ右列に移す（SP用・PC用に同じ中身を2回書かないため）
 */
export function DirectorMessage() {
  return (
    <section id="message" className="flex flex-col gap-10 lg:gap-[60px]">
      <SectionHeading>院長のあいさつ</SectionHeading>

      {/* 列は最大460px。1024px幅（中身984px）でもはみ出さないよう minmax(0, …) で縮めるのを許す。
          写真が左列より高くなった時に経歴・資格が下へずれないよう、余りは2行目（1fr）で吸収する */}
      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,460px)_minmax(0,460px)] lg:grid-rows-[auto_1fr] lg:justify-between lg:gap-x-10 lg:gap-y-[60px]">
        <div className="flex flex-col gap-5 lg:col-start-1 lg:row-start-1 lg:gap-10">
          <p className="text-xl/[1.5] font-bold tracking-[0.08em] lg:text-[28px]/[1.5]">
            気軽に相談できる
            <br />
            街の歯医者さんでありたい。
          </p>
          <div className="flex flex-col gap-[14px] text-sm/[1.7]">
            <p>
              当院は治療はもちろん、予防歯科にも力を入れておりますので、お口に関する相談だけでもお越しいただきたいと考えております。
            </p>
            <p>
              「患部を直すこと」より「未然に防ぐこと」が最も良い歯科医療と言えますので、些細なことでも気軽に話せる街の歯医者さんとして、明るい街づくりに貢献していきたいと考えております。
            </p>
            <p className="text-right">
              みなみ歯科クリニック
              <br />
              院長　南 俊雄
            </p>
          </div>
        </div>

        <Image
          src="/images/staff/director.webp"
          alt="院長 南 俊雄"
          width={DIRECTOR_IMAGE_WIDTH}
          height={DIRECTOR_IMAGE_HEIGHT}
          loading="lazy"
          // lg未満は幅いっぱいだが、タブレット幅で元の写真（920px）より大きく引き伸ばさないよう460pxで止める
          className="mx-auto aspect-[460/613] h-auto w-full max-w-[460px] rounded-[20px] object-cover lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start"
        />

        <div className="flex flex-col gap-[30px] lg:col-start-1 lg:row-start-2">
          <section className="flex flex-col gap-[14px]">
            <UnderlineHeading>経歴</UnderlineHeading>
            <dl className="flex flex-col gap-[14px] text-sm/[1.7]">
              {CAREER_ITEMS.map((item) => (
                <div key={item.year} className="flex items-start gap-[14px]">
                  <dt className="shrink-0">{item.year}</dt>
                  <dd>{item.description}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="flex flex-col gap-[14px]">
            <UnderlineHeading>資格</UnderlineHeading>
            <ul className="flex flex-col gap-[14px] text-sm/[1.7]">
              {QUALIFICATIONS.map((qualification) => (
                <li key={qualification}>{qualification}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
}
