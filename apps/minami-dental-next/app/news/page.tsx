import type { Metadata } from "next";
import { NewsListPage } from "./_components/NewsListPage";
import { newsMetaTitle } from "./_components/newsConfig";

export const metadata: Metadata = {
  title: newsMetaTitle(),
};

export default function NewsPage() {
  return <NewsListPage page={1} />;
}
