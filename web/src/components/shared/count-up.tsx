import { useEffect, useMemo, useState } from "react";

type CountUpProps = {
  end: number;
  suffix?: string;
  durationMs?: number;
};

export function CountUp({ end, suffix = "", durationMs = 1100 }: CountUpProps) {
  const [value, setValue] = useState(0);
  const safeEnd = useMemo(() => Math.max(0, end), [end]);

  useEffect(() => {
    let frame = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(safeEnd * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [safeEnd, durationMs]);

  return (
    <span>
      {value}
      {suffix}
    </span>
  );
}
