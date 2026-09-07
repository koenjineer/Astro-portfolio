import type { Metadata } from "next";
import { DownloadPageShell } from "../_components/DownloadPageShell";
import { DownloadThanksCard } from "../_components/DownloadThanksCard";

export const metadata: Metadata = {
  title: "資料ダウンロード完了 | Global Standard",
};

export default function DownloadThanksPage() {
  return (
    <DownloadPageShell
      breadcrumbItems={[
        { label: "資料ダウンロード", href: "/download" },
        { label: "資料ダウンロード完了" },
      ]}
    >
      <DownloadThanksCard />
    </DownloadPageShell>
  );
}
