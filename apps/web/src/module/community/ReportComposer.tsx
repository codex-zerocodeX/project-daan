import { MessageSquarePlus } from "lucide-react";
import { useState } from "react";
import type { CommunityKind, CommunitySegmentOption, CreateCommunityReportInput } from "./type";
import type { RouteThread } from "../../lib/type";

interface ReportComposerProp {
  thread: RouteThread[];
  segment: CommunitySegmentOption[];
  selectedThreadId: string | null;
  onCreate: (input: Omit<CreateCommunityReportInput, "routeId" | "contributorId">) => void;
}

const kindOption: { value: CommunityKind; label: string }[] = [
  { value: "answer", label: "Answer" },
  { value: "blocked", label: "Blocked" },
  { value: "flooded", label: "Flooded" },
  { value: "unlit", label: "Unlit" },
  { value: "queue", label: "Queue" },
];

export function ReportComposer({ thread, segment, selectedThreadId, onCreate }: ReportComposerProp) {
  const [isOpen, setIsOpen] = useState(false);
  const [threadId, setThreadId] = useState(selectedThreadId ?? thread[0]?.threadId ?? "");
  const [previousSelectedThreadId, setPreviousSelectedThreadId] = useState(selectedThreadId);
  const [segmentId, setSegmentId] = useState("");
  const [kind, setKind] = useState<CommunityKind>("answer");
  const [body, setBody] = useState("");

  if (selectedThreadId !== previousSelectedThreadId) {
    setPreviousSelectedThreadId(selectedThreadId);
    if (selectedThreadId) setThreadId(selectedThreadId);
  }

  if (!isOpen) {
    return (
      <button type="button" onClick={() => setIsOpen(true)} className="inline-flex min-h-11 items-center gap-2 rounded-chip bg-ink px-4 text-xs font-extrabold text-surface">
        <MessageSquarePlus size={16} aria-hidden="true" /> Answer this question
      </button>
    );
  }

  return (
    <form
      className="rounded-card border border-line bg-paper p-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (!threadId || !body.trim()) return;
        onCreate({ threadId, segmentId: segmentId || null, kind, body: body.trim() });
        setBody("");
        setIsOpen(false);
      }}
    >
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-ink-soft">
          Thread
          <select value={threadId} onChange={(event) => setThreadId(event.target.value)} className="mt-1 block min-h-11 w-full rounded-[9px] border border-line bg-surface px-2 text-xs font-bold normal-case tracking-normal text-ink">
            {thread.map((item) => <option key={item.threadId} value={item.threadId}>{item.question}</option>)}
          </select>
        </label>
        <label className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-ink-soft">
          Segment
          <select value={segmentId} onChange={(event) => setSegmentId(event.target.value)} className="mt-1 block min-h-11 w-full rounded-[9px] border border-line bg-surface px-2 text-xs font-bold normal-case tracking-normal text-ink">
            <option value="">Whole thread</option>
            {segment.map((item) => <option key={item.segmentId} value={item.segmentId}>{item.name}</option>)}
          </select>
        </label>
      </div>
      <fieldset className="mt-3">
        <legend className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-ink-soft">Kind</legend>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {kindOption.map((item) => (
            <button key={item.value} type="button" aria-pressed={kind === item.value} onClick={() => setKind(item.value)} className={`min-h-10 rounded-chip border px-3 text-xs font-bold ${kind === item.value ? "border-ink bg-ink text-surface" : "border-line bg-surface text-ink"}`}>
              {item.label}
            </button>
          ))}
        </div>
      </fieldset>
      <label className="mt-3 block text-[10px] font-extrabold uppercase tracking-[0.12em] text-ink-soft">
        Your answer
        <textarea value={body} onChange={(event) => setBody(event.target.value)} rows={3} maxLength={420} placeholder="Share what another commuter should know about this exact route." className="mt-1 block w-full resize-none rounded-[9px] border border-line bg-surface p-3 text-sm font-medium normal-case tracking-normal text-ink" />
      </label>
      <div className="mt-3 flex justify-end gap-2">
        <button type="button" onClick={() => setIsOpen(false)} className="min-h-11 rounded-chip px-3 text-xs font-bold text-ink-soft">Cancel</button>
        <button type="submit" disabled={!threadId || !body.trim()} className="min-h-11 rounded-chip bg-ink px-4 text-xs font-extrabold text-surface disabled:opacity-40">Post answer</button>
      </div>
    </form>
  );
}
