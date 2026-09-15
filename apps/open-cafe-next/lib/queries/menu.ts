import { cache } from "react";
import { graphqlClient } from "@/lib/graphql-client";
import { toLocalImageSrc, type ImageConnection } from "@/lib/images";

// 29品だが、管理画面で増やされても取りこぼさないよう多めに取る
const MENU_FETCH_LIMIT = 100;

const MENU_IMAGE_DIR = "/images/menu";

interface GenreNode {
  name: string;
  slug: string;
  parent: { node: { slug: string } } | null;
}

interface DishNode {
  title: string;
  slug: string;
  // ACFの数値欄は未入力だとnullで返る。2026-09-15時点では29品すべてnull
  dishFields: {
    price: number | null;
  };
  genres: {
    nodes: GenreNode[];
  };
  featuredImage: ImageConnection | null;
}

interface DishesQueryResult {
  dishes: {
    nodes: DishNode[];
  };
}

export interface Genre {
  name: string;
  slug: string;
  /** 「コーヒー」の親の「ドリンク」のslug。親が無いジャンルは null */
  parentSlug: string | null;
}

export interface Dish {
  title: string;
  /** WordPressが日本語のタイトルから自動で作ったslug（例：`アップルジュース`）。URLには使わない */
  slug: string;
  price: number | null;
  /** 分類に使うジャンル。子ジャンル（コーヒー等）が付いていれば子、無ければ親 */
  genre: Genre;
  /** ドリンク14品はアイキャッチが無い（2026-09-15時点）。画像なしで表示するかはFigmaを見て決める */
  imageSrc: string | null;
}

function toGenre(node: GenreNode): Genre {
  return {
    name: node.name,
    slug: node.slug,
    parentSlug: node.parent?.node.slug ?? null,
  };
}

// 並びは仮にslug昇順。日本語のslugなので、Figmaの並びを見て決め直す
const DISHES_QUERY = `
  {
    dishes(first: ${MENU_FETCH_LIMIT}, where: {orderby: {field: SLUG, order: ASC}}) {
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
  }
`;

/**
 * メニューには親と子の両方のジャンルが付いている（例：ドリンク＋ソフトドリンク）。
 * 細かいほうで分類したいので、子があれば子を選ぶ
 */
function toPrimaryGenre(node: DishNode): Genre {
  const genres = node.genres.nodes;
  const genre = genres.find((genreNode) => genreNode.parent) ?? genres[0];

  // ジャンルが無いとどの一覧にも置けないので、ビルドを止めて気づかせる
  if (!genre) {
    throw new Error(`メニュー（${node.title}）にジャンルが設定されていません`);
  }

  return toGenre(genre);
}

function toDish(node: DishNode): Dish {
  return {
    title: node.title,
    slug: node.slug,
    price: node.dishFields.price,
    genre: toPrimaryGenre(node),
    imageSrc: toLocalImageSrc(node.featuredImage, MENU_IMAGE_DIR),
  };
}

export const getDishes = cache(async (): Promise<Dish[]> => {
  const data = await graphqlClient.request<DishesQueryResult>(DISHES_QUERY);
  const dishes = data.dishes.nodes.map(toDish);

  if (dishes.length === 0) {
    throw new Error("メニュー（dish）が1件も見つかりませんでした");
  }

  return dishes;
});

interface GenresQueryResult {
  genres: {
    nodes: GenreNode[];
  };
}

// 並びは仮に作った順（TERM_ID昇順＝パスタ→サラダ→パン&スイーツ→ドリンク→コーヒー→紅茶→ソフトドリンク）。
// WordPressの既定は名前順。Figmaの並びを見て決め直す
const GENRES_QUERY = `
  {
    genres(first: ${MENU_FETCH_LIMIT}, where: {orderby: TERM_ID, order: ASC}) {
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

/** 親子どちらのジャンルも1列で返す。親子の組み立ては `parentSlug` を見て表示側で行う */
export const getGenres = cache(async (): Promise<Genre[]> => {
  const data = await graphqlClient.request<GenresQueryResult>(GENRES_QUERY);
  const genres = data.genres.nodes.map(toGenre);

  if (genres.length === 0) {
    throw new Error("ジャンル（genre）が1件も見つかりませんでした");
  }

  return genres;
});
