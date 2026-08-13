create extension if not exists pgcrypto;

create table if not exists public.analytics_admins (
  email text primary key,
  created_at timestamptz not null default now()
);

create table if not exists public.analytics_sessions (
  session_id uuid primary key,
  visitor_hash text not null,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  ended_at timestamptz,
  page_path text not null default '/',
  referrer text,
  user_agent text,
  language text,
  country text,
  city text,
  ip_masked text,
  screen_width integer,
  screen_height integer
);

create table if not exists public.analytics_pageviews (
  id bigint generated always as identity primary key,
  session_id uuid not null references public.analytics_sessions(session_id) on delete cascade,
  visitor_hash text not null,
  occurred_at timestamptz not null default now(),
  page_path text not null default '/',
  referrer text,
  country text,
  city text,
  ip_masked text
);

create index if not exists analytics_sessions_last_seen_idx on public.analytics_sessions(last_seen desc);
create index if not exists analytics_sessions_first_seen_idx on public.analytics_sessions(first_seen desc);
create index if not exists analytics_pageviews_occurred_at_idx on public.analytics_pageviews(occurred_at desc);
create index if not exists analytics_pageviews_visitor_hash_idx on public.analytics_pageviews(visitor_hash, occurred_at desc);
create index if not exists analytics_pageviews_session_id_idx on public.analytics_pageviews(session_id);

alter table public.analytics_admins enable row level security;
alter table public.analytics_sessions enable row level security;
alter table public.analytics_pageviews enable row level security;

create policy "deny direct access" on public.analytics_admins for all to anon, authenticated using (false) with check (false);
create policy "deny direct access" on public.analytics_sessions for all to anon, authenticated using (false) with check (false);
create policy "deny direct access" on public.analytics_pageviews for all to anon, authenticated using (false) with check (false);

revoke all on table public.analytics_admins, public.analytics_sessions, public.analytics_pageviews from anon, authenticated;
revoke all on sequence public.analytics_pageviews_id_seq from anon, authenticated;
grant select, insert, update, delete on public.analytics_admins, public.analytics_sessions, public.analytics_pageviews to service_role;
grant usage, select on sequence public.analytics_pageviews_id_seq to service_role;

insert into public.analytics_admins(email)
values ('wangyaochen963@126.com')
on conflict (email) do nothing;
