/**
 * 使う場所ごとの大きさ（Figmaの tag）。
 * - article：記事の見出しの下（PC・SPとも大）
 * - card：一覧のカード（SPは小・PCは大）
 * - sidebar：サイドバーの新着記事（PC・SPとも小）
 */
const SIZE_CLASSES = {
  article: "px-3 py-1.5 text-[11px]/[1.5]",
  card: "px-2 py-0.5 text-[10px]/[1.5] lg:px-3 lg:py-1.5 lg:text-[11px]/[1.5]",
  sidebar: "px-2 py-0.5 text-[10px]/[1.5]",
} as const;

interface CategoryTagProps {
  name: string;
  size: keyof typeof SIZE_CLASSES;
}

/** 青い丸のカテゴリ札。カード全体がリンクなので、札そのものはリンクにしない */
export function CategoryTag({ name, size }: CategoryTagProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full bg-main whitespace-nowrap text-white ${SIZE_CLASSES[size]}`}
    >
      {name}
    </span>
  );
}
