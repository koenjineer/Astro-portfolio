"use client";

import { useCallback, useEffect, useRef } from "react";
import { FieldLabel } from "@/components/form/FieldLabel";
import { FIELD_ROW_CLASS } from "@/components/form/FormField";
import { CheckIcon } from "@/components/icons/SmallIcons";

interface ChoiceGroupProps {
  label: string;
  /** 組の中の全選択肢で共通のname */
  name: string;
  type: "radio" | "checkbox";
  options: string[];
  /** radioは「どれか1つ」、checkboxは「1つ以上」が必須になる */
  required?: boolean;
  /** ラベルの下の小さな補足（例: ※(複数選択可)） */
  note?: string;
}

// ブラウザ標準の吹き出しに出す文言。checkboxの「1つ以上」はHTMLに標準の指定が無く、自分で渡すため
const AT_LEAST_ONE_MESSAGE = "いずれか1つ以上選択してください。";

/**
 * ラジオ／チェックボックスの組（Figma: ラジオ・チェックボックス）。
 * 丸・四角はFigmaの絵（main の1px枠、選択で main の点／チェック）を自前で描くため、
 * inputの見た目は appearance-none で消して、上に印を重ねる
 */
export function ChoiceGroup({
  label,
  name,
  type,
  options,
  required = false,
  note,
}: ChoiceGroupProps) {
  const groupRef = useRef<HTMLFieldSetElement>(null);
  const needsAtLeastOne = type === "checkbox" && required;

  /**
   * checkboxに required を付けると「全部チェック必須」になってしまう。そこで、
   * 1つも選ばれていない間だけ先頭のcheckboxを「不正」にし、送信時にブラウザ標準の吹き出しで止める
   */
  const syncAtLeastOneValidity = useCallback(() => {
    const inputs = groupRef.current?.querySelectorAll<HTMLInputElement>("input");
    if (!inputs || inputs.length === 0) return;

    const hasChecked = Array.from(inputs).some((input) => input.checked);
    inputs[0].setCustomValidity(hasChecked ? "" : AT_LEAST_ONE_MESSAGE);
  }, []);

  useEffect(() => {
    if (needsAtLeastOne) syncAtLeastOneValidity();
  }, [needsAtLeastOne, syncAtLeastOneValidity]);

  return (
    <fieldset
      ref={groupRef}
      onChange={needsAtLeastOne ? syncAtLeastOneValidity : undefined}
      className={FIELD_ROW_CLASS}
    >
      {/* float：fieldset先頭のlegendは特別扱いされて flex の並びに入らない。
          floatを付けると普通の子として扱われ、PCの横並び・SPの縦並びが効く */}
      <legend className="float-left">
        <FieldLabel label={label} required={required} note={note} />
      </legend>

      <div
        className={
          type === "radio"
            ? "flex gap-8 lg:w-[488px]"
            : "flex flex-wrap gap-x-6 gap-y-4 lg:w-[488px] lg:gap-x-8"
        }
      >
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-2 text-sm/[1.5]"
          >
            <span className="relative flex size-6 shrink-0">
              <input
                type={type}
                name={name}
                value={option}
                // radioは1つに付ければ組全体が必須になる。全部に付けても意味は同じ
                required={type === "radio" && required}
                className={`peer size-6 cursor-pointer appearance-none border border-main bg-white ${
                  type === "radio" ? "rounded-full" : ""
                }`}
              />
              {type === "radio" ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1.5 left-1.5 size-3 rounded-full bg-main opacity-0 peer-checked:opacity-100"
                />
              ) : (
                <CheckIcon className="pointer-events-none absolute top-[3px] left-[3px] size-[18px] text-main opacity-0 peer-checked:opacity-100" />
              )}
            </span>
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
