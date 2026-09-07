import Image from "next/image";
import { ViewMoreLink } from "./ViewMoreLink";
import { SectionHeading } from "./SectionHeading";

// 薄青の帯はサービスページ02・役員紹介と同じ、幅に対して17.57%下がる平行四辺形。
// 画面幅に追従させたいのでvwで指定する（高さは「帯の厚み＋傾きの下がり幅」）
const DIAGONAL_BACKGROUND_CLIP_PATH =
  "polygon(0 0, 100% 17.57vw, 100% 100%, 0 calc(100% - 17.57vw))";

// 理念の文言は当社についてページと同じ固定テキスト（WordPressからは取得しない）
const ABOUT_PARAGRAPHS = [
  "急速に広がったグローバル社会に対応できる人材を育成することで、文化・言語の垣根を越えたコミュニケーションを活発にし、一人でも多くの人が豊かに暮らせる世界を実現することを使命とする。",
  "コミュニケーションスキル習得をサポートすることで一人でも多くのビジネスパーソンの視野を広げ、世界を舞台に新しい相乗効果を生む未来を創造する。",
  "文化の垣根を越えた人と人とのつながりが新しい価値を生むことを信念とする。",
];

export function HomeAbout() {
  return (
    <section
      aria-labelledby="home-about-heading"
      className="relative isolate px-5 pt-[60px] pb-[135px] lg:px-[90px] lg:pt-[104px] lg:pb-[93px]"
    >
      <div
        aria-hidden="true"
        style={{ clipPath: DIAGONAL_BACKGROUND_CLIP_PATH }}
        className="absolute inset-x-0 top-[167px] -z-20 h-[calc(788px+17.57vw)] bg-main-light lg:top-[150px] lg:h-[calc(575px+17.57vw)]"
      />

      {/* PCは紺のビル写真がセクションの右端に貼り付く。SPは写真の裏だけに敷く（下で描く） */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 -z-10 hidden w-[500px] lg:block"
      >
        <Image
          src="/images/home/about-bg-pc.webp"
          alt=""
          fill
          sizes="500px"
          loading="lazy"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-main/80" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1100px] flex-col">
        <SectionHeading
          id="home-about-heading"
          english="ABOUT US"
          japanese="当社について"
        />

        <div className="mt-[67px] flex flex-col lg:mt-[28px] lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-6 text-sm leading-6 text-contrast lg:w-[379px]">
            {ABOUT_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {/* SPは紺のブロックの上に写真とView moreが重なる。PCは写真だけを右に置き、
              View moreは見出しの右へ回るのでこの箱を位置の基準から外す（lg:static） */}
          <div className="relative mt-[30px] h-[360px] w-full lg:static lg:mt-0 lg:h-auto lg:w-[681px] lg:shrink-0">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-[60px] -right-5 lg:hidden"
            >
              <Image
                src="/images/home/about-bg-sp.webp"
                alt=""
                fill
                sizes="100vw"
                loading="lazy"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-main/80" />
            </div>

            <Image
              src="/images/home/about-sp.webp"
              alt="研修を受ける受講者の様子"
              width={335}
              height={210}
              loading="lazy"
              className="relative mt-10 h-[210px] w-full object-cover lg:hidden"
            />
            <Image
              src="/images/home/about-pc.webp"
              alt="研修を受ける受講者の様子"
              width={681}
              height={426}
              loading="lazy"
              className="hidden w-full lg:block"
            />

            <ViewMoreLink
              href="/about"
              variant="white"
              label="当社についてのページへ"
              className="absolute top-[280px] right-0 lg:top-[49px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
