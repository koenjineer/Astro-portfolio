import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DishList } from "@/app/menu/_components/DishList";
import { DrinkMenu } from "@/app/menu/_components/DrinkMenu";
import { MenuPageShell } from "@/app/menu/_components/MenuPageShell";
import { MENU_LIST_HREF, MENU_TITLE } from "@/lib/menuRoutes";
import { DRINK_GENRE_SLUG, getMenu } from "@/lib/queries/menu";

// generateStaticParams で返した親ジャンル以外（/genre/coffee/ など）は作らない
export const dynamicParams = false;

async function findGenre(slug: string) {
  const { genres } = await getMenu();

  return genres.find((genre) => genre.slug === slug);
}

/**
 * 親ジャンル（タブの4つ）だけを書き出す。ドリンクの子ジャンル（コーヒー等）はFigmaにページが無く、
 * ドリンクのページの中の表の見出しとして出る
 */
export async function generateStaticParams() {
  const { genres } = await getMenu();

  return genres.map((genre) => ({ slug: genre.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/genre/[slug]">): Promise<Metadata> {
  const genre = await findGenre((await params).slug);

  return { title: genre ? genre.name : MENU_TITLE };
}

/** ジャンル別（Figma: 料理 19730:4292 / ドリンク 19730:4837）。料理はカードだけ、ドリンクは表だけ */
export default async function GenrePage({
  params,
}: PageProps<"/genre/[slug]">) {
  const { slug } = await params;
  const { genres, dishes, drinkGroups } = await getMenu();
  const genre = genres.find((candidate) => candidate.slug === slug);

  if (!genre) {
    notFound();
  }

  return (
    <MenuPageShell
      genres={genres}
      currentGenreSlug={genre.slug}
      breadcrumbItems={[
        { label: MENU_TITLE, href: MENU_LIST_HREF },
        { label: genre.name },
      ]}
    >
      {genre.slug === DRINK_GENRE_SLUG ? (
        <DrinkMenu drinkGroups={drinkGroups} />
      ) : (
        <DishList
          dishes={dishes.filter((dish) => dish.genre.slug === genre.slug)}
        />
      )}
    </MenuPageShell>
  );
}
