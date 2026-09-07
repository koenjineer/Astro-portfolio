import { useId } from "react";

interface FormFieldProps {
  label: string;
  /** 入力欄のname。今は送信しないが、後で送信先をつなぐ時にそのまま使えるよう振っておく */
  name: string;
  placeholder: string;
  type?: "text" | "email";
  required?: boolean;
}

/**
 * ラベル（＋必須バッジ）と入力欄の1組。
 * 枠線の#dddとplaceholderの#ccはFigmaの色変数ではなく生の色なので、
 * globals.cssのトークンには足さずこの部品の中だけで持つ。
 */
export function FormField({
  label,
  name,
  placeholder,
  type = "text",
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

      {/* focus-visible:border-main：Figmaにフォーカス時の指定が無いため、
          ホバー＝focus-visibleを揃えるルールに沿って最小限だけ足している */}
      <input
        id={inputId}
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="h-11 w-full rounded-[5px] border border-[#ddd] bg-white px-[14px] py-3 text-sm text-contrast transition-colors duration-300 placeholder:text-[#ccc] focus-visible:border-main motion-reduce:transition-none lg:px-4 lg:py-[10px] lg:text-base"
      />
    </div>
  );
}
