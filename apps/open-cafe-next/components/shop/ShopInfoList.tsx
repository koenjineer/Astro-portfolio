import type { ShopInfoRow } from "@/lib/site";

interface ShopInfoListProps {
  /** 並びはSPの縦1列の順（住所・TEL・Mail・営業時間・定休日・座席）。行が減るとPCの左右の対応が崩れるので、未入力でも6行そのまま渡す */
  rows: ShopInfoRow[];
}

/**
 * 住所・TEL・営業時間などの一覧（Figma: shop-info-pc / shop-info-sp）。
 * フッターのアクセスと店舗情報ページで同じ寸法・同じ順序なので共有している。
 * PCの2列（左：住所・TEL・Mail／右：営業時間・定休日・座席）は、6行を列方向に3行ずつ流して作る
 */
export function ShopInfoList({ rows }: ShopInfoListProps) {
  return (
    <dl className="grid gap-[18px] text-sm/[1.5] font-bold text-contrast md:grid-flow-col md:grid-cols-2 md:grid-rows-[repeat(3,auto)] md:gap-x-10 md:gap-y-5">
      {rows.map((row) => (
        // 下余白は5px：Figmaの下線は内側の線で高さを増やさないが、CSSの border は1px足すため。
        // 6pxのままだと1行ごとに1px高くなり、PCで3px・SPで6pxフッターが高くなった
        <div
          key={row.label}
          className="flex gap-6 border-b border-contrast pb-[5px]"
        >
          <dt className="w-14 shrink-0">{row.label}</dt>
          <dd>
            {row.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
