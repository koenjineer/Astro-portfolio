import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  /** 省略した項目は現在地として扱い、リンクにしない */
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const HOME_ITEM: BreadcrumbItem = { label: "トップ", href: "/" };

export function Breadcrumb({ items }: BreadcrumbProps) {
  const trail = [HOME_ITEM, ...items];

  return (
    <nav aria-label="パンくずリスト" className="px-5 py-2 lg:px-[90px]">
      {/* 1行に収める。記事タイトルのように長い現在地は末尾を「…」で省く */}
      <ol className="flex items-center gap-2 overflow-hidden text-xs whitespace-nowrap text-contrast-light">
        {trail.map((item, index) => (
          <li
            key={item.label}
            // 縮むのは現在地だけ。途中のリンクは全部読めるようにする
            className={`flex items-center gap-2 ${item.href ? "shrink-0" : "min-w-0"}`}
          >
            {index > 0 && <span aria-hidden="true">＞</span>}
            {item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span className="truncate text-contrast" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
