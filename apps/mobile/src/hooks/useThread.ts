import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

/**
 * One thread plus its community answers, read straight from Supabase under RLS
 * (CRUD does not go through apps/api - see AGENTS.md).
 *
 * The embed below is disambiguated on purpose. Both `threads` and `routes`
 * reach `profiles` by two different paths: the author foreign key, and the
 * many-to-many implied by the vote tables (votes / route_votes). PostgREST
 * refuses an ambiguous embed with PGRST201, so each author embed names its
 * foreign key explicitly.
 */

export type ThreadAuthor = { username: string; karma: number };

export type AnswerNode = {
  id: string;
  seq: number;
  lat: number;
  lng: number;
  label: string;
  image_url: string | null;
};

export type Answer = {
  id: string;
  author_id: string;
  summary: string;
  created_at: string;
  author: ThreadAuthor | null;
  nodes: AnswerNode[];
  /** Net score: upvotes minus downvotes on this answer. */
  score: number;
};

export type ThreadDetail = {
  id: string;
  title: string;
  body: string;
  category: string;
  image_url: string | null;
  created_at: string;
  author: ThreadAuthor | null;
  answers: Answer[];
};

const SELECT = `
  id, title, body, category, image_url, created_at,
  author:profiles!threads_author_id_fkey ( username, karma ),
  routes (
    id, author_id, summary, created_at,
    author:profiles!routes_author_id_fkey ( username, karma ),
    route_votes ( value ),
    nodes ( id, seq, lat, lng, label, image_url )
  )
`;

/** Shape PostgREST returns for the select above, before we reshape it. */
type RawRoute = {
  id: string;
  author_id: string;
  summary: string;
  created_at: string;
  author: ThreadAuthor | null;
  route_votes: { value: number }[] | null;
  nodes: AnswerNode[] | null;
};

type RawThread = {
  id: string;
  title: string;
  body: string;
  category: string;
  image_url: string | null;
  created_at: string;
  author: ThreadAuthor | null;
  routes: RawRoute[] | null;
};

function toAnswer(route: RawRoute): Answer {
  const score = (route.route_votes ?? []).reduce(
    (sum, vote) => sum + vote.value,
    0,
  );
  return {
    id: route.id,
    author_id: route.author_id,
    summary: route.summary,
    created_at: route.created_at,
    author: route.author,
    // Steps are only meaningful in order; `seq` is the ordering column.
    nodes: [...(route.nodes ?? [])].sort((a, b) => a.seq - b.seq),
    score,
  };
}

/**
 * Most useful answer first: highest net vote score, ties broken by oldest
 * first so the ordering is stable and does not shuffle between renders.
 */
function byUsefulness(a: Answer, b: Answer): number {
  if (b.score !== a.score) return b.score - a.score;
  return a.created_at.localeCompare(b.created_at);
}

export function useThread(id: string | undefined) {
  return useQuery({
    queryKey: ["thread", id],
    enabled: !!id,
    queryFn: async (): Promise<ThreadDetail | null> => {
      const { data, error } = await supabase
        .from("threads")
        .select(SELECT)
        .eq("id", id!)
        .maybeSingle();

      // A missing thread is `data: null` with no error, which the screen
      // renders as "not found" rather than as a failure.
      if (error) throw new Error(error.message);
      if (!data) return null;

      const raw = data as unknown as RawThread;
      return {
        id: raw.id,
        title: raw.title,
        body: raw.body,
        category: raw.category,
        image_url: raw.image_url,
        created_at: raw.created_at,
        author: raw.author,
        answers: (raw.routes ?? []).map(toAnswer).sort(byUsefulness),
      };
    },
  });
}
