import { FieldLabel } from "@/components/form/FieldLabel";
import {
  FIELD_CONTROL_WIDTH_CLASS,
  FIELD_ROW_CLASS,
} from "@/components/form/FormField";

interface ChoiceGroupProps {
  label: string;
  /** 組の中の全選択肢で共通のname */
  name: string;
  options: string[];
  /** 最初から選んでおく選択肢（options のどれか） */
  defaultValue?: string;
  /** 「どれか1つ」が必須になる */
  required?: boolean;
}

/**
 * ラジオボタンの組（Figma: fieldset / Radio button）。
 * 丸はFigmaの絵（main の1px枠、選択で accent の点）を自前で描くため、
 * inputの見た目は appearance-none で消して、上に点を重ねる
 */
export function ChoiceGroup({
  label,
  name,
  options,
  defaultValue,
  required = false,
}: ChoiceGroupProps) {
  return (
    <fieldset className={`${FIELD_ROW_CLASS} md:items-start`}>
      {/* float：fieldset先頭のlegendは特別扱いされて flex の並びに入らない。
          floatを付けると普通の子として扱われ、PCの横並び・SPの縦並びが効く */}
      <legend className="float-left">
        <FieldLabel label={label} required={required} />
      </legend>

      <div className={`flex flex-col gap-4 ${FIELD_CONTROL_WIDTH_CLASS}`}>
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-2.5 text-base/[1.5] text-main"
          >
            <span className="relative flex size-6 shrink-0">
              <input
                type="radio"
                name={name}
                value={option}
                defaultChecked={option === defaultValue}
                // radioは1つに付ければ組全体が必須になる。全部に付けても意味は同じ
                required={required}
                className="peer size-6 cursor-pointer appearance-none rounded-full border border-main bg-white"
              />
              {/* ハイコントラスト表示（forced-colors）では背景色が消され、点が見えなくなる。
                  この点だけ色の上書きを止め、文字と同じ系統色で塗る */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1.5 left-1.5 size-3 rounded-full bg-accent opacity-0 peer-checked:opacity-100 forced-colors:bg-[CanvasText] forced-colors:forced-color-adjust-none"
              />
            </span>
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
