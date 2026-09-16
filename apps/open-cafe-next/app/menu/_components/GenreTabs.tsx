import Link from "next/link";
import { genreHref } from "@/lib/menuRoutes";
import type { Genre } from "@/lib/queries/menu";

interface GenreTabsProps {
  genres: Genre[];
  /** ジャンル別ページで、今見ているジャンル。一覧ではどれも選択しない（Figma） */
  currentGenreSlug?: string;
}

/**
 * ジャンルのタブ（Figma: button-menu-nav-pc / button-menu-nav-sp）。
 * 灰色の面に、4px内側の白い1pxの線。現在地とホバーは同じ「カレント/ホバー」の見た目（mainの面）。
 * SPは2列×2行（160×64・横の間15px・縦の間14px）、PCは横1列（200×69・間14px）で中央に置く。
 * PCの横1列は842px要り、768〜1023px（中身713〜969px）では入らない。md からは横1列にして幅を等分し
 * （768pxで1つ約168px。SPの160pxより広く、「パン&スイーツ」も1行に収まる）、200px固定は lg から
 */
export function GenreTabs({ genres, currentGenreSlug }: GenreTabsProps) {
  return (
    <nav aria-label="メニューのジャンル">
      <ul className="grid grid-cols-2 gap-x-[15px] gap-y-3.5 md:flex md:justify-center md:gap-3.5">
        {genres.map((genre) => {
          const isCurrent = genre.slug === currentGenreSlug;

          return (
            <li key={genre.slug} className="md:flex-1 lg:flex-none">
              {/* 現在地は読み上げに aria-current で伝え、見た目も同じ属性で切り替える（状態を1か所で持つ） */}
              <Link
                href={genreHref(genre.slug)}
                aria-current={isCurrent ? "page" : undefined}
                className="relative flex h-16 items-center justify-center bg-disable px-5 text-sm/[1.5] font-bold whitespace-nowrap text-white transition-colors duration-300 hover:bg-main focus-visible:bg-main motion-reduce:transition-none aria-[current=page]:bg-main md:h-[69px] md:text-base/[1.5] lg:w-[200px]"
              >
                {genre.name}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-1 border border-white"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
