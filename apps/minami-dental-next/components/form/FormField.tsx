import { useId, type InputHTMLAttributes } from "react";
import { FieldLabel } from "@/components/form/FieldLabel";
import { ChevronDownIcon } from "@/components/icons/SmallIcons";

/**
 * 項目の区切り線の色。#c2c2c2はFigmaの色変数ではなく生の色なので、globals.cssのトークンには足さずここで持つ。
 * フォームの一番上の線など、行の外で同じ線を引く所でもこれを使う
 */
export const FIELD_BORDER_COLOR_CLASS = "border-[#c2c2c2]";

/**
 * 1項目分の行（上下の線・余白・PCで横並び／SPで縦並び）。
 * ChoiceGroupや希望日の行でも同じ形にするため書き出しておく
 */
export const FIELD_ROW_CLASS = `flex min-w-0 flex-col gap-3 border-b ${FIELD_BORDER_COLOR_CLASS} py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:py-[29px]`;

/**
 * 入力欄の地の色（#f6f6f6）・placeholderの色（#c2c2c2）も同じく生の色。
 * 文字は16px：iOSのSafariは16px未満の入力欄にフォーカスすると画面を拡大してしまうため、SPでも下げない
 */
export const FIELD_CONTROL_CLASS =
  "h-12 w-full rounded-[4px] bg-[#f6f6f6] px-4 py-3 text-base/[1.5] text-contrast placeholder:text-[#c2c2c2]";

interface FormFieldProps {
  label: string;
  /** 入力欄のname。今は送信しないが、後で送信先をつなぐ時にそのまま使えるよう振っておく */
  name: string;
  placeholder?: string;
  /** 既定は1行の入力欄。"select"は選択式、"textarea"は複数行 */
  control?: "input" | "select" | "textarea";
  /** control="input" のときの入力の種類 */
  type?: "text" | "email" | "tel";
  /** control="input" のときのブラウザの自動入力の種類（"name" / "tel" / "email" など）。当てはまる種類が無ければ付けない */
  autoComplete?: InputHTMLAttributes<HTMLInputElement>["autoComplete"];
  /** control="select" のときの選択肢。先頭が最初に選ばれた状態になる */
  options?: string[];
  required?: boolean;
}

/**
 * ラベル（＋必須バッジ）と入力欄の1行（Figma: フォームコンポーネント）。
 * 入力欄の幅はFigmaの上限（PC 488px、SPの1行入力は448px）まで。
 * Figmaにフォーカス時・ホバー時の指定は無いので、フォーカスはブラウザ標準の枠に任せる
 */
export function FormField({
  label,
  name,
  placeholder,
  control = "input",
  type = "text",
  autoComplete,
  options = [],
  required = false,
}: FormFieldProps) {
  const inputId = useId();

  return (
    <div className={FIELD_ROW_CLASS}>
      <label htmlFor={inputId}>
        <FieldLabel label={label} required={required} />
      </label>

      {control === "input" && (
        <input
          id={inputId}
          type={type}
          name={name}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className={`${FIELD_CONTROL_CLASS} max-w-[448px] lg:max-w-[488px]`}
        />
      )}

      {control === "select" && (
        <span className="relative flex w-full max-w-[488px]">
          <select
            id={inputId}
            name={name}
            required={required}
            defaultValue={options[0]}
            className={`${FIELD_CONTROL_CLASS} cursor-pointer appearance-none pr-12`}
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {/* Figmaは右端16pxに20px四方の枠、その中央に矢印 */}
          <span className="pointer-events-none absolute top-1/2 right-4 flex size-5 -translate-y-1/2 items-center justify-center text-contrast">
            <ChevronDownIcon className="h-[6.667px] w-[11.667px]" />
          </span>
        </span>
      )}

      {control === "textarea" && (
        <textarea
          id={inputId}
          name={name}
          placeholder={placeholder}
          required={required}
          className={`${FIELD_CONTROL_CLASS} h-40 min-h-40 max-w-[488px] resize-y lg:h-[200px] lg:min-h-[200px]`}
        />
      )}
    </div>
  );
}
