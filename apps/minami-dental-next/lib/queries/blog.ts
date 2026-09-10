import { toPostDate, type PostDate } from "@/lib/dates";
import { graphqlClient } from "@/lib/graphql-client";
import { requireLocalImageSrc, type FeaturedImageNode } from "@/lib/images";

// 11件の投稿だが、管理画面で増やされても取りこぼさないよう多めに取る
const BLOG_FETCH_LIMIT = 100;

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

// hideEmpty：記事が1件も無いカテゴリは返さない。行き先の無いリンクを作らないため。
// 並びはWordPressの既定（名前順）のまま。表示順はFigmaを見るページ実装時に決める
const BLOG_CATEGORIES_QUERY = `
  {
    blogCategories(first: ${BLOG_FETCH_LIMIT}, where: {hideEmpty: true}) {
      nodes {
        name
        slug
      }
    }
  }
`;

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const data = await graphqlClient.request<BlogCategoriesQueryResult>(
    BLOG_CATEGORIES_QUERY
  );

  return data.blogCategories.nodes.map((node) => ({
    name: node.name,
    slug: node.slug,
  }));
}

export function filterBlogByCategory(
  posts: BlogPost[],
  categorySlug: string
): BlogPost[] {
  return posts.filter((post) => post.category?.slug === categorySlug);
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

export async function getBlogPost(slug: string): Promise<BlogPostDetail> {
  const data = await graphqlClient.request<BlogPostQueryResult>(
    BLOG_POST_QUERY,
    { slug }
  );

  if (!data.blog) {
    throw new Error(`ブログ（slug: ${slug}）が見つかりませんでした`);
  }

  return { ...toBlogPost(data.blog), contentHtml: data.blog.content };
}
