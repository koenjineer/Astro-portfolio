import Image from "next/image";
import type { NewsPostDetail } from "@/lib/queries/news";
import { ArticleNav } from "./ArticleNav";
import { NEWS_IMAGE_HEIGHT, NEWS_IMAGE_WIDTH } from "./newsImage";
import "./entry-content.css";

interface NewsArticleProps {
  post: NewsPostDetail;
  /** 「記事一覧」の行き先 */
  listHref: string;
  /** 1つ古い記事のURL（いちばん古い記事では渡さない） */
  olderHref?: string;
  /** 1つ新しい記事のURL（いちばん新しい記事では渡さない） */
  newerHref?: string;
}

/** 記事の詳細（Figma: entry 19716:4823 / 19719:5769）。記事名がこのページのh1になる */
export function NewsArticle({
  post,
  listHref,
  olderHref,
  newerHref,
}: NewsArticleProps) {
  return (
    <article className="flex flex-col gap-10">
      <header className="flex flex-col gap-5">
        <Image
          src={post.thumbnailSrc}
          // WPから来る写真は飾り扱い（/rules/headless-wordpress.md）。記事名は直下のh1が伝える
          alt=""
          width={NEWS_IMAGE_WIDTH}
          height={NEWS_IMAGE_HEIGHT}
          loading="eager"
          fetchPriority="high"
          // 縦横比はFigmaの枠で持つ（SP 335×176 / PC 688×361）
          className="aspect-[335/176] w-full object-cover md:aspect-[688/361]"
        />
        <h1 className="text-xl/[1.5] font-bold text-main md:text-[28px]/[1.5]">
          {post.title}
        </h1>
        <p className="flex items-center gap-5 text-sm/[1.5] font-bold text-main">
          <time dateTime={post.isoDate}>{post.displayDate}</time>
          <span aria-hidden="true" className="h-[18px] w-px shrink-0 bg-main" />
          {post.category.name}
        </p>
      </header>

      {/* 本文はWordPressが組み立てたHTML。見た目は entry-content.css がタグ名で当てる。
          自分のWordPressからビルド時に取る内容なので、外部からの差し込みは起きない */}
      <div
        className="entry-content"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      <ArticleNav
        olderHref={olderHref}
        newerHref={newerHref}
        listHref={listHref}
      />
    </article>
  );
}
