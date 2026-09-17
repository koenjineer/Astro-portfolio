import Image from "next/image";

/*
 * コンセプトの3段の写真の組み（Figma: section__images）。組み方が段ごとに違うので1段ずつ書く。
 *
 * 各段の後ろの薄いベージュの四角（deco-bg）は写真の塊を基準に置く。
 * - 位置と高さは写真の塊に対する%。Figmaの数字が読めるよう calc(Figmaの値/塊の寸法*100%) で書く。
 *   1024〜1139pxで写真が縮んでも、写真との重なり方が変わらないように
 * - 画面の端側は -100vw まで伸ばし、ページ側の overflow-x-clip で切る。「端からの距離＋固定幅」だと
 *   広い画面で四角の端が見えてしまうため（/rules/design-to-code.md）
 * - 四角は写真より先に置き、写真に relative を付けて四角の上に重ねる
 *
 * 写真は書き出した実寸を width/height に渡し、表示の縦横比はFigmaの枠で持つ（object-cover）。
 * SPの枠はPCと比率がわずかに違う（335×209 と 640×400 など）ので、端数で高さがずれないよう md 未満はSPの比率にする
 */

interface DecoRectProps {
  className: string;
}

function DecoRect({ className }: DecoRectProps) {
  return <div aria-hidden="true" className={`absolute bg-base-dark ${className}`} />;
}

/**
 * 段1：大640×400の下に310×310を2枚（SP 335×209、162×162を間11px）。
 * 768px〜は間をPCの20pxにする。縦積みの間は中身が640pxで止まっているので、写真がPCと同じ大きさになる。
 * 四角（塊はSP 335×382、PC 640×730）：SP 塊の左から20・塊の上から332・塊の下に50はみ出す（高100）、
 * PC 塊の左から-253（段の左206）・上630・塊の下に100はみ出す（高200）。右は画面の端
 */
export function CoffeePhotos() {
  return (
    <div className="relative grid grid-cols-2 gap-[11px] md:gap-5">
      <DecoRect className="top-[calc(332/382*100%)] -bottom-[calc(50/382*100%)] left-[calc(20/335*100%)] -right-[100vw] lg:top-[calc(630/730*100%)] lg:-bottom-[calc(100/730*100%)] lg:-left-[calc(253/640*100%)]" />
      <Image
        src="/images/concept/bar.webp"
        alt="カウンターに人が集う店内"
        width={960}
        height={600}
        // 最初の画面（PC・SPとも）に入るので先に読み込む
        loading="eager"
        className="relative col-span-2 aspect-[335/209] w-full object-cover md:aspect-[640/400]"
      />
      <Image
        src="/images/concept/coffee.webp"
        alt="エスプレッソを抽出しているところ"
        width={465}
        height={465}
        loading="lazy"
        className="relative aspect-square w-full object-cover"
      />
      <Image
        src="/images/concept/coffee-milk.webp"
        alt="コーヒーにミルクを注いでいるところ"
        width={465}
        height={465}
        loading="lazy"
        className="relative aspect-square w-full object-cover"
      />
    </div>
  );
}

/**
 * 段2：パスタ（右上）と麺打ち（左下）を重ねる。
 * PC 540×405（左100）と350×263（上274）、SP 283×212（左52）と183×138（上143）。
 * 2枚を同じマスに重ね、麺打ちの上位置は margin-top の%（幅に対する%）で持つので、塊の高さが写真から決まる。
 * 四角（塊はSP 335×281、PC 640×537）：SP 画面の左端〜塊の右から71・塊の上から104・塊の下に50はみ出す（高227）、
 * PC 画面の左端〜塊の右から150（段の左490）・上160・塊の下に60はみ出す（高437）
 */
export function PastaPhotos() {
  return (
    <div className="relative grid">
      <DecoRect className="top-[calc(104/281*100%)] -bottom-[calc(50/281*100%)] -left-[100vw] right-[calc(71/335*100%)] lg:top-[calc(160/537*100%)] lg:-bottom-[calc(60/537*100%)] lg:right-[calc(150/640*100%)]" />
      <Image
        src="/images/concept/pasta.webp"
        alt="器に盛ったミートソースのパスタ"
        width={810}
        height={608}
        loading="lazy"
        className="relative col-start-1 row-start-1 aspect-[540/405] w-[calc(283/335*100%)] justify-self-end object-cover lg:w-[calc(540/640*100%)]"
      />
      <Image
        src="/images/concept/pasta-making.webp"
        alt="打ちたての生パスタを持ち上げているところ"
        width={525}
        height={394}
        loading="lazy"
        className="relative col-start-1 row-start-1 mt-[calc(143/335*100%)] aspect-[183/138] w-[calc(183/335*100%)] object-cover md:aspect-[350/263] lg:mt-[calc(274/640*100%)] lg:w-[calc(350/640*100%)]"
      />
    </div>
  );
}

/**
 * 段3：640×400（SP 335×210）。
 * 四角（塊はSP 335×210、PC 640×400）：SP 塊の左から171・塊の上から35・塊の下に20はみ出す（高195）、
 * PC 塊の左から331・上-40（-10%）・塊の下に80はみ出す（-20%、高520）。右は画面の端
 */
export function CroissantPhoto() {
  return (
    <div className="relative">
      <DecoRect className="top-[calc(35/210*100%)] -bottom-[calc(20/210*100%)] left-[calc(171/335*100%)] -right-[100vw] lg:-top-[10%] lg:-bottom-[20%] lg:left-[calc(331/640*100%)]" />
      <Image
        src="/images/concept/croissant.webp"
        alt="粉砂糖をふったクロワッサン"
        width={960}
        height={600}
        loading="lazy"
        className="relative aspect-[335/210] w-full object-cover md:aspect-[640/400]"
      />
    </div>
  );
}
