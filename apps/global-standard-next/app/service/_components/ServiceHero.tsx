import Image from "next/image";
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
        <div className="hidden items-center gap-8 lg:flex">
          <nav aria-label="グローバルナビゲーション">
            <ul className="flex items-center gap-4 text-sm font-medium text-contrast">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 遷移先ページ未実装のため#（本格的な共通レイアウト実装は別タスク） */}
          <div className="flex">
            <a
              href="#"
              className="flex h-[68px] w-[176px] items-center justify-center border border-main bg-white text-sm font-medium text-main"
            >
              資料ダウンロード
            </a>
            <a
              href="#"
              className="flex h-[68px] w-[176px] items-center justify-center bg-main text-sm font-medium text-white"
            >
              お問い合わせ
            </a>
          </div>
        </div>
      </header>

      <div className="relative h-[250px] overflow-hidden bg-main">
        <Image
          src="/images/service/hero-sp.webp"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover lg:hidden"
        />
        <Image
          src="/images/service/hero-pc.webp"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="hidden object-cover lg:block"
        />

        {/* Figmaの"filter"レイヤー：写真全体にかかる薄い黒フィルター */}
        <div className="absolute inset-0 bg-black/20" aria-hidden="true" />

        {/* Figmaの"lower-mv-decoration"：三角(台形)にマスクされた紺色オーバーレイ */}
        <div
          className="absolute inset-y-0 left-0 w-[44.17%] lg:w-[28.57%]"
          aria-hidden="true"
        >
          <Image
            src="/images/service/hero-decoration-sp.svg"
            alt=""
            fill
            className="object-fill lg:hidden"
          />
          <Image
            src="/images/service/hero-decoration-pc.svg"
            alt=""
            fill
            className="hidden object-fill lg:block"
          />
        </div>

        <div className="absolute top-1/2 left-[5.33%] flex -translate-y-1/2 flex-col gap-2 lg:left-[17.19%]">
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
