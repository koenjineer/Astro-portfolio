import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getCaseItems } from "@/lib/queries/case";
import { getNewsPosts } from "@/lib/queries/news";
import { HomeAbout } from "./_components/HomeAbout";
import { HomeCaseStudy } from "./_components/HomeCaseStudy";
import { HomeMainVisual } from "./_components/HomeMainVisual";
import { HomeNews } from "./_components/HomeNews";
import { HomeService } from "./_components/HomeService";

// Figmaのモックどおり導入事例は6件・お知らせは3件。並びの根拠は各取得関数のコメント
const HOME_CASE_COUNT = 6;
const HOME_NEWS_COUNT = 3;

// metadataは書かない。app/layout.tsx のサイト名・noindex設定をそのまま使う

export default async function HomePage() {
  const [caseItems, newsPosts] = await Promise.all([
    getCaseItems(),
    getNewsPosts(),
  ]);

  return (
    <main className="flex flex-col">
      <SiteHeader />
      <HomeMainVisual />
      <HomeAbout />
      <HomeService />
      <HomeCaseStudy caseItems={caseItems.slice(0, HOME_CASE_COUNT)} />
      <HomeNews posts={newsPosts.slice(0, HOME_NEWS_COUNT)} />
      <SiteFooter />
    </main>
  );
}
