-- NutriAI per-user email reminder storage
-- Run this file in Supabase Dashboard > SQL Editor.
--
-- The browser signs in with Supabase Anonymous Auth.
-- Anonymous Auth users receive an authenticated user ID.
-- RLS ensures each browser session can access only its own reminder row.

create table if not exists public.reminders (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  profile_name text not null default '',
  reminder_time time not null default '18:00',
  timezone text not null default 'Asia/Kolkata',
  frequency text not null default 'daily'
    check (frequency in ('daily','weekdays','custom')),
  custom_days smallint[] not null default array[1,2,3,4,5,6,7]::smallint[],
  reminder_types jsonb not null default
    '{"daily_plan":true,"hydration":true,"sports":false,"weekly_report":false}'::jsonb,
  enabled boolean not null default true,
  consent boolean not null default false,
  last_sent_at timestamptz,
  test_requested_at timestamptz,
  test_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint reminders_email_basic_check
    check (position('@' in email) > 1 and length(email) <= 320),

  constraint reminders_custom_days_check
    check (
      custom_days <@ array[1,2,3,4,5,6,7]::smallint[]
      and cardinality(custom_days) >= 1
    )
);

alter table public.reminders enable row level security;

-- Anonymous-auth users use the "authenticated" Postgres role.
grant select, insert, update, delete
on table public.reminders
to authenticated;

drop policy if exists "Users can read own reminder" on public.reminders;
create policy "Users can read own reminder"
on public.reminders
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own reminder" on public.reminders;
create policy "Users can insert own reminder"
on public.reminders
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own reminder" on public.reminders;
create policy "Users can update own reminder"
on public.reminders
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own reminder" on public.reminders;
create policy "Users can delete own reminder"
on public.reminders
for delete
to authenticated
using ((select auth.uid()) = user_id);

create index if not exists reminders_enabled_idx
on public.reminders(enabled);

create index if not exists reminders_test_requested_idx
on public.reminders(test_requested_at);
