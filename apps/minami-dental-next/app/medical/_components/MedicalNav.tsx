import { ArrowDownIcon } from "@/components/icons/SmallIcons";
import type { MedicalGroup } from "@/lib/queries/medical";
import { getMedicalTypeTag } from "./medicalTypeTag";

interface MedicalNavProps {
  /** 診療タイプごとの診療（並びは groupMedicalsByType が決める） */
  groups: MedicalGroup[];
}

/**
 * ページ内の目次（Figma: nav-medical）。ボタンで下の各診療のカードへ飛ぶ。
 * グループ名は見出しにしない（下の帯の h2 と同じ文言が2回見出しとして読まれるため）。
 * 代わりにリストの名前にして、読み上げでも「一般診療 保険対象」のまとまりだと分かるようにする
 */
export function MedicalNav({ groups }: MedicalNavProps) {
  return (
    <nav aria-label="診療内容の目次" className="flex flex-col gap-20">
      {groups.map((group) => {
        const tag = getMedicalTypeTag(group.type.slug);
        const labelId = `medical-nav-${group.type.slug}`;

        return (
          <div key={group.type.slug} className="flex flex-col gap-[30px]">
            <p
              id={labelId}
              className="flex items-center gap-6 text-xl/[1.5] font-bold tracking-[0.08em] lg:text-[28px]/[1.5]"
            >
              {/* 空白を挟む：リストの名前として読み上げる時に「一般診療保険対象」と続けて読まれないように
                  （見た目は gap で空くので、行末の空白は表示に影響しない） */}
              {group.type.name}{" "}
              <span
                className={`flex h-[35px] items-center rounded-3xl px-3 text-sm/[1.5] tracking-[0.08em] text-white ${tag.badgeClassName}`}
              >
                {tag.label}
              </span>
            </p>
            <ul aria-labelledby={labelId} className="flex flex-col gap-4 lg:flex-row lg:flex-wrap">
              {group.medicals.map((medical) => (
                <li key={medical.slug}>
                  <MedicalNavButton href={`#medical-${medical.slug}`} label={medical.title} />
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

interface MedicalNavButtonProps {
  href: string;
  label: string;
}

/**
 * 下向き矢印ボタン（Figma: button-arrow-down-pc / button-arrow-down-sp）。
 * ページ内リンクなので next/link ではなく素の a にする（BackToTop と同じ。移動はブラウザのスクロールに任せる）。
 * ホバーで出る矢印の分だけ高さが伸びないよう、高さを固定して文字と矢印を上下の中央に置く
 * （Figmaのホバーの絵も高さ72pxのまま、文字が少し上がって下に矢印が出る）
 */
function MedicalNavButton({ href, label }: MedicalNavButtonProps) {
  return (
    <a
      href={href}
      className="group flex h-[60px] flex-col items-center justify-center gap-0.5 rounded-xl border border-main bg-white px-5 text-center text-xl/[1.5] font-bold tracking-[0.08em] text-main transition-colors hover:bg-main-light focus-visible:bg-main-light motion-reduce:transition-none lg:h-[72px] lg:border-2 lg:px-8 lg:text-2xl/[1.5]"
    >
      {label}
      <ArrowDownIcon className="hidden size-5 shrink-0 group-hover:block group-focus-visible:block" />
    </a>
  );
}
