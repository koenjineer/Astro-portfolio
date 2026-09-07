import Image from "next/image";
import type { CaseItem } from "@/lib/queries/case";
import { CheckSquareIcon } from "./CheckSquareIcon";

// ロゴはFigmaでSP52px／PC100pxの正方形。元画像は400px四方なので、
// next/imageに渡す寸法は大きい方（PC）に合わせ、表示サイズはCSSで切り替える
const LOGO_SIZE_PC = 100;

interface CaseDetailProps {
  heading: string;
  /** ACFのテキストエリア。改行で段落が分かれている場合がある */
  body: string;
}

function CaseDetail({ heading, body }: CaseDetailProps) {
  const paragraphs = body.split(/\r?\n/).filter((line) => line.trim() !== "");

  return (
    <div className="flex flex-col gap-2">
      <h4 className="flex items-center gap-[10px] text-base font-bold text-contrast lg:text-lg">
        <CheckSquareIcon className="size-4 shrink-0 text-accent-2 lg:size-5" />
        {heading}
      </h4>
      <div className="flex flex-col">
        {paragraphs.map((paragraph) => (
          <p
            key={paragraph}
            className="text-sm leading-6 font-medium text-contrast"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

interface CaseCardProps {
  caseItem: CaseItem;
  /** 「研修コース：」の右に出すコース名。セクション見出しと同じ文言 */
  courseTitle: string;
}

export function CaseCard({ caseItem, courseTitle }: CaseCardProps) {
  return (
    // idはトップページの導入事例カードからのアンカー（/case#<slug>）の着地点
    <article
      id={caseItem.slug}
      className="flex h-full w-full flex-col rounded-xl bg-white shadow-[0px_3px_6px_0px_rgba(0,0,0,0.16)]"
    >
      <header className="relative flex items-center justify-between gap-4 rounded-t-xl bg-main px-5 py-[6px] lg:h-[100px] lg:px-10 lg:py-[18px]">
        <div className="flex flex-col gap-[3px] font-bold text-white lg:gap-2">
          <p className="text-xs lg:text-sm lg:leading-[17px]">
            {caseItem.businessField}
          </p>
          <p className="flex items-center gap-3 text-base lg:items-end lg:gap-[15px] lg:text-2xl">
            {caseItem.companyName}
            <span className="text-sm lg:text-base">様</span>
          </p>
        </div>

        {/* 白いロゴタイル。SPは紺帯の中に収まるが、PCはカード上辺から6pxはみ出す */}
        <div className="flex h-[68px] w-[90px] shrink-0 items-center justify-center rounded bg-white shadow-[0px_3px_12px_0px_rgba(0,0,0,0.16)] lg:absolute lg:-top-[6px] lg:right-5 lg:h-28 lg:w-40 lg:rounded-xl">
          <Image
            src={`/images/case/logo-${caseItem.slug}.webp`}
            alt={`${caseItem.companyName}のロゴ`}
            width={LOGO_SIZE_PC}
            height={LOGO_SIZE_PC}
            loading="lazy"
            className="size-[52px] lg:size-[100px]"
          />
        </div>
      </header>

      <div className="flex flex-col gap-5 p-5 lg:gap-[30px] lg:px-10 lg:py-[35px]">
        <p className="flex flex-wrap gap-[6px] border-b border-[#ddd] pb-[10px] text-base font-bold text-contrast lg:gap-[9px]">
          <span>研修コース：</span>
          <span>{courseTitle}</span>
        </p>

        <CaseDetail heading="研修の目的" body={caseItem.purpose} />
        <CaseDetail heading="選んだ理由" body={caseItem.reason} />
        <CaseDetail heading="導入後の成果・効果" body={caseItem.outcome} />
      </div>
    </article>
  );
}
