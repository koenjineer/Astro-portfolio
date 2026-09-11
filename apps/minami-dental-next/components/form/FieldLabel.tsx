interface FieldLabelProps {
  label: string;
  required?: boolean;
  /** ラベルの下の小さな補足（例: ※(複数選択可)） */
  note?: string;
}

/**
 * フォームの項目名（文字＋必須バッジ＋補足。Figma: label）。
 * <label>・<legend> どちらの中にも置けるよう、span だけで組む
 */
export function FieldLabel({ label, required = false, note }: FieldLabelProps) {
  return (
    <span className="flex shrink-0 flex-col items-start gap-1">
      <span className="flex items-center gap-4">
        <span className="text-base/[1.5]">{label}</span>
        {required && (
          <span className="flex w-9 items-center justify-center rounded-[4px] bg-accent px-1.5 py-[3px] text-xs/[1.5] font-bold text-white">
            必須
          </span>
        )}
      </span>
      {note && (
        <span className="text-[11px]/[1.5] text-contrast-light">{note}</span>
      )}
    </span>
  );
}
