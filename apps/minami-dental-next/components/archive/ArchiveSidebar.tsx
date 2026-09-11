import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ChevronRightIcon,
  FileIcon,
  FolderIcon,
  HospitalIcon,
} from "@/components/icons/SidebarIcons";
import { TriangleRightIcon } from "@/components/icons/SmallIcons";
import { CLINIC_NAME } from "@/lib/clinic";
import { ArchiveCard } from "./ArchiveCard";
import type { ArchiveCategory, ArchivePost, ArchiveRoutes } from "./types";

/** Figmaのサイドバー「新着記事」は4件 */
const LATEST_POST_COUNT = 4;

// 診察室の写真。元画像（1920×1280）を、SPのFigmaの幅335pxの2倍＝670px幅に縮めて書き出した
const CLINIC_PHOTO_SRC = "/images/archive/sidebar-clinic.webp";
const CLINIC_PHOTO_WIDTH = 670;
const CLINIC_PHOTO_HEIGHT = 447;

// Figmaの原稿のうち、誤字の「貢献しきたい」だけサイト側で「貢献していきたい」に直している（ユーザー決定）
const CLINIC_DESCRIPTION =
  "お子様からご高齢の方まで、快適な空間で治療が受けられる場を作り、地域医療に貢献していきたいと考えております。";

// ホバーで右へ少し動かす矢印（サイト共通の「矢印が少し右に移動」）
const ARROW_MOVE =
  "transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none";

interface SidebarSectionProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

/** 見出し（アイコン＋文字＋下線。Figma: side-title）と中身の組 */
function SidebarSection({ icon, title, children }: SidebarSectionProps) {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="flex items-center gap-2.5 border-b border-contrast pb-2 text-base/[1.5] font-bold">
        {/* アイコンは形ごとに大きさが違うので、Figmaと同じ24px四方の枠の中央に置く */}
        <span className="flex size-6 shrink-0 items-center justify-center">
          {icon}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

interface ArchiveSidebarProps {
  /** 新しい順の全記事。先頭の4件を「新着記事」に出す */
  posts: ArchivePost[];
  categories: ArchiveCategory[];
  routes: ArchiveRoutes;
  /** カテゴリー別ページで、今見ているカテゴリーを現在地として示す */
  currentCategorySlug?: string;
}

/** お知らせ・ブログのサイドバー（Figma: sidebar-pc / sidebar-sp） */
export function ArchiveSidebar({
  posts,
  categories,
  routes,
  currentCategorySlug,
}: ArchiveSidebarProps) {
  const latestPosts = posts.slice(0, LATEST_POST_COUNT);

  return (
    <aside className="flex flex-col gap-[60px] lg:w-[300px] lg:shrink-0">
      {/* アイコンの大きさはSVGの width/height 属性（Figmaの寸法）で決まるので、クラスでは指定しない */}
      <SidebarSection icon={<HospitalIcon />} title="クリニックの紹介">
        <div className="flex flex-col gap-5">
          <Image
            src={CLINIC_PHOTO_SRC}
            alt={`${CLINIC_NAME}の診察室`}
            width={CLINIC_PHOTO_WIDTH}
            height={CLINIC_PHOTO_HEIGHT}
            loading="lazy"
            className="aspect-[300/188] w-full object-cover"
          />
          <div className="flex flex-col gap-2.5">
            <p className="text-base/[1.5] font-bold">{CLINIC_NAME}</p>
            <p className="text-sm/[1.7]">{CLINIC_DESCRIPTION}</p>
            <Link
              href="/about/"
              className="group flex w-fit items-center text-sm/[1.5] text-main"
            >
              当院について
              {/* shrink-0：リンクの幅（w-fit）の中で矢印が押し縮められないようにする */}
              <ChevronRightIcon className={`shrink-0 ${ARROW_MOVE}`} />
            </Link>
          </div>
        </div>
      </SidebarSection>

      <SidebarSection icon={<FileIcon />} title="新着記事">
        <ul className="flex flex-col gap-5">
          {latestPosts.map((post) => (
            <li key={post.slug}>
              <ArchiveCard
                post={post}
                href={routes.post(post.slug)}
                variant="sidebar"
                titleAs="h3"
              />
            </li>
          ))}
        </ul>
      </SidebarSection>

      <SidebarSection icon={<FolderIcon />} title="カテゴリー">
        <ul className="flex flex-col gap-3 pl-5">
          {categories.map((category) => {
            const isCurrent = category.slug === currentCategorySlug;

            return (
              <li key={category.slug}>
                {/* 現在地はホバーと同じ見た目にし、読み上げには aria-current で伝える（グローバルナビと同じ考え方） */}
                <Link
                  href={routes.list(1, category.slug)}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`group flex w-fit items-center gap-1.5 text-base/[1.5] transition-colors duration-300 hover:text-main focus-visible:text-main motion-reduce:transition-none ${isCurrent ? "text-main" : ""}`}
                >
                  <TriangleRightIcon className={`shrink-0 text-main ${ARROW_MOVE}`} />
                  {category.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </SidebarSection>
    </aside>
  );
}
