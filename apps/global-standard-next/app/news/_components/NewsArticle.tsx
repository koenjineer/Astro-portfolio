import Image from "next/image";
import type { AdjacentNewsPosts, NewsPostDetail } from "@/lib/queries/news";
import "./entry-content.css";
import { NewsArticleNav } from "./NewsArticleNav";

/** サムネイルの原寸。`public/images/news/` の画像はすべてこの比率で用意されている */
const THUMBNAIL_WIDTH = 1200;
const THUMBNAIL_HEIGHT = 630;

interface NewsArticleProps {
  post: NewsPostDetail;
  adjacent: AdjacentNewsPosts;
}

export function NewsArticle({ post, adjacent }: NewsArticleProps) {
  return (
    <article>
      <header className="flex flex-col gap-6">
        <div className="flex flex-col gap-5 lg:gap-6">
          <div className="flex items-center justify-between gap-2">
            {post.category && (
              <span className="shrink-0 border border-accent-2 px-6 py-2 text-sm text-accent-2">
                {post.category.name}
              </span>
            )}
            {/* ml-auto：カテゴリ未設定の記事でも日付を右端に置く */}
            <time
              dateTime={post.isoDate}
              className="ml-auto shrink-0 text-sm text-contrast-light"
            >
              {post.displayDate}
            </time>
          </div>

          <h1 className="text-xl leading-7 font-bold text-contrast lg:text-2xl lg:leading-[1.2]">
            {post.title}
          </h1>
        </div>

        {/* 見出しのすぐ下にある飾りの写真で、記事の内容を説明していないためaltは空にする */}
        <Image
          src={post.thumbnailSrc}
          alt=""
          width={THUMBNAIL_WIDTH}
          height={THUMBNAIL_HEIGHT}
          priority
          className="w-full object-cover"
        />
      </header>

      {/* 本文はWordPressが組み立てたHTML。見た目は entry-content.css がタグ名で当てる。
          自分のWordPressからビルド時に取る内容なので、外部からの差し込みは起きない */}
      <div
        className="entry-content mt-5 lg:mt-10"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      <NewsArticleNav older={adjacent.older} newer={adjacent.newer} />
    </article>
  );
}
