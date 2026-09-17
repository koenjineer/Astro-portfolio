import { cache } from "react";
import { toPostDate, type PostDate } from "@/lib/dates";
import { graphqlClient } from "@/lib/graphql-client";
import { toLocalImageSrc, type ImageConnection } from "@/lib/images";
import { toLocalContentHtml, toPlainExcerpt } from "@/lib/newsContent";

// 15件の投稿だが、管理画面で増やされても取りこぼさないよう多めに取る
const NEWS_FETCH_LIMIT = 100;

const NEWS_THUMBNAIL_DIR = "/images/news";

/**
 * アイキャッチが無い記事（post-02・03・06・11・15）に出す代わりの画像。
 * Figmaのカードでは、この5件が写真ではなくOPEN CAFEのロゴになっている（19730:5820）
 */
const NEWS_NO_IMAGE_SRC = `${NEWS_THUMBNAIL_DIR}/no-image.webp`;

/** 一覧1ページの件数（Figmaの一覧は8件＋ページ送りが2ページ分。19716:3289） */
export const NEWS_PER_PAGE = 8;

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
  // 抜粋も本文も空の記事では null になりうる
  excerpt: string | null;
  categories: {
    nodes: CategoryNode[];
  };
  featuredImage: ImageConnection | null;
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
  category: NewsCategory;
  /** アイキャッチが無い記事には代わりの画像（ロゴ）を入れるので、画面側は分岐しなくてよい */
  thumbnailSrc: string;
  /** 本文の冒頭（タグを除いた文字列）。TOPのお知らせの大きいカードに出す */
  excerpt: string;
}

const NEWS_LIST_QUERY = `
  {
    posts(first: ${NEWS_FETCH_LIMIT}, where: {orderby: {field: DATE, order: DESC}}) {
      nodes {
        title
        slug
        date
        excerpt
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
 * 表示に使うカテゴリを1つだけ選ぶ（1記事に1カテゴリの運用）。
 * カテゴリ別一覧に置けなくなるので、未分類の記事はビルドを止めて気づかせる
 */
function toPrimaryCategory(node: PostNode): NewsCategory {
  const category = node.categories.nodes.find(
    (categoryNode) => categoryNode.slug !== UNCATEGORIZED_SLUG
  );

  if (!category) {
    throw new Error(`お知らせ（slug: ${node.slug}）にカテゴリーが設定されていません`);
  }

  return { name: category.name, slug: category.slug };
}

function toNewsPost(node: PostNode): NewsPost {
  return {
    title: node.title,
    slug: node.slug,
    ...toPostDate(node.date),
    category: toPrimaryCategory(node),
    thumbnailSrc:
      toLocalImageSrc(node.featuredImage, NEWS_THUMBNAIL_DIR) ??
      NEWS_NO_IMAGE_SRC,
    excerpt: toPlainExcerpt(node.excerpt ?? ""),
  };
}

/**
 * 公開中のお知らせを新しい順に全件返す。ページ送り・カテゴリ別・Pick UPは
 * すべてこの戻り値から組み立てる。1回のビルドで何度呼ばれても問い合わせは1回にする
 */
export const getNewsPosts = cache(async (): Promise<NewsPost[]> => {
  const data = await graphqlClient.request<NewsQueryResult>(NEWS_LIST_QUERY);
  const posts = data.posts.nodes.map(toNewsPost);

  if (posts.length === 0) {
    throw new Error("お知らせ（post）が1件も見つかりませんでした");
  }

  return posts;
});

interface NewsCategoriesQueryResult {
  categories: {
    nodes: CategoryNode[];
  };
}

// hideEmpty：記事が1件も無いカテゴリは返さない。行き先の無いリンクを作らないため。
// 並びは作った順（TERM_ID昇順＝キャンペーン→イベント情報→期間限定メニュー→営業時間）。
// Figmaのサイドバーの並びと一致するので、この順のまま出す（2026-09-16確認）
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

export const getNewsCategories = cache(async (): Promise<NewsCategory[]> => {
  const data = await graphqlClient.request<NewsCategoriesQueryResult>(
    NEWS_CATEGORIES_QUERY
  );

  // `uncategorized`はhideEmptyで今は消えているが、記事に付けられると復活するので明示的に除く
  return data.categories.nodes
    .filter((node) => node.slug !== UNCATEGORIZED_SLUG)
    .map((node) => ({ name: node.name, slug: node.slug }));
});

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
      excerpt
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
  /**
   * WordPressが組み立て済みのHTML。全15件に `open-cafe-cms.local` の画像
   * （img_firstview_concept）が埋め込まれているので、`lib/newsContent.ts` で
   * リポジトリ内の画像を指す形に直してから返す
   */
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

  return {
    ...toNewsPost(data.post),
    contentHtml: toLocalContentHtml(data.post.content, slug),
  };
});

/** Figmaの詳細ページの「関連記事」は2件（19719:5661） */
export const RELATED_NEWS_COUNT = 2;

/**
 * 関連記事。同じカテゴリーの新しい順で、自分自身は除く（Figmaの詳細ページ＝期間限定メニューの記事に、
 * 同じカテゴリーの2件が並んでいる）。同じカテゴリーが足りなければ、あるぶんだけ返す
 *
 * @param allPosts 新しい順の全記事
 */
export function getRelatedNewsPosts(
  allPosts: NewsPost[],
  current: NewsPost,
  count: number = RELATED_NEWS_COUNT
): NewsPost[] {
  return allPosts
    .filter(
      (post) =>
        post.slug !== current.slug &&
        post.category.slug === current.category.slug
    )
    .slice(0, count);
}
