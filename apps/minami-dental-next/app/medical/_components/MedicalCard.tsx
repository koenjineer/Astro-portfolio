import Image from "next/image";
import { SVG_BASE_PROPS } from "@/components/icons/SmallIcons";
import type { Medical } from "@/lib/queries/medical";
import { getMedicalTypeTag } from "./medicalTypeTag";

// WPのアイキャッチの実寸
const MEDICAL_IMAGE_WIDTH = 630;
const MEDICAL_IMAGE_HEIGHT = 473;

interface MedicalCardProps {
  medical: Medical;
}

/**
 * 診療1つ分のカード（Figma: medical-card-pc / medical-card-sp）。リンクではないのでホバーは付けない。
 * id は目次のボタン（MedicalNav）とフッターのサイトマップの飛び先。
 * 説明文はWPのテキスト欄の改行（\r\n）で段落を分けている。Figmaは段落の間に空行が1行入っているので、
 * 段落ごとに <p> にして間を1行分（行間と同じ1.7em）空ける
 */
export function MedicalCard({ medical }: MedicalCardProps) {
  const tag = getMedicalTypeTag(medical.type.slug);
  const paragraphs = (medical.description ?? "")
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");

  return (
    <article
      id={`medical-${medical.slug}`}
      className="relative flex flex-col gap-4 rounded-[20px] bg-white p-5 lg:gap-9 lg:p-[60px]"
    >
      {/* 右上のリボンに文字が重ならないよう、リボンの分だけ右を空ける（どの画面幅でも、長い診療名でも重ならない）。
          SPはリボンと同じ高さにある診療名だけ：リボンの右端からの幅（右20px＋幅80px）－カードの余白20px＋間15px＝95px
          （375px幅で文字の幅200px＝Figmaどおり）。PCは診療名と一言の横並び全体：（右60px＋幅100px）－余白60px＋間15px＝115px。
          padding なので下線は右端まで引かれる */}
      <header className="flex flex-col gap-5 border-b border-contrast-light pb-5 font-bold lg:flex-row lg:items-center lg:gap-10 lg:pr-[115px] lg:pb-9">
        <h3 className="pr-[95px] text-xl/[28px] tracking-[0.08em] lg:pr-0 lg:text-[28px]/[1.5]">
          {medical.title}
        </h3>
        {medical.lead && (
          <p className="text-sm/[1.5] tracking-[0.08em] text-main">{medical.lead}</p>
        )}

        {/* 「保険対象／実費」は見た目がリボンでも、診療の大事な情報なので文字は読み上げに残す（形だけ aria-hidden）。
            absolute なので置き場所は見た目に影響せず、読み上げで診療名・一言の後に来るよう見出し部の最後に置く */}
        <div
          className={`absolute top-0 right-5 h-[60px] w-20 lg:right-[60px] lg:h-20 lg:w-[100px] ${tag.ribbonClassName}`}
        >
          <RibbonShape />
          <p
            className={`relative pt-[14px] text-center text-sm/[1.5] text-white lg:pt-6 lg:text-base/[1.5] ${tag.ribbonLabelClassName}`}
          >
            {tag.label}
          </p>
        </div>
      </header>

      {/* PCは 420px＋間40px＋420px の2列。1024〜1280px幅では中身が880pxより狭いので、両列を同じ割合で縮める */}
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,420px)_minmax(0,420px)] lg:justify-between lg:gap-10">
        {paragraphs.length > 0 && (
          <div className="flex flex-col gap-[1.7em] text-sm/[1.7]">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}
        <Image
          src={medical.imageSrc}
          alt=""
          width={MEDICAL_IMAGE_WIDTH}
          height={MEDICAL_IMAGE_HEIGHT}
          loading="lazy"
          // 写真は診療のイメージで、内容は診療名と説明文で伝わるので alt は空にする。
          // lg未満は幅いっぱいだが、タブレット幅で元の写真（630px）より大きく引き伸ばさないよう630pxで止める。
          // 説明文が未入力でも写真はPCの右列に置く
          className="mx-auto aspect-[4/3] h-auto w-full max-w-[630px] rounded-[20px] object-cover lg:col-start-2 lg:max-w-none"
        />
      </div>
    </article>
  );
}

/**
 * カード右上のリボンの形（Figma: パス 43827）。PC 100×80 と SP 80×60 は縦横の比率が違うが、
 * どちらも同じ形を横0.8倍・縦0.75倍したものなので、1つのパスを preserveAspectRatio="none" で枠いっぱいに伸ばす
 */
function RibbonShape() {
  return (
    <svg
      {...SVG_BASE_PROPS}
      width={100}
      height={80}
      viewBox="0 0 100 80"
      preserveAspectRatio="none"
      fill="currentColor"
      className="absolute inset-0 size-full"
    >
      <path d="M0 0H100V80L51.2839 63.6735L0 80V0Z" />
    </svg>
  );
}
