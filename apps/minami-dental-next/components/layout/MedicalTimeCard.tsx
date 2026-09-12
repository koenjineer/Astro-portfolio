import Image from "next/image";

// 書き出した画像の実寸（Figmaの PC 477×166・SP 335×116 より大きく、どちらの表示にも足りる）
const MEDICAL_TIME_WIDTH = 800;
const MEDICAL_TIME_HEIGHT = 279;

// 診療時間表はFigmaでも画像で置かれている。読み上げ用に表の中身を文章にする
const MEDICAL_TIME_ALT =
  "診療時間：9:00〜12:00は月曜〜日曜・祝日、13:00〜22:00は水曜を除く月曜〜日曜・祝日";

interface MedicalTimeCardProps {
  /** 外側の余白や重なりは置く側で決めるので、クラスを受け取れるようにする */
  className?: string;
}

/**
 * 診療時間表の白い角丸カード（Figma: medical-time-pc / medical-time-sp）。
 * フッターと、ホームのメインビジュアルの下で使う。表示の幅はどちらもPC 477px・SP 335pxで同じ
 */
export function MedicalTimeCard({ className = "" }: MedicalTimeCardProps) {
  return (
    <div
      className={`w-full max-w-[335px] rounded-xl bg-white shadow-default lg:max-w-[477px] ${className}`.trimEnd()}
    >
      <Image
        src="/images/common/footer-medical-time.webp"
        alt={MEDICAL_TIME_ALT}
        width={MEDICAL_TIME_WIDTH}
        height={MEDICAL_TIME_HEIGHT}
        loading="lazy"
        className="h-auto w-full"
      />
    </div>
  );
}
