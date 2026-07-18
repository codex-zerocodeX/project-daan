-- Komyut 0002: answer-routes, nodes, route votes, karma.
-- Apply via Supabase SQL editor (paste whole file) or `supabase db push`.
-- Depends on 0001 (profiles, threads, votes, postgis, thread-images bucket).

-- An answer to a thread is a route: an ordered set of nodes (map points that
-- form the step-by-step directions). A thread can have many answer-routes.
create table public.routes (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.threads (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  summary text not null default '' check (char_length(summary) <= 2000),
  created_at timestamptz not null default now()
);

-- A single step on an answer-route. geom is derived from lng/lat for PostGIS.
create table public.nodes (
  id uuid primary key default gen_random_uuid(),
  route_id uuid not null references public.routes (id) on delete cascade,
  seq integer not null check (seq >= 0),
  lat double precision not null check (lat between -90 and 90),
  lng double precision not null check (lng between -180 and 180),
  label text not null default '' check (char_length(label) <= 500),
  image_url text,
  geom geometry(Point, 4326) generated always as
    (st_setsrid(st_makepoint(lng, lat), 4326)) stored,
  created_at timestamptz not null default now(),
  unique (route_id, seq)
);

-- Up/down votes on an answer-route. These (plus 0001's thread votes) drive karma.
create table public.route_votes (
  route_id uuid not null references public.routes (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  primary key (route_id, user_id)
);

create index routes_thread_id_idx on public.routes (thread_id);
create index nodes_route_id_seq_idx on public.nodes (route_id, seq);
create index nodes_geom_idx on public.nodes using gist (geom);

-- Karma is derived, never hand-set: net votes on a user's threads + their routes.
create function public.recompute_karma(target uuid)
returns void
language sql
security definer set search_path = ''
as $$
  update public.profiles p
  set karma = coalesce((
        select sum(v.value) from public.votes v
        join public.threads t on t.id = v.thread_id
        where t.author_id = target
      ), 0)
      + coalesce((
        select sum(rv.value) from public.route_votes rv
        join public.routes r on r.id = rv.route_id
        where r.author_id = target
      ), 0)
  where p.id = target;
$$;

create function public.on_thread_vote_change()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  author uuid;
begin
  select t.author_id into author from public.threads t
    where t.id = coalesce(new.thread_id, old.thread_id);
  perform public.recompute_karma(author);
  return coalesce(new, old);
end;
$$;

create function public.on_route_vote_change()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  author uuid;
begin
  select r.author_id into author from public.routes r
    where r.id = coalesce(new.route_id, old.route_id);
  perform public.recompute_karma(author);
  return coalesce(new, old);
end;
$$;

create trigger votes_karma
  after insert or update or delete on public.votes
  for each row execute function public.on_thread_vote_change();

create trigger route_votes_karma
  after insert or update or delete on public.route_votes
  for each row execute function public.on_route_vote_change();

-- Row Level Security: public read, authenticated users write only their own rows.
alter table public.routes enable row level security;
alter table public.nodes enable row level security;
alter table public.route_votes enable row level security;

create policy "routes are readable by everyone"
  on public.routes for select using (true);
create policy "users create own routes"
  on public.routes for insert to authenticated
  with check ((select auth.uid()) = author_id);
create policy "users update own routes"
  on public.routes for update using ((select auth.uid()) = author_id)
  with check ((select auth.uid()) = author_id);
create policy "users delete own routes"
  on public.routes for delete using ((select auth.uid()) = author_id);

-- A node is writable only by the owner of its parent route.
create policy "nodes are readable by everyone"
  on public.nodes for select using (true);
create policy "users create nodes on own routes"
  on public.nodes for insert to authenticated
  with check ((select auth.uid()) = (
    select r.author_id from public.routes r where r.id = route_id));
create policy "users update nodes on own routes"
  on public.nodes for update using ((select auth.uid()) = (
    select r.author_id from public.routes r where r.id = route_id))
  with check ((select auth.uid()) = (
    select r.author_id from public.routes r where r.id = route_id));
create policy "users delete nodes on own routes"
  on public.nodes for delete using ((select auth.uid()) = (
    select r.author_id from public.routes r where r.id = route_id));

create policy "route votes are readable by everyone"
  on public.route_votes for select using (true);
create policy "users create own route votes"
  on public.route_votes for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "users update own route votes"
  on public.route_votes for update using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "users delete own route votes"
  on public.route_votes for delete using ((select auth.uid()) = user_id);

-- Node images reuse the existing public 'thread-images' bucket (see 0001).
