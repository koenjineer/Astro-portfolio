import type { Metadata } from "next";
import { newsMetaTitle } from "@/lib/newsRoutes";
import { NewsListPage } from "./_components/NewsListPage";

export const metadata: Metadata = {
  title: newsMetaTitle(),
};

export default function NewsPage() {
  return <NewsListPage page={1} />;
}
