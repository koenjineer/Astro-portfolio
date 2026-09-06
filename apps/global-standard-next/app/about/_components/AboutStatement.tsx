import Image from "next/image";
import { Fragment } from "react";

interface AboutStatementProps {
  /** 英字の見出し（例: MISSION） */
  eyebrow: string;
  /** 日本語の見出し（例: 社会的使命） */
  title: string;
  /** 白いカードの太字見出し。配列の切れ目でFigmaどおりに改行する */
  messageLines: string[];
  /**
   * 改行を効かせる方の画面幅。もう一方では続けて書き、カード幅なりに折り返す。
   * Figmaでは改行位置がPCとSPで違う（MISSIONはSPだけ2行、VISIONはPCだけ2行）
   */
  messageBreakAt: "sp" | "pc";
  body: string;
  imagePcSrc: string;
  imageSpSrc: string;
}

export function AboutStatement({
  eyebrow,
  title,
  messageLines,
  messageBreakAt,
  body,
  imagePcSrc,
  imageSpSrc,
}: AboutStatementProps) {
  const messageBreakClass =
    messageBreakAt === "sp" ? "lg:hidden" : "hidden lg:inline";
  const headingId = `${eyebrow.toLowerCase()}-heading`;

  return (
    <section aria-labelledby={headingId}>
      <div className="relative h-[281px] lg:h-[353px]">
        <Image
          src={imageSpSrc}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          loading="lazy"
          className="object-cover lg:hidden"
        />
        <Image
          src={imagePcSrc}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          loading="lazy"
          className="hidden object-cover lg:block"
        />

        {/* Figmaの写真に重ねた薄い黒フィルター（PageHeroと同じ） */}
        <div className="absolute inset-0 bg-black/20" aria-hidden="true" />

        {/* 写真の左上から20pxの位置に白文字で重ねる。英字と日本語は行送りだけで
            くっつけるので、余白ではなくleadingで高さを作る */}
        <div className="absolute top-5 left-5 flex flex-col gap-[2px] text-white lg:gap-0">
          <p className="font-fira-sans text-[52px] leading-[1.2] italic lg:text-[100px]">
            {eyebrow}
          </p>
          <h2
            id={headingId}
            className="text-base leading-[1.45] font-bold lg:text-2xl"
          >
            {title}
          </h2>
        </div>
      </div>

      {/* 白いカードは写真の下辺に食い込ませる（SP 40px / PC 60px） */}
      <div className="relative mx-5 -mt-10 flex flex-col gap-[18px] bg-white p-5 shadow-[0px_3px_12px_0px_rgba(0,0,0,0.16)] lg:mx-auto lg:-mt-[60px] lg:w-[688px] lg:gap-[30px] lg:px-10 lg:py-[30px] lg:shadow-[0px_3px_6px_0px_rgba(0,0,0,0.16)]">
        <p className="text-center text-xl font-bold text-main lg:text-2xl">
          {messageLines.map((line, index) => (
            <Fragment key={line}>
              {index > 0 && <br className={messageBreakClass} />}
              {line}
            </Fragment>
          ))}
        </p>
        <p className="text-sm leading-6 text-contrast">{body}</p>
      </div>
    </section>
  );
}
