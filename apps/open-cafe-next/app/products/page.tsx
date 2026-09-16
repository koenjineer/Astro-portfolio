import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHero } from "@/components/layout/PageHero";
import { getProducts } from "@/lib/queries/products";
import { GiftCard } from "./_components/GiftCard";
import { WrappingNotice } from "./_components/WrappingNotice";

const PAGE_TITLE = "ギフト・贈り物";

export const metadata: Metadata = {
  title: PAGE_TITLE,
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="flex-1">
      <PageHero
        title={PAGE_TITLE}
        eyebrow="gift"
        imagePcSrc="/images/firstview/gift-pc.webp"
        imageSpSrc="/images/firstview/gift-sp.webp"
      />
      <Breadcrumb items={[{ label: PAGE_TITLE }]} />

      <div className="px-5 pt-[60px] pb-40 md:pt-20">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-[60px] md:gap-[100px]">
          {/* 1件目だけ大きいカード。PCは4列で大カードが2列×2行を占め、
              Figmaの「左に大、右に2×2、下に4つ」になる。SPは2列で大カードが1行を占める */}
          <ul className="grid grid-cols-2 items-start gap-x-[19px] gap-y-5 md:grid-cols-4 md:gap-10">
            {products.map((product, index) => {
              const isLarge = index === 0;

              return (
                <li
                  key={product.slug}
                  className={isLarge ? "col-span-2 md:row-span-2" : undefined}
                >
                  <GiftCard product={product} size={isLarge ? "large" : "small"} />
                </li>
              );
            })}
          </ul>

          <WrappingNotice />
        </div>
      </div>
    </main>
  );
}
