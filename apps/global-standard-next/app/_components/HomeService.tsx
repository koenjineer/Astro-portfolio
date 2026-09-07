import Image from "next/image";
import { COURSES } from "@/lib/courses";
import { SectionHeading } from "./SectionHeading";
import { ViewMoreLink } from "./ViewMoreLink";

// ABOUT US・役員紹介と同じ17.57%の傾き。下端を基準に置くと、文章量が変わっても
// カードの終わりと帯の終わりの関係が崩れない
const DIAGONAL_BACKGROUND_CLIP_PATH =
  "polygon(0 0, 100% 17.57vw, 100% 100%, 0 calc(100% - 17.57vw))";

interface ServiceCard {
  number: string;
  /** 白い箱1つ＝1行。Figmaでは長いコース名が2行に割れる */
  titleLines: string[];
  /** Figmaで行が分かれている単位 */
  paragraphs: string[];
  imageSrc: string;
  /** PCだけカードを段違いに下げる（Figma y=298 / 357 / 417） */
  offsetClass: string;
}

// コース紹介文はサービスページと同じく固定テキストで持つ。
// 見出しはlib/courses.tsのコース名をFigmaの2行組みに割って使う
const SERVICE_CARDS: ServiceCard[] = [
  {
    number: "01",
    titleLines: [COURSES[0].title],
    paragraphs: [
      "ビジネス英会話はこれからの時代、すべてのビジネスパーソンが学ぶべき必須スキルと考えおります。海外にビジネス展開する際にはもちろんのこと、日本国内でも英会話コミュニケーションができることによってチャンスが掴める場面があります。",
    ],
    imageSrc: "/images/service/card-01.webp",
    offsetClass: "",
  },
  {
    number: "02",
    titleLines: ["異文化", "コミュニケーション"],
    paragraphs: [
      "急速にグローバル化が進んでおり、ビジネスの場面に限らず様々な文化的背景を持つ者同士の交流はもはや日常的な光景となりました。",
      "言語や文化が異なる相手を理解することで世界が広がり、新たなビジネスチャンスに巡り会うことは少なくありません。",
    ],
    imageSrc: "/images/service/card-02.webp",
    offsetClass: "lg:mt-[59px]",
  },
  {
    number: "03",
    titleLines: ["ビジネス留学", "プログラム"],
    paragraphs: [
      "将来的に海外で働きたい方に向けた講座をご用意しております。一般的には3ヶ月〜1年の期間で基本的な英会話スキルと、海外でのビジネスマナー習得を目指します。",
      "通常の語学留学では得られないビジネスの場で通用するコミュニケーションスキル習得に重点をおいておりますので、海外でビジネス展開する際に自信を持って活動することができるようになります。",
    ],
    imageSrc: "/images/service/card-03.webp",
    offsetClass: "lg:mt-[119px]",
  },
];

export function HomeService() {
  return (
    <section
      aria-labelledby="home-service-heading"
      className="relative isolate px-5 pt-[60px] pb-[168px] lg:px-[90px] lg:pt-[269px] lg:pb-[109px]"
    >
      <div
        aria-hidden="true"
        style={{ clipPath: DIAGONAL_BACKGROUND_CLIP_PATH }}
        className="absolute inset-x-0 bottom-[60px] -z-10 h-[calc(1112px+17.57vw)] bg-main-light lg:-bottom-[125px] lg:h-[calc(575px+17.57vw)]"
      />

      <div className="relative mx-auto flex w-full max-w-[1100px] flex-col">
        <SectionHeading
          id="home-service-heading"
          english="SERVICE"
          japanese="サービス"
        />

        <ul className="mt-3 flex flex-col gap-[18px] lg:mt-[30px] lg:flex-row lg:items-start lg:gap-[70px]">
          {SERVICE_CARDS.map((card) => (
            <li
              key={card.number}
              className={`relative flex flex-col lg:w-[calc((100%-140px)/3)] ${card.offsetClass}`}
            >
              {/* 白いずらし影つきの番号。写真の上辺からはみ出す（サービスページと同じ） */}
              <p
                aria-hidden="true"
                className="absolute top-0 right-0 font-fira-sans text-[100px] leading-[1.23] text-main italic [text-shadow:4px_4px_0_#fff]"
              >
                {card.number}
              </p>

              {/* 写真の右端をカードの右端に揃え、コース名の白い箱を左へはみ出させる */}
              <div className="relative mt-[55px] w-[320px] self-end lg:w-full">
                <Image
                  src={card.imageSrc}
                  alt={`${card.titleLines.join("")}のイメージ`}
                  width={320}
                  height={427}
                  loading="lazy"
                  className="aspect-[320/427] w-full object-cover"
                />

                <h3 className="absolute bottom-8 -left-[15px] flex flex-col items-start gap-2 text-[28px] leading-[1.46] font-bold text-main lg:-left-8">
                  {card.titleLines.map((line) => (
                    <span key={line} className="bg-white">
                      {line}
                    </span>
                  ))}
                </h3>
              </div>

              <div className="mt-[14px] w-[320px] self-end text-sm leading-6 text-contrast lg:w-full">
                {card.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </li>
          ))}
        </ul>

        <ViewMoreLink
          href="/service"
          variant="dark"
          label="サービスのページへ"
          className="mt-[29px] self-end lg:absolute lg:top-[49px] lg:right-0 lg:mt-0"
        />
      </div>
    </section>
  );
}
