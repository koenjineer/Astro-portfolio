import Image from "next/image";

interface Director {
  role: string;
  name: string;
  imageSrc: string;
  /** Figmaで行が分かれている単位。1行ずつ段落として並べる */
  paragraphs: string[];
}

// 役員の顔ぶれは頻繁に変わらないため、固定テキストで持つ（WordPressからは取得しない）
const DIRECTORS: Director[] = [
  {
    role: "代表取締役社長",
    name: "波瑠　慶太",
    imageSrc: "/images/about/director-01.webp",
    paragraphs: [
      "20年間外資系企業に勤務し、世界17カ国でビジネスを展開。",
      "様々な文化に触れ、コミュニケーションスキルを磨き、同時にその必要性を実感する。",
      "自身も講師を務め、実体験から得られた知見を皆様に還元し、グローバルなビジネス展開をサポートいたします。",
    ],
  },
  {
    role: "取締役",
    name: "ジャック・スミス",
    imageSrc: "/images/about/director-02.webp",
    paragraphs: [
      "オーストラリア出身。",
      "英会話の講師として13年のキャリアがあります。",
      "翻訳業務も担当しており、外国映画の日本版DVDの字幕やテレビ番組の英語をヒヤリングなども行なっております。",
      "皆様に「より気持ちの伝わる英会話」を習得していただくサポートをいたします。",
    ],
  },
  {
    role: "取締役",
    name: "メアリー・ジャクソン",
    imageSrc: "/images/about/director-03.webp",
    paragraphs: [
      "アメリカ出身。",
      "メジャーリーグ球団「ニューヨークヤンキース」の通訳担当として7年間チームに在籍。",
      "数多くの契約交渉の経験を活かし、国際ビジネスにおけるコミュニケーションのマナーから応用までお伝えいたします。",
    ],
  },
];

const DIRECTOR_PHOTO_WIDTH = 240;
const DIRECTOR_PHOTO_HEIGHT = 320;

// Figmaの背景シェイプ「staff-bg」は幅に対して17.57%下がる平行四辺形。
// サービスページ02の斜め背景と同じ傾きで、要素が画面幅いっぱいなのでvwで指定する
const DIAGONAL_BACKGROUND_CLIP_PATH =
  "polygon(0 0, 100% 17.57vw, 100% 100%, 0 calc(100% - 17.57vw))";

/** 架空の会社なのでリンク先が存在しない。デザインどおりの飾りとしてだけ置く */
function SnsIcons() {
  return (
    <div className="flex items-center gap-6" aria-hidden="true">
      <Image
        src="/images/about/icon-twitter.svg"
        alt=""
        width={32}
        height={32}
        loading="lazy"
        className="size-8"
      />
      <Image
        src="/images/about/icon-facebook.svg"
        alt=""
        width={32}
        height={32}
        loading="lazy"
        className="size-8"
      />
      {/* Instagramだけ32pxの枠の中に24pxのアイコンが入る形（線幅のぶん27pxで書き出される） */}
      <span className="flex size-8 items-center justify-center">
        <Image
          src="/images/about/icon-instagram.svg"
          alt=""
          width={27}
          height={27}
          loading="lazy"
          className="size-[27px]"
        />
      </span>
    </div>
  );
}

export function DirectorProfiles() {
  return (
    <section
      aria-labelledby="directors-heading"
      className="relative isolate flex flex-col items-center gap-10 px-5 pt-[60px] pb-[155px] lg:gap-[60px] lg:px-[90px] lg:pt-[120px] lg:pb-[187px]"
    >
      {/* 高さは「平行四辺形の縦の厚み＋傾きの下がり幅」。厚みを保ったまま画面幅に追従する */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[49px] -z-10 h-[calc(1168px+17.57vw)] bg-main-light lg:-bottom-[45px] lg:h-[calc(575px+17.57vw)]"
        style={{ clipPath: DIAGONAL_BACKGROUND_CLIP_PATH }}
      />

      <h2
        id="directors-heading"
        className="text-center text-2xl font-bold text-contrast"
      >
        役員紹介
      </h2>

      <ul className="flex w-full max-w-[688px] flex-col gap-[60px]">
        {DIRECTORS.map((director) => (
          <li key={director.name}>
            {/* SPは写真が上、PCは写真が右。読み上げ順を本文からにしたいので
                DOMはテキストが先で、SPだけ列を逆順にする */}
            <article className="flex flex-col-reverse items-center gap-[22px] lg:flex-row lg:items-start lg:justify-between lg:gap-0">
              <div className="flex w-full flex-col gap-[17px] lg:w-[408px] lg:gap-[30px]">
                <h3 className="flex items-center gap-5 font-bold text-contrast">
                  <span className="text-sm">{director.role}</span>
                  <span className="text-xl">{director.name}</span>
                </h3>

                <div className="text-sm leading-6 text-contrast">
                  {director.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                <SnsIcons />
              </div>

              <Image
                src={director.imageSrc}
                alt={`${director.name}の顔写真`}
                width={DIRECTOR_PHOTO_WIDTH}
                height={DIRECTOR_PHOTO_HEIGHT}
                loading="lazy"
                className="w-[240px] shrink-0"
              />
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
