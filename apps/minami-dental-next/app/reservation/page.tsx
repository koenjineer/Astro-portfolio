import type { Metadata } from "next";
import { ReservationForm } from "./_components/ReservationForm";
import { ReservationGuide } from "./_components/ReservationGuide";
import { ReservationPageShell } from "./_components/ReservationPageShell";

export const metadata: Metadata = {
  title: "WEB予約 | みなみ歯科",
};

export default function ReservationPage() {
  return (
    <ReservationPageShell breadcrumbItems={[{ label: "WEB予約" }]}>
      <div className="flex flex-col gap-[100px] lg:gap-[150px]">
        <ReservationGuide />
        <ReservationForm />
      </div>
    </ReservationPageShell>
  );
}
