"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDE_NUMBERS = ["01", "02", "03"];
const SLIDE_INTERVAL_MS = 6000;

export function HomeMainVisual() {
  const [activeSlide, setActiveSlide] = useState(0);

  // 1枚前の写真は不透明のまま下に敷いておく。3枚を同時に薄くすると下地の白が
  // 透けて、切り替わりの一瞬だけ写真全体が白っぽく飛ぶため
  const previousSlide =
    (activeSlide - 1 + SLIDE_NUMBERS.length) % SLIDE_NUMBERS.length;

  useEffect(() => {
    // OSで「視差効果を減らす」を選んでいる人には切り替えず、1枚目だけを見せる
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % SLIDE_NUMBERS.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[607px] lg:h-[850px]">
      {/* 写真は右寄せで、左に余白（SP41px / PC90px）を残す */}
      {/* isolate：下に敷く写真の重ね順(z-10/z-20)をこの枠の中だけで解決させ、
          あとに続く見出しより前に出てこないようにする */}
      <div className="absolute top-0 right-0 left-[41px] isolate h-[607px] lg:left-[90px] lg:h-[700px]">
        {SLIDE_NUMBERS.map((slideNumber, index) => (
          <div
            key={slideNumber}
            aria-hidden="true"
            className={`absolute inset-0 transition-opacity duration-1000 motion-reduce:transition-none ${
              index === activeSlide
                ? "z-20 opacity-100"
                : index === previousSlide
                  ? "z-10 opacity-100"
                  : "opacity-0"
            }`}
          >
            <Image
              src={`/images/home/fv-${slideNumber}-sp.webp`}
              alt=""
              fill
              sizes="100vw"
              priority={index === 0}
              className="object-cover lg:hidden"
            />
            <Image
              src={`/images/home/fv-${slideNumber}-pc.webp`}
              alt=""
              fill
              sizes="100vw"
              priority={index === 0}
              className="hidden object-cover lg:block"
            />
          </div>
        ))}
      </div>

      {/* 白い箱は文字の外形そのもの。余白を足さず、行送りだけFigmaの箱の高さに合わせる */}
      <div className="absolute top-[387px] left-5 flex flex-col items-start gap-4 lg:top-[435px] lg:left-[50px]">
        <h1 className="flex flex-col items-start gap-2 font-fira-sans text-[40px] leading-[1.2] text-main italic lg:gap-4 lg:text-[60px]">
          {/* PCは「YOU CAN CHANGE」で1行、SPは「YOU CAN」「CHANGE」の2行に割れる */}
          <span className="bg-white">
            YOU CAN
            <span className="hidden lg:inline"> CHANGE</span>
          </span>
          <span className="bg-white lg:hidden">CHANGE</span>
          <span className="bg-white">THE WORLD</span>
        </h1>

        <p className="bg-main text-base font-bold text-white lg:text-xl">
          世界で活躍できるグローバルな人材を育てる
        </p>
      </div>
    </section>
  );
}
