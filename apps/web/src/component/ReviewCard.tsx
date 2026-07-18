import { Star } from "lucide-react";
import type { Review } from "../lib/type";

interface ReviewCardProps {
  review: Review;
  similarity?: number;
}

export function ReviewCard({ review, similarity }: ReviewCardProps) {
  return (
    <article className="rounded-card border border-line bg-paper p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-extrabold">{review.authorName}</span>
        <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-manageable">
          <Star size={13} fill="currentColor" aria-hidden="true" /> {review.rating}/5
        </span>
      </div>
      <p className="mt-2 text-sm font-medium leading-relaxed text-ink-soft">{review.body}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-bold text-ink-soft">
        <span>{new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric" }).format(new Date(review.createdAt))}</span>
        {similarity !== undefined && <span className="rounded-chip border border-line bg-surface px-2 py-1">{Math.round(similarity * 100)}% similar context</span>}
      </div>
    </article>
  );
}
