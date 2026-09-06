import type { Metadata } from "next";
import { DownloadForm } from "./_components/DownloadForm";
import { DownloadPageShell } from "./_components/DownloadPageShell";

export const metadata: Metadata = {
  title: "資料ダウンロード | Global Standard",
};

export default function DownloadPage() {
  return (
    <DownloadPageShell breadcrumbItems={[{ label: "資料ダウンロード" }]}>
      <DownloadForm />
    </DownloadPageShell>
  );
}
