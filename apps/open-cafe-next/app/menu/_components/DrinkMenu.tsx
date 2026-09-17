import Image from "next/image";
import type { DrinkGroup } from "@/lib/queries/menu";

// 書き出した写真の実寸（Figmaの311×311を2倍。元の写真はこの範囲に1150px分あるので引き伸ばしではない）
const IMAGE_SIZE = 622;

interface DrinkMenuProps {
  drinkGroups: DrinkGroup[];
  /** 表の見出し（コーヒー等）のタグ。TOPでは「GRAND MENU」→「ドリンク」の下に入るので h4 */
  headingAs?: "h2" | "h4";
}

/**
 * ドリンクの表（Figma: drink-menu-pc 19730:3952 / drink-menu-sp 19730:4208）。
 *
 * - SP：写真なし。表が縦に並び、左右に20pxの余白
 * - md〜：表を横に3列（間48px）。768〜1023pxは写真（327px）と表（687px）が横に入らないので、写真は出さない
 * - lg〜：左に白い縁の写真、右に表。1024〜1279pxは写真だけが縮む（表は197pxのまま）
 *
 * 品名と価格の対なので dl。見出しの下線は、Figmaでは線が高さを増やさないので下余白を6→5pxにする
 */
export function DrinkMenu({ drinkGroups, headingAs: HeadingTag = "h2" }: DrinkMenuProps) {
  return (
    <div className="flex items-start justify-between gap-10 px-5 md:px-0">
      <div className="hidden min-w-0 bg-white p-2 lg:block lg:w-[327px]">
        <Image
          src="/images/menu/drink.webp"
          alt="コーヒーカップにミルクを注いでいるところ"
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
          loading="lazy"
          className="aspect-square w-full object-cover"
        />
      </div>

      <div className="flex w-full flex-col gap-10 md:flex-row md:gap-12 lg:w-auto lg:shrink-0">
        {drinkGroups.map((group) => (
          <section
            key={group.genre.slug}
            aria-labelledby={`drink-${group.genre.slug}`}
            className="flex flex-col gap-[19px] md:flex-1 lg:w-[197px] lg:flex-none"
          >
            <HeadingTag
              id={`drink-${group.genre.slug}`}
              className="border-b border-contrast pb-[5px] text-base/[1.5] font-bold text-contrast"
            >
              {group.genre.name}
            </HeadingTag>
            <dl className="flex flex-col gap-2 text-contrast">
              {group.drinks.map((drink) => (
                <div
                  key={drink.slug}
                  className="flex items-center justify-between gap-2 whitespace-nowrap"
                >
                  <dt className="text-sm/[1.5] font-bold">{drink.title}</dt>
                  <dd className="flex gap-1 font-damion text-xl/[1.5] font-normal">
                    <span>{drink.price}</span>
                    <span>yen</span>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}
