import { AlertTriangle, CornerDownRight, MessageCircle, RadioTower } from "lucide-react";
import { useState } from "react";
import { review } from "../../fixture/discussion";
import { matchReview } from "../../lib/similarity";
import type { RouteThread } from "../../lib/type";
import { KarmaBadge } from "./KarmaBadge";
import { ReplyComposer } from "./ReplyComposer";
import { VoteControl } from "./VoteControl";
import type {
  CastCommunityVoteAction,
  CommunityReplyView,
  CommunityThreadView,
  CreateCommunityReplyInput,
  CreateCommunityReplyResult,
} from "./type";

interface ReplyItemProp {
  item: CommunityReplyView;
  selectedReplyId: string | null;
  onReplySelect: (replyId: string | null) => void;
  onCreateReply: (input: Omit<CreateCommunityReplyInput, "contributorId">) => CreateCommunityReplyResult;
  onVote: (input: CastCommunityVoteAction) => void;
}

function ReplyItem({ item, selectedReplyId, onReplySelect, onCreateReply, onVote }: ReplyItemProp) {
  const isSelected = selectedReplyId === item.reply.replyId;
  return (
    <div className={`mt-2 border-l-2 pl-3 ${isSelected ? "border-ink" : "border-line"}`}>
      <div className="rounded-card bg-paper p-3">
        <p className="text-sm font-medium leading-relaxed text-ink-soft">{item.reply.body}</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <VoteControl
            acceptCount={item.tally.acceptCount}
            disputeCount={item.tally.disputeCount}
            currentVote={item.currentVote}
            onVote={(value) => onVote({ targetKind: "reply", replyId: item.reply.replyId, value })}
          />
          {item.depth < 3 ? (
            <button type="button" onClick={() => onReplySelect(isSelected ? null : item.reply.replyId)} className="inline-flex min-h-10 items-center gap-1.5 rounded-chip px-3 text-xs font-bold text-ink-soft">
              <CornerDownRight size={14} aria-hidden="true" /> Reply
            </button>
          ) : (
            <span className="text-[10px] font-bold text-ink-soft">Reply depth limit reached</span>
          )}
        </div>
        {isSelected && item.depth < 3 && (
          <ReplyComposer
            onCancel={() => onReplySelect(null)}
            onSubmit={(body) => {
              onCreateReply({ reportId: item.reply.reportId, parentReplyId: item.reply.replyId, body });
              onReplySelect(null);
            }}
          />
        )}
      </div>
      {item.child.map((child) => (
        <ReplyItem
          key={child.reply.replyId}
          item={child}
          selectedReplyId={selectedReplyId}
          onReplySelect={onReplySelect}
          onCreateReply={onCreateReply}
          onVote={onVote}
        />
      ))}
    </div>
  );
}

interface CommunityThreadProp {
  thread: RouteThread;
  view: CommunityThreadView;
  selectedReportId: string | null;
  selectedReplyId: string | null;
  onReportSelect: (reportId: string | null) => void;
  onReplySelect: (replyId: string | null) => void;
  onCreateReply: (input: Omit<CreateCommunityReplyInput, "contributorId">) => CreateCommunityReplyResult;
  onVote: (input: CastCommunityVoteAction) => void;
}

export function CommunityThread({
  thread,
  view,
  selectedReportId,
  selectedReplyId,
  onReportSelect,
  onReplySelect,
  onCreateReply,
  onVote,
}: CommunityThreadProp) {
  const [replyReportId, setReplyReportId] = useState<string | null>(null);
  const nodeReview = review.filter((item) => item.target === "node" && thread.nodeId.includes(item.targetId));
  const match = matchReview(`${thread.question} ${thread.body}`, nodeReview)[0];
  return (
    <div className="grid gap-3">
      <div className="rounded-card border border-line bg-paper p-3">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-ink-soft">Question · this route only</p>
        <h3 className="mt-1 text-base font-extrabold">{thread.question}</h3>
        <p className="mt-1 text-xs font-medium leading-relaxed text-ink-soft">{thread.body}</p>
        <p className="mt-2 text-[10px] font-bold text-ink-soft">Asked by {thread.askedBy} · {new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric" }).format(new Date(thread.askedAt))}</p>
        {match && (
          <p className="mt-3 rounded-card border border-line bg-surface p-2 text-[11px] font-medium text-ink-soft">
            <strong className="text-ink">Similarity-matched place context · {Math.round(match.similarity * 100)}%</strong><br />
            {match.review.body}
          </p>
        )}
      </div>
      {view.report.length === 0 ? (
        <p className="rounded-card border border-dashed border-line bg-surface p-4 text-sm font-medium text-ink-soft">No answer yet. Help the next commuter with what you know about this route.</p>
      ) : (
        view.report.map((item) => {
          const isExcluded = !item.tally.isScoringActive;
          const isSelected = selectedReportId === item.report.reportId;
          return (
            <article key={item.report.reportId} className={`rounded-card border bg-surface p-4 ${isSelected ? "border-ink shadow-soft" : "border-line"} ${isExcluded ? "opacity-70" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-chip border border-line bg-paper px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em]">
                    {item.report.kind === "answer" ? <MessageCircle size={12} aria-hidden="true" /> : <RadioTower size={12} aria-hidden="true" />}
                    {item.report.kind}
                  </span>
                  {item.report.segmentId && <span className="ml-2 font-mono text-[10px] font-bold text-ink-soft">{item.report.segmentId}</span>}
                </div>
                <KarmaBadge karma={item.karma} weight={item.weight} />
              </div>
              <p className={`mt-3 text-sm font-medium leading-relaxed ${isExcluded ? "line-through text-ink-soft" : "text-ink"}`}>{item.report.body}</p>
              {isExcluded && (
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-extrabold text-avoid">
                  <AlertTriangle size={14} aria-hidden="true" /> Disputed · excluded from route score.
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <VoteControl
                  acceptCount={item.tally.acceptCount}
                  disputeCount={item.tally.disputeCount}
                  currentVote={item.currentVote}
                  onVote={(value) => onVote({ targetKind: "report", reportId: item.report.reportId, value })}
                />
                <div className="flex gap-1">
                  <button type="button" onClick={() => onReportSelect(isSelected ? null : item.report.reportId)} className="min-h-10 rounded-chip px-3 text-xs font-bold text-ink-soft">{isSelected ? "Close" : "Open"}</button>
                  <button type="button" onClick={() => setReplyReportId(replyReportId === item.report.reportId ? null : item.report.reportId)} className="inline-flex min-h-10 items-center gap-1.5 rounded-chip px-3 text-xs font-bold text-ink-soft">
                    <CornerDownRight size={14} aria-hidden="true" /> Reply
                  </button>
                </div>
              </div>
              {replyReportId === item.report.reportId && (
                <ReplyComposer
                  onCancel={() => setReplyReportId(null)}
                  onSubmit={(body) => {
                    onCreateReply({ reportId: item.report.reportId, parentReplyId: null, body });
                    setReplyReportId(null);
                  }}
                />
              )}
              {item.reply.map((reply) => (
                <ReplyItem
                  key={reply.reply.replyId}
                  item={reply}
                  selectedReplyId={selectedReplyId}
                  onReplySelect={onReplySelect}
                  onCreateReply={onCreateReply}
                  onVote={onVote}
                />
              ))}
            </article>
          );
        })
      )}
      {view.invalidReply.length > 0 && (
        <p role="status" className="rounded-card border border-manageable/40 bg-manageable/10 p-3 text-xs font-bold text-ink-soft">
          {view.invalidReply.length} invalid reply hidden safely.
        </p>
      )}
    </div>
  );
}
