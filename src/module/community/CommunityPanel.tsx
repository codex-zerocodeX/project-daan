import { MessagesSquare, Route as RouteIcon } from "lucide-react";
import { CommunityThread } from "./CommunityThread";
import { ReportComposer } from "./ReportComposer";
import type { CommunityPanelProp } from "./type";

export function CommunityPanel({
  routeId,
  thread,
  segment,
  selectedThreadId,
  selectedReportId,
  selectedReplyId,
  threadView,
  onThreadSelect,
  onReportSelect,
  onReplySelect,
  onCreateReport,
  onCreateReply,
  onVote,
}: CommunityPanelProp) {
  if (thread.length === 0) return null;
  const activeThreadId = selectedThreadId && thread.some((item) => item.threadId === selectedThreadId) ? selectedThreadId : thread[0].threadId;
  const activeThread = thread.find((item) => item.threadId === activeThreadId) ?? thread[0];
  const activeView = threadView.find((item) => item.threadId === activeThread.threadId) ?? {
    threadId: activeThread.threadId,
    report: [],
    invalidReply: [],
  };

  return (
    <section className="rounded-card border border-line bg-surface p-4 shadow-soft" aria-labelledby="community-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-ink-soft">Commuter Q&amp;A · route-bound</p>
          <h2 id="community-heading" className="mt-1 flex items-center gap-2 text-xl font-extrabold tracking-[-0.03em]">
            <MessagesSquare size={20} aria-hidden="true" /> Questions for this route
          </h2>
          <p className="mt-1 max-w-[58ch] text-xs font-medium text-ink-soft">Ask and answer like a commuter forum. Every question, answer, vote, and reply stays attached to this exact A → B path.</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-chip bg-paper px-3 py-2 font-mono text-[10px] font-bold text-ink-soft">
          <RouteIcon size={13} aria-hidden="true" /> {routeId.slice(0, 28)}{routeId.length > 28 ? "…" : ""}
        </span>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Route discussion thread">
        {thread.map((item) => {
          const isSelected = item.threadId === activeThread.threadId;
          return (
            <button key={item.threadId} type="button" role="tab" aria-selected={isSelected} onClick={() => onThreadSelect(item.threadId)} className={`min-h-11 shrink-0 rounded-chip border px-3 text-left text-xs font-extrabold ${isSelected ? "border-ink bg-ink text-surface" : "border-line bg-paper text-ink"}`}>
              {item.question}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <ReportComposer thread={thread} segment={segment} selectedThreadId={activeThread.threadId} onCreate={onCreateReport} />
      </div>
      <div className="mt-4">
        <CommunityThread
          thread={activeThread}
          view={activeView}
          selectedReportId={selectedReportId}
          selectedReplyId={selectedReplyId}
          onReportSelect={onReportSelect}
          onReplySelect={onReplySelect}
          onCreateReply={onCreateReply}
          onVote={onVote}
        />
      </div>
    </section>
  );
}
