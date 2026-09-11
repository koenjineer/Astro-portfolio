import type { Metadata } from "next";
import {
  FormPageSections,
  FormPageShell,
} from "@/components/layout/FormPageShell";
import { ReservationForm } from "./_components/ReservationForm";
import { ReservationGuide } from "./_components/ReservationGuide";

export const metadata: Metadata = {
  title: "WEB予約 | みなみ歯科",
};

export default function ReservationPage() {
  return (
    <FormPageShell
      title="WEB予約"
      eyebrow="RESERVE"
      breadcrumbItems={[{ label: "WEB予約" }]}
    >
      <FormPageSections>
        <ReservationGuide />
        <ReservationForm />
      </FormPageSections>
    </FormPageShell>
  );
}
