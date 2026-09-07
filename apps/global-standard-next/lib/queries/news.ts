import { graphqlClient } from "@/lib/graphql-client";
import { NEWS_CATEGORY_SLUG_ORDER, NEWS_PER_PAGE } from "@/lib/news";

// 15件の投稿だが、管理画面で増やされても取りこぼさないよう多めに取る
const NEWS_FETCH_LIMIT = 100;

const THUMBNAIL_DIR = "/images/news";
const PLACEHOLDER_THUMBNAIL = `${THUMBNAIL_DIR}/thumb-placeholder.webp`;

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
  featuredImage: {
    node: { sourceUrl: string };
  } | null;
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

export interface NewsPost {
  title: string;
  slug: string;
  /** 画面に出す日付（2024.12.10） */
  displayDate: string;
  /** <time datetime>用（2024-12-10） */
  isoDate: string;
  /** 未分類の記事もありうるのでnullを許す */
  category: NewsCategory | null;
  thumbnailSrc: string;
}

// Figmaの並びが 2024.12.10 → 12.01 → … なので投稿日の降順。WPGraphQLの既定も降順だが、
// 導入事例（昇順）と読み比べたときに意図が分かるよう明示する
export const NEWS_LIST_QUERY = `
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

/**
 * アイキャッチのURLからファイル名だけを取り出し、リポジトリ内の画像を指すパスに置き換える。
 * WordPressはユーザーのMac内にしかなく、書き出した静的サイトの閲覧者からは
 * `global-standard-cms.local` の画像に到達できないため、
 * 「どの記事にどの画像か」だけをWordPressに持たせ、画像の実体はリポジトリから配る。
 */
function toThumbnailSrc(featuredImage: PostNode["featuredImage"]): string {
  const fileName = featuredImage?.node.sourceUrl.split("/").pop();

  return fileName ? `${THUMBNAIL_DIR}/${fileName}` : PLACEHOLDER_THUMBNAIL;
}

/**
 * 表示に使うカテゴリを1つだけ選ぶ。Figmaのバッジが1記事1つで、
 * WordPress既定の`uncategorized`はサイドバーにも出さないため除外する。
 */
function toPrimaryCategory(categoryNodes: CategoryNode[]): NewsCategory | null {
  const category = categoryNodes.find((node) =>
    NEWS_CATEGORY_SLUG_ORDER.includes(node.slug)
  );

  return category ? { name: category.name, slug: category.slug } : null;
}

function toNewsPost(node: PostNode): NewsPost {
  // WordPressは`2024-12-10T12:15:26`形式で返す。Dateに通すと時差で日付がずれうるので、
  // 日付部分を文字列のまま切り出す
  const isoDate = node.date.slice(0, 10);

  return {
    title: node.title,
    slug: node.slug,
    displayDate: isoDate.replaceAll("-", "."),
    isoDate,
    category: toPrimaryCategory(node.categories.nodes),
    thumbnailSrc: toThumbnailSrc(node.featuredImage),
  };
}

/**
 * 公開中のお知らせを新しい順に全件返す。ページ送り・カテゴリ別・サイドバーの新着は
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

/**
 * サイドバーに出すカテゴリ。記事が1件も無いカテゴリは返さない。
 * 導入事例のカテゴリーボタンと同じく、行き先の無いリンクを作らないため。
 */
export function getNewsCategories(posts: NewsPost[]): NewsCategory[] {
  return NEWS_CATEGORY_SLUG_ORDER.map((slug) => {
    const post = posts.find((item) => item.category?.slug === slug);

    return post?.category ?? null;
  }).filter((category): category is NewsCategory => category !== null);
}

export function filterNewsByCategory(
  posts: NewsPost[],
  categorySlug: string
): NewsPost[] {
  return posts.filter((post) => post.category?.slug === categorySlug);
}

export interface NewsPage {
  posts: NewsPost[];
  totalPages: number;
}

export function paginateNews(posts: NewsPost[], page: number): NewsPage {
  const totalPages = Math.max(1, Math.ceil(posts.length / NEWS_PER_PAGE));
  const startIndex = (page - 1) * NEWS_PER_PAGE;

  return {
    posts: posts.slice(startIndex, startIndex + NEWS_PER_PAGE),
    totalPages,
  };
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
  /** WordPressが組み立て済みのHTML。`entry-content.css` がタグ名で見た目を当てる */
  contentHtml: string;
}

export async function getNewsPost(slug: string): Promise<NewsPostDetail> {
  const data = await graphqlClient.request<NewsPostQueryResult>(
    NEWS_POST_QUERY,
    { slug }
  );

  if (!data.post) {
    throw new Error(`お知らせ（slug: ${slug}）が見つかりませんでした`);
  }

  return { ...toNewsPost(data.post), contentHtml: data.post.content };
}

export interface AdjacentNewsPosts {
  /** 1つ古い記事。WordPressの「前の記事」にあたる */
  older: NewsPost | null;
  /** 1つ新しい記事 */
  newer: NewsPost | null;
}

/** `posts`は新しい順。配列の後ろほど古い記事になる */
export function getAdjacentNewsPosts(
  posts: NewsPost[],
  slug: string
): AdjacentNewsPosts {
  const index = posts.findIndex((post) => post.slug === slug);

  return {
    older: posts[index + 1] ?? null,
    newer: index > 0 ? posts[index - 1] : null,
  };
}
