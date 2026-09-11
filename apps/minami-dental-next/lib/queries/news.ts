import { cache } from "react";
import { toPostDate, type PostDate } from "@/lib/dates";
import { graphqlClient } from "@/lib/graphql-client";
import { toLocalImageSrc, type FeaturedImageNode } from "@/lib/images";

// 15件の投稿だが、管理画面で増やされても取りこぼさないよう多めに取る
const NEWS_FETCH_LIMIT = 100;

/** 一覧（全件・カテゴリ別とも）の1ページの件数。Figmaの一覧がPC・SPとも9件 */
export const NEWS_PER_PAGE = 9;

const NEWS_THUMBNAIL_DIR = "/images/news";
// お知らせは全件アイキャッチ無しなので、実際には全記事がこの画像になる。
// Figmaのカードの青地＋ロゴ（元は1200×630の画像）を、PCの表示264×153の2倍が収まる600×315で書き出した
export const NEWS_FALLBACK_THUMBNAIL = `${NEWS_THUMBNAIL_DIR}/thumb-fallback.webp`;

// WordPress既定のカテゴリ。記事の分類としては使っていないので、表示にも絞り込みにも出さない
const UNCATEGORIZED_SLUG = "uncategorized";

interface CategoryNode {
  name: string;
  slug: string;
}

interface PostNode {
  title: string;
  slug: string;
  date: string;
  categories: {
    nodes: CategoryNode[];
  };
  featuredImage: FeaturedImageNode | null;
}

interface NewsQueryResult {
  posts: {
    nodes: PostNode[];
  };
}

export interface NewsCategory {
  name: string;
  slug: string;
}

export interface NewsPost extends PostDate {
  title: string;
  slug: string;
  /** 未分類の記事もありうるのでnullを許す */
  category: NewsCategory | null;
  thumbnailSrc: string;
}

// WPGraphQLの既定も投稿日の降順だが、診療案内・スタッフ（slug昇順）と
// 読み比べたときに意図が分かるよう明示する
const NEWS_LIST_QUERY = `
  {
    posts(first: ${NEWS_FETCH_LIMIT}, where: {orderby: {field: DATE, order: DESC}}) {
      nodes {
        title
        slug
        date
        categories {
          nodes {
            name
            slug
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

/** 表示に使うカテゴリを1つだけ選ぶ。1記事に1カテゴリの運用で、`uncategorized`は除く */
function toPrimaryCategory(categoryNodes: CategoryNode[]): NewsCategory | null {
  const category = categoryNodes.find((node) => node.slug !== UNCATEGORIZED_SLUG);

  return category ? { name: category.name, slug: category.slug } : null;
}

function toNewsPost(node: PostNode): NewsPost {
  return {
    title: node.title,
    slug: node.slug,
    ...toPostDate(node.date),
    category: toPrimaryCategory(node.categories.nodes),
    thumbnailSrc: toLocalImageSrc(
      node.featuredImage,
      NEWS_THUMBNAIL_DIR,
      NEWS_FALLBACK_THUMBNAIL
    ),
  };
}

/**
 * 公開中のお知らせを新しい順に全件返す。ページ送り・カテゴリ別・新着は
 * すべてこの戻り値から組み立て、ビルド中に何度もWordPressへ問い合わせない。
 */
export async function getNewsPosts(): Promise<NewsPost[]> {
  const data = await graphqlClient.request<NewsQueryResult>(NEWS_LIST_QUERY);
  const posts = data.posts.nodes.map(toNewsPost);

  if (posts.length === 0) {
    throw new Error("お知らせ（post）が1件も見つかりませんでした");
  }

  return posts;
}

interface NewsCategoriesQueryResult {
  categories: {
    nodes: CategoryNode[];
  };
}

// hideEmpty：記事が1件も無いカテゴリは返さない。行き先の無いリンクを作らないため。
// 並びは作った順（TERM_ID昇順＝診療日→その他）。Figmaのサイドバーがこの順で、
// WordPressの既定（名前順）だと「その他→診療日」と逆になるため
const NEWS_CATEGORIES_QUERY = `
  {
    categories(first: ${NEWS_FETCH_LIMIT}, where: {hideEmpty: true, orderby: TERM_ID, order: ASC}) {
      nodes {
        name
        slug
      }
    }
  }
`;

export async function getNewsCategories(): Promise<NewsCategory[]> {
  const data = await graphqlClient.request<NewsCategoriesQueryResult>(
    NEWS_CATEGORIES_QUERY
  );

  // `uncategorized`はhideEmptyで今は消えているが、記事に付けられると復活するので明示的に除く
  return data.categories.nodes
    .filter((node) => node.slug !== UNCATEGORIZED_SLUG)
    .map((node) => ({ name: node.name, slug: node.slug }));
}

export function filterNewsByCategory(
  posts: NewsPost[],
  categorySlug: string
): NewsPost[] {
  return posts.filter((post) => post.category?.slug === categorySlug);
}

interface NewsPostQueryResult {
  post: (PostNode & { content: string }) | null;
}

/**
 * 1記事分。本文は一覧では使わないので、一覧用のクエリには足さず個別に取る。
 * `idType: SLUG` を付けないと、WordPressはslugをIDとして解釈して見つけられない。
 */
const NEWS_POST_QUERY = `
  query NewsPost($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      title
      slug
      date
      content
      categories {
        nodes {
          name
          slug
        }
      }
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`;

export interface NewsPostDetail extends NewsPost {
  /** WordPressが組み立て済みのHTML */
  contentHtml: string;
}

// 詳細ページの generateMetadata と本体の両方で呼ばれる。cache() で同じページの書き出し中は1回だけ取りに行く
export const getNewsPost = cache(async (slug: string): Promise<NewsPostDetail> => {
  const data = await graphqlClient.request<NewsPostQueryResult>(
    NEWS_POST_QUERY,
    { slug }
  );

  if (!data.post) {
    throw new Error(`お知らせ（slug: ${slug}）が見つかりませんでした`);
  }

  return { ...toNewsPost(data.post), contentHtml: data.post.content };
});
