import Link from "next/link";
import { TriangleRightIcon } from "@/components/icons/SmallIcons";

interface SitemapLink {
  label: string;
  href: string;
}

interface SitemapGroup extends SitemapLink {
  /** 小項目。「診療内容」だけFigmaで2列に分かれているので、列の配列で持つ */
  columns: SitemapLink[][];
}

/**
 * 小項目（「ポリシーと特徴」など）は、飛び先のページが未実装で見出しの位置が決まっていないので、
 * ひとまずページの先頭へリンクする。各ページを実装するときにページ内の見出しへ付け替える。
 * 見出しの文言はFigmaのとおり（ナビは「ホーム」「診療案内」だが、ここは「TOP」「診療内容」）。
 */
const SITEMAP_GROUPS: SitemapGroup[] = [
  { label: "TOP", href: "/", columns: [] },
  {
    label: "当院について",
    href: "/about/",
    columns: [
      [
        { label: "ポリシーと特徴", href: "/about/" },
        { label: "当院の様子", href: "/about/" },
      ],
    ],
  },
  {
    label: "スタッフ紹介",
    href: "/staff/",
    columns: [
      [
        { label: "院長のあいさつ", href: "/staff/" },
        { label: "スタッフ", href: "/staff/" },
        { label: "スタッフブログ", href: "/blog/" },
      ],
    ],
  },
  {
    label: "診療内容",
    href: "/medical/",
    columns: [
      [
        { label: "一般歯科", href: "/medical/" },
        { label: "小児歯科", href: "/medical/" },
        { label: "予防歯科", href: "/medical/" },
      ],
      [
        { label: "入れ歯", href: "/medical/" },
        { label: "矯正歯科", href: "/medical/" },
        { label: "ホワイトニング", href: "/medical/" },
        { label: "口腔外科", href: "/medical/" },
        { label: "レーザー治療", href: "/medical/" },
      ],
    ],
  },
  {
    label: "お問い合わせ",
    href: "/contact/",
    columns: [
      [
        { label: "お問い合わせフォーム", href: "/contact/" },
        { label: "WEB予約", href: "/reservation/" },
      ],
    ],
  },
];

/** フッターのサイトマップ。Figmaにホバーの指定が無いので、色は変えない */
export function FooterSitemap() {
  return (
    <nav aria-label="サイトマップ" className="px-2.5 lg:self-center lg:px-0">
      <ul className="flex flex-col gap-10 lg:flex-row lg:flex-wrap">
        {SITEMAP_GROUPS.map((group) => (
          <li key={group.label} className="flex flex-col gap-[18px]">
            <Link href={group.href} className="text-base/[1.5] font-bold">
              {group.label}
            </Link>
            {group.columns.length > 0 && (
              <div className="flex gap-5">
                {group.columns.map((column) => (
                  <ul key={column[0].label} className="flex flex-col gap-[18px]">
                    {column.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="flex items-center gap-1.5 text-base/[1.5]"
                        >
                          <TriangleRightIcon className="h-3 w-1.5 shrink-0 text-main" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
