const FLOW_ALT_TEXT =
  "導入の流れ。" +
  "STEP1 お問い合わせ：お問い合わせフォームより必要事項をご入力の上、お申し込みください。" +
  "STEP2 ご提案：ご依頼の背景をお伺いし、必要なスキルと習得期間から最適なプランをご提案いたします。" +
  "STEP3 日程調整：研修日数と開始日を調整し、今後の流れ全体の段取りをご提案いたします。" +
  "STEP4 研修開始：研修当日はお約束のお時間の30分前に講師が伺います。※キャンセルのご連絡は2日前までにお願いいたします。";

export function ServiceFlow() {
  return (
    <section
      aria-labelledby="service-flow-heading"
      className="flex flex-col items-center gap-10 px-5 py-16 lg:gap-16 lg:px-[90px] lg:py-20"
    >
      <h2
        id="service-flow-heading"
        className="text-xl font-bold text-contrast lg:text-2xl"
      >
        導入の流れ
      </h2>

      <picture className="w-full max-w-[1100px]">
        <source
          media="(min-width: 1024px)"
          srcSet="/images/service/flow-pc.webp"
        />
        <img
          src="/images/service/flow-sp.webp"
          alt={FLOW_ALT_TEXT}
          width={503}
          height={963}
          loading="lazy"
          className="h-auto w-full"
        />
      </picture>
    </section>
  );
}
