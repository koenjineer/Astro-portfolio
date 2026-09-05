"use client";

import Image from "next/image";
import { useId, useState } from "react";
import type { FaqItem } from "@/lib/queries/service";

const PANEL_TRANSITION_MS = 300;

interface ServiceFaqProps {
  items: FaqItem[];
}

interface ServiceFaqRowProps {
  item: FaqItem;
  isOpen: boolean;
  panelId: string;
  onToggle: () => void;
}

function ServiceFaqRow({ item, isOpen, panelId, onToggle }: ServiceFaqRowProps) {
  return (
    <li className="py-6">
      <h3>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full cursor-pointer items-start justify-between gap-4 text-left"
        >
          <span
            className={`text-base font-bold transition-colors duration-300 lg:text-xl ${
              isOpen ? "text-accent-2" : "text-contrast"
            }`}
          >
            {item.question}
          </span>
          {/* 開閉でアイコンを差し替えるが、表示切り替えでは動きが出ないため重ねてフェードさせる */}
          <span aria-hidden="true" className="relative mt-1 size-[30px] shrink-0">
            <Image
              src="/images/service/icon-plus.svg"
              alt=""
              width={21}
              height={21}
              loading="lazy"
              className={`absolute inset-0 m-auto transition-opacity duration-300 ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <Image
              src="/images/service/icon-close.svg"
              alt=""
              width={30}
              height={30}
              loading="lazy"
              className={`absolute inset-0 transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "opacity-0"
              }`}
            />
          </span>
        </button>
      </h3>

      {/* 高さautoは補間できないため、回答が必ず収まる高さ（SP最長176px）までmax-heightを開く */}
      <div
        id={panelId}
        style={{ transition: `max-height ${PANEL_TRANSITION_MS}ms ease-out` }}
        className={`overflow-hidden motion-reduce:transition-none ${
          isOpen ? "max-h-60" : "max-h-0"
        }`}
      >
        <p className="pt-4 text-sm leading-6 font-medium text-contrast">
          {item.answer}
        </p>
      </div>
    </li>
  );
}

export function ServiceFaq({ items }: ServiceFaqProps) {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const panelIdPrefix = useId();

  return (
    <section
      aria-labelledby="service-faq-heading"
      className="flex flex-col items-center gap-10 px-5 py-16 lg:gap-14 lg:px-[90px] lg:py-20"
    >
      <h2
        id="service-faq-heading"
        className="text-xl font-bold text-contrast lg:text-2xl"
      >
        よくある質問
      </h2>

      <ul className="w-full max-w-[688px] divide-y divide-[#ddd] border-t border-[#ddd]">
        {items.map((item, index) => (
          <ServiceFaqRow
            key={item.question}
            item={item}
            isOpen={openQuestion === item.question}
            panelId={`${panelIdPrefix}-panel-${index}`}
            onToggle={() =>
              setOpenQuestion(
                openQuestion === item.question ? null : item.question,
              )
            }
          />
        ))}
      </ul>
    </section>
  );
}
