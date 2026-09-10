interface PageHeroProps {
  /** 日本語の見出し（例: WEB予約）。ページのh1になる */
  title: string;
  /** 英字の小見出し（例: RESERVE） */
  eyebrow: string;
  /** 背景写真。ページごとに違う写真が敷かれるので使う側から渡す */
  imagePcSrc: string;
  imageSpSrc: string;
}

// 書き出した写真の実寸（縦横比をブラウザに伝えるため。素材の書き出し時にPC 1.5倍・SP 2倍で出している）
const IMAGE_PC_WIDTH = 1740;
const IMAGE_PC_HEIGHT = 510;
const IMAGE_SP_WIDTH = 670;
const IMAGE_SP_HEIGHT = 376;

/** 下層ページ上部（Figma: lower-top-pc / lower-top-sp） */
export function PageHero({
  title,
  eyebrow,
  imagePcSrc,
  imageSpSrc,
}: PageHeroProps) {
  return (
    // Figmaの枠はPC 1160px・SP 335px。どちらも「小さな外側の余白＋幅の上限」で中央に置く
    <div className="px-5 pt-5 lg:pt-10">
      <div className="relative mx-auto flex h-[188px] max-w-[1160px] items-center justify-center overflow-hidden rounded-xl p-2.5 lg:h-[340px] lg:px-5 lg:py-0">
        {/* PCとSPで写真の切り抜きが違う。<picture>なら画面幅に合う方だけを読み込む
            （next/image を2つ並べてCSSで隠すと、見えない方も読み込まれる） */}
        <picture>
          <source
            media="(min-width: 1024px)"
            srcSet={imagePcSrc}
            width={IMAGE_PC_WIDTH}
            height={IMAGE_PC_HEIGHT}
          />
          {/* 素のimg：静的書き出しでは next/image の最適化が効かず、<picture> の中では出し分けもできないため */}
          <img
            src={imageSpSrc}
            alt=""
            aria-hidden="true"
            width={IMAGE_SP_WIDTH}
            height={IMAGE_SP_HEIGHT}
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 size-full object-cover"
          />
        </picture>
        {/* Figmaの写真に重なる20%の黒（白文字を読みやすくするため） */}
        <div aria-hidden="true" className="absolute inset-0 bg-black/20" />

        <div className="relative flex flex-col items-center gap-[14px] text-center font-bold text-white lg:gap-[17px]">
          <h1 className="text-2xl/[1.5] tracking-[0.2em] lg:text-[32px]/[1.5] lg:tracking-[0.1em]">
            {title}
          </h1>
          <p className="text-xs/[1.5] tracking-[0.1em] uppercase lg:text-sm/[1.5]">
            {eyebrow}
          </p>
        </div>
      </div>
    </div>
  );
}
