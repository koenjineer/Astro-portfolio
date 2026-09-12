import { SectionHeading } from "@/components/heading/SectionHeading";
import { ContentWidth } from "@/components/layout/ContentWidth";
import type { MedicalGroup } from "@/lib/queries/medical";
import { MedicalCard } from "./MedicalCard";
import { WaveBackground } from "./WaveBackground";

interface MedicalSectionProps {
  group: MedicalGroup;
}

/** 診療タイプ1つ分の水色の帯（Figma: bg-section-pc / bg-section-sp）。帯は画面の端から端まで、中身は幅の上限1000px */
export function MedicalSection({ group }: MedicalSectionProps) {
  return (
    <section>
      <WaveBackground edge="top" />
      {/* PCは上の波のすぐ下から見出しが始まるので上の余白なし。
          下の余白は「下の波を重ねる分＋カードとの間」。SPは波を重ねる量が画面幅の14.4%で幅に比例して増えるので、
          余白も同じ割合で増やす（固定だと広いSP幅で波のキラキラが最後のカードに掛かる。375px幅で62px＝Figmaどおり）。
          PCはFigmaどおり85px固定 */}
      <div className="bg-main-light pt-[30px] pb-[calc(14.4%+8px)] lg:pt-0 lg:pb-[85px]">
        <ContentWidth>
          <div className="flex flex-col gap-10 lg:gap-[60px]">
            <SectionHeading>{group.type.name}</SectionHeading>
            <div className="flex flex-col gap-10">
              {group.medicals.map((medical) => (
                <MedicalCard key={medical.slug} medical={medical} />
              ))}
            </div>
          </div>
        </ContentWidth>
      </div>
      <WaveBackground edge="bottom" />
    </section>
  );
}
