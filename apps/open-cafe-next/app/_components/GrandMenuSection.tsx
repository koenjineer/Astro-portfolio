import Image from "next/image";
import { DrinkMenu } from "@/app/menu/_components/DrinkMenu";
import { HeadingGroup } from "@/components/heading/HeadingGroup";
import { Button } from "@/components/ui/Button";
import { DRINK_GENRE_SLUG, type Dish, type Genre, type Menu } from "@/lib/queries/menu";

// WordPressの原本の実寸（735×735。表示は最大328px なので引き伸ばさない）
const DISH_IMAGE_SIZE = 735;

/** 各ジャンルから出す品数（Figma: パスタ・サラダ・パン&スイーツとも3品） */
const DISHES_PER_GENRE = 3;

interface GrandMenuSectionProps {
  menu: Menu;
}

/**
 * GRAND MENU（Figma: PC grandmenu 19709:8258 / SP grand-menu 19710:3678）。
 * 料理のジャンルごとに先頭3品（管理画面の並び＝menu_order順）、最後にドリンクの表。
 *
 * 料理のカードはメニューページの DishList と見た目が違う（白い縁取り・左揃え・大きい文字）ので別に持つ。
 * ドリンクの表はメニューページと同じ部品（Figma: drink-menu-pc / drink-menu-sp が同じ）
 */
export function GrandMenuSection({ menu }: GrandMenuSectionProps) {
  const dishGroups = menu.genres.flatMap((genre) => {
    const dishes = menu.dishes
      .filter((dish) => dish.genre.slug === genre.slug)
      .slice(0, DISHES_PER_GENRE);

    return dishes.length > 0 ? [{ genre, dishes }] : [];
  });
  // ドリンクは料理のカードではなく表で出す（親ジャンル「ドリンク」の名前は見出しに使う）
  const drinkGenre = menu.genres.find((genre) => genre.slug === DRINK_GENRE_SLUG);

  return (
    <section
      aria-labelledby="top-grand-menu-heading"
      className="relative flex flex-col items-center gap-10 py-[60px] xl:gap-[60px] xl:py-20"
    >
      {/* 薄いベージュの面。下端に合わせて右に寄せる（SP 幅274・高さ1565 / PC 幅1024・高さ2196）。
          幅は画面幅に対する%で持つ（固定pxだと広い画面でカードの列に食い込む位置が変わるため） */}
      <div
        aria-hidden="true"
        className="absolute right-0 bottom-0 h-[1565px] w-[calc(274/375*100%)] bg-base-dark xl:h-[2196px] xl:w-[80%]"
      />
      {/* 葉っぱ：左上から画面の外へはみ出す。Figmaでは反転して135度（PC 137度）回している */}
      <Image
        src="/images/home/leaves-2.webp"
        alt=""
        aria-hidden="true"
        width={399}
        height={441}
        loading="lazy"
        className="pointer-events-none absolute -top-[65px] -left-[11px] h-auto w-[128px] rotate-135 -scale-y-100 xl:-top-[86px] xl:-left-11 xl:w-[266px] xl:rotate-[137deg]"
      />
      {/* コーヒー豆：右下から画面の外・次の余白へはみ出す */}
      <Image
        src="/images/home/coffee-beans-2.webp"
        alt=""
        aria-hidden="true"
        width={585}
        height={495}
        loading="lazy"
        className="pointer-events-none absolute -right-[30px] -bottom-[100px] h-auto w-[168px] xl:-right-[89px] xl:-bottom-[121px] xl:w-[390px]"
      />

      <div id="top-grand-menu-heading" className="relative w-full">
        <HeadingGroup en="grand menu" ja="グランドメニュー" />
      </div>

      <div className="relative flex w-full max-w-[1140px] flex-col gap-10 px-5 xl:gap-[100px]">
        {dishGroups.map(({ genre, dishes }) => (
          <section key={genre.slug} aria-labelledby={`top-genre-${genre.slug}`} className="flex flex-col gap-5 xl:gap-6">
            <GenreHeading id={`top-genre-${genre.slug}`} genre={genre} />
            <DishCards dishes={dishes} />
          </section>
        ))}

        {drinkGenre && menu.drinkGroups.length > 0 && (
          <section aria-labelledby={`top-genre-${drinkGenre.slug}`} className="flex flex-col gap-5 xl:gap-6">
            <GenreHeading id={`top-genre-${drinkGenre.slug}`} genre={drinkGenre} />
            {/* DrinkMenu はSPで自分に左右20pxの余白を持つ（メニューページと同じ） */}
            <DrinkMenu drinkGroups={menu.drinkGroups} headingAs="h4" />
          </section>
        )}
      </div>

      <div className="relative">
        <Button href="/menu/">その他のメニュー</Button>
      </div>
    </section>
  );
}

interface GenreHeadingProps {
  id: string;
  genre: Genre;
}

/**
 * 上下に二重線の付くジャンル名（Figma: heading-border-block-pc / -sp）。
 * Figmaの線は枠の内側に描かれて寸法を増やさないので、余白から線の太さを引く
 * （外側：線2px＋余白4px→2px、内側：線1px＋余白 PC5px / SP2px → 4px / 1px）
 */
function GenreHeading({ id, genre }: GenreHeadingProps) {
  return (
    <div className="border-y-2 border-contrast py-0.5">
      <h3
        id={id}
        className="border-y border-contrast px-2.5 py-px text-xl/[1.5] font-bold text-contrast xl:px-5 xl:py-1 xl:text-2xl/[1.5]"
      >
        {genre.name}
      </h3>
    </div>
  );
}

interface DishCardsProps {
  dishes: Dish[];
}

/**
 * 料理のカード（Figma: menu-card-pc 344px・白い縁8px / menu-card-sp 158px・白い縁5px）。
 * SPは2列（横19px・縦20px）、md〜は3列（PC 横34px・縦40px）
 */
function DishCards({ dishes }: DishCardsProps) {
  return (
    <ul className="grid grid-cols-2 gap-x-[19px] gap-y-5 md:grid-cols-3 md:gap-x-[34px] md:gap-y-10">
      {dishes.map((dish) => (
        <li key={dish.slug} className="flex flex-col gap-3 text-contrast">
          <Image
            src={dish.imageSrc}
            // WPから来る写真は飾り扱い（/rules/headless-wordpress.md）。品名は直下の文字が伝える
            alt=""
            width={DISH_IMAGE_SIZE}
            height={DISH_IMAGE_SIZE}
            loading="lazy"
            // 縦横比は白い縁を含む箱で持つ（width/height属性だけだと縁を除いた中身に比率がかかる。フッターの地図と同じ）
            className="aspect-square w-full border-5 border-white bg-white object-cover xl:border-8"
          />
          <div>
            <h4 className="text-sm/[1.5] font-bold xl:text-xl/[1.5]">{dish.title}</h4>
            <p className="flex gap-[7px] font-damion text-2xl/[1.5] font-normal whitespace-nowrap xl:text-[32px]/[1.5]">
              <span>{dish.price}</span>
              <span>yen</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
