"use client";

import { useEffect, useState, type ReactNode } from "react";

const AUTOPLAY_INTERVAL_MS = 5000;

// 書き出した写真の実寸。PCは元の写真（2160×1470）から1.5倍の1620×1102。
// SPはFigmaにある元の写真が375×667しか無いので、引き伸ばさず1倍のまま（/rules/design-to-code.md）
const IMAGE_PC_WIDTH = 1620;
const IMAGE_PC_HEIGHT = 1102;
const IMAGE_SP_WIDTH = 375;
const IMAGE_SP_HEIGHT = 667;

const SLIDES = [1, 2, 3].map((number) => ({
  pcSrc: `/images/home/mainvisual${number}-pc.webp`,
  spSrc: `/images/home/mainvisual${number}-sp.webp`,
}));

interface MainVisualSliderProps {
  /** 写真の上に重ねるもの（キャッチコピー・Pick UPニュース）。写真とドットの間の重なり順に置く */
  children: ReactNode;
}

/**
 * ファーストビューの写真の切り替え（Figma: mainvisual__swiper / 写真は 19719:11090・19709:7468）。
 * 写真3枚を重ねて置き、5秒ごとにフェードで入れ替える。左下のドットでも切り替えられる。
 *
 * 作りは minami-dental-next のスライダーと同じ：
 * - 写真は飾り（alt=""）。伝えたいことはキャッチコピーにあるので、切り替わりを読み上げる aria-live は付けない
 * - 一時停止ボタンは付けない。動きを減らす設定なら自動送りを止め、ドットに触れている間も止める
 *   （操作しようとした直前に写真が変わるのを防ぐため）
 * - PCとSPで写真の切り抜きが違うので <picture> で出し分ける。md〜はPCの写真（横長の枠に合う）
 */
export function MainVisualSlider({ children }: MainVisualSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // ホバーとフォーカスは別々に持つ。1つの状態にすると、フォーカスしたままマウスを離しただけで自動送りが再開してしまう
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPaused = isHovered || isFocused;
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
    // ドットで手動で送った直後に、残っていた時間で続けて送られるのを防ぐため
    const timer = window.setTimeout(() => {
      setCurrentIndex((index) => (index + 1) % SLIDES.length);
    }, AUTOPLAY_INTERVAL_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [currentIndex, isPaused, prefersReducedMotion]);

  const pauseProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  };

  return (
    <div className="relative size-full overflow-hidden">
      {SLIDES.map((slide, index) => (
        <picture key={slide.pcSrc}>
          <source
            media="(min-width: 768px)"
            srcSet={slide.pcSrc}
            width={IMAGE_PC_WIDTH}
            height={IMAGE_PC_HEIGHT}
          />
          {/* 素のimg：<picture> の中では next/image で出し分けができないため（PageHero と同じ） */}
          <img
            src={slide.spSrc}
            alt=""
            width={IMAGE_SP_WIDTH}
            height={IMAGE_SP_HEIGHT}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : undefined}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-700 motion-reduce:transition-none ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        </picture>
      ))}

      {children}

      {/* ドット（Figma: mainvisual__pagenation）。点は8pxで中心の間隔24px。
          押せる範囲を24px四方に広げ、点の位置がFigma（左20px・下 SP12px / PC20px）に来るよう外側を8px戻す */}
      <div className="absolute bottom-1 left-3 flex md:bottom-3">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.pcSrc}
            type="button"
            onClick={() => setCurrentIndex(index)}
            aria-label={`${index + 1}枚目の写真を表示`}
            aria-current={index === currentIndex ? "true" : undefined}
            className="group flex size-6 cursor-pointer items-center justify-center"
            {...pauseProps}
          >
            {/* 今の写真の色 #d59b71 はルールセットの色（cr-*）に無いので、名前を作らずFigmaの値のまま置く */}
            <span
              className={`size-2 rounded-full transition-colors duration-300 motion-reduce:transition-none ${
                index === currentIndex
                  ? "bg-[#d59b71]"
                  : "bg-white group-hover:bg-[#d59b71] group-focus-visible:bg-[#d59b71]"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
