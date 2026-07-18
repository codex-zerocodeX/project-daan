import { ThumbsDown, ThumbsUp } from "lucide-react";
import type { CommunityVoteValue } from "./type";

interface VoteControlProp {
  acceptCount: number;
  disputeCount: number;
  currentVote: CommunityVoteValue | null;
  onVote: (value: CommunityVoteValue) => void;
}

export function VoteControl({ acceptCount, disputeCount, currentVote, onVote }: VoteControlProp) {
  return (
    <div className="inline-flex overflow-hidden rounded-chip border border-line bg-surface" aria-label="Community vote">
      <button
        type="button"
        aria-label={`Accept this report, ${acceptCount} accept`}
        aria-pressed={currentVote === "accept"}
        onClick={() => onVote("accept")}
        className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 px-3 text-xs font-extrabold ${currentVote === "accept" ? "bg-pleasant text-surface" : "text-pleasant"}`}
      >
        <ThumbsUp size={15} aria-hidden="true" /> {acceptCount}
      </button>
      <button
        type="button"
        aria-label={`Dispute this report, ${disputeCount} dispute`}
        aria-pressed={currentVote === "dispute"}
        onClick={() => onVote("dispute")}
        className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 border-l border-line px-3 text-xs font-extrabold ${currentVote === "dispute" ? "bg-avoid text-surface" : "text-avoid"}`}
      >
        <ThumbsDown size={15} aria-hidden="true" /> {disputeCount}
      </button>
    </div>
  );
}
