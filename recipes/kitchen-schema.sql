create table if not exists public.kitchen_events (
  seq bigint generated always as identity,
  user_id uuid not null references auth.users(id) on delete cascade,
  op_id uuid not null,
  entity_key text not null check (length(entity_key) between 1 and 300),
  payload jsonb not null check (octet_length(payload::text) <= 1048576),
  deleted boolean not null default false,
  created_at timestamptz not null default now(),
  primary key(user_id,op_id)
);
create index if not exists kitchen_events_latest_idx on public.kitchen_events(user_id,entity_key,seq desc);
alter table public.kitchen_events enable row level security;
create policy kitchen_events_read_own on public.kitchen_events for select to authenticated using ((select auth.uid())=user_id);
create policy kitchen_events_insert_own on public.kitchen_events for insert to authenticated with check ((select auth.uid())=user_id);
revoke all on public.kitchen_events from anon, authenticated;
grant select on public.kitchen_events to authenticated;
grant insert(user_id,op_id,entity_key,payload,deleted) on public.kitchen_events to authenticated;
grant usage on sequence public.kitchen_events_seq_seq to authenticated;
create view public.kitchen_latest with (security_invoker=true) as
 select distinct on (user_id,entity_key) user_id,entity_key,payload,deleted,seq,created_at
 from public.kitchen_events order by user_id,entity_key,seq desc;
revoke all on public.kitchen_latest from anon;
grant select on public.kitchen_latest to authenticated;
