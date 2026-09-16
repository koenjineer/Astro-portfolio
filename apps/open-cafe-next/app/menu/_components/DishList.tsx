import Image from "next/image";
import type { Dish } from "@/lib/queries/menu";

// WordPressの原本の実寸（735×735。表示はPC 245px / SP 158px なので引き伸ばさない）
const IMAGE_SIZE = 735;

// PCの1行目（4枚）は下層上部・タブのすぐ下で、最初の画面に入る
const EAGER_CARD_COUNT = 4;

interface DishListProps {
  dishes: Dish[];
}

/**
 * 料理のカードの並び（Figma: menu 19716:2470 / 19730:3843、カードは menu-card2）。
 * SPは2列（158px・横19px・縦24px）、PCは4列（245px・間40px）。
 * 行の高さはその行でいちばん高いカードに揃う（SPで品名が2行になるカードがある。Figmaも同じ）
 */
export function DishList({ dishes }: DishListProps) {
  return (
    <ul className="grid grid-cols-2 gap-x-[19px] gap-y-6 md:grid-cols-4 md:gap-10">
      {dishes.map((dish, index) => (
        <li key={dish.slug} className="flex flex-col gap-3">
          <Image
            src={dish.imageSrc}
            // WPから来る写真は飾り扱い（/rules/headless-wordpress.md）。品名は直下の h2 が伝える
            alt=""
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}
            loading={index < EAGER_CARD_COUNT ? "eager" : "lazy"}
            className="aspect-square w-full object-cover"
          />
          <div className="text-contrast">
            <h2 className="text-sm/[1.5] font-bold">{dish.title}</h2>
            <p className="flex justify-center gap-[7px] font-damion text-2xl/[1.5] font-normal whitespace-nowrap">
              <span>{dish.price}</span>
              <span>yen</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
