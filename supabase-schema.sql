-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).
-- If you already created the old (no-auth) version of this table, see the
-- migration block at the bottom instead of running this from scratch.

create extension if not exists "pgcrypto";

create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
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

-- Each user can only see and modify their own entries.
create policy "select own entries" on entries
  for select using (auth.uid() = user_id);

create policy "insert own entries" on entries
  for insert with check (auth.uid() = user_id);

create policy "delete own entries" on entries
  for delete using (auth.uid() = user_id);

create index if not exists entries_entry_date_idx on entries (entry_date desc);
create index if not exists entries_user_id_idx on entries (user_id);

-- ─────────────────────────────────────────────────────────────────────────
-- MIGRATION: if you already have the old table (no user_id, public RLS),
-- run this instead of the create table above:
--
-- alter table entries add column user_id uuid references auth.users(id) on delete cascade;
-- -- backfill existing rows with your own user id (find it in
-- -- Authentication > Users after you sign up), then:
-- -- update entries set user_id = 'YOUR-USER-UUID-HERE' where user_id is null;
-- alter table entries alter column user_id set not null;
--
-- drop policy if exists "public read" on entries;
-- drop policy if exists "public insert" on entries;
-- drop policy if exists "public delete" on entries;
--
-- create policy "select own entries" on entries for select using (auth.uid() = user_id);
-- create policy "insert own entries" on entries for insert with check (auth.uid() = user_id);
-- create policy "delete own entries" on entries for delete using (auth.uid() = user_id);
-- ─────────────────────────────────────────────────────────────────────────
