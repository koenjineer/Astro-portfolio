import type { ReactNode } from "react";
import { ContentWidth } from "@/components/layout/ContentWidth";

interface WaveImage {
  src: string;
  width: number;
  height: number;
}

interface WaveSet {
  pc: WaveImage;
  sp: WaveImage;
}

// 書き出したSVGの実寸（縦横比をブラウザに伝えるため）
const WAVES: Record<"top" | "bottom", WaveSet> = {
  top: {
    pc: { src: "/images/common/bg-top-pc.svg", width: 1280, height: 203 },
    sp: { src: "/images/common/bg-top-sp.svg", width: 375, height: 88 },
  },
  bottom: {
    pc: { src: "/images/common/bg-bottom-pc.svg", width: 1280, height: 214 },
    sp: { src: "/images/common/bg-bottom-sp.svg", width: 375, height: 82 },
  },
};

interface WaveBandProps {
  /** 帯の中身。見出しと中身の間はここで40px（PCは60px）空ける */
  children: ReactNode;
}

/**
 * 上下に波の付いた水色の帯（Figma: bg-section-pc / bg-section-sp）。
 * 診療案内の診療タイプごとの帯と、ホームの診療案内セクションで使う（Figmaでは同じ組みで寸法も同じ）。
 * 帯は画面の端から端まで、中身は幅の上限1000px。
 */
export function WaveBand({ children }: WaveBandProps) {
  return (
    <>
      <Wave edge="top" />
      {/* PCは上の波のすぐ下から見出しが始まるので上の余白なし。
          下の余白は「下の波を重ねる分＋カードとの間」。SPは波を重ねる量が画面幅の14.4%で幅に比例して増えるので、
          余白も同じ割合で増やす（固定だと広いSP幅で波のキラキラが最後のカードに掛かる。375px幅で62px＝Figmaどおり）。
          PCはFigmaどおり85px固定 */}
      <div className="bg-main-light pt-[30px] pb-[calc(14.4%+8px)] lg:pt-0 lg:pb-[85px]">
        <ContentWidth>
          <div className="flex flex-col gap-10 lg:gap-[60px]">{children}</div>
        </ContentWidth>
      </div>
      <Wave edge="bottom" />
    </>
  );
}

interface WaveProps {
  /** 帯の上に置く波（top）か、帯の下に置く波（bottom）か */
  edge: "top" | "bottom";
}

/**
 * 帯の上下の波。飾りなので読み上げの対象から外す。
 * 画面の幅に合わせて比率を保ったまま伸び縮みさせる（1280pxより広い画面でも波が途中で切れないように）。
 *
 * 下の波は、SVGの上側（PC 117px/1280px・SP 54px/375px）がキラキラだけの透明な部分なので、その分を帯に重ねる。
 * margin の % は幅に対する割合なので、SVGと同じ比率で伸び縮みし、どの画面幅でも波の始まりが帯の下端に揃う
 * （117÷1280＝9.140625%、54÷375＝14.4%）。
 * 下の波は relative にする。カード（relative）と重なる所では positioned どうしが書いた順に描かれるので、
 * 後ろに書いた波がカードより手前に来る（Figmaの重なり順と同じ）。
 *
 * 伸び縮みで波の高さが端数（例: 1455px幅で230.75px）になると、端の画素が半透明で描かれ、帯との継ぎ目に
 * 白い横線が出る。上の波は帯に1px重ね（-mb-px）、下の波は透明な部分の重なりに1px足して、
 * 継ぎ目の半透明の画素を白地ではなく帯の水色の上に描かせる
 */
function Wave({ edge }: WaveProps) {
  const wave = WAVES[edge];

  return (
    <picture>
      <source
        media="(min-width: 1024px)"
        srcSet={wave.pc.src}
        width={wave.pc.width}
        height={wave.pc.height}
      />
      {/* 素のimg：<picture> の中では next/image で出し分けができないため（PageHero と同じ） */}
      <img
        src={wave.sp.src}
        alt=""
        aria-hidden="true"
        width={wave.sp.width}
        height={wave.sp.height}
        loading="lazy"
        className={`block h-auto w-full ${
          edge === "bottom"
            ? "relative -mt-[calc(14.4%+1px)] lg:-mt-[calc(9.140625%+1px)]"
            : "-mb-px"
        }`}
      />
    </picture>
  );
}
