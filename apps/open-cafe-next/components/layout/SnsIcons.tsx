import Image from "next/image";

const SNS_ICON_SOURCES = [
  "/images/common/icon-twitter.svg",
  "/images/common/icon-instagram.svg",
  "/images/common/icon-youtube.svg",
];

/**
 * SNSアイコン3つ（Figma: sns ホワイト）。ドロワーとフッターで使う。
 * 架空のカフェなのでリンク先が存在しない。`#` のリンクにすると押しても何も起きない操作が増えるだけなので、
 * global-standard-next と同じくデザインどおりの飾りとしてだけ置く
 */
export function SnsIcons() {
  return (
    <div aria-hidden="true" className="flex items-center gap-6">
      {SNS_ICON_SOURCES.map((src) => (
        <Image
          key={src}
          src={src}
          alt=""
          width={24}
          height={24}
          loading="lazy"
          className="size-6"
        />
      ))}
    </div>
  );
}
