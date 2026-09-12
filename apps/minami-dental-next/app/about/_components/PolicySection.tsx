import Image from "next/image";
import type { ReactNode } from "react";
import { SectionHeading } from "@/components/heading/SectionHeading";
import { ContentWidth } from "@/components/layout/ContentWidth";

// 書き出した写真の実寸（Figmaの PC 640×438 と同じ。これが元の写真の大きさで、これ以上大きくは書き出せない）
const POLICY_IMAGE_WIDTH = 640;
const POLICY_IMAGE_HEIGHT = 438;

interface PolicyItem {
  /** 英字の小見出し（POLICY / FEATURE） */
  eyebrow: string;
  /** 2行に分ける所には <br /> を入れるので、文字列ではなくJSXで持つ */
  title: ReactNode;
  /** 段落の間はFigmaどおり1行空ける。段落の中の改行もFigmaと同じ位置で入れる */
  paragraphs: ReactNode[];
  imageSrc: string;
  imageAlt: string;
  /** 写真を画面のどちら側の端に付けるか（PCは写真と文章の左右もこれで入れ替わる） */
  imageSide: "left" | "right";
  /** 1つ目だけ後ろに飾りを敷く */
  hasDeco: boolean;
}

// ポリシーと特徴はWordPressに無い固定の文言なので、コードに持つ
const POLICY_ITEMS: PolicyItem[] = [
  {
    eyebrow: "POLICY",
    title: "コミュニケーションから始まる最適な医療提供",
    paragraphs: [
      <>
        当院ではまず患者様から詳しくお話を伺います。
        <br />
        難しい言葉は使わず、実際に感じている小さな違和感からあらゆる可能性を考え、最適な治療方法をご提案いたします。
      </>,
      <>
        「どこよりも本音で話せる歯医者さん」を目指し、スタッフ一同、「人間力の向上」にも努めております。
      </>,
    ],
    imageSrc: "/images/about/policy-01.webp",
    imageAlt: "レントゲン写真を見せながら説明する歯科医師",
    imageSide: "left",
    hasDeco: true,
  },
  {
    eyebrow: "FEATURE",
    title: (
      <>
        「医療技術の追求」と
        <br />
        「通いやすさ」
      </>
    ),
    paragraphs: [
      <>
        歯の治療において、小さな違和感は大きなストレスにつながります。私たちは常に快適な歯科医療技術の研究を行っております。
        <br />
        また、「通いやすさ」も医院選びの重要なポイントと考え、2019年のリニューアルを機に更に駅の近くへ場所を移しました。
      </>,
      <>
        朝から夜までお仕事をされている方のために診療時間を見直し、平日でもご利用いただけるようにいたしました。
      </>,
    ],
    imageSrc: "/images/about/policy-02.webp",
    imageAlt: "リニューアルした受付とエントランス",
    imageSide: "right",
    hasDeco: false,
  },
];

/** ポリシーと特徴（Figma: policy）。見出しは幅の上限の中、写真と文章のブロックは画面の端まで使う */
export function PolicySection() {
  return (
    <section id="policy" className="flex flex-col gap-10 lg:gap-[60px]">
      <ContentWidth>
        <SectionHeading>ポリシーと特徴</SectionHeading>
      </ContentWidth>

      <div className="flex flex-col gap-[100px] lg:gap-[120px]">
        {POLICY_ITEMS.map((item) => (
          <PolicyMedia key={item.eyebrow} item={item} />
        ))}
      </div>
    </section>
  );
}

interface PolicyMediaProps {
  item: PolicyItem;
}

/**
 * 写真と文章のブロック（Figma: media-pc / media-sp）。
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
function PolicyMedia({ item }: PolicyMediaProps) {
  const isImageLeft = item.imageSide === "left";

  return (
    <div
      className={`relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-end lg:gap-[93px] ${
        isImageLeft ? "items-start lg:flex-row-reverse" : "items-end"
      } ${item.hasDeco ? "overflow-clip pt-[110px] lg:pt-[180px] lg:pb-[108px]" : ""}`}
    >
      {item.hasDeco && <PolicyDeco />}

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
            {item.eyebrow}
          </p>
          <h3 className="text-xl/[1.5] tracking-[0.08em] lg:text-[28px]/[1.5]">
            {item.title}
          </h3>
        </hgroup>

        {/* Figmaは段落の間に空行が1行入っているので、段落ごとに <p> にして間を1行分（行間と同じ1.7em）空ける */}
        <div className="flex flex-col gap-[1.7em] text-sm/[1.7]">
          {item.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      <Image
        src={item.imageSrc}
        alt={item.imageAlt}
        width={POLICY_IMAGE_WIDTH}
        height={POLICY_IMAGE_HEIGHT}
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
 * 1つ目のブロックの後ろに敷く飾り（Figma: deco-pc / deco-sp）。飾りなので読み上げの対象から外す。
 * 左の位置はFigmaと同じ（PCは1280px幅での right:-480px ＝ 左から450px、SPは左から10px）。
 * 写真が画面の端に付くので、飾りとの位置関係は画面幅が変わっても保たれる。
 *
 * 幅は固定せず右端を画面の右端に合わせる（left＋right＋w-auto）。固定幅だと右端の座標も固定され、
 * それより広い画面（PCは1760px超、SPの組みは567px超）でブロブの右の輪郭が画面の中に見えてしまうため。
 * 中身は object-cover・object-left にして、枠がSVGより広い時は左を基準に引き伸ばし、
 * 狭い時は今までどおり右側が切れるだけにする
 */
function PolicyDeco() {
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
