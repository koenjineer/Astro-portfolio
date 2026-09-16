import { DrawerMenu } from "@/components/layout/DrawerMenu";

interface PageHeroProps {
  /** 日本語の見出し（例: お問い合わせ）。既定ではページのh1になる */
  title: string;
  /**
   * 見出しのタグ。記事詳細のように、ページの中に本来のh1（記事名）があるページでは "p" を渡す。
   * h1が2つあると、見出しをたどる読み上げでどちらがページの題か分からなくなるため
   */
  titleAs?: "h1" | "p";
  /** 英字の見出し（例: contact）。CSSで大文字にするのでFigmaの原稿どおり小文字で渡す */
  eyebrow: string;
  /** 背景写真。ページごとに違う写真が敷かれるので使う側から渡す（Figma: 下層トップ背景画像 PC/SP） */
  imagePcSrc: string;
  imageSpSrc: string;
}

// 書き出した写真の実寸（縦横比をブラウザに伝えるため。PC 1.5倍・SP 2倍で書き出している）
const IMAGE_PC_WIDTH = 1920;
const IMAGE_PC_HEIGHT = 480;
const IMAGE_SP_WIDTH = 750;
const IMAGE_SP_HEIGHT = 240;

/**
 * 下層ページ上部（Figma: mainvisual-pc / mainvisual-sp）。写真＋黒40%＋白の二重線＋見出し＋メニューボタン。
 * Figmaでは画面幅いっぱいに敷かれているので、余白や幅の上限は付けない
 */
export function PageHero({
  title,
  titleAs: TitleTag = "h1",
  eyebrow,
  imagePcSrc,
  imageSpSrc,
}: PageHeroProps) {
  return (
    <div className="relative h-[120px] md:h-80">
      {/* PCとSPで写真の切り抜きが違う。<picture>なら画面幅に合う方だけを読み込む */}
      <picture>
        <source
          media="(min-width: 768px)"
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
      {/* 白文字を読みやすくするための黒40%（Figmaの値） */}
      <div aria-hidden="true" className="absolute inset-0 bg-black/40" />

      {/* 二重線。外側2px・内側1px。SPは外側6px・内側11px、PCは外側10px・内側16px内に入る */}
      <div
        aria-hidden="true"
        className="absolute inset-1.5 border-2 border-white md:inset-2.5"
      />
      <div
        aria-hidden="true"
        className="absolute inset-[11px] border border-white md:inset-4"
      />

      <div className="absolute top-1/2 left-1/2 flex w-max max-w-[200px] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center text-white md:max-w-[800px]">
        <p className="font-amatic text-[32px]/[1.3] font-bold tracking-[0.2em] uppercase md:text-7xl/[1.3]">
          {eyebrow}
        </p>
        <TitleTag className="text-xs/[1.5] font-bold tracking-[0.08em] md:text-base/[1.5]">
          {title}
        </TitleTag>
      </div>

      {/* Figmaではメニューボタンが写真の右上に置かれている（TOP以外のページ共通）。
          下の方からでもメニューを開けるよう、画面の右上に固定する（写真の上では同じ右上10pxに見える）。
          z-50：固定した外枠が重なり順の区切りになり、中のドロワーはこの外枠より上に出られない。
          ページトップへ戻る(z-40)より下にするとドロワーがその下に潜るので、外枠ごと z-50 にする */}
      <div className="fixed top-2.5 right-2.5 z-50">
        <DrawerMenu />
      </div>
    </div>
  );
}
