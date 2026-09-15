import Image from "next/image";
import { HeadingGroup } from "@/components/heading/HeadingGroup";
import { SnsIcons } from "@/components/layout/SnsIcons";
import { COPYRIGHT_TEXT, FOOTER_SHOP_INFO } from "@/lib/site";

/**
 * フッター（Figma: footer-pc / footer-sp）。ACCESS（吹き出し・地図・店舗情報）＋SNS・コピーライト＋パンと豆の飾り。
 * 飾りはFigmaどおり画面の端からはみ出させる。横だけ切り、上（本文側）へのはみ出しは見せる
 */
export function SiteFooter() {
  return (
    <footer className="relative overflow-x-clip">
      <section className="bg-base-dark px-5 py-20">
        <div className="relative mx-auto flex max-w-[688px] flex-col items-center gap-10">
          {/* 吹き出しは「吉祥寺駅から徒歩5分！」という情報を持つ絵なので、飾り扱いにせず alt を付ける。
              位置は中身の枠の左上からの距離（SPは枠の外、画面の端からはみ出す） */}
          <Image
            src="/images/common/balloon-access.svg"
            alt="吉祥寺駅から徒歩5分！"
            width={233}
            height={200}
            loading="lazy"
            className="absolute -top-[124px] -left-[52px] h-auto w-[200px] md:-top-[130px] md:left-10 md:w-[233px]"
          />

          <HeadingGroup en="access" ja="アクセス" />

          <div className="flex w-full flex-col gap-10">
            {/* 地図はGoogleマップの埋め込みではなく、Figmaの地図を画像で置く（外部への通信を発生させない）。
                元の画像が669pxしか無いので、PCでも引き伸ばさない1倍で書き出している */}
            <Image
              src="/images/common/map.webp"
              alt="店舗周辺の地図"
              width={669}
              height={367}
              loading="lazy"
              // 縦横比は白枠を含む箱で持つ（Figmaの枠 SP 335×184 / PC 688×377。中の地図は枠に合わせて切り抜く）。
              // width/height属性だけだと、枠を除いた中身に比率がかかって枠の分だけ背が高くなる
              className="aspect-[335/184] w-full border-5 border-white object-cover md:aspect-[688/377] md:border-10"
            />

            <dl className="grid gap-[18px] text-sm/[1.5] font-bold text-contrast md:grid-flow-col md:grid-cols-2 md:grid-rows-[repeat(3,auto)] md:gap-x-10 md:gap-y-5">
              {FOOTER_SHOP_INFO.map((row) => (
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
          </div>
        </div>
      </section>

      <div className="flex flex-col items-center gap-10 bg-main px-5 pt-10 pb-3.5">
        <SnsIcons />
        <p className="text-center text-xs/[1.5] text-white">
          {/* small は既定で文字が小さくなるので大きさを戻す。行の高さも一緒に書く（text-xs だけだと親の1.5が打ち消される） */}
          <small className="text-xs/[1.5]">{COPYRIGHT_TEXT}</small>
        </p>
      </div>

      {/* パン：右上。画像はFigmaの枠（PC 389×359 / SP 194×179）の左に寄っているので、
          画像の右端までの距離に直している（PC 91-15=76px / SP 40-7=33px） */}
      <Image
        src="/images/common/bread.webp"
        alt=""
        aria-hidden="true"
        width={561}
        height={539}
        loading="lazy"
        className="pointer-events-none absolute -top-[93px] -right-[33px] h-auto w-[187px] md:-top-[170px] md:-right-[76px] md:w-[374px]"
      />
      {/* 豆：左下。同じく枠の中で右に寄っているので、画像の左端までの距離に直している（PC 85-19=66px / SP 36-7=29px）。
          PCの大きさ（幅322px・高さ289px）は、本文の左端（(画面幅−688)/2）が豆の右端256pxより右に来る幅でないと
          店舗情報の文字に重なる（768pxでは TEL・Mail が隠れた）。カンプの無い768〜1279pxは、豆の上端が
          店舗情報の最後の下線（フッター上端から778px）より下に来る幅231px（高さ207px、上端787px）に縮め、
          はみ出し量も同じ比率（66×231/322≒47px）にする。これなら本文の位置に関係なく文字にかからない */}
      <Image
        src="/images/common/coffee-beans.webp"
        alt=""
        aria-hidden="true"
        width={483}
        height={433}
        loading="lazy"
        className="pointer-events-none absolute bottom-[89px] -left-[29px] h-auto w-[121px] md:bottom-0 md:-left-[47px] md:w-[231px] xl:-left-[66px] xl:w-[322px]"
      />
    </footer>
  );
}
