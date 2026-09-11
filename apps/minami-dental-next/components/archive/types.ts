import type { PostDate } from "@/lib/dates";

export interface ArchiveCategory {
  name: string;
  slug: string;
}

/**
 * 一覧・サイドバーに並べる記事の形。お知らせ（NewsPost）とブログ（BlogPost）のどちらもこの形を満たすので、
 * 部品の側はどちらの記事かを知らなくてよい
 */
export interface ArchivePost extends PostDate {
  title: string;
  slug: string;
  /** 未分類の記事もありうるのでnullを許す */
  category: ArchiveCategory | null;
  thumbnailSrc: string;
}

/** 記事・一覧のURLの作り方。お知らせ（/news）とブログ（/blog）で行き先の根元が違うので使う側から渡す */
export interface ArchiveRoutes {
  post: (slug: string) => string;
  /** `page` は1始まり。カテゴリ別の一覧なら `categorySlug` を渡す */
  list: (page: number, categorySlug?: string) => string;
}
