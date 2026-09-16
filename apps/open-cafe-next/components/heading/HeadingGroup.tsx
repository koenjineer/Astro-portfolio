interface HeadingGroupProps {
  /** 英字の見出し。CSSで大文字にするのでFigmaの原稿どおり小文字で渡す */
  en: string;
  /** 英字の下の日本語 */
  ja: string;
}

/**
 * 英字＋日本語のセクション見出し（Figma: heading-group-pc / heading-group-sp）。
 * 1つの見出しとして読み上げさせるため、2行とも h2 の中に入れる。
 * 行の高さは各行に文字サイズと一緒に書く。親の h2 に leading-[1.5] を付けても、
 * 子の text-xs 等が自分の行の高さで打ち消す（Tailwind v4 の --tw-leading は子へ引き継がれない。/rules/tailwind.md）
 */
export function HeadingGroup({ en, ja }: HeadingGroupProps) {
  return (
    <h2 className="flex flex-col items-center text-center text-contrast">
      <span className="font-amatic text-[40px]/[1.5] font-bold tracking-[0.1em] uppercase md:text-[52px]/[1.5] md:tracking-[0.2em]">
        {en}
      </span>
      {/* 見えない読点で区切り、「access、アクセス」と読ませる（無いと「accessアクセス」とくっつく） */}
      <span className="sr-only">、</span>
      <span className="text-xs/[1.5] font-bold md:text-sm/[1.5]">{ja}</span>
    </h2>
  );
}
