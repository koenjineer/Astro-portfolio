import type { Metadata } from "next";
import { BlogListPage } from "./_components/BlogListPage";
import { blogMetaTitle } from "./_components/blogConfig";

export const metadata: Metadata = {
  title: blogMetaTitle(),
};

export default function BlogPage() {
  return <BlogListPage page={1} />;
}
