import type { Metadata } from "next";
import { MENU_TITLE } from "@/lib/menuRoutes";
import { getMenu } from "@/lib/queries/menu";
import { DishList } from "./_components/DishList";
import { DrinkMenu } from "./_components/DrinkMenu";
import { MenuPageShell } from "./_components/MenuPageShell";

export const metadata: Metadata = {
  title: MENU_TITLE,
};

/** 一覧は料理の全品をジャンルの区切りなしで1つの並びにし、下にドリンクの表を置く（Figma: 19716:1875） */
export default async function MenuPage() {
  const { genres, dishes, drinkGroups } = await getMenu();

  return (
    <MenuPageShell genres={genres} breadcrumbItems={[{ label: MENU_TITLE }]}>
      <DishList dishes={dishes} />
      <DrinkMenu drinkGroups={drinkGroups} />
    </MenuPageShell>
  );
}
