import Image from "next/image";
import Link from "next/link";
import { CategoryTag } from "@/components/archive/CategoryTag";
import { BLOG_ROUTES } from "@/app/blog/_components/blogConfig";
import type { BlogPost } from "@/lib/queries/blog";

// next/image に渡す寸法は、一番大きく表示されるPCのサムネイル枠（300×188）に合わせる
const THUMBNAIL_WIDTH = 300;
const THUMBNAIL_HEIGHT = 188;

interface TopBlogCardProps {
  post: BlogPost;
}

/**
 * ホームのブログカード。PCは白いカードの縦組み（Figma: top-blog-card-pc 300×317）、
 * SPは一覧ページと同じ横組み（Figma: blog-card-sp 335×101）で、形そのものが変わる。
 * 一覧・サイドバーの ArchiveCard は「横組み1つの形で寸法だけ差し替える」作りなので、
 * PCの縦組み（札が写真に重なる・白いカードと影・3行で省略）はそちらには足さず、ホーム専用にした。
 *
 * ホバーは一覧のカードと同じ：文字が main に、サムネイルが1.1倍
 */
export function TopBlogCard({ post }: TopBlogCardProps) {
  return (
    <article>
      {/* カードのどこを押しても記事が開くよう、カード全体をリンクにする */}
      <Link
        href={BLOG_ROUTES.post(post.slug)}
        className="group flex items-center gap-2.5 lg:flex-col lg:items-stretch lg:gap-0 lg:overflow-hidden lg:rounded-[20px] lg:bg-white lg:px-6 lg:pb-3 lg:shadow-default"
      >
        {/* 拡大したサムネイルが枠からはみ出さないよう、外側で切り抜く。
            PCは写真だけカードの左右の余白（24px）の外まで広げて、カードの幅いっぱいに敷く */}
        <div className="h-[101px] w-[133px] shrink-0 overflow-hidden lg:-mx-6 lg:h-[188px] lg:w-[300px]">
          {/* タイトルがすぐ隣にあり、サムネイル自体は情報を足さないのでaltは空にする */}
          <Image
            src={post.thumbnailSrc}
            alt=""
            width={THUMBNAIL_WIDTH}
            height={THUMBNAIL_HEIGHT}
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none"
          />
        </div>

        {/* PCは札を写真の下端に14px重ねる */}
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5 lg:-mt-3.5 lg:w-full lg:flex-none lg:gap-[7px]">
          {post.category && <CategoryTag name={post.category.name} size="card" />}
          {/* Figmaはタイトル欄の高さが決まっていて、あふれた分は「…」。
              短いタイトルでも日付の位置が揃うよう、SPは2行分・PCは3行分の高さを確保する */}
          <h3 className="line-clamp-2 min-h-[3em] w-full text-sm/[1.5] transition-colors duration-300 group-hover:text-main group-focus-visible:text-main motion-reduce:transition-none lg:line-clamp-3 lg:min-h-[4.5em] lg:text-base/[1.5]">
            {post.title}
          </h3>
          <time
            dateTime={post.isoDate}
            className="text-[11px]/[1.5] text-contrast-light"
          >
            {post.displayDate}
          </time>
        </div>
      </Link>
    </article>
  );
}
