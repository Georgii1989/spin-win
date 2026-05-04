create extension if not exists pgcrypto;

create table if not exists public.leaderboard_scores (
  id uuid primary key default gen_random_uuid(),
  wallet text not null unique,
  username text not null,
  credits bigint not null default 0,
  total_spins integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.chain_events (
  id uuid primary key default gen_random_uuid(),
  tx_hash text not null unique,
  wallet text,
  amount numeric not null default 0,
  token_symbol text,
  event_type text not null default 'unknown',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists leaderboard_scores_credits_idx
  on public.leaderboard_scores (credits desc, updated_at desc);

create index if not exists chain_events_wallet_idx
  on public.chain_events (wallet, created_at desc);

create or replace function public.touch_leaderboard_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_touch_leaderboard_updated_at on public.leaderboard_scores;
create trigger trg_touch_leaderboard_updated_at
before update on public.leaderboard_scores
for each row execute function public.touch_leaderboard_updated_at();
