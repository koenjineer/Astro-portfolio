import { cache } from "react";
import { toPostDate, type PostDate } from "@/lib/dates";
import { graphqlClient } from "@/lib/graphql-client";
import { requireLocalImageSrc, type FeaturedImageNode } from "@/lib/images";

// 11件の投稿だが、管理画面で増やされても取りこぼさないよう多めに取る
const BLOG_FETCH_LIMIT = 100;

/** 一覧（全件・カテゴリ別とも）の1ページの件数。Figmaの一覧がPC・SPとも9件 */
export const BLOG_PER_PAGE = 9;

const BLOG_THUMBNAIL_DIR = "/images/blog";

interface BlogCategoryNode {
  name: string;
  slug: string;
}

interface BlogNode {
  title: string;
  slug: string;
  date: string;
  blogCategories: {
    nodes: BlogCategoryNode[];
  };
  featuredImage: FeaturedImageNode | null;
}

interface BlogListQueryResult {
  blogs: {
    nodes: BlogNode[];
  };
}

export interface BlogCategory {
  name: string;
  slug: string;
}

export interface BlogPost extends PostDate {
  title: string;
  slug: string;
  /** カテゴリ未設定の記事もありうるのでnullを許す */
  category: BlogCategory | null;
  thumbnailSrc: string;
}

// slugの連番（blog-01が最新）と投稿日の降順が一致している。お知らせと同じく新しい順に並べる
const BLOG_LIST_QUERY = `
  {
    blogs(first: ${BLOG_FETCH_LIMIT}, where: {orderby: {field: DATE, order: DESC}}) {
      nodes {
        title
        slug
        date
        blogCategories {
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

/** 表示に使うカテゴリを1つだけ選ぶ。1記事に1カテゴリの運用のため先頭を採る */
function toPrimaryCategory(categoryNodes: BlogCategoryNode[]): BlogCategory | null {
  const [category] = categoryNodes;

  return category ? { name: category.name, slug: category.slug } : null;
}

function toBlogPost(node: BlogNode): BlogPost {
  return {
    title: node.title,
    slug: node.slug,
    ...toPostDate(node.date),
    category: toPrimaryCategory(node.blogCategories.nodes),
    thumbnailSrc: requireLocalImageSrc(
      node.featuredImage,
      BLOG_THUMBNAIL_DIR,
      `ブログ（slug: ${node.slug}）`
    ),
  };
}

/**
 * 公開中のブログを新しい順に全件返す。ページ送り・カテゴリ別・新着は
 * すべてこの戻り値から組み立て、ビルド中に何度もWordPressへ問い合わせない。
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const data = await graphqlClient.request<BlogListQueryResult>(BLOG_LIST_QUERY);
  const posts = data.blogs.nodes.map(toBlogPost);

  if (posts.length === 0) {
    throw new Error("ブログ（blog）が1件も見つかりませんでした");
  }

  return posts;
}

interface BlogCategoriesQueryResult {
  blogCategories: {
    nodes: BlogCategoryNode[];
  };
}

// hideEmpty：記事が1件も無いカテゴリは返さない。行き先の無いリンクを作らないため
const BLOG_CATEGORIES_QUERY = `
  {
    blogCategories(first: ${BLOG_FETCH_LIMIT}, where: {hideEmpty: true, orderby: TERM_ID, order: ASC}) {
      nodes {
        name
        slug
      }
    }
  }
`;

// Figmaのサイドバーの並び（歯科コラム→患者様の声→小児歯科）。作った順（TERM_ID昇順＝column→pediatric→voice）
// では後ろ2つが逆になるので順番をコードに持つ。ここに無いslugは、sortが安定ソートなので後ろに作った順で付く
const BLOG_CATEGORY_ORDER = ["column", "voice", "pediatric"];

function categoryOrderIndex(slug: string): number {
  const index = BLOG_CATEGORY_ORDER.indexOf(slug);

  return index === -1 ? BLOG_CATEGORY_ORDER.length : index;
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const data = await graphqlClient.request<BlogCategoriesQueryResult>(
    BLOG_CATEGORIES_QUERY
  );

  return data.blogCategories.nodes
    .map((node) => ({ name: node.name, slug: node.slug }))
    .sort((first, second) => categoryOrderIndex(first.slug) - categoryOrderIndex(second.slug));
}

interface BlogPostQueryResult {
  blog: (BlogNode & { content: string }) | null;
}

/**
 * 1記事分。本文は一覧では使わないので、一覧用のクエリには足さず個別に取る。
 * `idType: SLUG` を付けないと、WordPressはslugをIDとして解釈して見つけられない。
 */
const BLOG_POST_QUERY = `
  query BlogPost($slug: ID!) {
    blog(id: $slug, idType: SLUG) {
      title
      slug
      date
      content
      blogCategories {
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

export interface BlogPostDetail extends BlogPost {
  /** WordPressが組み立て済みのHTML */
  contentHtml: string;
}

// 詳細ページの generateMetadata と本体の両方で呼ばれる。cache() で同じページの書き出し中は1回だけ取りに行く
export const getBlogPost = cache(async (slug: string): Promise<BlogPostDetail> => {
  const data = await graphqlClient.request<BlogPostQueryResult>(
    BLOG_POST_QUERY,
    { slug }
  );

  if (!data.blog) {
    throw new Error(`ブログ（slug: ${slug}）が見つかりませんでした`);
  }

  return { ...toBlogPost(data.blog), contentHtml: data.blog.content };
});
