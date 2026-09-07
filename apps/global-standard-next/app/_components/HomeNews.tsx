import type { NewsPost } from "@/lib/queries/news";
import { HomeNewsRow } from "./HomeNewsRow";
import { SectionHeading } from "./SectionHeading";
import { ViewMoreLink } from "./ViewMoreLink";

// ABOUT US・SERVICEと同じ17.57%の傾きの平行四辺形
const DIAGONAL_BACKGROUND_CLIP_PATH =
  "polygon(0 0, 100% 17.57vw, 100% 100%, 0 calc(100% - 17.57vw))";

interface HomeNewsProps {
  posts: NewsPost[];
}

export function HomeNews({ posts }: HomeNewsProps) {
  return (
    <section
      aria-labelledby="home-news-heading"
      className="relative isolate px-5 pt-[60px] pb-[187px] lg:px-[90px] lg:pt-[165px] lg:pb-40"
    >
      <div
        aria-hidden="true"
        style={{ clipPath: DIAGONAL_BACKGROUND_CLIP_PATH }}
        className="absolute inset-x-0 bottom-[100px] -z-10 h-[calc(514px+17.57vw)] bg-main-light lg:-bottom-[89px] lg:h-[calc(415px+17.57vw)]"
      />

      <div className="relative mx-auto flex w-full max-w-[1100px] flex-col">
        <SectionHeading
          id="home-news-heading"
          english="NEWS"
          japanese="お知らせ"
        />

        {/* 高さはFigmaどおり固定せず行の中身で決める（お知らせ一覧の行と同じ考え方） */}
        <ul className="mt-[60px] w-full bg-white px-5 py-10 shadow-[0px_3px_6px_0px_rgba(0,0,0,0.16)] lg:mt-20 lg:w-[768px] lg:self-center lg:px-10 lg:pt-[60px] lg:pb-10">
          {posts.map((post) => (
            <HomeNewsRow key={post.slug} post={post} />
          ))}
        </ul>

        <ViewMoreLink
          href="/news"
          variant="dark"
          label="お知らせのページへ"
          className="mt-8 self-end lg:absolute lg:top-[49px] lg:right-0 lg:mt-0"
        />
      </div>
    </section>
  );
}
