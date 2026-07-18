import { useQuery } from "@tanstack/react-query";
import type { Thread } from "@alitaptap/shared";
import { apiGet } from "../lib/api";

export function useThreads() {
  return useQuery({
    queryKey: ["threads"],
    queryFn: () => apiGet<Thread[]>("/v1/threads"),
  });
}
