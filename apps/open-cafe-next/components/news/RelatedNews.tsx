import { newsPostHref } from "@/lib/newsRoutes";
import type { NewsPost } from "@/lib/queries/news";
import { NewsCard } from "./NewsCard";

interface RelatedNewsProps {
  /** 同じカテゴリーの新しい順（`getRelatedNewsPosts` の戻り値）。0件なら節ごと出さない */
  posts: NewsPost[];
}

/**
 * 記事の下の「関連記事」（Figma: related 19719:5661）。
 * カードはPCで202px幅の2列。SPは一覧と同じく全幅の2列にする（Figmaは375px幅で158px×2＝画面いっぱい）
 */
export function RelatedNews({ posts }: RelatedNewsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-10 md:gap-[60px]">
      <h2 className="text-center text-xl/[1.5] font-bold text-main md:text-[28px]/[1.5]">
        関連記事
      </h2>
      <ul className="grid grid-cols-2 gap-x-[19px] gap-y-6 md:grid-cols-[repeat(2,202px)] md:gap-10">
        {posts.map((post) => (
          <li key={post.slug}>
            <NewsCard
              post={post}
              href={newsPostHref(post.slug)}
              variant="grid"
              titleAs="h3"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
