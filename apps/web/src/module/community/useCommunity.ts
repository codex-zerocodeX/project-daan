import { useMemo, useSyncExternalStore } from "react";
import { createBrowserCommunityRepository } from "./repository";
import type {
  CastCommunityVoteAction,
  CommunityRepository,
  CreateCommunityReplyInput,
  CreateCommunityReportInput,
} from "./type";

let browserRepository: CommunityRepository | null = null;

function repository() {
  browserRepository ??= createBrowserCommunityRepository();
  return browserRepository;
}

export function useCommunity(threadId: string[]) {
  const communityRepository = repository();
  const snapshot = useSyncExternalStore(
    communityRepository.subscribe,
    communityRepository.getSnapshot,
    communityRepository.getSnapshot,
  );
  const threadView = useMemo(
    () => {
      void snapshot.state;
      return threadId.map((item) => communityRepository.queryThread(item, snapshot.contributorId));
    },
    [communityRepository, snapshot.contributorId, snapshot.state, threadId],
  );
  return {
    snapshot,
    threadView,
    getProjection: communityRepository.getProjection,
    createReport: (input: Omit<CreateCommunityReportInput, "contributorId">) =>
      communityRepository.createReport({ ...input, contributorId: snapshot.contributorId }),
    createReply: (input: Omit<CreateCommunityReplyInput, "contributorId">) =>
      communityRepository.createReply({ ...input, contributorId: snapshot.contributorId }),
    castVote: (input: CastCommunityVoteAction) =>
      communityRepository.castVote({ ...input, contributorId: snapshot.contributorId }),
  };
}
