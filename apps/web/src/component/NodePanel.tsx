import { MapPin, MessageCircle, Star, X } from "lucide-react";
import { reviewForTarget, summarizeReview } from "../lib/thread";
import type { PlaceNode, Review, RouteThread } from "../lib/type";
import { ReviewCard } from "./ReviewCard";

interface NodePanelProps {
  node: PlaceNode | null;
  review: Review[];
  thread: RouteThread[];
  onClose: () => void;
}

export function NodePanel({ node, review, thread, onClose }: NodePanelProps) {
  if (!node) {
    return (
      <section className="alitaptap-firefly-banner min-h-[86px] rounded-card border border-brand-navy p-4 pl-28 shadow-[0_14px_34px_rgb(8_34_55/0.13)]" aria-label="Place details">
        <div className="flex min-h-[52px] items-center">
          <div className="rounded-[8px] bg-brand-navy/95 px-2 py-1">
            <p className="text-sm font-extrabold text-surface">Select a place on the map</p>
            <p className="mt-0.5 text-xs font-medium text-surface/75">See reviews compiled for that place and route questions that mention it.</p>
          </div>
        </div>
      </section>
    );
  }

  const scopedReview = reviewForTarget("node", node.nodeId, review);
  const summary = summarizeReview("node", node.nodeId, review);
  const memberThread = thread.filter((item) => item.nodeId.includes(node.nodeId));

  return (
    <section className="rounded-card border border-line bg-surface p-4 shadow-soft" aria-labelledby="node-heading">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-card bg-ink text-surface"><MapPin size={21} aria-hidden="true" /></span>
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-soft">Place node · {node.kind}</p>
            <h2 id="node-heading" className="mt-1 truncate text-lg font-extrabold">{node.name}</h2>
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label="Close place details" className="grid size-11 shrink-0 place-items-center rounded-chip border border-line bg-paper"><X size={18} aria-hidden="true" /></button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex min-h-9 items-center gap-1.5 rounded-chip bg-paper px-3 text-xs font-extrabold">
          <Star size={14} className="text-manageable" fill="currentColor" aria-hidden="true" />
          {summary.ratingAverage ?? "No score"}{summary.ratingAverage !== null && "/5"} · {summary.reviewCount} review
        </span>
        <span className="inline-flex min-h-9 items-center gap-1.5 rounded-chip bg-paper px-3 text-xs font-extrabold">
          <MessageCircle size={14} aria-hidden="true" /> {memberThread.length} route question
        </span>
      </div>
      {memberThread.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {memberThread.map((item) => <span key={item.threadId} className="rounded-chip border border-line px-2 py-1 text-[10px] font-bold">{item.question}</span>)}
        </div>
      )}
      <div className="mt-4 grid max-h-64 gap-2 overflow-y-auto pr-1">
        {scopedReview.length > 0 ? scopedReview.map((item) => <ReviewCard key={item.reviewId} review={item} />) : (
          <p className="rounded-card bg-paper p-3 text-sm font-medium text-ink-soft">No one has reviewed this place yet. Alitaptap leaves it unknown.</p>
        )}
      </div>
    </section>
  );
}
