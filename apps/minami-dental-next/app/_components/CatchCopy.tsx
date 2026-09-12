const CATCH_COPY_LINES = ["街の皆さまの笑顔を守る", "アットホームな歯医者さん"];

// 文字の下の白い点線（Figma: リピートグリッド）。PCは4pxの点を10px間隔、SPは2pxの点を約6.4px間隔。
// 点の中心を左上に置き、線の左端から点が始まるようにする（既定の中央合わせだと左に半端な余白が出る）
const DOT_LINE_CLASS =
  "[background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_1px)] [background-size:6.4px_2px] lg:[background-image:radial-gradient(circle_at_2px_2px,#fff_2px,transparent_2px)] lg:[background-size:10px_4px]";

/**
 * メインビジュアルの写真に重ねる、ページの大見出し（Figma: top-text / top-text-sp）。
 * 2行それぞれの下に白い点線が入る。点線は飾りなので読み上げの対象から外す
 */
export function CatchCopy() {
  return (
    <h1 className="absolute bottom-[39px] left-5 flex flex-col gap-[10px] font-bold text-white [text-shadow:4px_6px_6px_rgba(0,0,0,0.2)] lg:bottom-[95px] lg:left-[62px] lg:gap-[11px]">
      {CATCH_COPY_LINES.map((line) => (
        // w-fit：点線の長さを文字の幅に合わせる
        <span key={line} className="flex w-fit flex-col gap-px lg:gap-0.5">
          <span className="text-xl/[1.5] tracking-[0.08em] lg:text-[32px]/[1.5]">
            {line}
          </span>
          <span
            aria-hidden="true"
            className={`h-0.5 bg-repeat-x lg:h-1 ${DOT_LINE_CLASS}`}
          />
        </span>
      ))}
    </h1>
  );
}
