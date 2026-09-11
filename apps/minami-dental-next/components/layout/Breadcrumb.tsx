import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  /** 省略した項目は現在地として扱い、リンクにしない */
  href?: string;
}

interface BreadcrumbProps {
  /** 「ホーム」の後ろに続く項目。先頭の「ホーム」はこの部品が自分で付ける */
  items: BreadcrumbItem[];
}

const HOME_ITEM: BreadcrumbItem = { label: "ホーム", href: "/" };

/** Figma: breadcrumb-pc / breadcrumb-sp。Figmaにホバーの指定が無いので、色は変えない */
export function Breadcrumb({ items }: BreadcrumbProps) {
  const trail = [HOME_ITEM, ...items];

  return (
    // Figmaは左右90px（1280px幅で中身1100px）。余白を固定せず、幅の上限で中央に置く
    <nav aria-label="パンくずリスト" className="px-5 pt-3">
      {/* 1行に収める。SPで長い現在地は末尾を「…」で省く */}
      <ol className="mx-auto flex max-w-[1100px] items-center gap-2 overflow-hidden text-xs/[1.5] whitespace-nowrap">
        {trail.map((item, index) => (
          <li
            key={item.label}
            // 縮むのは現在地だけ。途中のリンクは全部読めるようにする
            className={`flex items-center gap-2 ${item.href ? "shrink-0" : "min-w-0"}`}
          >
            {index > 0 && <span aria-hidden="true">＞</span>}
            {item.href ? (
              <Link href={item.href} className="text-contrast-light">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="truncate">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
