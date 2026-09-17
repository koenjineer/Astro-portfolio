import Image from "next/image";
import { HeadingGroup } from "@/components/heading/HeadingGroup";
import { NewsCard } from "@/components/news/NewsCard";
import { Button } from "@/components/ui/Button";
import { newsListHref, newsPostHref } from "@/lib/newsRoutes";
import type { NewsPost } from "@/lib/queries/news";

interface NewsSectionProps {
  /** 新しい順の5件。先頭が大きいカード、残り4件が小さいカード */
  posts: NewsPost[];
}

/**
 * NEWS（Figma: PC news 19709:8726 / SP news 19710:3921）。
 *
 * - 〜lg：大きいカードの下に小さいカード2列（SP 158px・横19px・縦20px）
 * - lg〜：左に大きいカード（PC 510px）、右に小さいカード2×2（PC 265px・間30px）。
 *   1024〜1279pxは 510:560 の比率のまま縮める
 */
export function NewsSection({ posts }: NewsSectionProps) {
  const [largePost, ...smallPosts] = posts;

  return (
    <section
      aria-labelledby="top-news-heading"
      className="relative px-5 pt-[60px] pb-[180px] xl:py-20"
    >
      {/* お皿：左上から画面の外へはみ出す（Figmaでは左右反転） */}
      <Image
        src="/images/home/plate.webp"
        alt=""
        aria-hidden="true"
        width={531}
        height={480}
        loading="lazy"
        className="pointer-events-none absolute -top-10 -left-[70px] h-auto w-[204px] -scale-x-100 xl:-top-[140px] xl:-left-[87px] xl:w-[354px]"
      />

      <div className="relative mx-auto flex max-w-[1100px] flex-col items-center gap-10 xl:gap-[60px]">
        <div id="top-news-heading" className="w-full">
          <HeadingGroup en="news" ja="お知らせ" />
        </div>

        <div className="flex w-full flex-col gap-5 lg:flex-row lg:items-start lg:gap-[30px]">
          {largePost && (
            <div className="lg:flex-[510]">
              <NewsCard post={largePost} href={newsPostHref(largePost.slug)} variant="large" titleAs="h3" />
            </div>
          )}
          <ul className="grid grid-cols-2 gap-x-[19px] gap-y-5 lg:flex-[560] lg:gap-[30px]">
            {smallPosts.map((post) => (
              <li key={post.slug}>
                <NewsCard post={post} href={newsPostHref(post.slug)} variant="grid" titleAs="h3" />
              </li>
            ))}
          </ul>
        </div>

        <Button href={newsListHref()}>過去のお知らせ</Button>
      </div>
    </section>
  );
}
