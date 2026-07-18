import { Send } from "lucide-react";
import { useState } from "react";

interface ReplyComposerProp {
  onSubmit: (body: string) => void;
  onCancel: () => void;
}

export function ReplyComposer({ onSubmit, onCancel }: ReplyComposerProp) {
  const [body, setBody] = useState("");
  return (
    <form
      className="mt-2 rounded-card border border-line bg-surface p-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (!body.trim()) return;
        onSubmit(body.trim());
        setBody("");
      }}
    >
      <label className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-ink-soft">
        Reply
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={2}
          maxLength={320}
          placeholder="Add useful context, not just agreement."
          className="mt-1 block w-full resize-none rounded-[9px] border border-line bg-paper p-2 text-sm font-medium normal-case tracking-normal text-ink outline-none"
        />
      </label>
      <div className="mt-2 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="min-h-10 rounded-chip px-3 text-xs font-bold text-ink-soft">Cancel</button>
        <button type="submit" disabled={!body.trim()} className="inline-flex min-h-10 items-center gap-1.5 rounded-chip bg-ink px-3 text-xs font-extrabold text-surface disabled:opacity-40">
          <Send size={14} aria-hidden="true" /> Post reply
        </button>
      </div>
    </form>
  );
}
