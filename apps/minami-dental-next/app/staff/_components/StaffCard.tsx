import Image from "next/image";
import type { StaffMember } from "@/lib/queries/staff";

// 書き出した写真の実寸（WPのアイキャッチ。正方形）
const STAFF_IMAGE_SIZE = 420;

interface StaffCardProps {
  member: StaffMember;
}

interface ProfileRow {
  label: string;
  value: string | null;
}

/**
 * スタッフ1人分のカード（Figma: card-staff）。リンクではないのでホバーは付けない。
 * 出身地・趣味・好きな食べ物は未入力（null）の人がいて、Figmaもその行ごと省いているので、空の行は出さない。
 * 管理画面で一度入れて消した欄は空文字で返ることがあるので、空文字も未入力として扱う
 */
export function StaffCard({ member }: StaffCardProps) {
  const profileRows = (
    [
      { label: "出身地", value: member.birthplace },
      { label: "趣味", value: member.hobby },
      { label: "好きな食べ物", value: member.food },
    ] satisfies ProfileRow[]
  ).filter((row): row is { label: string; value: string } => Boolean(row.value));

  return (
    <li className="flex flex-col gap-[15px]">
      <Image
        src={member.imageSrc}
        alt={member.name}
        width={STAFF_IMAGE_SIZE}
        height={STAFF_IMAGE_SIZE}
        loading="lazy"
        className="aspect-square h-auto w-full rounded-[20px] object-cover"
      />

      <div className="flex items-center justify-center gap-3">
        <p className="text-xs/[1.5] font-medium tracking-[0.08em]">{member.job.name}</p>
        <h4 className="text-lg/[1.5] font-bold tracking-[0.08em]">{member.name}</h4>
      </div>

      {profileRows.length > 0 && (
        // 行と行の間の1pxは、行に色を付けず gap で空けて下地の白を見せる（見出し側の水色だけが区切られて見える）
        <dl className="flex flex-col gap-px text-sm/[1.5]">
          {profileRows.map((row) => (
            <div key={row.label} className="flex">
              <dt className="flex w-[140px] shrink-0 items-center bg-main-light px-5 py-[17px]">
                {row.label}
              </dt>
              <dd className="flex flex-1 items-center px-5 py-[17px]">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </li>
  );
}
