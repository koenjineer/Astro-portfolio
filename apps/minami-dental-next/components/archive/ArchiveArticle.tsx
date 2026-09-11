import { PenIcon } from "@/components/icons/SmallIcons";
import { ArticleNav } from "./ArticleNav";
import { CategoryTag } from "./CategoryTag";
import type { ArchivePost } from "./types";
import "./entry-content.css";

interface ArchiveArticleProps {
  post: ArchivePost & {
    /** WordPressが組み立て済みの本文HTML */
    contentHtml: string;
  };
  /** 「記事一覧」の行き先 */
  listHref: string;
  /** 1つ古い記事のURL（一番古い記事では渡さない） */
  olderHref?: string;
  /** 1つ新しい記事のURL（一番新しい記事では渡さない） */
  newerHref?: string;
}

/** 記事の詳細（Figma: entry）。記事名がこのページのh1になる */
export function ArchiveArticle({
  post,
  listHref,
  olderHref,
  newerHref,
}: ArchiveArticleProps) {
  return (
    <article className="flex flex-col gap-10">
      <header className="flex flex-col gap-2.5">
        <h1 className="text-xl/[1.5] font-bold tracking-[0.08em] lg:text-[28px]/[1.5]">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
          <p className="flex items-center gap-1.5 text-base/[1.5] text-main">
            <PenIcon className="size-3.5" />
            <time dateTime={post.isoDate}>{post.displayDate}</time>
          </p>
          {post.category && (
            <CategoryTag name={post.category.name} size="article" />
          )}
        </div>
      </header>

      {/* 本文はWordPressが組み立てたHTML。見た目は entry-content.css がタグ名で当てる。
          自分のWordPressからビルド時に取る内容なので、外部からの差し込みは起きない */}
      <div
        className="entry-content"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      {/* Figmaの本文とボタンの間はSP 40px / PC 72px。記事全体の間隔40pxに、PCだけ足りない32pxを足す */}
      <div className="lg:mt-8">
        <ArticleNav
          olderHref={olderHref}
          newerHref={newerHref}
          listHref={listHref}
        />
      </div>
    </article>
  );
}
