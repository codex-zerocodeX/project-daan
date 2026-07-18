import { Info } from "lucide-react";

interface FallbackBannerProp {
  fetchedAt: string;
}

export function FallbackBanner({ fetchedAt }: FallbackBannerProp) {
  const timestamp = new Intl.DateTimeFormat("en-PH", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Manila",
  }).format(new Date(fetchedAt));

  return (
    <div className="flex items-center gap-2 border-b border-brand-gold/35 bg-brand-gold/10 px-5 py-2 text-xs font-semibold text-ink sm:px-7 lg:px-9">
      <Info size={15} className="shrink-0 text-brand-teal" aria-hidden="true" />
      <span>Live data unavailable — showing the disclosed route fixture captured at {timestamp}.</span>
    </div>
  );
}
