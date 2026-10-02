export interface ChatLink {
  label: string;
  href: string;
}

export interface ChatTopic {
  id: string;
  // 選択肢のボタンに出す文言。押すと、そのまま自分の発言として会話に残る
  question: string;
  // 1要素が1段落
  answer: string[];
  links?: ChatLink[];
  // 回答のあとに出す選択肢。全部は出さず、話の流れで絞る
  next: string[];
}

const MORNING_START_HOUR = 5;
const AFTERNOON_START_HOUR = 11;
const EVENING_START_HOUR = 18;

const getTimeGreeting = (hour: number) => {
  if (hour >= EVENING_START_HOUR || hour < MORNING_START_HOUR) return "こんばんは";
  if (hour >= AFTERNOON_START_HOUR) return "こんにちは";
  return "おはようございます";
};

// サイトは静的に書き出すので、時刻はビルド時に固定される。呼ぶ側でブラウザの時刻を渡すこと
export const getGreeting = (hour: number, isReturning: boolean) =>
  `${getTimeGreeting(hour)}。${isReturning ? "おかえりなさい。" : "はじめまして。"}知りたいことを選んでください。`;

// 「はじめに戻る」の返事。挨拶は最初に済ませているので繰り返さない
export const RESTART_REPLY = "知りたいことを選んでください。";

export const RESTART_LABEL = "はじめに戻る";

export const OPEN_SUGGESTIONS_LABEL = "質問を選ぶ";

// 回答の元は各コンポーネントの文言（home / SkillsList / projects / logoWall / contact）。
// 件数は書かない（実績の件数は StatsCounter と projects で別々に持っており、ここでも増やすとずれる）
export const topics: ChatTopic[] = [
  {
    id: "about",
    question: "どんな人ですか？",
    answer: [
      "Hiroyuki Chuman、Web Engineer です。東京を拠点にしています。",
      "「AIを羅針盤に、アイデアに輪郭を与える。」を軸に、デザインの立案から公開・運用まで、一人で責任を持って形にします。",
    ],
    next: ["skills", "projects", "contact"],
  },
  {
    id: "skills",
    question: "何ができますか？",
    answer: [
      "大きく4つあります。",
      "デザイン・サイト制作（Figma からの忠実な再現、ランディングページや企業サイト）。CMS構築（WordPress、ヘッドレスCMS）。AIを使った開発（Claude Code での実装とレビュー）。品質・公開（SEO、表示速度、アクセシビリティ、公開・運用）。",
    ],
    next: ["cms", "ai", "tech"],
  },
  {
    id: "projects",
    question: "制作実績を見たい",
    answer: [
      "飲食店、歯科医院、人材会社、BtoB SaaS、フィットネスジム、アプリなど、さまざまな業種を想定した架空サイトを作っています。",
      "架空サイトですが、ヘッドレスWordPress × Next.js の構成や、Astro で作り込んだランディングページなど、実際の案件を想定した作りです。",
    ],
    links: [{ label: "制作実績を見る", href: "#projects" }],
    next: ["cms", "tech", "contact"],
  },
  {
    id: "cms",
    question: "CMS は作れますか？",
    answer: [
      "WordPress のオリジナルテーマ制作に加え、ヘッドレスCMS（WordPress × Next.js、microCMS × Astro）に対応しています。",
      "お知らせやブログを、管理画面から更新できる仕組みをつくります。",
    ],
    links: [{ label: "制作実績を見る", href: "#projects" }],
    next: ["projects", "ai", "contact"],
  },
  {
    id: "ai",
    question: "AI はどう使っていますか？",
    answer: [
      "Claude Code を使って実装とレビューを進めています。",
      "作業ルールを文書にして、AI でも仕上がりの質がそろう運用にしています。変更のたびに自動チェック（CI）を走らせ、Git / GitHub で変更を管理します。",
    ],
    next: ["tech", "skills", "contact"],
  },
  {
    id: "tech",
    question: "使える技術は？",
    answer: [
      "Astro、React、Next.js、TypeScript、HTML / CSS / JavaScript、Sass、Tailwind CSS、WordPress。",
      "デザインは Figma、開発は Git / GitHub、AI は Claude Code、ChatGPT、Cursor を使っています。",
    ],
    next: ["skills", "projects", "contact"],
  },
  {
    id: "contact",
    question: "連絡したい",
    answer: [
      "コーディングの代行や、Web制作のパートナーとしてのご相談をお待ちしています。",
      "お問い合わせフォームか、メールでご連絡ください。",
    ],
    links: [
      { label: "お問い合わせフォームへ", href: "#contact" },
      { label: "メールで連絡する", href: "mailto:contact@hiroyuki-chuman.com" },
      { label: "GitHub", href: "https://github.com/koenjineer" },
      { label: "Zenn", href: "https://zenn.dev/koenjineer" },
    ],
    next: ["projects", "skills", "about"],
  },
];

// 最初に並べる選択肢
export const ROOT_TOPIC_IDS = ["about", "skills", "projects", "tech", "contact"];
