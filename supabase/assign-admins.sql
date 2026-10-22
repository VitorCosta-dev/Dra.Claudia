-- Run ONLY after both owners have registered and confirmed their email.
-- Replace the two placeholders with the actual verified administrator addresses
-- locally in Supabase SQL Editor. Do not commit private email addresses.
-- Review the returned rows first. Never use this as an automatic signup trigger.
select id, email, email_confirmed_at from auth.users
where lower(email) in (
  'FIRST_ADMIN_EMAIL',
  'SECOND_ADMIN_EMAIL'
);

-- When the two verified accounts above are correct, run separately:
-- insert into public.admins (user_id)
-- select id from auth.users
-- where email_confirmed_at is not null
--   and lower(email) in (
--     'FIRST_ADMIN_EMAIL',
--     'SECOND_ADMIN_EMAIL'
--   )
-- on conflict (user_id) do nothing;
