import { SectionHeading } from "@/components/heading/SectionHeading";
import { WaveBand } from "@/components/layout/WaveBand";
import type { MedicalGroup } from "@/lib/queries/medical";
import { MedicalCard } from "./MedicalCard";

interface MedicalSectionProps {
  group: MedicalGroup;
}

/** 診療タイプ1つ分の水色の帯（Figma: bg-section-pc / bg-section-sp） */
export function MedicalSection({ group }: MedicalSectionProps) {
  return (
    <section>
      <WaveBand>
        <SectionHeading>{group.type.name}</SectionHeading>
        <div className="flex flex-col gap-10">
          {group.medicals.map((medical) => (
            <MedicalCard key={medical.slug} medical={medical} />
          ))}
        </div>
      </WaveBand>
    </section>
  );
}
