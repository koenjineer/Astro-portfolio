import Image from "next/image";

interface PageHeroProps {
  /** 英字の見出し（例: SERVICE） */
  eyebrow: string;
  /** 日本語の見出し（例: サービス） */
  title: string;
}

export function PageHero({ eyebrow, title }: PageHeroProps) {
  return (
    <div className="relative h-[250px] overflow-hidden bg-main">
      <Image
        src="/images/common/hero-sp.webp"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="object-cover lg:hidden"
      />
      <Image
        src="/images/common/hero-pc.webp"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="hidden object-cover lg:block"
      />

      {/* Figmaの"filter"レイヤー：写真全体にかかる薄い黒フィルター */}
      <div className="absolute inset-0 bg-black/20" aria-hidden="true" />

      {/* Figmaの"lower-mv-decoration"：三角(台形)にマスクされた紺色オーバーレイ */}
      <div
        className="absolute inset-y-0 left-0 w-[44.17%] lg:w-[28.57%]"
        aria-hidden="true"
      >
        <Image
          src="/images/common/hero-decoration-sp.svg"
          alt=""
          fill
          className="object-fill lg:hidden"
        />
        <Image
          src="/images/common/hero-decoration-pc.svg"
          alt=""
          fill
          className="hidden object-fill lg:block"
        />
      </div>

      <div className="absolute top-1/2 left-[5.33%] flex -translate-y-1/2 flex-col gap-2 lg:left-[17.19%]">
        <p className="font-fira-sans text-3xl text-white italic lg:text-6xl">
          {eyebrow}
        </p>
        <h1 className="text-lg font-bold text-white lg:text-xl">{title}</h1>
      </div>
    </div>
  );
}
