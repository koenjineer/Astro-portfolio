import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import type { CaseCourseGroup } from "@/lib/queries/case";
import { CaseCard } from "./CaseCard";

interface CaseCourseSectionProps {
  group: CaseCourseGroup;
}

export function CaseCourseSection({ group }: CaseCourseSectionProps) {
  const headingId = `${group.slug}-heading`;

  return (
    <section
      id={group.slug}
      aria-labelledby={headingId}
      className="flex flex-col items-center gap-10 px-5 lg:gap-[60px] lg:px-[90px]"
    >
      <div className="flex w-full max-w-[1100px] flex-col gap-[30px] lg:gap-[60px]">
        <h2 id={headingId} className="flex items-center gap-[18px] lg:gap-[10px]">
          {/* 見出し左の青い縦バー。文字の高さに合わせて伸ばす */}
          <span aria-hidden="true" className="w-2 self-stretch bg-main" />
          <span className="flex flex-col gap-px lg:flex-row lg:items-center lg:gap-5">
            <span className="text-2xl font-bold text-contrast lg:text-[28px]">
              {group.title}
            </span>
            <span className="font-fira-sans text-sm text-main italic lg:text-base">
              {group.englishName}
            </span>
          </span>
        </h2>

        {/* PCは1100px幅に510pxのカードを80px空けて2列。1024〜1280pxでは1100pxに
            届かないため、カード幅は固定せず列の間隔を引いた半分で持たせる */}
        <ul className="flex flex-col gap-[54px] lg:flex-row lg:flex-wrap lg:gap-x-20 lg:gap-y-[60px]">
          {group.cases.map((caseItem) => (
            <li key={caseItem.slug} className="lg:w-[calc((100%-80px)/2)]">
              <CaseCard caseItem={caseItem} courseTitle={group.title} />
            </li>
          ))}
        </ul>
      </div>

      {/* ルールセット「矢印つき」：ホバーで背景塗りつぶし＋文字とアイコン色を反転 */}
      <a
        href={`/service#${group.slug}`}
        className="group relative flex h-[69px] w-[295px] items-center justify-center border border-main bg-white text-sm font-medium text-main transition-colors duration-300 hover:bg-main hover:text-white focus-visible:bg-main focus-visible:text-white motion-reduce:transition-none lg:h-[67px] lg:w-auto lg:px-20 lg:text-base"
      >
        {group.title}の詳細
        {/* 10px: Figmaのホバー時に矢印が右へずれる分（ServicePrograms.tsxと共通） */}
        <ArrowRightIcon className="absolute right-3 h-3 w-[18px] transition-transform duration-300 group-hover:translate-x-[10px] group-focus-visible:translate-x-[10px] motion-reduce:transition-none lg:right-5 lg:h-[14px] lg:w-5" />
      </a>
    </section>
  );
}
