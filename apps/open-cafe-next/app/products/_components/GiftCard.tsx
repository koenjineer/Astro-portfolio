import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/queries/products";

// 「ショップで確認する」の行き先。架空のカフェでショップが無いので、今いるページを指す。
// scroll={false} と合わせて、押してもURLもスクロール位置も変わらない。ショップができたらここだけ差し替える
const SHOP_LINK_HREF = "/products/";

// 書き出した写真の実寸（Figmaの528×528を1.5倍。PCの大カード530pxまで引き伸ばさずに足りる）
const IMAGE_SIZE = 792;

export type GiftCardSize = "large" | "small";

interface GiftCardProps {
  product: Product;
  size: GiftCardSize;
}

const TITLE_CLASS: Record<GiftCardSize, string> = {
  large: "text-xl/[1.5] md:text-2xl/[1.5]",
  small: "text-sm/[1.5]",
};

// 「3500」と「yen」の間は大8px・小6px（Figma）
const PRICE_CLASS: Record<GiftCardSize, string> = {
  large: "gap-2 text-[28px]/[1.5] md:text-[32px]/[1.5]",
  small: "gap-1.5 text-2xl/[1.5]",
};

/**
 * ギフトの商品カード（Figma: gift-card-large-pc / gift-card-pc / gift-card-large-sp / gift-card-sp）。
 * 大小で違うのは文字の大きさだけなので、1つの部品を size で切り替える
 */
export function GiftCard({ product, size }: GiftCardProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Image
        src={product.imageSrc}
        // WPから来る写真は飾り扱い（/rules/headless-wordpress.md）。商品名は直下の h2 が伝え、alt に入れると2回続けて読まれる
        alt=""
        width={IMAGE_SIZE}
        height={IMAGE_SIZE}
        // 大カードは1枚目で、PC・SPとも最初の画面に入る
        loading={size === "large" ? "eager" : "lazy"}
        className="aspect-square w-full object-cover"
      />
      <h2 className={`w-full font-bold text-contrast ${TITLE_CLASS[size]}`}>
        {product.title}
      </h2>
      <p
        className={`flex items-center justify-center font-damion font-normal text-contrast ${PRICE_CLASS[size]}`}
      >
        <span>{product.price}</span>
        <span>yen</span>
      </p>
      {/* ルールセットのショップカードボタン（19719:11352 / ホバー 19719:11354）。ホバーで白地＋main色の文字に変わる。
          枠線はデフォルトから付けてホバーで寸法が変わらないようにし、そのぶん padding をFigmaから1px減らす
          （Figmaの枠線は寸法を増やさない。PC 24/8 → 23/7、SP 12/6 → 11/5 で高さ37px / 30px）。
          PCの寸法（幅174px）は小カードが212px以上になる lg から。768〜1023pxは小カードが148〜200pxで、PCの寸法だと2行に折り返すため */}
      <Link
        href={SHOP_LINK_HREF}
        scroll={false}
        className="border border-main bg-main px-[11px] py-[5px] text-xs/[1.5] font-bold whitespace-nowrap text-white transition-colors duration-300 hover:bg-white hover:text-main focus-visible:bg-white focus-visible:text-main motion-reduce:transition-none lg:px-[23px] lg:py-[7px] lg:text-sm/[1.5]"
      >
        ショップで確認する
        {/* 9個とも同じ文言なので、読み上げではどの商品のリンクか分かるようにする */}
        <span className="sr-only">（{product.title}）</span>
      </Link>
    </div>
  );
}
