-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).

create extension if not exists "pgcrypto";

create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  detail text default '',
  metric text,
  role text,
  category text not null check (category in ('impact', 'shipped', 'learned', 'recognition')),
  entry_date date not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table entries enable row level security;

-- This app has no login system — it's a single-user personal tool guarded
-- only by knowledge of your Supabase URL/anon key. That's fine for a
-- private brag document, but don't reuse this policy for anything with
-- data you'd mind becoming public if the keys leaked.
create policy "public read" on entries for select using (true);
create policy "public insert" on entries for insert with check (true);
create policy "public delete" on entries for delete using (true);

create index if not exists entries_entry_date_idx on entries (entry_date desc);
