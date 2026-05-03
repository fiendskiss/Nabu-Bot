-- Run this in the Supabase SQL Editor.
-- It creates the three public submission tables, adds one admin allowlist row,
-- and applies RLS so only the configured admin account can read/update/delete.
--
-- After this, update the Supabase magic-link email template for SSR:
-- Authentication -> Email Templates -> Magic Link
-- Change the URL target to:
-- {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/admin

create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default timezone('utc', now())
);

insert into public.admin_users (email)
values ('quitlong.shanne.r@gmail.com')
on conflict (email) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  preferred_date date not null,
  preferred_time time not null,
  focus text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'completed')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  subject text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'completed')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.newsletter_submissions (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  status text not null default 'new' check (status in ('new', 'in_progress', 'completed')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
before update on public.bookings
for each row
execute function public.set_updated_at();

drop trigger if exists contact_submissions_set_updated_at on public.contact_submissions;
create trigger contact_submissions_set_updated_at
before update on public.contact_submissions
for each row
execute function public.set_updated_at();

drop trigger if exists newsletter_submissions_set_updated_at on public.newsletter_submissions;
create trigger newsletter_submissions_set_updated_at
before update on public.newsletter_submissions
for each row
execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.bookings enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.newsletter_submissions enable row level security;

drop policy if exists "Admin can read admin_users" on public.admin_users;
create policy "Admin can read admin_users"
on public.admin_users
for select
to authenticated
using (public.is_admin());

drop policy if exists "Public can create bookings" on public.bookings;
create policy "Public can create bookings"
on public.bookings
for insert
to anon, authenticated
with check (true);

drop policy if exists "Admin can manage bookings" on public.bookings;
create policy "Admin can manage bookings"
on public.bookings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can create contact submissions" on public.contact_submissions;
create policy "Public can create contact submissions"
on public.contact_submissions
for insert
to anon, authenticated
with check (true);

drop policy if exists "Admin can manage contact submissions" on public.contact_submissions;
create policy "Admin can manage contact submissions"
on public.contact_submissions
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can create newsletter submissions" on public.newsletter_submissions;
create policy "Public can create newsletter submissions"
on public.newsletter_submissions
for insert
to anon, authenticated
with check (true);

drop policy if exists "Admin can manage newsletter submissions" on public.newsletter_submissions;
create policy "Admin can manage newsletter submissions"
on public.newsletter_submissions
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
