interface FieldLabelProps {
  label: string;
  required?: boolean;
}

/**
 * フォームの項目名（文字＋必須バッジ。Figma: label / icon-must）。
 * <label>・<legend> どちらの中にも置けるよう、span だけで組む
 */
export function FieldLabel({ label, required = false }: FieldLabelProps) {
  return (
    <span className="flex items-center gap-2">
      <span className="text-base/[1.5] font-bold text-main">{label}</span>
      {required && (
        <span className="flex h-[19px] w-[34px] shrink-0 items-center justify-center rounded-[2px] bg-accent text-[11px]/[1.5] font-bold text-white">
          必須
        </span>
      )}
    </span>
  );
}
