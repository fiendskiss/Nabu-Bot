-- Run this once in the Supabase SQL Editor for an existing database.
-- It updates the submission status constraints to allow:
-- new, pending, confirmed, cancelled, completed.

alter table public.bookings
drop constraint if exists bookings_status_check;
update public.bookings
set status = 'pending'
where status = 'in_progress';
alter table public.bookings
add constraint bookings_status_check
check (status in ('new', 'pending', 'confirmed', 'cancelled', 'completed'));

alter table public.contact_submissions
drop constraint if exists contact_submissions_status_check;
update public.contact_submissions
set status = 'pending'
where status = 'in_progress';
alter table public.contact_submissions
add constraint contact_submissions_status_check
check (status in ('new', 'pending', 'confirmed', 'cancelled', 'completed'));

alter table public.newsletter_submissions
drop constraint if exists newsletter_submissions_status_check;
update public.newsletter_submissions
set status = 'pending'
where status = 'in_progress';
alter table public.newsletter_submissions
add constraint newsletter_submissions_status_check
check (status in ('new', 'pending', 'confirmed', 'cancelled', 'completed'));
