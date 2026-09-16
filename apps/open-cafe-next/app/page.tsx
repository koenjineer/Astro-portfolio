import { getMenu } from "@/lib/queries/menu";
import { getNewsCategories, getNewsPosts } from "@/lib/queries/news";
import { getProducts } from "@/lib/queries/products";
import { getShops } from "@/lib/queries/shops";
import { getSpecialLunches } from "@/lib/queries/top";

// WordPressとの疎通確認用の仮ページ。TOPページを実装するときに丸ごと置き換える。
// 件数と名前だけを並べ、画像やWordPressのURLは出さない
export default async function Home() {
  const [posts, categories, menu, products, shops, lunches] =
    await Promise.all([
      getNewsPosts(),
      getNewsCategories(),
      getMenu(),
      getProducts(),
      getShops(),
      getSpecialLunches(),
    ]);

  const sections = [
    { heading: "お知らせ", items: posts.map((post) => `${post.displayDate} [${post.category.name}] ${post.title}`) },
    { heading: "お知らせのカテゴリー", items: categories.map((category) => `${category.name}（${category.slug}）`) },
    { heading: "メニュー（料理）", items: menu.dishes.map((dish) => `[${dish.genre.name}] ${dish.title} ${dish.price}円`) },
    { heading: "メニュー（ドリンク）", items: menu.drinkGroups.flatMap((group) => group.drinks.map((drink) => `[${group.genre.name}] ${drink.title} ${drink.price}円`)) },
    { heading: "ジャンル", items: menu.genres.map((genre) => `${genre.name}（${genre.slug}）`) },
    { heading: "ギフト", items: products.map((product) => `${product.title} ${product.price}円`) },
    { heading: "店舗", items: shops.map((shop) => `${shop.title}（${shop.addressLines.join(" ")}）`) },
    { heading: "今月のスペシャルランチ", items: lunches.map((lunch) => lunch.name) },
  ];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">OPEN CAFE（疎通確認用の仮ページ）</h1>
      {sections.map((section) => (
        <section key={section.heading} className="mt-8">
          <h2 className="text-lg font-bold">
            {section.heading}：{section.items.length}件
          </h2>
          <ul className="mt-2 list-disc pl-6">
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
