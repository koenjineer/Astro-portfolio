import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import type { CaseListItem } from "@/lib/queries/case";

// Figmaの白いロゴ枠は200px四方。元画像は400px四方なので等倍の半分で置く
const LOGO_SIZE = 200;

interface HomeCaseCardProps {
  caseItem: CaseListItem;
}

export function HomeCaseCard({ caseItem }: HomeCaseCardProps) {
  return (
    <article>
      {/* 導入事例ページには詳細ページが無いので、一覧の該当社（CaseCardのid）へ飛ばす */}
      <Link
        href={`/case#${caseItem.slug}`}
        className="group flex flex-col gap-[14px]"
      >
        <div className="flex aspect-[335/251] w-full items-center justify-center bg-white lg:aspect-[4/3]">
          <Image
            src={`/images/case/logo-${caseItem.slug}.webp`}
            alt={`${caseItem.companyName}のロゴ`}
            width={LOGO_SIZE}
            height={LOGO_SIZE}
            loading="lazy"
            className="size-[200px]"
          />
        </div>

        <h3 className="text-base font-bold text-white">
          {caseItem.companyName}　様
        </h3>

        <div className="flex items-center justify-between gap-4">
          <p className="border border-white px-4 py-[6px] text-sm font-bold text-white">
            {caseItem.courseTitle}
          </p>

          {/* ルールセット「導入事例カードのホバー」：矢印が黄色に変わり、右へ10pxずれる。
              Tailwind v4のtranslate-xはtransformではなくtranslateプロパティを使うため、
              移す対象にtranslateを挙げる（transformと書くとアニメーションしない） */}
          <span
            aria-hidden="true"
            className="flex size-[30px] shrink-0 items-center justify-center rounded-full border-2 border-current text-white transition-[color,translate] duration-300 group-hover:translate-x-[10px] group-hover:text-accent-1 group-focus-visible:translate-x-[10px] group-focus-visible:text-accent-1 motion-reduce:transition-none"
          >
            <ChevronRightIcon className="size-5" />
          </span>
        </div>
      </Link>
    </article>
  );
}
