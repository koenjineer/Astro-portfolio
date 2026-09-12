import { getBlogPosts } from "@/lib/queries/blog";
import { getNewsPosts } from "@/lib/queries/news";
import { BlogSection } from "./_components/BlogSection";
import { ConceptSection } from "./_components/ConceptSection";
import { MainVisual } from "./_components/MainVisual";
import { MedicalGuideSection } from "./_components/MedicalGuideSection";
import { RecommendSection } from "./_components/RecommendSection";

// Figmaのカンプで決まっている件数
const HOME_BLOG_COUNT = 6;

/**
 * ホーム（Figma: 【PC】ホーム / 【SP】ホーム）。
 * `<title>` は app/layout.tsx の SITE_NAME（＝みなみ歯科）がそのまま正解なので、metadata は書かない。
 * 下層ページのように「◯◯ | みなみ歯科」と足す必要がない
 */
export default async function HomePage() {
  // お知らせもブログも新しい順の全件が返るので、必要な分だけ先頭から取る（サイドバーの新着記事と同じ考え方）
  const [newsPosts, blogPosts] = await Promise.all([
    getNewsPosts(),
    getBlogPosts(),
  ]);

  return (
    <main className="flex-1">
      <MainVisual latestNews={newsPosts[0]} />
      <ConceptSection />
      <RecommendSection />
      <MedicalGuideSection />
      <BlogSection posts={blogPosts.slice(0, HOME_BLOG_COUNT)} />
    </main>
  );
}
