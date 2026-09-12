import Link from "next/link";
import { NewsArrowIcon } from "@/components/icons/HomeIcons";
import { NEWS_ROUTES } from "@/app/news/_components/newsConfig";
import type { NewsPost } from "@/lib/queries/news";

// ホバーで矢印を右へ少し動かす（サイト共通の「矢印が少し右に移動」）
const ARROW_MOVE =
  "transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none";

// ホバーで文字が main に変わる
const TEXT_HOVER =
  "transition-colors duration-300 group-hover:text-main group-focus-visible:text-main motion-reduce:transition-none";

interface HomeNewsLinkProps {
  post: NewsPost;
}

/**
 * メインビジュアルの下のお知らせ（Figma: news ＋ news-link-pc / news-link-sp）。
 * 一覧ではなく最新の1件だけを、日付・タイトル・右矢印の1行で見せる
 */
export function HomeNewsLink({ post }: HomeNewsLinkProps) {
  return (
    <section className="flex w-full max-w-[542px] flex-col gap-1.5">
      <div className="flex items-center justify-between pl-3">
        <h2 className="flex items-center gap-4 font-bold">
          <span className="text-xl/[1.5] tracking-[0.08em] lg:tracking-[0.1em]">
            お知らせ
          </span>
          <span className="text-[11px]/[1.5] tracking-[0.1em] text-main uppercase lg:text-xs/[1.5]">
            news
          </span>
        </h2>
        <Link
          href={NEWS_ROUTES.list(1)}
          className="group text-[11px]/[1.5] text-contrast-light underline lg:text-xs/[1.5]"
        >
          <span className={TEXT_HOVER}>過去のお知らせはこちら</span>
        </Link>
      </div>

      <article>
        {/* 行のどこを押しても記事が開くよう、行全体をリンクにする。
            矢印は右端から浮かせる（並びに入れるとタイトルの長さで位置が動くため） */}
        <Link
          href={NEWS_ROUTES.post(post.slug)}
          className="group relative flex items-center gap-[23px] border-t border-b border-contrast py-2.5 pr-[30px] pl-1.5 lg:pr-8 lg:pl-[9px]"
        >
          <time
            dateTime={post.isoDate}
            className={`shrink-0 text-xs/[1.5] ${TEXT_HOVER}`}
          >
            {post.displayDate}
          </time>
          {/* タイトルは1行に収め、あふれたら「…」。行の高さ（41px）を見出しの長さで動かさないため */}
          <h3 className={`truncate text-sm/[1.5] ${TEXT_HOVER}`}>
            {post.title}
          </h3>
          <NewsArrowIcon
            className={`absolute right-1.5 size-[14px] lg:right-[9px] ${ARROW_MOVE}`}
          />
        </Link>
      </article>
    </section>
  );
}
