import Image from "next/image";
import { HeadingGroup } from "@/components/heading/HeadingGroup";
import { Button } from "@/components/ui/Button";
import { GALLERY_CONTENT } from "./content";

// 書き出した写真の実寸（PCの257pxの1.5倍。SPの158pxの2倍316pxより大きいので両方をまかなう）
const GALLERY_IMAGE_SIZE = 386;

/**
 * GALLERY（Figma: PC gallery 19709:8691 / SP gallery 19710:3886）。
 * Instagram連携はせず、Figmaの写真4枚を固定で置く（ユーザー決定）。
 * SPは2×2（158px・間19px）、md〜は横4列（PC 257px・間24px）
 */
export function GallerySection() {
  return (
    <section aria-labelledby="top-gallery-heading" className="bg-base-dark px-5 py-[60px] xl:py-20">
      <div className="relative mx-auto flex max-w-[1100px] flex-col items-center gap-10 xl:gap-[60px]">
        {/* 吹き出しは文字の絵なので alt に文言を書く。位置は中身の枠の左上から（SPは画面の左端からはみ出す） */}
        <Image
          src="/images/home/balloon-gallery.svg"
          alt={GALLERY_CONTENT.balloon}
          width={266}
          height={138}
          loading="lazy"
          className="pointer-events-none absolute -top-[120px] -left-10 h-auto w-[200px] xl:-top-[140px] xl:left-[207px] xl:w-[266px]"
        />

        <div id="top-gallery-heading" className="w-full">
          <HeadingGroup en={GALLERY_CONTENT.headingEn} ja={GALLERY_CONTENT.headingJa} />
        </div>

        <ul className="grid w-full max-w-[335px] grid-cols-2 gap-[19px] md:max-w-none md:grid-cols-4 md:gap-6">
          {GALLERY_CONTENT.images.map((image) => (
            <li key={image.src}>
              <Image
                src={image.src}
                alt={image.alt}
                width={GALLERY_IMAGE_SIZE}
                height={GALLERY_IMAGE_SIZE}
                loading="lazy"
                // 元の写真より大きく引き伸ばさない（書き出した386pxで止める）
                className="aspect-square w-full max-w-[386px] object-cover"
              />
            </li>
          ))}
        </ul>

        <Button href={GALLERY_CONTENT.instagramHref} external>
          インスタグラムを見る
        </Button>
      </div>
    </section>
  );
}
