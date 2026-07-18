import { useCallback, useEffect, useState } from "react";
import { isSameCommunityUrl, normalizeCommunityUrl, readCommunityUrl, writeCommunityUrl, type CommunityUrlContext } from "./url";
import type { CommunityUrlState } from "./type";

function currentState() {
  return readCommunityUrl(new URL(window.location.href));
}

export function useCommunityUrl(context: CommunityUrlContext) {
  const [urlState, setUrlState] = useState<CommunityUrlState>(currentState);
  const [pendingState, setPendingState] = useState<CommunityUrlState | null>(null);
  const isPendingKnown = Boolean(
    pendingState &&
      (!pendingState.routeId || context.routeId.includes(pendingState.routeId)) &&
      (!pendingState.segmentId || context.segmentId.includes(pendingState.segmentId)) &&
      (!pendingState.threadId || context.threadId.includes(pendingState.threadId)) &&
      (!pendingState.reportId || context.reportId.includes(pendingState.reportId)) &&
      (!pendingState.replyId || context.replyId.includes(pendingState.replyId)),
  );
  const normalizedState = pendingState && isSameCommunityUrl(pendingState, urlState) && !isPendingKnown
    ? urlState
    : normalizeCommunityUrl(urlState, context);

  useEffect(() => {
    const onPopState = () => {
      setPendingState(null);
      setUrlState(currentState());
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (isSameCommunityUrl(normalizedState, urlState)) return;
    const nextUrl = writeCommunityUrl(new URL(window.location.href), normalizedState);
    window.history.replaceState(window.history.state, "", nextUrl);
  }, [isPendingKnown, normalizedState, urlState]);

  const navigateCommunity = useCallback((patch: Partial<CommunityUrlState>, isReplace = false) => {
    const next = { ...urlState, ...patch };
    if (isSameCommunityUrl(urlState, next)) return;
    const nextUrl = writeCommunityUrl(new URL(window.location.href), next);
    const method = isReplace ? "replaceState" : "pushState";
    window.history[method](window.history.state, "", nextUrl);
    setPendingState(next);
    setUrlState(next);
  }, [urlState]);

  return { urlState: normalizedState, navigateCommunity };
}
