const ICON_CLASS = "w-6 h-6 text-[var(--sec)] opacity-70 shrink-0";

// アイコンは Remix Icon の形をそのまま使っている
const CategoryIcons = {
  design: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={ICON_CLASS} aria-hidden="true">
      <path d="M21 3C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H21ZM20 11H4V19H20V11ZM20 5H4V9H20V5ZM11 6V8H9V6H11ZM7 6V8H5V6H7Z"></path>
    </svg>
  ),
  cms: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={ICON_CLASS} aria-hidden="true">
      <path d="M5 12.5C5 12.8134 5.46101 13.3584 6.53047 13.8931C7.91405 14.5849 9.87677 15 12 15C14.1232 15 16.0859 14.5849 17.4695 13.8931C18.539 13.3584 19 12.8134 19 12.5V10.3287C17.35 11.3482 14.8273 12 12 12C9.17273 12 6.64996 11.3482 5 10.3287V12.5ZM19 15.3287C17.35 16.3482 14.8273 17 12 17C9.17273 17 6.64996 16.3482 5 15.3287V17.5C5 17.8134 5.46101 18.3584 6.53047 18.8931C7.91405 19.5849 9.87677 20 12 20C14.1232 20 16.0859 19.5849 17.4695 18.8931C18.539 18.3584 19 17.8134 19 17.5V15.3287ZM3 17.5V7.5C3 5.01472 7.02944 3 12 3C16.9706 3 21 5.01472 21 7.5V17.5C21 19.9853 16.9706 22 12 22C7.02944 22 3 19.9853 3 17.5ZM12 10C14.1232 10 16.0859 9.58492 17.4695 8.89313C18.539 8.3584 19 7.81342 19 7.5C19 7.18658 18.539 6.6416 17.4695 6.10687C16.0859 5.41508 14.1232 5 12 5C9.87677 5 7.91405 5.41508 6.53047 6.10687C5.46101 6.6416 5 7.18658 5 7.5C5 7.81342 5.46101 8.3584 6.53047 8.89313C7.91405 9.58492 9.87677 10 12 10Z"></path>
    </svg>
  ),
  ai: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={ICON_CLASS} aria-hidden="true">
      <path d="M4 5V19H20V5H4ZM3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM7.76777 8.29289L12.5355 13.0607L7.76777 17.8284L6.35355 16.4142L9.70711 13.0607L6.35355 9.70711L7.76777 8.29289ZM12 15H18V17H12V15Z"></path>
    </svg>
  ),
  quality: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={ICON_CLASS} aria-hidden="true">
      <path d="M2 13H8V21H2V13ZM9 3H15V21H9V3ZM16 8H22V21H16V8Z"></path>
    </svg>
  ),
};

const skillCategories: { icon: keyof typeof CategoryIcons; title: string; items: string[] }[] = [
  {
    icon: "design",
    title: "デザイン・サイト制作",
    items: [
      "目的と見る人に合わせたデザインの立案（Figma）",
      "Figma のデザインカンプの忠実な再現（パソコン・スマホ。カンプにない画面幅も判断して組む）",
      "ランディングページ・企業サイトの制作（Astro / HTML・SCSS）",
      "既存サイトの改修",
    ],
  },
  {
    icon: "cms",
    title: "CMS構築",
    items: [
      "WordPress のオリジナルテーマ制作",
      "ヘッドレスCMS（WordPress × Next.js）",
      "ヘッドレスCMS（microCMS × Astro）",
      "お知らせやブログを、管理画面から更新できる仕組みづくり",
    ],
  },
  {
    icon: "ai",
    title: "AIを使った開発",
    items: [
      "Claude Code を使った実装とレビュー",
      "作業ルールを文書にして、AI でも仕上がりの質をそろえる運用",
      "Git / GitHub での変更管理とレビュー",
      "変更のたびに自動チェックを走らせる仕組み（CI）",
    ],
  },
  {
    icon: "quality",
    title: "品質・公開",
    items: [
      "表示速度の改善（画像の軽量化・読み込みの工夫）",
      "スマホで見やすい画面づくり",
      "アクセシビリティ（画像の説明文・キーボード操作・動きを控えたい人への配慮）",
      "お問い合わせフォームの安全対策",
      "ホスティングサービスへの公開と、依存パッケージの更新・脆弱性対応",
    ],
  },
];

// 日本語を文節の途中で折り返さない（auto-phrase は lang="ja" のときに効く）
const SkillsList = () => (
  <div className="text-left pt-3 md:pt-9 [word-break:auto-phrase]">
    <h3 className="text-[var(--white)] text-3xl md:text-4xl font-semibold">できること</h3>
    <p className="mt-4 text-[var(--white-icon)] text-base md:text-lg text-pretty">
      デザインの立案から公開・運用まで、一人で責任を持って形にします。
    </p>
    <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8 md:mt-10">
      {skillCategories.map((category) => (
        <li
          key={category.title}
          className="bg-white rounded-2xl border border-[var(--white-icon-tr)] p-6 md:p-8"
        >
          <div className="flex items-center gap-3">
            {CategoryIcons[category.icon]}
            <h4 className="text-[var(--white)] text-lg font-semibold">{category.title}</h4>
          </div>
          <ul className="mt-4 space-y-2 text-[var(--white-icon)] text-sm leading-relaxed list-disc pl-5 marker:text-[var(--sec)]">
            {category.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  </div>
);

export default SkillsList;
