import Image from "next/image";

interface ServiceProgram {
  number: string;
  englishName: string;
  title: string;
  paragraphs: string[];
  cost: string;
  target: string;
  imageSrc: string;
  /** Figmaデザインで画像とテキストの左右が入れ替わっているカード */
  reverseOnDesktop: boolean;
}

// このタスクの時点ではFigma上の固定テキストをそのまま実装する
// （動的化の要否は別途ユーザーに確認する）
const SERVICE_PROGRAMS: ServiceProgram[] = [
  {
    number: "01",
    englishName: "Business English Training",
    title: "ビジネス英語研修",
    paragraphs: [
      "ビジネス英会話はこれからの時代、すべてのビジネスパーソンが学ぶべき必須スキルと考えおります。",
      "海外にビジネス展開する際にはもちろんのこと、日本国内でも英会話コミュニケーションができることによってチャンスが掴める場面があります。",
      "担当する講師は皆、豊富な海外ビジネス経験者であり、ティーチングスキル、コミュニケーションスキル、人間性に加えて採用後には厳しいトレーニング期間を設けているので、様々な職業や職種に合ったスキルまで身につけられます。",
      "また、必要に応じてマンツーマン形式のレッスンを行うことも可能なので、時間の限り話すことができ効率よく上達することができます。",
    ],
    cost: "時間内容要相談",
    target: "ビジネスの中で使える英語コミュニケーション能力が必要な方",
    imageSrc: "/images/service/card-01.png",
    reverseOnDesktop: true,
  },
  {
    number: "02",
    englishName: "Cross-cultural communication",
    title: "異文化コミュニケーション",
    paragraphs: [
      "急速にグローバル化が進んでおり、ビジネスの場面に限らず様々な文化的背景を持つ者同士の交流はもはや日常的な光景となりました。",
      "言語や文化が異なる相手を理解することで世界が広がり、新たなビジネスチャンスに巡り会うことは少なくありません。",
      "多様な価値観を尊重しながら言葉の垣根を越え、コミュニケーションの力で他者を理解しようとする「異文化コミュニケーション」はこれからの時代、さらに重要となるスキルと言えます。",
      "コミュニケーションの基本となる日本語と英語の力を鍛えつつ、アプローチする国の文化を同時に学び、スムーズなビジネス展開をサポートいたします。",
    ],
    cost: "時間内容要相談",
    target: "海外へのビジネス展開を検討されている方",
    imageSrc: "/images/service/card-02.png",
    reverseOnDesktop: false,
  },
  {
    number: "03",
    englishName: "Business study abroad program",
    title: "ビジネス留学プログラム",
    paragraphs: [
      "将来的に海外で働きたい方に向けた講座をご用意しております。一般的には3ヶ月〜1年の期間で基本的な英会話スキルと、海外でのビジネスマナー習得を目指します。",
      "通常の語学留学では得られないビジネスの場で通用するコミュニケーションスキル習得に重点をおいておりますので、海外でビジネス展開する際に自信を持って活動することができるようになります。",
      "お申し込みいただく際に綿密なヒアリングを行い、おすすめの留学先を複数ピックアップいたします。海外ビジネス経験豊富な講師が、留学後のキャリアプラン作成までお手伝いいたします。",
    ],
    cost: "時間内容要相談",
    target: "英語コミュニケーション能力を習得し、将来的に海外で働きたい方",
    imageSrc: "/images/service/card-03.png",
    reverseOnDesktop: true,
  },
];

export function ServicePrograms() {
  return (
    <section
      aria-labelledby="service-programs-heading"
      className="flex flex-col items-center gap-16 px-5 py-16 lg:gap-24 lg:px-[90px] lg:py-20"
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
            className={`flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8 ${
              program.reverseOnDesktop ? "lg:flex-row-reverse" : ""
            }`}
          >
            <div className="relative h-[300px] w-full overflow-hidden lg:h-auto lg:aspect-[5/8] lg:w-1/2">
              <Image
                src={program.imageSrc}
                alt={`${program.title}のイメージ`}
                fill
                loading="lazy"
                className="object-cover"
              />
            </div>

            <article className="relative flex w-full flex-col gap-6 bg-white/90 p-6 shadow-[0px_3px_12px_0px_rgba(0,0,0,0.16)] lg:w-1/2 lg:p-10">
              <p
                aria-hidden="true"
                className="absolute top-0 right-6 font-fira-sans text-6xl text-accent-1 italic lg:right-10 lg:text-[100px]"
              >
                {program.number}
              </p>

              <header className="flex flex-col gap-1">
                <p className="font-fira-sans text-sm text-main italic lg:text-base">
                  {program.englishName}
                </p>
                <h3 className="text-2xl font-bold text-contrast lg:text-[40px]">
                  {program.title}
                </h3>
              </header>

              {program.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-sm leading-6 font-medium text-contrast"
                >
                  {paragraph}
                </p>
              ))}

              <dl className="flex flex-col divide-y divide-[#ccc] border-y border-[#ccc] text-sm text-contrast">
                <div className="flex gap-[52px] py-4">
                  <dt className="font-bold">費用</dt>
                  <dd className="font-medium">{program.cost}</dd>
                </div>
                <div className="flex gap-[52px] py-4">
                  <dt className="font-bold">対象</dt>
                  <dd className="font-medium">{program.target}</dd>
                </div>
              </dl>

              <a
                href="#"
                className="flex items-center justify-center gap-2 border border-main py-6 text-sm font-medium text-main"
              >
                お申し込みはこちら
                <Image
                  src="/images/service/icon-arrow-right.svg"
                  alt=""
                  aria-hidden="true"
                  width={14}
                  height={14}
                  loading="lazy"
                />
              </a>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
