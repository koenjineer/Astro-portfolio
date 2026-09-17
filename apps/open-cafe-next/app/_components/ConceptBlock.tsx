import Image from "next/image";
import { HeadingGroup } from "@/components/heading/HeadingGroup";
import { Button } from "@/components/ui/Button";
import { CONCEPT_CONTENT } from "./content";

/**
 * CONCEPT（Figma: PC concept 19709:8055 / SP concept 19710:3150）。
 *
 * - 〜xl：文章→写真の縦積み。写真は画面の左端に付け、右に余白（SP 315px＝画面幅−60px）。
 *   タブレットは文章を640pxで止めて中央に置き（コンセプトページと同じ上限）、写真はPCの600pxで止める
 * - xl〜：写真600px（左端に付ける）＋間80px＋文章。文章は510pxで止め、右の余白はFigmaの90px
 *
 * 薄いベージュの四角は、写真の下端から画面の左端側に敷く（SP 高さ100px・右20px残し / PC 高さ300px・右90px残し）
 */
export function ConceptBlock() {
  return (
    <section
      aria-labelledby="top-concept-heading"
      className="relative flex flex-col gap-[60px] py-[60px] xl:flex-row xl:items-center xl:gap-20 xl:py-20 xl:pr-[90px]"
    >
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[100px] w-[calc(100%-20px)] bg-base-dark xl:h-[300px] xl:w-[calc(100%-90px)]"
      />
      {/* コーヒー豆：右上から画面の外へはみ出す（ページ側の overflow-x-clip で切る） */}
      <Image
        src="/images/home/coffee-beans.webp"
        alt=""
        aria-hidden="true"
        width={444}
        height={397}
        loading="lazy"
        className="pointer-events-none absolute -top-5 -right-[17px] h-auto w-[145px] xl:-top-10 xl:-right-10 xl:w-[296px]"
      />

      {/* DOMは文章→写真（読み上げ順）。PCでは写真を左に出す */}
      <div className="relative mx-auto flex w-full max-w-[680px] flex-col gap-10 px-5 xl:order-2 xl:mx-0 xl:max-w-[510px] xl:gap-12 xl:px-0">
        {/* 見出しの id は HeadingGroup の h2 に付けられないので、外側の div を aria-labelledby で指す */}
        <div id="top-concept-heading">
          <HeadingGroup en={CONCEPT_CONTENT.headingEn} ja={CONCEPT_CONTENT.headingJa} align="start" />
        </div>
        <p className="text-xl/[2] font-bold text-contrast xl:text-[28px]/[2]">
          {CONCEPT_CONTENT.leadLines.map((line, index) => (
            <span key={line}>
              {index > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
        <div className="flex flex-col gap-3.5 text-sm/[2] text-contrast">
          {CONCEPT_CONTENT.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="self-center xl:self-start">
          <Button href="/concept/">詳しくはこちら</Button>
        </div>
      </div>

      <Image
        src="/images/home/concept.webp"
        alt="木のカウンターに並んだ3つのカフェオレ"
        width={900}
        height={1146}
        loading="lazy"
        className="relative aspect-[315/401] w-[calc(100%-60px)] max-w-[600px] object-cover xl:order-1 xl:aspect-[600/764] xl:w-[600px] xl:shrink-0"
      />
    </section>
  );
}
