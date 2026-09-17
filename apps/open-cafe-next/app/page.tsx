import { getMenu } from "@/lib/queries/menu";
import { getNewsPosts } from "@/lib/queries/news";
import { getSpecialLunches } from "@/lib/queries/top";
import { ConceptBlock } from "./_components/ConceptBlock";
import { GallerySection } from "./_components/GallerySection";
import { GrandMenuSection } from "./_components/GrandMenuSection";
import { NewsSection } from "./_components/NewsSection";
import { SpecialLunchSection } from "./_components/SpecialLunchSection";
import { TopDrawerButton } from "./_components/TopDrawerButton";
import { TopFirstView } from "./_components/TopFirstView";

/** Figma: 大きいカード1＋小さいカード4 */
const NEWS_SECTION_COUNT = 5;

const FIRST_VIEW_ID = "top-first-view";

/**
 * TOPページ（Figma: 【PC】TOP 19709:8911 / 【SP】TOP 19710:4041）。
 * タイトルは layout の既定（サイト名だけ）を使うので metadata は書かない。
 *
 * 余白の塊（Figma: spacer）はCONCEPTの後とGRAND MENUの後に SP 120px / PC 160px。
 * NEWSの後ろ（フッターの前）はSPだけ120px（NewsSection の下余白に含めた）
 */
export default async function Home() {
  const [posts, lunches, menu] = await Promise.all([
    getNewsPosts(),
    getSpecialLunches(),
    getMenu(),
  ]);

  return (
    // overflow-x-clip：飾り（コーヒー豆・葉っぱ・お皿）を画面の端からはみ出させて切る。縦は切らない
    <main className="flex-1 overflow-x-clip">
      <TopFirstView id={FIRST_VIEW_ID} pickupPost={posts.at(0)} />
      <TopDrawerButton firstViewId={FIRST_VIEW_ID} />
      <ConceptBlock />
      <div aria-hidden="true" className="h-[120px] xl:h-40" />
      <SpecialLunchSection lunches={lunches} />
      <GrandMenuSection menu={menu} />
      <div aria-hidden="true" className="h-[120px] xl:h-40" />
      <GallerySection />
      <NewsSection posts={posts.slice(0, NEWS_SECTION_COUNT)} />
    </main>
  );
}
