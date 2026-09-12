"use client";

import { useEffect, useState } from "react";
import { SliderChevronIcon } from "@/components/icons/HomeIcons";
import { CatchCopy } from "./CatchCopy";
import { HOME_SLIDES } from "./homeSlides";

const AUTOPLAY_INTERVAL_MS = 5000;

/**
 * メインビジュアルの写真の切り替え（Figma: slider）。写真3枚を5秒ごとに入れ替え、
 * 左右の矢印と左下のドットでも操作できる。
 *
 * 写真は飾りとして扱う（alt=""）。伝えたいことはキャッチコピーに書いてあり、
 * どの写真が出ていても意味は変わらないので、切り替わりを読み上げさせる aria-live は付けない。
 *
 * 一時停止のボタンは付けない（スタッフ紹介の写真の帯と同じ判断）。
 * 代わりに、動きを減らす設定の人には自動送りを止め、矢印・ドットに触れている間も止める
 * （操作しようとした直前に写真が変わる事故を防ぐため）。
 */
export function MainVisualSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => {
      setPrefersReducedMotion(motionQuery.matches);
    };

    syncPreference();
    motionQuery.addEventListener("change", syncPreference);

    return () => {
      motionQuery.removeEventListener("change", syncPreference);
    };
  }, []);

  useEffect(() => {
    if (isPaused || prefersReducedMotion) {
      return;
    }

    // setInterval ではなく currentIndex ごとに張り直す setTimeout にする。
    // 矢印やドットで手動で送った直後に、残っていた時間で続けて送られるのを防ぐため
    const timer = window.setTimeout(() => {
      setCurrentIndex((index) => (index + 1) % HOME_SLIDES.length);
    }, AUTOPLAY_INTERVAL_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [currentIndex, isPaused, prefersReducedMotion]);

  // 矢印・ドットに触れている間だけ自動送りを止める
  const pauseProps = {
    onMouseEnter: () => setIsPaused(true),
    onMouseLeave: () => setIsPaused(false),
    onFocus: () => setIsPaused(true),
    onBlur: () => setIsPaused(false),
  };

  return (
    <div className="px-5 lg:px-[60px]">
      <div className="relative mx-auto w-full max-w-[1160px]">
        {/* 写真は重ねて置き、今の1枚だけを不透明にする。切り抜きはここだけに付け、
            矢印・ドットは外側に置いて写真の端からはみ出せるようにする */}
        <div className="relative aspect-[335/447] overflow-hidden rounded-[20px] lg:aspect-[1160/520]">
          {HOME_SLIDES.map((slide, index) => (
            <picture key={slide.pcSrc}>
              <source
                media="(min-width: 1024px)"
                srcSet={slide.pcSrc}
                width={slide.pcWidth}
                height={slide.pcHeight}
              />
              {/* 素のimg：<picture> の中では next/image で出し分けができないため（PageHero と同じ） */}
              <img
                src={slide.spSrc}
                alt=""
                width={slide.spWidth}
                height={slide.spHeight}
                loading={index === 0 ? "eager" : "lazy"}
                className={`absolute inset-0 size-full object-cover transition-opacity duration-700 motion-reduce:transition-none ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            </picture>
          ))}

          {/* 写真の上に敷く薄い膜。白い文字を読みやすくするための飾り */}
          <div aria-hidden="true" className="absolute inset-0 bg-black/10" />
        </div>

        <CatchCopy />

        <SliderArrow
          direction="previous"
          onClick={() =>
            setCurrentIndex(
              (index) => (index - 1 + HOME_SLIDES.length) % HOME_SLIDES.length
            )
          }
          pauseProps={pauseProps}
        />
        <SliderArrow
          direction="next"
          onClick={() =>
            setCurrentIndex((index) => (index + 1) % HOME_SLIDES.length)
          }
          pauseProps={pauseProps}
        />

        {/* ドットは写真の左の外に、下端をそろえて縦に並べる（Figma: Pagination） */}
        <div className="absolute right-full bottom-[13px] mr-[3px] flex flex-col lg:bottom-0 lg:mr-2.5">
          {HOME_SLIDES.map((slide, index) => (
            <button
              key={slide.pcSrc}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`${index + 1}枚目の写真を表示`}
              aria-current={index === currentIndex ? "true" : undefined}
              // 点は6px（PCは8px）しかないので、押せる範囲を14px（PCは18px）に広げる
              className="group flex size-3.5 items-center justify-center lg:size-[18px]"
              {...pauseProps}
            >
              <span
                className={`size-1.5 rounded-full transition-colors duration-300 motion-reduce:transition-none lg:size-2 ${
                  index === currentIndex
                    ? "bg-main"
                    : "bg-contrast-light group-hover:bg-main group-focus-visible:bg-main"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface SliderArrowProps {
  direction: "previous" | "next";
  onClick: () => void;
  pauseProps: Record<string, () => void>;
}

/**
 * 写真の左右の端にまたがる丸い矢印（Figma: arrow-left / arrow-right）。
 * Figmaにホバーの指定が無いので、ページトップへ戻るボタンと同じ扱いにして main で塗り山形を白にする
 */
function SliderArrow({ direction, onClick, pauseProps }: SliderArrowProps) {
  const isPrevious = direction === "previous";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrevious ? "前の写真へ" : "次の写真へ"}
      className={`absolute top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-contrast-light shadow-default transition-colors duration-300 hover:bg-main hover:text-white focus-visible:bg-main focus-visible:text-white motion-reduce:transition-none lg:size-12 ${
        isPrevious ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"
      }`}
      {...pauseProps}
    >
      {/* 山形は左向きなので、次へのボタンだけ左右を反転させる */}
      <SliderChevronIcon
        className={`h-[56%] w-auto ${isPrevious ? "" : "rotate-180"}`}
      />
    </button>
  );
}
