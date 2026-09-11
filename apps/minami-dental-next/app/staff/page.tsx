import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHero } from "@/components/layout/PageHero";
import { SITE_NAME } from "@/lib/clinic";
import { getStaffMembers, groupStaffByJob } from "@/lib/queries/staff";
import { DirectorMessage } from "./_components/DirectorMessage";
import { StaffPhotoStrip } from "./_components/StaffPhotoStrip";
import { StaffSection } from "./_components/StaffSection";

export const metadata: Metadata = {
  title: `スタッフ紹介 | ${SITE_NAME}`,
};

export default async function StaffPage() {
  const staffGroups = groupStaffByJob(await getStaffMembers());

  return (
    <main className="flex-1">
      <PageHero
        title="スタッフ紹介"
        eyebrow="STAFF"
        imagePcSrc="/images/staff/hero-pc.webp"
        imageSpSrc="/images/staff/hero-sp.webp"
      />
      <Breadcrumb items={[{ label: "スタッフ紹介" }]} />

      <div className="flex flex-col gap-[100px] pt-[60px] pb-[100px] lg:gap-40 lg:pt-20 lg:pb-40">
        <ContentWidth>
          <DirectorMessage />
        </ContentWidth>
        {/* 写真の帯は画面の端から端まで流すので、幅の上限の外に置く */}
        <StaffPhotoStrip />
        <ContentWidth>
          <StaffSection groups={staffGroups} />
        </ContentWidth>
      </div>
    </main>
  );
}

interface ContentWidthProps {
  children: ReactNode;
}

/** 本文の幅（小さな外側の余白＋幅の上限1000pxで中央に置く）。写真の帯だけはこの外に出す */
function ContentWidth({ children }: ContentWidthProps) {
  return (
    <div className="px-5">
      <div className="mx-auto max-w-[1000px]">{children}</div>
    </div>
  );
}
