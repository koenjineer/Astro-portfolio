import { MediaBlock } from "@/components/layout/MediaBlock";
import { UtilityButton } from "./UtilityButton";

/**
 * ホームのCONCEPT（Figma: media-pc / media-sp）。
 * 当院についての「ポリシーと特徴」と同じFigmaの部品なので、組みは MediaBlock に任せ、
 * ここでは文言・写真・ボタンだけを渡す
 */
export function ConceptSection() {
  return (
    <section>
      <MediaBlock
        eyebrow="CONCEPT"
        title={
          <>
            健康的で素敵な笑顔あふれる
            <br />
            街づくりを目指して
          </>
        }
        titleAs="h2"
        paragraphs={[
          <>
            私たちは最新の医療技術を追求すると共に、患者様とのコミュニケーションを大事にすることで、気軽に通いやすく些細なことでも相談できる「街の掛かり付け医」を目指しております。
            <br />
            お子様からご高齢の方まで、快適な空間で治療が受けられる場を作り、地域医療に貢献していきたいと考えております。
          </>,
        ]}
        imageSrc="/images/home/concept.webp"
        imageAlt="診療台で治療を行う歯科医師"
        imageSide="left"
        hasDeco
        action={<UtilityButton href="/about/">当院について</UtilityButton>}
      />
    </section>
  );
}
