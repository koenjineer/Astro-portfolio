import Link from "next/link";

interface BreadcrumbItem {
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
      <ol className="flex items-center gap-2 text-xs text-contrast-light">
        {trail.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden="true">＞</span>}
            {item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span className="text-contrast" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
