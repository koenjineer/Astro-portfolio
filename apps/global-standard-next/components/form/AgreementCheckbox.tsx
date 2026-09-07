import Image from "next/image";
import { useId } from "react";

/**
 * 「個人情報保護方針に同意します。」のチェックボックス。
 * 資料ダウンロードとお問い合わせの2ページで寸法・文言とも同一。
 */
export function AgreementCheckbox() {
  const agreementId = useId();

  return (
    <div className="flex items-center gap-[10px]">
      {/* チェック済みの絵はFigmaのSVGをそのまま重ねる。未チェックは同じ1pxの枠線だけ */}
      <span className="relative inline-flex size-7 shrink-0 lg:size-8">
        <input
          id={agreementId}
          type="checkbox"
          name="agreement"
          required
          className="peer size-full cursor-pointer appearance-none border border-[#3e3e3e] bg-white"
        />
        <Image
          src="/images/common/checkbox-checked.svg"
          alt=""
          aria-hidden="true"
          width={32}
          height={32}
          loading="lazy"
          className="pointer-events-none absolute inset-0 size-full opacity-0 peer-checked:opacity-100"
        />
      </span>
      <label
        htmlFor={agreementId}
        className="cursor-pointer text-sm text-contrast lg:text-base"
      >
        {/* サイト内に個人情報保護方針ページが無いためリンクにしない（下線つきの文字だけ） */}
        <span className="font-bold underline">個人情報保護方針</span>
        に同意します。
      </label>
    </div>
  );
}
