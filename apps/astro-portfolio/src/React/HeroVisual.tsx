import { useEffect, useState } from "react";
import { Lottie } from "lottie-react";
import heroWorkspace from "../assets/lottie/hero-workspace.json";

const HeroVisual = () => {
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setAutoplay(!mediaQuery.matches);
  }, []);

  return (
    <div className="hidden lg:flex items-center justify-center shrink-0 w-[300px] h-[300px]">
      <Lottie
        src={heroWorkspace}
        loop={autoplay}
        autoplay={autoplay}
        className="w-full h-full"
      />
    </div>
  );
};

export default HeroVisual;
