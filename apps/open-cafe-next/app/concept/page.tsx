import type { Metadata } from "next";
import { SubPageLayout } from "@/components/layout/SubPageLayout";
import { ConceptSection } from "./_components/ConceptSection";
import { CoffeePhotos, CroissantPhoto, PastaPhotos } from "./_components/ConceptPhotos";
import { COFFEE_TEXT, CROISSANT_TEXT, PASTA_TEXT } from "./content";

const PAGE_TITLE = "コンセプト";

export const metadata: Metadata = {
  title: PAGE_TITLE,
};

/** コンセプト（Figma PC 19716:1559 / SP 19716:1771）。WordPressを使わない固定の原稿 */
export default function ConceptPage() {
  return (
    <SubPageLayout
      title={PAGE_TITLE}
      eyebrow="concept"
      imagePcSrc="/images/firstview/concept-pc.webp"
      imageSpSrc="/images/firstview/concept-sp.webp"
      breadcrumbItems={[{ label: PAGE_TITLE }]}
    >
      {/* 各段のベージュの四角は画面の端の外まで伸ばしてあるので、ここで横だけ切る。
          SubPageLayout が本文に付ける左右20px（px-5）を -mx-5 で打ち消して画面幅いっぱいに広げ、px-5 で余白を戻す。
          こうしないと四角が画面の端の20px手前で切れる。
          overflow-x-clip は縦を切らない（四角が段の下や最後の段の下にはみ出すため hidden は使わない） */}
      <div className="-mx-5 overflow-x-clip px-5">
        {/* SPの縦積みの間（〜1023px）は中身を640px（PCの写真の幅）で止める。効くのは中身が640pxを超える画面680px〜。
            本文1行が伸びすぎないように */}
        <div className="mx-auto flex max-w-[640px] flex-col gap-[100px] lg:max-w-[1100px] lg:gap-[200px]">
          <ConceptSection text={COFFEE_TEXT} photos={<CoffeePhotos />} photosSide="right" />
          <ConceptSection text={PASTA_TEXT} photos={<PastaPhotos />} photosSide="left" />
          <ConceptSection text={CROISSANT_TEXT} photos={<CroissantPhoto />} photosSide="right" />
        </div>
      </div>
    </SubPageLayout>
  );
}
