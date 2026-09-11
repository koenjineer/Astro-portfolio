import { SectionHeading } from "@/components/heading/SectionHeading";
import type { StaffGroup } from "@/lib/queries/staff";
import { StaffCard } from "./StaffCard";
import { UnderlineHeading } from "./UnderlineHeading";

interface StaffSectionProps {
  /** 職種ごとのスタッフ（並びは groupStaffByJob が決める） */
  groups: StaffGroup[];
}

/**
 * スタッフ紹介（職種ごとのカード一覧）。カードは SP 1列 / タブレット 2列 / PC 3列（280px×3＋間80px×2＝1000px）。
 * 出身地などの未入力でカードの高さが揃わないので、行の中では上端で揃える
 */
export function StaffSection({ groups }: StaffSectionProps) {
  return (
    <section id="staff" className="flex flex-col gap-10 lg:gap-[60px]">
      <SectionHeading>スタッフ紹介</SectionHeading>

      <div className="flex flex-col gap-10 lg:gap-[60px]">
        {groups.map((group) => (
          <section key={group.job.slug} className="flex flex-col gap-10">
            <UnderlineHeading>{group.job.name}</UnderlineHeading>
            {/* 1列の間は元の写真（420px）より大きく引き伸ばさないよう420pxで止める */}
            <ul className="mx-auto grid w-full max-w-[420px] items-start gap-y-10 md:max-w-none md:grid-cols-2 md:gap-x-10 lg:grid-cols-3 lg:gap-x-20 lg:gap-y-[60px]">
              {group.members.map((member) => (
                <StaffCard key={member.slug} member={member} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
