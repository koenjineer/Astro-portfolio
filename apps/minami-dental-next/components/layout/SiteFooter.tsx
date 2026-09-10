import Image from "next/image";
import Link from "next/link";
import { DevicesIcon } from "@/components/icons/DevicesIcon";
import { MailIcon } from "@/components/icons/MailIcon";
import { FooterSitemap } from "@/components/layout/FooterSitemap";
import { TelNumber } from "@/components/layout/TelNumber";
import {
  CLINIC_ADDRESS,
  CLINIC_HOURS_NOTE,
  CLINIC_NAME,
  CLINIC_POSTAL_CODE,
} from "@/lib/clinic";

// ボタン2つで共通の形（PC 220×56 / SP 150×38）
const BUTTON_BASE_CLASS =
  "flex h-[38px] w-[150px] items-center justify-center gap-1.5 rounded-[30px] px-1.5 py-2 text-sm/[1.5] transition-colors duration-300 motion-reduce:transition-none lg:h-14 lg:w-[220px] lg:px-2.5 lg:py-4 lg:text-base/[1.5]";

// 診療時間表はFigmaでも画像で置かれている。読み上げ用に表の中身を文章にする
const MEDICAL_TIME_ALT =
  "診療時間：9:00〜12:00は月曜〜日曜・祝日、13:00〜22:00は水曜を除く月曜〜日曜・祝日";

export function SiteFooter() {
  return (
    <footer className="overflow-hidden">
      {/* 上端の波。1山（84px）の絵を横に繰り返す。Figmaは画面の中央が、PCでは谷・SPでは山に来る
          （背景の繰り返しは既定で1枚目の中央＝山が画面の中央に来るので、PCは半山ずらす） */}
      <div
        aria-hidden="true"
        className="h-8 bg-[url(/images/common/footer-wave.svg)] bg-[position:50%_0] bg-repeat-x lg:bg-[position:calc(50%_+_42px)_0]"
      />

      <div className="bg-main-light px-2.5 pt-[13px] pb-[60px] lg:px-5 lg:py-14">
        <div className="mx-auto flex max-w-[1000px] flex-col gap-[42px] lg:gap-[43px]">
          <div className="flex flex-col items-center gap-5 rounded-lg bg-white px-2.5 pt-8 pb-5 lg:flex-row lg:justify-between lg:rounded-[20px] lg:px-[49px] lg:py-10">
            <div className="flex flex-col items-center gap-5 lg:w-[477px] lg:gap-[19px]">
              <div className="flex flex-col items-center gap-[7px]">
                <Image
                  src="/images/common/logo.svg"
                  alt={CLINIC_NAME}
                  width={405}
                  height={48}
                  loading="lazy"
                  className="h-auto w-[309px] max-w-full lg:w-[405px]"
                />
                <address className="flex gap-[14px] text-sm/[normal] not-italic lg:text-sm/[1.5]">
                  <span>{CLINIC_POSTAL_CODE}</span>
                  <span>{CLINIC_ADDRESS}</span>
                </address>
              </div>

              <div className="flex flex-col items-center">
                <TelNumber />
                <p className="text-xs/[normal] text-main lg:text-xs/[1.5]">
                  {CLINIC_HOURS_NOTE}
                </p>
              </div>

              <div className="flex gap-[15px] lg:gap-5">
                {/* ルールセット「WEB予約ボタン」：ホバーでmain-darkに濃くする */}
                <Link
                  href="/reservation/"
                  className={`${BUTTON_BASE_CLASS} bg-main text-white hover:bg-main-dark focus-visible:bg-main-dark`}
                >
                  <span className="flex size-[17px] items-center justify-center lg:size-6">
                    <DevicesIcon className="h-[11.679px] w-[17px] lg:h-[14.669px] lg:w-[21.353px]" />
                  </span>
                  WEB予約
                </Link>
                {/* ルールセット「お問い合わせボタン」：ホバーでmainに塗り、文字と封筒を白に反転 */}
                <Link
                  href="/contact/"
                  className={`${BUTTON_BASE_CLASS} border border-main bg-white text-main hover:bg-main hover:text-white focus-visible:bg-main focus-visible:text-white`}
                >
                  <span className="flex size-[17px] items-center justify-center lg:size-6">
                    <MailIcon className="h-[13.333px] w-[16.167px] lg:h-[18px] lg:w-[22px]" />
                  </span>
                  お問い合わせ
                </Link>
              </div>

              <div className="w-full max-w-[335px] rounded-xl bg-white shadow-default lg:max-w-[477px]">
                <Image
                  src="/images/common/footer-medical-time.webp"
                  alt={MEDICAL_TIME_ALT}
                  width={800}
                  height={279}
                  loading="lazy"
                  className="h-auto w-full"
                />
              </div>
            </div>

            {/* 地図はGoogleマップの埋め込みではなく、Figmaの地図を画像で置く（外部への通信を発生させない） */}
            <Image
              src="/images/common/footer-map.webp"
              alt="医院周辺の地図"
              width={770}
              height={770}
              loading="lazy"
              className="h-auto w-full max-w-[315px] shrink-0 lg:max-w-[385px]"
            />
          </div>

          <FooterSitemap />
        </div>
      </div>

      <p className="bg-main py-[13px] text-center text-sm/[1.5] text-white lg:py-4">
        ©︎2020-2021 {CLINIC_NAME}
      </p>
    </footer>
  );
}
