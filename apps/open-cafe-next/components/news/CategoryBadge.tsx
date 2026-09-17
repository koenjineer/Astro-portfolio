import Image from "next/image";

// 飾りの実寸（Figma: category-badge 19709:6032）
const DECO_RIGHT_WIDTH = 5;
const DECO_RIGHT_HEIGHT = 22;
// 大きいリボン（TOPのお知らせの大きいカード。文字16px＋上下2pxで28px）
const DECO_RIGHT_LARGE_HEIGHT = 28;
const DECO_BOTTOM_WIDTH = 8;
const DECO_BOTTOM_HEIGHT = 4;

interface CategoryBadgeProps {
  name: string;
  /**
   * `default`：カードの写真の上から10px。
   * `pickup`：TOPのPick UPニュース。上から8px（Figma: news-top-pc 19710:2538）。
   * `large`：TOPのお知らせの大きいカード。文字16px・上から20px（Figma: card-news-large-pc 19709:8796）
   */
  size?: "default" | "pickup" | "large";
}

const TOP_CLASS_NAMES: Record<NonNullable<CategoryBadgeProps["size"]>, string> = {
  default: "top-2.5",
  pickup: "top-2",
  large: "top-5",
};

/**
 * カードの写真の左上に載るカテゴリーのリボン。写真の左端から8pxはみ出し、
 * 右端に切り欠き、左下に折り返しの影が付く。
 *
 * 位置を決めるのは写真側（`relative` を持つ親）。文字の高さ18px＋上下2pxで22pxになり、
 * 右端の切り欠きの高さと合う
 */
export function CategoryBadge({ name, size = "default" }: CategoryBadgeProps) {
  const isLarge = size === "large";

  return (
    <div className={`absolute ${TOP_CLASS_NAMES[size]} -left-2 flex flex-col items-start`}>
      <div className="flex items-center">
        <span
          className={`bg-main px-2.5 py-0.5 ${isLarge ? "text-base/[1.5]" : "text-xs/[1.5]"} font-bold whitespace-nowrap text-white`}
        >
          {name}
        </span>
        <Image
          src={
            isLarge
              ? "/images/common/badge-deco-right-large.svg"
              : "/images/common/badge-deco-right.svg"
          }
          alt=""
          aria-hidden="true"
          width={DECO_RIGHT_WIDTH}
          height={isLarge ? DECO_RIGHT_LARGE_HEIGHT : DECO_RIGHT_HEIGHT}
          loading="lazy"
        />
      </div>
      <Image
        src="/images/common/badge-deco-bottom.svg"
        alt=""
        aria-hidden="true"
        width={DECO_BOTTOM_WIDTH}
        height={DECO_BOTTOM_HEIGHT}
        loading="lazy"
      />
    </div>
  );
}
