import { useQuery } from "@tanstack/react-query";
import type { Thread } from "@daan/shared";
import { apiGet } from "../lib/api";

export function useThreads() {
  return useQuery({
    queryKey: ["threads"],
    queryFn: () => apiGet<Thread[]>("/v1/threads"),
  });
}
