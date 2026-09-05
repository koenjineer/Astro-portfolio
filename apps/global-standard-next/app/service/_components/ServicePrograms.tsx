import Image from "next/image";

interface ServiceProgram {
  number: string;
  englishName: string;
  title: string;
  /** 空行で区切られたブロック。ブロック内の文はデザインどおり行を詰めて並べる */
  paragraphBlocks: string[][];
  cost: string;
  target: string;
  imageSrc: string;
  /** Figmaデザインで画像とテキストの左右が入れ替わっているカード */
  reverseOnDesktop: boolean;
  /** 数字を置く側。Figmaでは常に画像と反対側に置かれる */
  numberSide: "left" | "right";
  /** 背景に斜めの薄青マスクを敷くカード（Figmaでは02のみ） */
  hasDiagonalBackground: boolean;
}

// Figmaの背景シェイプは幅に対して17.57%下がる平行四辺形（PC:225px/1280px、SP:66px/375px）。
// 要素が画面幅いっぱいなので、vwで指定すると全幅で同じ傾きを保てる
const DIAGONAL_BACKGROUND_CLIP_PATH =
  "polygon(0 0, 100% 17.57vw, 100% 100%, 0 calc(100% - 17.57vw))";

// このタスクの時点ではFigma上の固定テキストをそのまま実装する
// （動的化の要否は別途ユーザーに確認する）
const SERVICE_PROGRAMS: ServiceProgram[] = [
  {
    number: "01",
    englishName: "Business English Training",
    title: "ビジネス英語研修",
    paragraphBlocks: [
      [
        "ビジネス英会話はこれからの時代、すべてのビジネスパーソンが学ぶべき必須スキルと考えおります。",
        "海外にビジネス展開する際にはもちろんのこと、日本国内でも英会話コミュニケーションができることによってチャンスが掴める場面があります。",
      ],
      [
        "担当する講師は皆、豊富な海外ビジネス経験者であり、ティーチングスキル、コミュニケーションスキル、人間性に加えて採用後には厳しいトレーニング期間を設けているので、様々な職業や職種に合ったスキルまで身につけられます。",
        "また、必要に応じてマンツーマン形式のレッスンを行うことも可能なので、時間の限り話すことができ効率よく上達することができます。",
      ],
    ],
    cost: "時間内容要相談",
    target: "ビジネスの中で使える英語コミュニケーション能力が必要な方",
    imageSrc: "/images/service/card-01.webp",
    reverseOnDesktop: true,
    numberSide: "left",
    hasDiagonalBackground: false,
  },
  {
    number: "02",
    englishName: "Cross-cultural communication",
    title: "異文化コミュニケーション",
    paragraphBlocks: [
      [
        "急速にグローバル化が進んでおり、ビジネスの場面に限らず様々な文化的背景を持つ者同士の交流はもはや日常的な光景となりました。",
        "言語や文化が異なる相手を理解することで世界が広がり、新たなビジネスチャンスに巡り会うことは少なくありません。",
        "多様な価値観を尊重しながら言葉の垣根を越え、コミュニケーションの力で他者を理解しようとする「異文化コミュニケーション」はこれからの時代、さらに重要となるスキルと言えます。",
      ],
      [
        "コミュニケーションの基本となる日本語と英語の力を鍛えつつ、アプローチする国の文化を同時に学び、スムーズなビジネス展開をサポートいたします。",
      ],
    ],
    cost: "時間内容要相談",
    target: "海外へのビジネス展開を検討されている方",
    imageSrc: "/images/service/card-02.webp",
    reverseOnDesktop: false,
    numberSide: "right",
    hasDiagonalBackground: true,
  },
  {
    number: "03",
    englishName: "Business study abroad program",
    title: "ビジネス留学プログラム",
    paragraphBlocks: [
      [
        "将来的に海外で働きたい方に向けた講座をご用意しております。一般的には3ヶ月〜1年の期間で基本的な英会話スキルと、海外でのビジネスマナー習得を目指します。",
        "通常の語学留学では得られないビジネスの場で通用するコミュニケーションスキル習得に重点をおいておりますので、海外でビジネス展開する際に自信を持って活動することができるようになります。",
      ],
      [
        "お申し込みいただく際に綿密なヒアリングを行い、おすすめの留学先を複数ピックアップいたします。海外ビジネス経験豊富な講師が、留学後のキャリアプラン作成までお手伝いいたします。",
      ],
    ],
    cost: "時間内容要相談",
    target: "英語コミュニケーション能力を習得し、将来的に海外で働きたい方",
    imageSrc: "/images/service/card-03.webp",
    reverseOnDesktop: true,
    numberSide: "left",
    hasDiagonalBackground: false,
  },
];

export function ServicePrograms() {
  return (
    // overflow-hidden: 02の斜め背景を画面幅いっぱいに広げるため、横スクロールをここで抑える
    <section
      aria-labelledby="service-programs-heading"
      className="flex flex-col items-center gap-16 overflow-hidden px-5 py-16 lg:gap-24 lg:px-[90px] lg:py-20"
    >
      <h2
        id="service-programs-heading"
        className="text-center text-xl font-bold text-contrast lg:text-2xl lg:leading-[40px]"
      >
        世界で活躍できる
        <br />
        グローバルな人材を育てる３つの研修プログラム
      </h2>

      <ul className="flex w-full max-w-[1100px] flex-col gap-16 lg:gap-20">
        {SERVICE_PROGRAMS.map((program) => (
          <li
            key={program.number}
            className={`relative isolate flex flex-col lg:flex-row lg:items-start ${
              program.reverseOnDesktop ? "lg:flex-row-reverse" : ""
            }`}
          >
            {program.hasDiagonalBackground && (
              <div
                aria-hidden="true"
                style={{ clipPath: DIAGONAL_BACKGROUND_CLIP_PATH }}
                className="absolute -top-[25px] -bottom-[25px] left-1/2 -z-10 w-screen -translate-x-1/2 bg-[#edf3f8] lg:-top-[116px] lg:-bottom-[194px]"
              />
            )}

            {/* Figmaでは写真に白い箱が重なる。SPは画面端まで、PCは箱より63px下げて5.5%（60px）重ねる */}
            <div
              className={`relative h-[301px] w-[188px] overflow-hidden lg:mt-[63px] lg:aspect-[5/8] lg:h-auto lg:w-[51.4%] lg:self-auto ${
                program.reverseOnDesktop
                  ? "-mr-5 self-end lg:mr-0"
                  : "-ml-5 self-start lg:ml-0"
              }`}
            >
              <Image
                src={program.imageSrc}
                alt={`${program.title}のイメージ`}
                fill
                loading="lazy"
                className="object-cover"
              />
            </div>

            <article
              className={`relative -mt-[149px] flex w-full flex-col gap-[30px] bg-white/90 px-5 pt-10 pb-10 shadow-[0px_3px_12px_0px_rgba(0,0,0,0.16)] lg:z-10 lg:mt-0 lg:w-[54.1%] lg:gap-[60px] lg:px-10 lg:pt-[82px] lg:pb-[60px] ${
                program.reverseOnDesktop ? "lg:-mr-[5.5%]" : "lg:-ml-[5.5%]"
              }`}
            >
              {/* Figmaでは白い箱の上辺からはみ出し、白のずらし影が背景に重なる */}
              <p
                aria-hidden="true"
                className={`absolute -top-11 font-fira-sans text-[68px] text-main italic [text-shadow:4px_4px_0_#fff] lg:-top-[53px] lg:text-[100px] ${
                  program.numberSide === "left"
                    ? "left-5 lg:left-[58px]"
                    : "right-4 lg:right-10"
                }`}
              >
                {program.number}
              </p>

              <header className="flex flex-col gap-1">
                <h3 className="text-[28px] font-bold text-contrast lg:text-[40px]">
                  {program.title}
                </h3>
                <p className="font-fira-sans text-sm text-main italic lg:text-base">
                  {program.englishName}
                </p>
              </header>

              <div className="flex flex-col gap-6">
                {program.paragraphBlocks.map((block, blockIndex) => (
                  <div key={blockIndex} className="flex flex-col">
                    {block.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-sm leading-6 font-medium text-contrast"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ))}
              </div>

              <dl className="flex flex-col divide-y divide-[#ccc] border-y border-[#ccc] text-sm text-contrast">
                <div className="flex items-center gap-[52px] py-5 lg:py-[30px]">
                  <dt className="shrink-0 font-bold">対象</dt>
                  <dd className="font-medium">{program.target}</dd>
                </div>
                <div className="flex items-center gap-[52px] py-5 lg:py-[30px]">
                  <dt className="shrink-0 font-bold">費用</dt>
                  <dd className="font-medium">{program.cost}</dd>
                </div>
              </dl>

              <a
                href="#"
                className="relative flex h-[72px] w-full items-center justify-center border border-main bg-white text-sm font-medium text-main lg:mx-auto lg:w-[304px] lg:text-base"
              >
                お申し込みはこちら
                <Image
                  src="/images/service/icon-arrow-right.svg"
                  alt=""
                  aria-hidden="true"
                  width={20}
                  height={14}
                  loading="lazy"
                  className="absolute right-3 h-3 w-[18px] lg:right-5 lg:h-[14px] lg:w-5"
                />
              </a>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
