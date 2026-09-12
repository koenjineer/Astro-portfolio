import Image from "next/image";
import type { ReactNode } from "react";

// 書き出した写真の実寸（Figmaの PC 640×438 と同じ。これが元の写真の大きさで、これ以上大きくは書き出せない）
const MEDIA_IMAGE_WIDTH = 640;
const MEDIA_IMAGE_HEIGHT = 438;

export interface MediaBlockProps {
  /** 英字の小見出し（POLICY / FEATURE / CONCEPT） */
  eyebrow: string;
  /** 2行に分ける所には <br /> を入れるので、文字列ではなくJSXで持つ */
  title: ReactNode;
  /**
   * 見出しのレベル。ホームのCONCEPTはページの大見出しなので h2、
   * 当院についてのポリシーと特徴は「ポリシーと特徴」の下にぶら下がるので h3
   */
  titleAs?: "h2" | "h3";
  /** 段落の間はFigmaどおり1行空ける。段落の中の改行もFigmaと同じ位置で入れる */
  paragraphs: ReactNode[];
  imageSrc: string;
  imageAlt: string;
  /** 写真を画面のどちら側の端に付けるか（PCは写真と文章の左右もこれで入れ替わる） */
  imageSide: "left" | "right";
  /** 後ろに水色の飾りを敷くか */
  hasDeco?: boolean;
  /** 本文の下に置くボタンなど。ホームのCONCEPTだけ「当院について」ボタンが入る */
  action?: ReactNode;
}

/**
 * 写真と文章のブロック（Figma: media-pc / media-sp）。当院についてのポリシーと特徴と、
 * ホームのCONCEPTで使う。Figmaでは同じコンポーネントで、寸法もすべて同じ。
 *
 * SPはどちらのブロックも「文章 → 写真」の縦並びなので、DOMの順番は1つにして、
 * PCで写真を左に置くブロックだけ横並びの向きを反転させる（SP用・PC用に同じ中身を2回書かないため）。
 *
 * 写真は画面の端に付ける。元の写真が640×438しかないので、それより大きくは引き伸ばさない（ぼやけるため）。
 * PCは画面の半分（1024〜1280px幅）か640pxの小さい方、SPは画面幅－41px（Figmaの 375－334）で640pxまで。
 * 文章はFigmaどおり407px。1024px幅では写真512px＋間93pxの残りに入らないので、
 * 画面の端との間（20px）だけ margin で確保して、あふれる分は文章側を縮める。
 *
 * 縦並びの間は、文章も写真と同じ640pxで止めて写真と同じ側へ寄せる
 * （上限が無いとタブレット幅で1行が1000px近くになり読みにくいため。横並びへの切り替えは、
 * 写真640＋間93＋文章407＝1140pxが入る1024px以上から）。
 * 1281px以上では、写真は端に付けたまま文章だけ中央へ寄せて左右の空白の偏りを目立たなくする。
 * 寄せる量は「（ブロックの幅－1280px）÷2」を写真側の margin に足す形で、1280px以下では0になり
 * Figmaの見え方（間93px・本文407px）がそのまま残る（% はブロックの幅に対する割合なので、
 * スクロールバーの分がずれる 100vw は使わない）
 */
export function MediaBlock({
  eyebrow,
  title,
  titleAs = "h3",
  paragraphs,
  imageSrc,
  imageAlt,
  imageSide,
  hasDeco = false,
  action,
}: MediaBlockProps) {
  const isImageLeft = imageSide === "left";
  const Title = titleAs;

  return (
    <div
      className={`relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-end lg:gap-[93px] ${
        isImageLeft ? "items-start lg:flex-row-reverse" : "items-end"
      } ${hasDeco ? "overflow-clip pt-[110px] lg:pt-[180px] lg:pb-[108px]" : ""}`}
    >
      {hasDeco && <MediaDeco />}

      {/* 飾りは absolute（positioned）なので、後ろに書いただけでは文章と写真より手前に来る。
          どちらにも relative を付けて飾りの上に描かせる */}
      <div
        className={`relative flex w-full max-w-[640px] flex-col gap-[30px] px-5 lg:w-[407px] lg:gap-[39px] lg:px-0 ${
          isImageLeft
            ? "mr-auto lg:mr-5 min-[1281px]:ml-[max(0px,calc((100%-1280px)/2))]"
            : "ml-auto lg:ml-5 min-[1281px]:mr-[max(0px,calc((100%-1280px)/2))]"
        }`}
      >
        <hgroup className="flex flex-col gap-[14px] font-bold lg:gap-6">
          <p className="text-[11px]/[1.5] tracking-[0.1em] text-main uppercase lg:text-sm/[1.5]">
            {eyebrow}
          </p>
          <Title className="text-xl/[1.5] tracking-[0.08em] lg:text-[28px]/[1.5]">
            {title}
          </Title>
        </hgroup>

        {/* Figmaは段落の間に空行が1行入っているので、段落ごとに <p> にして間を1行分（行間と同じ1.7em）空ける */}
        <div className="flex flex-col gap-[1.7em] text-sm/[1.7]">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {action}
      </div>

      <Image
        src={imageSrc}
        alt={imageAlt}
        width={MEDIA_IMAGE_WIDTH}
        height={MEDIA_IMAGE_HEIGHT}
        loading="lazy"
        className={`relative h-auto w-[calc(100%-41px)] max-w-[640px] lg:w-1/2 lg:shrink-0 ${
          isImageLeft ? "rounded-r-[20px]" : "rounded-l-[20px]"
        }`}
      />
    </div>
  );
}

// 書き出したSVGの実寸（縦横比をブラウザに伝えるため）
const DECO_PC_WIDTH = 1310;
const DECO_PC_HEIGHT = 726;
const DECO_SP_WIDTH = 556;
const DECO_SP_HEIGHT = 308;

/**
 * ブロックの後ろに敷く飾り（Figma: deco-pc / deco-sp）。飾りなので読み上げの対象から外す。
 * 左の位置はFigmaと同じ（PCは1280px幅での right:-480px ＝ 左から450px、SPは左から10px）。
 * 写真が画面の端に付くので、飾りとの位置関係は画面幅が変わっても保たれる。
 *
 * 幅は固定せず右端を画面の右端に合わせる（left＋right＋w-auto）。固定幅だと右端の座標も固定され、
 * それより広い画面（PCは1760px超、SPの組みは567px超）でブロブの右の輪郭が画面の中に見えてしまうため。
 * 中身は object-cover・object-left にして、枠がSVGより広い時は左を基準に引き伸ばし、
 * 狭い時は今までどおり右側が切れるだけにする
 */
function MediaDeco() {
  return (
    // absolute は <picture> に付ける。<img> だけを浮かせても <picture> は横並びの1つ分として残り、
    // 写真と文章の間（PC 93px・SP 40px）がもう1つ増えてしまうため
    <picture className="absolute top-0 right-0 left-[10px] h-[308px] w-auto lg:left-[450px] lg:h-[726px]">
      <source
        media="(min-width: 1024px)"
        srcSet="/images/common/deco-pc.svg"
        width={DECO_PC_WIDTH}
        height={DECO_PC_HEIGHT}
      />
      {/* 素のimg：<picture> の中では next/image で出し分けができないため（PageHero と同じ） */}
      <img
        src="/images/common/deco-sp.svg"
        alt=""
        aria-hidden="true"
        width={DECO_SP_WIDTH}
        height={DECO_SP_HEIGHT}
        loading="lazy"
        className="size-full max-w-none object-cover object-left"
      />
    </picture>
  );
}
