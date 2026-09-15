import { useId, type InputHTMLAttributes } from "react";
import { FieldLabel } from "@/components/form/FieldLabel";

/**
 * 1項目分の行。SPはラベルの下に入力欄、PC（768px以上）はラベル左・入力欄右（490px）。
 * ChoiceGroup でも同じ形にするため書き出しておく
 */
export const FIELD_ROW_CLASS =
  "flex flex-col gap-5 md:flex-row md:justify-between md:gap-4";

/** 入力欄の右列の幅（Figma PC 490px）。SPは列いっぱい */
export const FIELD_CONTROL_WIDTH_CLASS = "w-full md:w-[490px] md:shrink-0";

/**
 * 入力欄の見た目。placeholderの #ccc はFigmaの色変数ではなく生の色なので、トークンに足さずここで持つ。
 * 文字は16px：iOSのSafariは16px未満の入力欄にフォーカスすると画面を拡大してしまうため、SPでも下げない
 */
const FIELD_CONTROL_CLASS = `${FIELD_CONTROL_WIDTH_CLASS} rounded-[6px] border border-main bg-white px-4 py-3 text-base/[1.5] text-main placeholder:text-[#ccc]`;

interface FormFieldProps {
  label: string;
  /** 入力欄のname。今は送信しないが、後で送信先をつなぐ時にそのまま使えるよう振っておく */
  name: string;
  placeholder?: string;
  /** 既定は1行の入力欄。"textarea"は複数行 */
  control?: "input" | "textarea";
  /** control="input" のときの入力の種類 */
  type?: "text" | "email" | "tel";
  /** ブラウザの自動入力の種類（"name" / "email" / "tel" など） */
  autoComplete?: InputHTMLAttributes<HTMLInputElement>["autoComplete"];
  required?: boolean;
}

/**
 * ラベル（＋必須バッジ）と入力欄の1行（Figma: form-control / input / textarea）。
 * Figmaにフォーカス時の指定は無いので、フォーカスはブラウザ標準の枠に任せる
 */
export function FormField({
  label,
  name,
  placeholder,
  control = "input",
  type = "text",
  autoComplete,
  required = false,
}: FormFieldProps) {
  const inputId = useId();

  return (
    // PCで1行入力はラベルを入力欄の上下中央に、複数行は上端にそろえる（Figmaどおり）
    <div
      className={`${FIELD_ROW_CLASS} ${control === "textarea" ? "md:items-start" : "md:items-center"}`}
    >
      <label htmlFor={inputId}>
        <FieldLabel label={label} required={required} />
      </label>

      {control === "input" ? (
        <input
          id={inputId}
          type={type}
          name={name}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className={`${FIELD_CONTROL_CLASS} h-12`}
        />
      ) : (
        <textarea
          id={inputId}
          name={name}
          placeholder={placeholder}
          required={required}
          className={`${FIELD_CONTROL_CLASS} h-[200px] resize-y md:h-60`}
        />
      )}
    </div>
  );
}
