import type { Metadata } from "next";
import { SubPageLayout } from "@/components/layout/SubPageLayout";
import { getShops } from "@/lib/queries/shops";
import { ShopSection } from "./_components/ShopSection";

const PAGE_TITLE = "店舗情報";

export const metadata: Metadata = {
  title: PAGE_TITLE,
};

export default async function ShopPage() {
  const shops = await getShops();

  return (
    <SubPageLayout
      title={PAGE_TITLE}
      eyebrow="shop"
      imagePcSrc="/images/firstview/shop-pc.webp"
      imageSpSrc="/images/firstview/shop-sp.webp"
      breadcrumbItems={[{ label: PAGE_TITLE }]}
    >
      {/* 店舗の一覧なので ul。並びは lib/site.ts の SHOP_TITLE_ORDER で決まる */}
      <ul className="mx-auto flex w-full max-w-[688px] flex-col gap-[60px] md:gap-[120px]">
        {shops.map((shop, index) => (
          <li key={shop.slug}>
            <ShopSection shop={shop} isFirst={index === 0} />
          </li>
        ))}
      </ul>
    </SubPageLayout>
  );
}
