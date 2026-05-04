import React, { useState, useEffect, useRef } from "react";

interface Stat {
  label: string;
  value: number;
  suffix: string;
}

const stats: Stat[] = [
  { label: "制作実績", value: 12, suffix: "件" },
  { label: "対応言語・技術", value: 10, suffix: "以上" },
  { label: "納品満足度", value: 100, suffix: "%" },
];

const CountUp = ({
  end,
  suffix,
  start,
}: {
  end: number;
  suffix: string;
  start: boolean;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    const duration = 1500;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(step);
  }, [end, start]);

  return (
    <>
      <span className="tabular-nums">{count}</span>
      <span className="text-xl md:text-2xl font-semibold ml-1">{suffix}</span>
    </>
  );
};

const StatsCounter = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full"
    >
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="bg-white rounded-2xl px-5 py-6 border border-[var(--white-icon-tr)] shadow-sm text-center"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="text-4xl md:text-5xl font-bold text-[var(--sec)] leading-none mb-2">
            <CountUp end={stat.value} suffix={stat.suffix} start={hasStarted} />
          </div>
          <div className="text-sm text-[var(--white-icon)] font-medium mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCounter;
