import { MedicalTimeCard } from "@/components/layout/MedicalTimeCard";
import type { NewsPost } from "@/lib/queries/news";
import { HomeNewsLink } from "./HomeNewsLink";
import { MainVisualSlider } from "./MainVisualSlider";

interface MainVisualProps {
  latestNews: NewsPost;
}

/**
 * ページ上部のメインビジュアル（Figma: mv）。写真のスライダーの下端に、
 * お知らせ1件と診療時間表を重ねる（PCは横並び・SPは縦並びで診療時間表が上）。
 *
 * DOMはお知らせ→診療時間表の順にして、SPだけ flex-col-reverse で見た目の上下を入れ替える。
 * 読み上げの順番はどちらの画面幅でもお知らせが先になる
 */
export function MainVisual({ latestNews }: MainVisualProps) {
  return (
    <div className="pt-[15px] pb-[60px] lg:pt-10">
      <MainVisualSlider />

      {/* 写真の下端に重ねる（SP 24px・PC 25px）。
          relative：重なった所で、後ろに書いたこちらを写真より手前に描かせる */}
      <div className="relative -mt-6 px-5 lg:-mt-[25px]">
        <div className="mx-auto flex max-w-[335px] flex-col-reverse items-center gap-[39px] lg:max-w-[1079px] lg:flex-row lg:gap-[60px]">
          <HomeNewsLink post={latestNews} />
          <MedicalTimeCard className="shrink-0" />
        </div>
      </div>
    </div>
  );
}
