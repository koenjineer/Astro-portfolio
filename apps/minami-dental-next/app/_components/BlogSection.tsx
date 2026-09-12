import { SectionHeading } from "@/components/heading/SectionHeading";
import { ContentWidth } from "@/components/layout/ContentWidth";
import { BLOG_ROUTES } from "@/app/blog/_components/blogConfig";
import type { BlogPost } from "@/lib/queries/blog";
import { TopBlogCard } from "./TopBlogCard";
import { UtilityButton } from "./UtilityButton";

interface BlogSectionProps {
  posts: BlogPost[];
}

/** ホームのスタッフブログ（Figma: blog）。新着6件とブログ一覧へのボタン */
export function BlogSection({ posts }: BlogSectionProps) {
  return (
    <section className="py-[100px] lg:py-[120px]">
      <ContentWidth>
        <div className="flex flex-col gap-10 lg:gap-[60px]">
          <SectionHeading>スタッフブログ</SectionHeading>

          {/* PCは 300px×3、間は横50px・縦60px */}
          <ul className="grid gap-5 lg:grid-cols-3 lg:gap-x-[50px] lg:gap-y-[60px]">
            {posts.map((post) => (
              <li key={post.slug}>
                <TopBlogCard post={post} />
              </li>
            ))}
          </ul>

          <div className="flex justify-center">
            <UtilityButton href={BLOG_ROUTES.list(1)}>
              スタッフブログ一覧はこちら
            </UtilityButton>
          </div>
        </div>
      </ContentWidth>
    </section>
  );
}
