import Image from "next/image";

interface PageHeroProps {
  /** 英字の見出し（例: SERVICE） */
  eyebrow: string;
  /** 日本語の見出し（例: サービス） */
  title: string;
  /** 背景写真。Figmaではページごとに違う写真が敷かれる */
  imagePcSrc: string;
  imageSpSrc: string;
}

export function PageHero({
  eyebrow,
  title,
  imagePcSrc,
  imageSpSrc,
}: PageHeroProps) {
  return (
    <div className="relative h-[250px] overflow-hidden bg-main">
      <Image
        src={imageSpSrc}
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="object-cover lg:hidden"
      />
      <Image
        src={imagePcSrc}
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

      {/* Figmaでは見出しが白い箱の上の紺文字で、英字と日本語がそれぞれ別の箱になる。
          箱に内側の余白は無く、文字の行送りがそのまま箱の高さ（PC 60px→72px / SP 32px→38px、
          日本語は20px→29px / 16px→23px）になるので、余白ではなくleadingで高さを作る。
          items-start：既定のstretchだと日本語の箱まで英字の幅に広がってしまう */}
      <div className="absolute top-1/2 left-[5.33%] flex -translate-y-1/2 flex-col items-start gap-2 lg:left-[17.19%]">
        {/* pr：Figmaの箱は英字の右端ぴったりで終わるため、斜体の右上が箱からはみ出しやすい。
            文字サイズに追従するemで逃がす */}
        <p className="bg-white pr-[0.06em] font-fira-sans text-[32px] leading-[1.2] text-main italic lg:text-6xl">
          {eyebrow}
        </p>
        <h1 className="bg-white text-base leading-[1.45] font-bold text-main lg:text-xl">
          {title}
        </h1>
      </div>
    </div>
  );
}
