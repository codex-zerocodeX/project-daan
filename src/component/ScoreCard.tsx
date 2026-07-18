import { Clock3, MoveRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Route } from "../lib/type";
import { verdictMeta } from "../lib/verdict";
import { WeatherChip } from "./WeatherChip";

interface ScoreCardProp {
  route: Route;
}

function useAnimatedScore(score: number) {
  const [displayScore, setDisplayScore] = useState(score);
  const previousScore = useRef(score);

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) {
      const frame = requestAnimationFrame(() => {
        previousScore.current = score;
        setDisplayScore(score);
      });
      return () => cancelAnimationFrame(frame);
    }

    const startedAt = performance.now();
    const startScore = previousScore.current;
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / 600, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(startScore + (score - startScore) * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        previousScore.current = score;
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return displayScore;
}

export function ScoreCard({ route }: ScoreCardProp) {
  const meta = verdictMeta[route.verdict];
  const VerdictIcon = meta.icon;
  const displayScore = useAnimatedScore(route.score);

  return (
    <section
      key={route.departureTime}
      className="score-transition rounded-card border border-line bg-surface p-5 shadow-[0_10px_30px_rgb(8_34_55/0.05)] lg:p-4"
      aria-labelledby="score-heading"
    >
      <span className="sr-only" aria-live="polite">
        Route score {route.score} out of 100. Verdict: {meta.label}.
      </span>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-ink-soft">Daan score</p>
          <div className="mt-1 flex items-end gap-2">
            <span className="text-[64px] font-extrabold leading-none tracking-[-0.065em] text-brand-navy" aria-hidden="true">
              {displayScore}
            </span>
            <span className="mb-1.5 text-sm font-bold text-ink-soft">/ 100</span>
          </div>
        </div>
        <div className={`flex items-center gap-2 rounded-chip bg-paper px-3 py-2 ${meta.className}`}>
          <VerdictIcon size={20} strokeWidth={2.4} aria-hidden="true" />
          <span id="score-heading" className="text-sm font-extrabold uppercase tracking-[0.08em]">
            {meta.label}
          </span>
        </div>
      </div>

      <p className="mt-2 max-w-[46ch] text-[15px] font-medium leading-relaxed text-ink-soft">{meta.description}. See the receipt for why.</p>

      <div className="my-4 h-px bg-line lg:my-2" />

      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-bold lg:mb-3">
        <span>{(route.distanceM / 1000).toFixed(1)} km</span>
        <MoveRight size={15} className="text-ink-soft" aria-hidden="true" />
        <span className="inline-flex items-center gap-1.5">
          <Clock3 size={15} className="text-ink-soft" aria-hidden="true" />
          {route.durationMin} min
        </span>
      </div>

      <WeatherChip weather={route.weather} />
    </section>
  );
}
