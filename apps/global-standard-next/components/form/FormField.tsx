import { useId } from "react";
import { SelectArrowIcon } from "@/components/icons/SelectArrowIcon";

interface FormFieldProps {
  label: string;
  /** 入力欄のname。今は送信しないが、後で送信先をつなぐ時にそのまま使えるよう振っておく */
  name: string;
  placeholder: string;
  /** 既定は1行の入力欄。"select"は選択式、"textarea"は複数行 */
  control?: "input" | "select" | "textarea";
  /** control="input" のときの入力の種類 */
  type?: "text" | "email" | "tel";
  /** control="select" のときの選択肢。未選択を表す先頭の項目はここに入れない */
  options?: string[];
  required?: boolean;
}

/**
 * 枠線の#ddd・placeholderの#ccはFigmaの色変数ではなく生の色なので、
 * globals.cssのトークンには足さずこの部品の中だけで持つ。
 * focus-visible:border-main：Figmaにフォーカス時の指定が無いため、
 * ホバー＝focus-visibleを揃えるルールに沿って最小限だけ足している。
 */
const FIELD_BASE_CLASS =
  "w-full rounded-[5px] border border-[#ddd] bg-white text-sm text-contrast transition-colors duration-300 placeholder:text-[#ccc] focus-visible:border-main motion-reduce:transition-none lg:text-base";

/**
 * ラベル（＋必須バッジ）と入力欄の1組。
 * 資料ダウンロードとお問い合わせの2ページで使う。
 */
export function FormField({
  label,
  name,
  placeholder,
  control = "input",
  type = "text",
  options = [],
  required = false,
}: FormFieldProps) {
  const inputId = useId();

  return (
    <div className="flex w-full flex-col gap-2 lg:gap-3">
      <div className="flex items-center gap-2 lg:gap-[9px]">
        <label
          htmlFor={inputId}
          className="text-sm font-bold text-contrast lg:text-lg"
        >
          {label}
        </label>
        {required && (
          <span className="inline-flex h-[17px] w-9 items-center justify-center bg-accent-2 px-2 py-px text-[10px] font-bold text-white lg:h-5 lg:w-10 lg:text-xs">
            必須
          </span>
        )}
      </div>

      {control === "select" && (
        <div className="relative">
          {/* 未選択（value=""）の間だけ文字をplaceholderと同じ#ccにしたい。
              requiredのselectは未選択だと:invalidになるので、CSSだけで色を出し分けられる */}
          <select
            id={inputId}
            name={name}
            required={required}
            defaultValue=""
            className={`${FIELD_BASE_CLASS} h-11 cursor-pointer appearance-none px-[14px] py-3 pr-9 invalid:text-[#ccc] lg:px-4 lg:py-[10px] lg:pr-10`}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option} value={option} className="text-contrast">
                {option}
              </option>
            ))}
          </select>
          <SelectArrowIcon className="pointer-events-none absolute top-1/2 right-[14px] w-[11px] -translate-y-1/2 text-contrast lg:right-4 lg:w-[14px]" />
        </div>
      )}

      {control === "textarea" && (
        <textarea
          id={inputId}
          name={name}
          placeholder={placeholder}
          required={required}
          className={`${FIELD_BASE_CLASS} h-[140px] resize-y px-[14px] py-[13px] lg:h-60 lg:px-4 lg:py-3`}
        />
      )}

      {control === "input" && (
        <input
          id={inputId}
          type={type}
          name={name}
          placeholder={placeholder}
          required={required}
          className={`${FIELD_BASE_CLASS} h-11 px-[14px] py-3 lg:px-4 lg:py-[10px]`}
        />
      )}
    </div>
  );
}
