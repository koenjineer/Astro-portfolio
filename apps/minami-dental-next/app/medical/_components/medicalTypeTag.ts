interface MedicalTypeTag {
  /** 札とリボンの文字（例: 保険対象） */
  label: string;
  /** 目次の札の地の色 */
  badgeClassName: string;
  /** カード右上のリボンの色（リボンの形は currentColor で塗るので文字色で指定する） */
  ribbonClassName: string;
  /** リボンの文字の字間。Figmaは PC の「実費」だけ字間を広げている（2文字だとリボンの幅に対して詰まって見えるため） */
  ribbonLabelClassName: string;
}

// 保険対象か実費かはWordPressに無い情報なので、診療タイプのslugごとにコードに持つ
const MEDICAL_TYPE_TAGS: Record<string, MedicalTypeTag> = {
  general: {
    label: "保険対象",
    badgeClassName: "bg-main",
    ribbonClassName: "text-main",
    ribbonLabelClassName: "tracking-[0.08em]",
  },
  special: {
    label: "実費",
    badgeClassName: "bg-accent",
    ribbonClassName: "text-accent",
    ribbonLabelClassName: "tracking-[0.08em] lg:tracking-[0.5em]",
  },
};

/**
 * 診療タイプの札（目次）とリボン（カード）の見た目を返す。
 * 管理画面で診療タイプが増えると札の無いグループができてしまうので、ビルドを止めて気づかせる（lib/queries と同じ方針）
 */
export function getMedicalTypeTag(slug: string): MedicalTypeTag {
  const tag: MedicalTypeTag | undefined = MEDICAL_TYPE_TAGS[slug];

  if (!tag) {
    throw new Error(`診療タイプ（slug: ${slug}）の札（保険対象／実費）が決まっていません`);
  }

  return tag;
}
