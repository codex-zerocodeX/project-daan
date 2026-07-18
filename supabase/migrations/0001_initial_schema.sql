-- Komyut initial schema. Apply via Supabase SQL editor (paste whole file)
-- or `supabase db push` if using the CLI. See docs/setup.md.

create extension if not exists postgis;

create type public.thread_category as enum
  ('route', 'terminal', 'hazard', 'walkability', 'general');

-- profiles: one row per auth user, auto-created on signup
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null check (char_length(username) between 3 and 30),
  karma integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.threads (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  body text not null check (char_length(body) <= 5000),
  category public.thread_category not null default 'general',
  geom geometry(Geometry, 4326),
  image_url text,
  created_at timestamptz not null default now()
);

create table public.votes (
  thread_id uuid not null references public.threads (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  primary key (thread_id, user_id)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.threads (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  image_url text,
  created_at timestamptz not null default now()
);

create index threads_geom_idx on public.threads using gist (geom);
create index threads_created_at_idx on public.threads (created_at desc);
create index comments_thread_id_idx on public.comments (thread_id);

-- auto-create a profile when a user signs up
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', 'user_' || left(new.id::text, 8))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security: public read, authenticated users write their own rows
alter table public.profiles enable row level security;
alter table public.threads enable row level security;
alter table public.votes enable row level security;
alter table public.comments enable row level security;

create policy "profiles are readable by everyone"
  on public.profiles for select using (true);
create policy "users update own profile"
  on public.profiles for update using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "threads are readable by everyone"
  on public.threads for select using (true);
create policy "users create own threads"
  on public.threads for insert to authenticated
  with check ((select auth.uid()) = author_id);
create policy "users update own threads"
  on public.threads for update using ((select auth.uid()) = author_id)
  with check ((select auth.uid()) = author_id);
create policy "users delete own threads"
  on public.threads for delete using ((select auth.uid()) = author_id);

create policy "votes are readable by everyone"
  on public.votes for select using (true);
create policy "users create own votes"
  on public.votes for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "users update own votes"
  on public.votes for update using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "users delete own votes"
  on public.votes for delete using ((select auth.uid()) = user_id);

create policy "comments are readable by everyone"
  on public.comments for select using (true);
create policy "users create own comments"
  on public.comments for insert to authenticated
  with check ((select auth.uid()) = author_id);
create policy "users update own comments"
  on public.comments for update using ((select auth.uid()) = author_id)
  with check ((select auth.uid()) = author_id);
create policy "users delete own comments"
  on public.comments for delete using ((select auth.uid()) = author_id);

-- public bucket for thread image attachments
insert into storage.buckets (id, name, public)
values ('thread-images', 'thread-images', true)
on conflict (id) do nothing;

create policy "thread images are publicly readable"
  on storage.objects for select using (bucket_id = 'thread-images');
create policy "authenticated users upload thread images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'thread-images');
