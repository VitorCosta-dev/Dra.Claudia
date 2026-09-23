-- Run once in the Supabase SQL Editor, before accepting registrations.
-- Auth owns passwords. Patient information lives in this restricted table.
create function public.valid_cpf(value text)
returns boolean
language plpgsql
immutable
strict
set search_path = ''
as $$
declare
  size integer;
  i integer;
  total integer;
  digit integer;
begin
  if value !~ '^[0-9]{11}$' or value ~ '^([0-9])\1{10}$' then
    return false;
  end if;
  for size in 9..10 loop
    total := 0;
    for i in 1..size loop
      total := total + substring(value from i for 1)::integer * (size + 2 - i);
    end loop;
    digit := mod(total * 10, 11);
    if digit = 10 then digit := 0; end if;
    if digit <> substring(value from size + 1 for 1)::integer then
      return false;
    end if;
  end loop;
  return true;
end;
$$;

create table public.patients (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(trim(full_name)) between 2 and 150),
  email text not null,
  cpf text not null unique check (public.valid_cpf(cpf)),
  created_at timestamptz not null default now()
);

create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.patients enable row level security;
alter table public.admins enable row level security;

-- New tables are not automatically exposed in this project. Grant only reads
-- to authenticated users; RLS decides which rows are visible.
revoke all on public.patients from anon, authenticated;
revoke all on public.admins from anon, authenticated;
grant select on public.patients to authenticated;
grant select on public.admins to authenticated;

create policy "Administrators can identify their own membership"
  on public.admins for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Patients see themselves and admins see patients"
  on public.patients for select to authenticated
  using (
    user_id = (select auth.uid())
    or exists (
      select 1 from public.admins a where a.user_id = (select auth.uid())
    )
  );

-- Auth registration creates the patient row atomically. Do not grant visitors
-- INSERT/UPDATE permissions on either table. Metadata is validated on input.
create function public.create_patient_on_signup()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  patient_name text := trim(coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  patient_cpf text := coalesce(new.raw_user_meta_data ->> 'cpf', '');
begin
  if char_length(patient_name) not between 2 and 150
     or not public.valid_cpf(patient_cpf) then
    raise exception 'Invalid patient registration';
  end if;
  insert into public.patients (user_id, full_name, email, cpf)
  values (new.id, patient_name, lower(new.email), patient_cpf);
  return new;
end;
$$;

create trigger on_auth_user_created_patient
  after insert on auth.users
  for each row execute function public.create_patient_on_signup();
