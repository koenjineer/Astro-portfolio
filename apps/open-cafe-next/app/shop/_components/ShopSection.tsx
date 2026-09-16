import Image from "next/image";
import { BarHeading } from "@/components/heading/BarHeading";
import { ShopInfoList } from "@/components/shop/ShopInfoList";
import type { Shop } from "@/lib/queries/shops";
import type { ShopInfoRow } from "@/lib/site";

// 書き出した写真の実寸（Figmaの688×377を1.5倍）
const IMAGE_WIDTH = 1032;
const IMAGE_HEIGHT = 566;

interface ShopSectionProps {
  shop: Shop;
  /** 1店舗目は最初の画面に入るので先に読み込む */
  isFirst: boolean;
}

/**
 * 表の並びはSPの縦1列の順（PCの2列はCSSが作る）。
 * 管理画面で未入力の項目があっても行は残す。行が減るとPCの左右の対応がずれるため
 */
function toShopInfoRows(shop: Shop): ShopInfoRow[] {
  return [
    { label: "住所", lines: shop.addressLines },
    { label: "TEL", lines: shop.tel ? [shop.tel] : [] },
    { label: "Mail", lines: shop.email ? [shop.email] : [] },
    { label: "営業時間", lines: shop.timeLines },
    { label: "定休日", lines: shop.holiday ? [shop.holiday] : [] },
    { label: "座席", lines: shop.seats ? [shop.seats] : [] },
  ];
}

/** 1店舗分（Figma: section 19719:7127 / 19719:8571）。見出し＋店内の写真＋店舗情報 */
export function ShopSection({ shop, isFirst }: ShopSectionProps) {
  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <BarHeading>{shop.title}</BarHeading>

      <div className="flex flex-col gap-10">
        <Image
          src={shop.imageSrc}
          // WPから来る写真は飾り扱い（/rules/headless-wordpress.md）。店名は直上の見出しが伝える
          alt=""
          width={IMAGE_WIDTH}
          height={IMAGE_HEIGHT}
          loading={isFirst ? "eager" : "lazy"}
          // 縦横比はFigmaの枠で持つ（SP 335×184 / PC 688×377）。写真の比率とわずかに違うので枠に合わせて切り抜く
          className="aspect-[335/184] w-full object-cover md:aspect-[688/377]"
        />
        <ShopInfoList rows={toShopInfoRows(shop)} />
      </div>
    </div>
  );
}
