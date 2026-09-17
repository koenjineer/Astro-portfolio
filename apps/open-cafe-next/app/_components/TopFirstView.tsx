import Image from "next/image";
import Link from "next/link";
import { CategoryBadge } from "@/components/news/CategoryBadge";
import { NEWS_IMAGE_HEIGHT, NEWS_IMAGE_WIDTH } from "@/components/news/newsImage";
import { newsPostHref } from "@/lib/newsRoutes";
import type { NewsPost } from "@/lib/queries/news";
import { NAV_ITEMS, SITE_NAME } from "@/lib/site";
import { CATCH_COPY_LINES } from "./content";
import { MainVisualSlider } from "./MainVisualSlider";

/** ルールセット「その他リンク」「ハンバーガー内メニュー」：ホバーで透明度70%（ドロワーと同じ） */
const HOVER_FADE_CLASS =
  "transition-opacity duration-300 hover:opacity-70 focus-visible:opacity-70 motion-reduce:transition-none";

// PCの縦ナビのSNSアイコン（Figma: sns 19816:6849。ドロワー・フッターの白とは別の黒い版）
const DARK_SNS_ICON_SOURCES = [
  "/images/home/icon-twitter-dark.svg",
  "/images/home/icon-instagram-dark.svg",
  "/images/home/icon-youtube-dark.svg",
];

interface TopFirstViewProps {
  /** TopDrawerButton が見張る要素のid */
  id: string;
  /** 右下の「Pick UP」に出す記事（最新の1件）。無ければ Pick UP を出さない（NEWSの大きいカードと同じ扱い） */
  pickupPost?: NewsPost;
}

/**
 * ファーストビュー（Figma: PC top 19709:7457 / SP mainvisual 19710:3042・header 19710:3095）。
 *
 * - 〜xl：写真が画面幅いっぱい。左上にロゴ（白）、右上にメニューボタン（TopDrawerButton）。
 *   SPの高さはFigmaの667px。md〜はPCの写真に切り替え、高さはPCの比率（1080:735）で735pxまで
 * - xl〜：左に200pxの縦ナビ（ロゴ・7項目・SNS）、右に写真（高さ735px）。
 *   写真の下60pxと右側に薄いベージュの面が敷かれる（Figma: bg 984×795、右下に寄せる）
 *
 * PCの組みを xl からにしたのは、キャッチコピー（左50＋幅427）と Pick UP（幅388＋右20）が
 * 写真の下端で横に並ぶには写真の幅が905px要り、縦ナビ200pxと合わせて1105px必要なため（docs/progress/top.md）
 */
export function TopFirstView({ id, pickupPost }: TopFirstViewProps) {
  return (
    <div id={id} className="relative xl:flex xl:pb-[60px]">
      {/* 右下に寄せた薄いベージュの面。左端はFigmaの296px（1280−984）で止め、広い画面では右へ伸ばす */}
      <div aria-hidden="true" className="absolute inset-y-0 right-0 left-[296px] hidden bg-base-dark xl:block" />

      {/* PCの縦ナビ。ロゴがページの題（h1） */}
      <header className="relative hidden h-[735px] w-[200px] shrink-0 flex-col items-center justify-between py-[18px] xl:flex">
        <h1>
          <Image
            src="/images/home/logo-dark.svg"
            alt={SITE_NAME}
            width={166}
            height={90}
            loading="eager"
            className="h-[90px] w-[166px]"
          />
        </h1>
        <nav aria-label="メインメニュー">
          <ul className="flex w-20 flex-col items-center gap-8 text-contrast">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  // TOPのナビなので、現在地は常に「トップ」
                  aria-current={item.href === "/" ? "page" : undefined}
                  className={`flex flex-col items-center text-center whitespace-nowrap ${HOVER_FADE_CLASS}`}
                >
                  <span className="font-patua text-base/[1.5] tracking-[0.12em] uppercase">
                    {item.labelEn}
                  </span>
                  {/* 見えない読点で「top、トップ」と区切って読ませる（ドロワーと同じ） */}
                  <span className="sr-only">、</span>
                  <span className="text-[10px]/[1.5]">{item.labelJa}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* ドロワー・フッターのSNSアイコンと同じく、リンク先が無いので飾りとして置く（SnsIcons のコメント参照） */}
        <div aria-hidden="true" className="flex items-center gap-6">
          {DARK_SNS_ICON_SOURCES.map((src) => (
            <Image key={src} src={src} alt="" width={24} height={24} loading="eager" className="size-6" />
          ))}
        </div>
      </header>

      <div className="relative h-[667px] md:aspect-[1080/735] md:h-auto md:max-h-[735px] md:w-full xl:h-[735px] xl:min-w-0 xl:flex-1">
        <MainVisualSlider>
          {/* SP・タブレットのヘッダーのロゴ（白）。PCの縦ナビのロゴと同時には出ないので、h1は画面に1つ */}
          <h1 className="absolute top-2.5 left-2.5 xl:hidden">
            <Image
              src="/images/common/logo-light.svg"
              alt={SITE_NAME}
              width={120}
              height={65}
              loading="eager"
              className="h-[65px] w-[120px]"
            />
          </h1>

          <p className="absolute top-[124px] left-5 text-base/[2] font-bold tracking-[0.14em] text-white md:left-[50px] md:text-xl/[2] lg:top-auto lg:bottom-[52px]">
            {CATCH_COPY_LINES[0]}
            <br className="md:hidden" />
            {CATCH_COPY_LINES[1]}
            <br />
            {CATCH_COPY_LINES[2]}
          </p>

          {pickupPost && <PickupNews post={pickupPost} />}
        </MainVisualSlider>
      </div>
    </div>
  );
}

interface PickupNewsProps {
  post: NewsPost;
}

/**
 * 右下の「Pick UP」ニュース（Figma: news-top-pc 19710:2538 / news-top-sp 19710:3113）。
 * SPは下32pxで左右20px、md〜は右下20pxに幅388px
 */
function PickupNews({ post }: PickupNewsProps) {
  return (
    <div className="absolute inset-x-5 bottom-8 md:inset-x-auto md:right-5 md:bottom-5 md:w-[388px]">
      {/* 吹き出し「Pick UP ニュース！」は、この枠が何かを伝える文字の絵なので alt に文言を書く。
          読み上げで枠より先に来るよう前に置き、z-10で枠の上に重ねる。Figmaでは5度傾けて枠の右上に重ねている（傾けた外枠の位置から、傾ける前の絵の位置に直した値） */}
      <Image
        src="/images/home/balloon-pickup.svg"
        alt="Pick UP ニュース！"
        width={160}
        height={95}
        loading="eager"
        className="pointer-events-none absolute z-10 -top-[38px] right-[3px] h-auto w-[120px] rotate-5 md:-top-[44px] md:right-1 md:w-40"
      />
      <Link
        href={newsPostHref(post.slug)}
        className={`relative flex items-center gap-4 bg-white/85 p-3 text-contrast md:p-4 ${HOVER_FADE_CLASS}`}
      >
        <Image
          src={post.thumbnailSrc}
          // WPから来る写真は飾り扱い。記事名は隣の文字が伝える
          alt=""
          width={NEWS_IMAGE_WIDTH}
          height={NEWS_IMAGE_HEIGHT}
          loading="eager"
          className="size-[100px] shrink-0 object-cover md:size-[120px]"
        />
        {/* min-w-0：長い記事名が縮まずに枠から飛び出すのを防ぐ */}
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <p className="text-xs/[1.5]">
            <time dateTime={post.isoDate}>{post.displayDate}</time>
          </p>
          <p className="line-clamp-2 text-xs/[1.5] font-bold md:text-sm/[1.5]">{post.title}</p>
        </div>
        <CategoryBadge name={post.category.name} size="pickup" />
      </Link>
    </div>
  );
}
