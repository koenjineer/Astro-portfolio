import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
}

// header/breadcrumb/lower-mainvisualは仮実装（本格的な共通レイアウト実装は別タスク）
const NAV_ITEMS: NavItem[] = [
  { label: "トップ", href: "/" },
  { label: "当社について", href: "#" },
  { label: "サービス", href: "/service" },
  { label: "導入事例", href: "#" },
  { label: "お知らせ", href: "#" },
];

export function ServiceHero() {
  return (
    <>
      <header className="flex items-center justify-between gap-4 border-b border-contrast-light/20 px-5 py-4 lg:px-8">
        <p className="font-fira-sans text-2xl text-main italic lg:text-4xl">
          Global standard
        </p>
        <nav aria-label="グローバルナビゲーション" className="hidden lg:block">
          <ul className="flex items-center gap-4 text-sm font-medium text-contrast">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="relative flex h-[180px] items-center bg-main px-5 lg:h-[250px] lg:px-[90px]">
        <div className="flex flex-col gap-2">
          <p className="font-fira-sans text-3xl text-white italic lg:text-6xl">
            SERVICE
          </p>
          <p className="text-lg font-bold text-white lg:text-xl">サービス</p>
        </div>
      </div>

      <nav aria-label="パンくずリスト" className="px-5 py-2 lg:px-[90px]">
        <ol className="flex items-center gap-2 text-xs text-contrast-light">
          <li>
            <Link href="/">トップ</Link>
          </li>
          <li aria-hidden="true">＞</li>
          <li className="text-contrast" aria-current="page">
            サービス
          </li>
        </ol>
      </nav>
    </>
  );
}
