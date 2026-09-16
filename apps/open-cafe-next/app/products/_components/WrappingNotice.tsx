import Image from "next/image";

const HEADING_ID = "wrapping-notice-heading";

// 書き出した写真の実寸（Figmaの460×300を2倍。縦並びのタブレット幅で横900px近くまで広がるため）
const IMAGE_WIDTH = 920;
const IMAGE_HEIGHT = 600;

/**
 * ラッピングの案内（Figma: wrapping PC 19719:9454 / SP 19719:9831）。
 * 白地に4pxの枠、その10px内側に1pxの線。SPは縦並び、広い画面では本文と写真を横に並べる。
 *
 * Figmaの枠線は内側に描かれて寸法を増やさないが、CSSの border は増やすので、
 * padding は Figma の値から枠の4pxを引いている（PC 60/79 → 56/75、SP 40 → 36）
 */
export function WrappingNotice() {
  return (
    <section
      aria-labelledby={HEADING_ID}
      className="relative flex flex-col gap-[34px] border-4 border-main bg-white p-9 lg:flex-row lg:items-center lg:gap-[60px] lg:px-14 lg:py-[75px]"
    >
      {/* 内側の線。4pxの枠線の内側から6px（枠の外側から10px）。PCの上下はFigmaが外側から9pxなので5px */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-1.5 border border-main lg:inset-y-[5px]"
      />

      <div className="flex flex-col gap-5 lg:flex-1 lg:gap-9">
        <div className="flex flex-col gap-5">
          <h2
            id={HEADING_ID}
            className="text-base/[1.5] font-bold text-main md:text-2xl/[1.5]"
          >
            ラッピングは無料でお付けいたします。
            {/* PCは文の切れ目で改行（Figma）。SPは幅が狭く、折り返しに任せる */}
            <br className="hidden md:inline" />
            お気軽にご相談ください。
          </h2>
          {/* 点線（Figma: リピートグリッド 18）。点は中央に描かれるので、11px幅のタイルの左の余白4pxぶん位置をずらす。
              SPは端から端まで均等に並べる（space）。タイルの中の余白のぶん左右へ4pxはみ出させて、点を端にそろえる */}
          <div
            aria-hidden="true"
            className="-mx-1 h-[3px] bg-[url(/images/products/dot.svg)] bg-size-[11px_3px] bg-repeat-space lg:mx-0 lg:bg-[position:-4px_0] lg:bg-repeat-x"
          />
        </div>
        <p className="text-sm/[2] md:text-base/[2]">
          大切な方への贈り物に、心を込めたラッピングを。ご希望のイメージや用途に合わせたご提案も可能です。
          <br />
          オンライン注文の際は備考欄にご記入くださいませ。
        </p>
      </div>

      <Image
        src="/images/products/wrapping.webp"
        alt="赤い包装紙と白いリボンでラッピングしたギフトボックス"
        width={IMAGE_WIDTH}
        height={IMAGE_HEIGHT}
        loading="lazy"
        className="aspect-[255/166] w-full object-cover lg:aspect-[460/300] lg:min-w-0 lg:flex-1"
      />
    </section>
  );
}
