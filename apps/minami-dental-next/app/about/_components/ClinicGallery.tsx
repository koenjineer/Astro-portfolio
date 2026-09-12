import Image from "next/image";
import { SectionHeading } from "@/components/heading/SectionHeading";

// 書き出した写真の実寸（正方形。PC表示317pxの2倍が収まる大きさにしている）
const CLINIC_IMAGE_SIZE = 640;

interface ClinicPhoto {
  src: string;
  /** 何が写っているかを短く伝える（写真そのものが情報なので alt は空にしない） */
  alt: string;
}

const CLINIC_PHOTOS: ClinicPhoto[] = [
  { src: "/images/about/clinic-01.webp", alt: "オレンジ色の診療台がある診察室" },
  { src: "/images/about/clinic-02.webp", alt: "患者様の治療をする歯科医師" },
  { src: "/images/about/clinic-03.webp", alt: "グレーの診療台と無影灯" },
  { src: "/images/about/clinic-04.webp", alt: "モニターが付いた診療ユニット" },
  { src: "/images/about/clinic-05.webp", alt: "緑色でそろえた診察室" },
  { src: "/images/about/clinic-06.webp", alt: "診療ユニットに並ぶ治療器具" },
];

/**
 * 院内の様子（Figma: clinic）。写真は正方形で、PC 3列（317px×3＋間24px×2＝1000px）・
 * SP 2列（162px×2＋間11px＝335px）。リンクではないのでホバーは付けない
 */
export function ClinicGallery() {
  return (
    <section id="clinic" className="flex flex-col gap-10 lg:gap-[60px]">
      <SectionHeading>院内の様子</SectionHeading>

      <ul className="grid grid-cols-2 gap-[11px] lg:grid-cols-3 lg:gap-6">
        {CLINIC_PHOTOS.map((photo) => (
          <li key={photo.src}>
            <Image
              src={photo.src}
              alt={photo.alt}
              width={CLINIC_IMAGE_SIZE}
              height={CLINIC_IMAGE_SIZE}
              loading="lazy"
              className="aspect-square h-auto w-full rounded-[20px] object-cover"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
