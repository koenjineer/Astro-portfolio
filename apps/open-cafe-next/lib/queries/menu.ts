import { cache } from "react";
import { graphqlClient } from "@/lib/graphql-client";
import type { ImageConnection } from "@/lib/images";
import { requireExistingLocalImageSrc } from "@/lib/images.server";

// 29品・7ジャンルだが、管理画面で増やされても取りこぼさないよう多めに取る
const MENU_FETCH_LIMIT = 100;

const MENU_IMAGE_DIR = "/images/menu";

/**
 * ドリンクの親ジャンル。Figmaではドリンクだけが写真付きのカードではなく、
 * 子ジャンル（コーヒー・紅茶・ソフトドリンク）ごとの品名と価格の表になる
 */
export const DRINK_GENRE_SLUG = "drink";

interface GenreNode {
  name: string;
  slug: string;
  parent: { node: { slug: string } } | null;
}

interface MenuItemNode {
  title: string;
  slug: string;
  // ACFの数値欄は未入力だとnullで返る
  dishFields: {
    price: number | null;
  };
  genres: {
    nodes: GenreNode[];
  };
  featuredImage: ImageConnection | null;
}

interface MenuQueryResult {
  dishes: {
    nodes: MenuItemNode[];
  };
  genres: {
    nodes: GenreNode[];
  };
}

export interface Genre {
  name: string;
  slug: string;
}

interface MenuItemBase {
  title: string;
  /** WordPressが日本語のタイトルから自動で作ったslug。詳細ページが無いのでURLには使わない */
  slug: string;
  price: number;
}

/** 写真付きのカードで出す料理（パスタ・サラダ・パン&スイーツ） */
export interface Dish extends MenuItemBase {
  /** 親ジャンル。料理には子ジャンルが無い */
  genre: Genre;
  imageSrc: string;
}

/** 表で出すドリンク。写真は無い */
export type Drink = MenuItemBase;

/** ドリンクの表1つ分（コーヒー・紅茶・ソフトドリンク） */
export interface DrinkGroup {
  genre: Genre;
  drinks: Drink[];
}

export interface Menu {
  /** 親ジャンル。ジャンルのタブと `/genre/{slug}/` のページになる */
  genres: Genre[];
  /** ドリンク以外の全品 */
  dishes: Dish[];
  drinkGroups: DrinkGroup[];
}

// 品の並びは管理画面の並び替え（menu_order）。プラグイン「Post Types Order」の自動並び替えが有効で、
// orderby に何を書いても menu_order に上書きされるため、意図が読めるよう MENU_ORDER と明示する（docs/wordpress.md）。
// ジャンルは作った順（TERM_ID）がFigmaのタブの順（パスタ→サラダ→パン&スイーツ→ドリンク、コーヒー→紅茶→ソフトドリンク）と一致する。
// WordPressの既定は名前順
const MENU_QUERY = `
  {
    dishes(first: ${MENU_FETCH_LIMIT}, where: {orderby: {field: MENU_ORDER, order: ASC}}) {
      nodes {
        title
        slug
        dishFields {
          price
        }
        genres {
          nodes {
            name
            slug
            parent {
              node {
                slug
              }
            }
          }
        }
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
    genres(first: ${MENU_FETCH_LIMIT}, where: {orderby: TERM_ID, order: ASC, hideEmpty: true}) {
      nodes {
        name
        slug
        parent {
          node {
            slug
          }
        }
      }
    }
  }
`;

function toGenre(node: GenreNode): Genre {
  return { name: node.name, slug: node.slug };
}

function requirePrice(node: MenuItemNode, label: string): number {
  // 価格の無い品を出すと入力漏れに気づけないので、ビルドを止める
  if (node.dishFields.price === null) {
    throw new Error(`${label}に価格が設定されていません`);
  }

  return node.dishFields.price;
}

function requireParentGenre(node: MenuItemNode, label: string): GenreNode {
  const parentGenre = node.genres.nodes.find((genre) => !genre.parent);

  // 親ジャンルが無いとどのタブにも置けないので、ビルドを止めて気づかせる
  if (!parentGenre) {
    throw new Error(`${label}に親ジャンルが設定されていません`);
  }

  return parentGenre;
}

function toDish(node: MenuItemNode, genre: GenreNode, label: string): Dish {
  return {
    title: node.title,
    slug: node.slug,
    price: requirePrice(node, label),
    genre: toGenre(genre),
    // 画像がリポジトリに置かれているかまで確かめる（置き忘れたまま公開しないため）
    imageSrc: requireExistingLocalImageSrc(
      node.featuredImage,
      MENU_IMAGE_DIR,
      label
    ),
  };
}

export const getMenu = cache(async (): Promise<Menu> => {
  const data = await graphqlClient.request<MenuQueryResult>(MENU_QUERY);

  const genres = data.genres.nodes
    .filter((genre) => !genre.parent)
    .map(toGenre);
  const drinkSubGenres = data.genres.nodes.filter(
    (genre) => genre.parent?.node.slug === DRINK_GENRE_SLUG
  );

  const dishes: Dish[] = [];
  const drinksBySubGenreSlug = new Map<string, Drink[]>();

  for (const node of data.dishes.nodes) {
    const label = `メニュー（${node.title}）`;
    const parentGenre = requireParentGenre(node, label);

    if (parentGenre.slug !== DRINK_GENRE_SLUG) {
      dishes.push(toDish(node, parentGenre, label));
      continue;
    }

    const subGenre = node.genres.nodes.find(
      (genre) => genre.parent?.node.slug === DRINK_GENRE_SLUG
    );

    // 子ジャンルが無いドリンクはどの表にも置けない
    if (!subGenre) {
      throw new Error(`${label}にドリンクの子ジャンル（コーヒー等）が設定されていません`);
    }

    const drinks = drinksBySubGenreSlug.get(subGenre.slug) ?? [];
    drinks.push({
      title: node.title,
      slug: node.slug,
      price: requirePrice(node, label),
    });
    drinksBySubGenreSlug.set(subGenre.slug, drinks);
  }

  // 表の並びは子ジャンルの並び（TERM_ID順）、表の中は品の並び（menu_order順）
  const drinkGroups = drinkSubGenres.flatMap((subGenre) => {
    const drinks = drinksBySubGenreSlug.get(subGenre.slug);

    return drinks ? [{ genre: toGenre(subGenre), drinks }] : [];
  });

  if (dishes.length === 0 && drinkGroups.length === 0) {
    throw new Error("メニュー（dish）が1件も見つかりませんでした");
  }

  return { genres, dishes, drinkGroups };
});
