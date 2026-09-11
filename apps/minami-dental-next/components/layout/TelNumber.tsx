import { TelIcon } from "@/components/icons/TelIcon";
import { CLINIC_TEL } from "@/lib/clinic";

interface TelNumberProps {
  /** 幅や並びは置き場所ごとに違うので使う側で足す */
  className?: string;
}

/**
 * 受話器＋電話番号（Figma: tell-icon）。ヘッダー・フッター・WEB予約の案内で同じ寸法。
 * 電話発信リンクにはしない：架空の医院の番号が実在した場合に、閲覧者がタップして発信してしまうのを避けるため
 * （2026-09-11 ユーザー決定）。リンクではないのでホバーも付けない
 */
export function TelNumber({ className = "" }: TelNumberProps) {
  return (
    <p
      className={`flex items-center gap-1 text-[32px]/[1.3] font-bold tracking-[-0.02em] text-main ${className}`}
    >
      <TelIcon className="size-7 shrink-0" />
      {CLINIC_TEL}
    </p>
  );
}
