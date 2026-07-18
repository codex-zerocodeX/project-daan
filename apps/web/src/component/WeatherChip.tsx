import { CloudRain, ThermometerSun } from "lucide-react";
import type { Weather } from "../lib/type";

interface WeatherChipProp {
  weather: Weather;
}

export function WeatherChip({ weather }: WeatherChipProp) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Weather affecting this route">
      <span className="inline-flex items-center gap-1.5 rounded-chip border border-line bg-surface px-2.5 py-1.5 text-xs font-bold">
        <ThermometerSun size={15} className="text-harsh" aria-hidden="true" />
        Feels like {weather.apparentTemperatureC}°C
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-chip border border-line bg-surface px-2.5 py-1.5 text-xs font-bold">
        <CloudRain size={15} className="text-unknown" aria-hidden="true" />
        {weather.rainProbabilityPct}% rain
      </span>
      <span className="inline-flex items-center rounded-chip bg-paper px-2.5 py-1.5 font-mono text-[11px] font-bold text-ink-soft">
        weather ×{weather.multiplier.toFixed(2)}
      </span>
    </div>
  );
}
