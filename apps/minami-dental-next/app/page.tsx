import type { ReactNode } from "react";
import { getBlogPosts } from "@/lib/queries/blog";
import { getMedicals } from "@/lib/queries/medical";
import { getNewsPosts } from "@/lib/queries/news";
import { getStaffMembers } from "@/lib/queries/staff";

// WordPressとの疎通確認用の仮ページ。ホームのデザインを実装するときに丸ごと置き換える

/** 各種類から並べる件数。取れているかを見るだけなので少しでよい */
const PREVIEW_COUNT = 3;

// 画像の元の寸法（縦横比をブラウザに伝えるため）。WPから書き出した画像の実寸
const BLOG_IMAGE_WIDTH = 1800;
const BLOG_IMAGE_HEIGHT = 945;
const MEDICAL_IMAGE_WIDTH = 630;
const MEDICAL_IMAGE_HEIGHT = 473;
const STAFF_IMAGE_SIZE = 420;

interface PreviewSectionProps {
  heading: string;
  count: number;
  children: ReactNode;
}

function PreviewSection({ heading, count, children }: PreviewSectionProps) {
  return (
    <section className="border-t border-gray-300 pt-6">
      <h2 className="text-xl font-bold">
        {heading}（<span data-testid="count">{count}</span>件）
      </h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-3">{children}</ul>
    </section>
  );
}

export default async function HomePage() {
  const [newsPosts, blogPosts, medicals, staffMembers] = await Promise.all([
    getNewsPosts(),
    getBlogPosts(),
    getMedicals(),
    getStaffMembers(),
  ]);

  return (
    <main className="mx-auto w-full max-w-5xl space-y-10 px-4 py-10">
      <h1 className="text-2xl font-bold">みなみ歯科（WordPress疎通確認）</h1>

      {/* お知らせは全件アイキャッチ無しで、代わりの画像もまだ無いため画像は出さない */}
      <PreviewSection heading="お知らせ" count={newsPosts.length}>
        {newsPosts.slice(0, PREVIEW_COUNT).map((post) => (
          <li key={post.slug}>
            <article>
              <h3 className="font-bold">{post.title}</h3>
              <p className="text-sm">
                <time dateTime={post.isoDate}>{post.displayDate}</time>
                {post.category && ` / ${post.category.name}`}
              </p>
            </article>
          </li>
        ))}
      </PreviewSection>

      <PreviewSection heading="スタッフブログ" count={blogPosts.length}>
        {blogPosts.slice(0, PREVIEW_COUNT).map((post) => (
          <li key={post.slug}>
            <article>
              {/* eslint-disable-next-line @next/next/no-img-element -- 静的書き出しで最適化が効かないため素のimgで足りる */}
              <img
                src={post.thumbnailSrc}
                alt=""
                width={BLOG_IMAGE_WIDTH}
                height={BLOG_IMAGE_HEIGHT}
                loading="lazy"
                className="h-auto w-full"
              />
              <h3 className="mt-2 font-bold">{post.title}</h3>
              <p className="text-sm">
                <time dateTime={post.isoDate}>{post.displayDate}</time>
                {post.category && ` / ${post.category.name}`}
              </p>
            </article>
          </li>
        ))}
      </PreviewSection>

      <PreviewSection heading="診療案内" count={medicals.length}>
        {medicals.slice(0, PREVIEW_COUNT).map((medical) => (
          <li key={medical.slug}>
            <article>
              {/* eslint-disable-next-line @next/next/no-img-element -- 静的書き出しで最適化が効かないため素のimgで足りる */}
              <img
                src={medical.imageSrc}
                alt=""
                width={MEDICAL_IMAGE_WIDTH}
                height={MEDICAL_IMAGE_HEIGHT}
                loading="lazy"
                className="h-auto w-full"
              />
              <h3 className="mt-2 font-bold">{medical.title}</h3>
              <p className="text-sm">{medical.type.name}</p>
            </article>
          </li>
        ))}
      </PreviewSection>

      <PreviewSection heading="スタッフ" count={staffMembers.length}>
        {staffMembers.slice(0, PREVIEW_COUNT).map((member) => (
          <li key={member.slug}>
            <article>
              {/* eslint-disable-next-line @next/next/no-img-element -- 静的書き出しで最適化が効かないため素のimgで足りる */}
              <img
                src={member.imageSrc}
                alt={member.name}
                width={STAFF_IMAGE_SIZE}
                height={STAFF_IMAGE_SIZE}
                loading="lazy"
                className="h-auto w-full"
              />
              <h3 className="mt-2 font-bold">{member.name}</h3>
              <p className="text-sm">{member.job.name}</p>
            </article>
          </li>
        ))}
      </PreviewSection>
    </main>
  );
}
