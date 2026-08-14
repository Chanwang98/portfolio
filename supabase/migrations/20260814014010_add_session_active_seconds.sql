alter table public.analytics_sessions
  add column if not exists active_seconds integer null;
