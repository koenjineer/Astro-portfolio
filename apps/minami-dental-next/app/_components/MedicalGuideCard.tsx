import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export interface MedicalGuideItem {
  title: string;
  /** 2行に分ける所には <br /> を入れるので、文字列ではなくJSXで持つ */
  description: ReactNode;
  imageSrc: string;
  /** 書き出した写真の実寸（元の写真がこれしかないので、これ以上大きくは書き出せない） */
  imageWidth: number;
  imageHeight: number;
}

interface MedicalGuideCardProps {
  item: MedicalGuideItem;
}

/**
 * ホームの診療案内カード（Figma: 診療案内カード / card-medical-sp）。写真の上に膜を敷いて白い文字を載せる。
 * ホバーは写真が1.1倍・膜が濃く（0.2→0.4）・内側に白い枠線（Figmaのホバー比較より）。
 * 枠線は擬似要素で出す。border を足すと箱の寸法が動いて中身がガタつくため
 */
export function MedicalGuideCard({ item }: MedicalGuideCardProps) {
  return (
    <li>
      <Link
        href="/medical/"
        className="group relative flex aspect-[46/29] items-center justify-center overflow-hidden rounded-[20px] after:pointer-events-none after:absolute after:inset-2.5 after:rounded-[20px] after:border-2 after:border-white after:opacity-0 after:transition-opacity after:duration-300 hover:after:opacity-100 focus-visible:after:opacity-100 motion-reduce:after:transition-none"
      >
        {/* すぐ隣に診療の名前があり、写真自体は情報を足さないのでaltは空にする */}
        <Image
          src={item.imageSrc}
          alt=""
          width={item.imageWidth}
          height={item.imageHeight}
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none"
        />
        {/* 白い文字を読みやすくするための膜。飾りなので読み上げの対象から外す */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/40 group-focus-visible:bg-black/40 motion-reduce:transition-none"
        />

        <div className="relative flex flex-col items-center gap-5 px-5 text-center text-white">
          <div className="flex flex-col items-center gap-5">
            <h3 className="text-xl/[1.5] font-bold tracking-[0.08em] lg:text-[28px]/[1.5]">
              {item.title}
            </h3>
            <span
              aria-hidden="true"
              className="h-0.5 w-[30px] rounded-[30px] bg-white lg:w-10"
            />
          </div>
          <p className="text-xs/[1.5] font-bold tracking-[0.08em] lg:text-base/[1.5]">
            {item.description}
          </p>
        </div>
      </Link>
    </li>
  );
}
