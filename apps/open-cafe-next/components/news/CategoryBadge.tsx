import Image from "next/image";

// 飾りの実寸（Figma: category-badge 19709:6032）
const DECO_RIGHT_WIDTH = 5;
const DECO_RIGHT_HEIGHT = 22;
const DECO_BOTTOM_WIDTH = 8;
const DECO_BOTTOM_HEIGHT = 4;

interface CategoryBadgeProps {
  name: string;
}

/**
 * カードの写真の左上に載るカテゴリーのリボン。写真の左端から8pxはみ出し、
 * 右端に切り欠き、左下に折り返しの影が付く。
 *
 * 位置を決めるのは写真側（`relative` を持つ親）。文字の高さ18px＋上下2pxで22pxになり、
 * 右端の切り欠きの高さと合う
 */
export function CategoryBadge({ name }: CategoryBadgeProps) {
  return (
    <div className="absolute top-2.5 -left-2 flex flex-col items-start">
      <div className="flex items-center">
        <span className="bg-main px-2.5 py-0.5 text-xs/[1.5] font-bold whitespace-nowrap text-white">
          {name}
        </span>
        <Image
          src="/images/common/badge-deco-right.svg"
          alt=""
          aria-hidden="true"
          width={DECO_RIGHT_WIDTH}
          height={DECO_RIGHT_HEIGHT}
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
