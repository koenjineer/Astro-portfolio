import Image from "next/image";

interface FlowStep {
  step: string;
  title: string;
  description: string;
  note?: string;
}

const FLOW_STEPS: FlowStep[] = [
  {
    step: "01",
    title: "お問い合わせ",
    description:
      "お問い合わせフォームより必要事項を誤入力の上、お申し込みください",
  },
  {
    step: "02",
    title: "ご提案",
    description:
      "ご依頼の背景をお伺いし、必要なスキルと習得期間から最適なプランをご提案いたします",
  },
  {
    step: "03",
    title: "日程調整",
    description:
      "研修日数と開始日を調整し、今後の流れ全体の段取りをご提案いたします",
  },
  {
    step: "04",
    title: "研修開始",
    description: "研修当日はお約束のお時間の30分前に講師が伺います。",
    note: "※キャンセルのご連絡は2日前までにお願いいたします",
  },
];

export function ServiceFlow() {
  return (
    <section
      aria-labelledby="service-flow-heading"
      className="relative flex flex-col items-center gap-10 overflow-hidden px-5 py-16 lg:gap-16 lg:px-[90px] lg:py-20"
    >
      <Image
        src="/images/service/flow-bg.webp"
        alt=""
        aria-hidden="true"
        fill
        loading="lazy"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-main/80" aria-hidden="true" />

      <h2
        id="service-flow-heading"
        className="relative text-xl font-bold text-white lg:text-2xl"
      >
        導入の流れ
      </h2>

      <ol className="relative grid w-full max-w-[1100px] grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {FLOW_STEPS.map((flowStep) => (
          <li
            key={flowStep.step}
            className="flex flex-col gap-4 rounded bg-white/90 p-6 text-center"
          >
            <p className="font-fira-sans text-accent-1 italic">
              <span className="text-4xl">{flowStep.step}</span>
              <br />
              <span className="text-xl">STEP</span>
            </p>
            <p className="text-lg font-bold text-main">{flowStep.title}</p>
            <p className="text-sm leading-6 text-contrast">
              {flowStep.description}
            </p>
            {flowStep.note && (
              <p className="text-sm leading-6 text-accent-2">
                {flowStep.note}
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
