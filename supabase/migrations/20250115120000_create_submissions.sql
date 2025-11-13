-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Admin members table to manage access to submissions
create table if not exists public.admin_members (
  auth_user_id uuid primary key,
  email text unique,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists admin_members_email_idx on public.admin_members (email);

create or replace function public.set_updated_at_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- Submissions table
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  -- Step 1
  client_name text not null,
  industry text not null,
  geography text[] default '{}'::text[],
  languages text[] not null default array['ru'],
  business_goals text[] not null default '{}',

  -- Step 2
  target_audience text not null,
  channels text[] default '{}'::text[],
  usp text,
  integrations text[] default '{}'::text[],

  -- Step 3
  kpi_traffic text,
  kpi_conversion text,
  has_brandbook boolean not null default false,
  brandbook_link text,
  brandbook_file_url text,
  brand_tone integer not null default 50,

  -- Step 4
  contact_name text not null,
  contact_email text not null,
  contact_phone text,
  contact_method text not null check (contact_method in ('email', 'telegram', 'whatsapp', 'phone')),
  team_roles text,

  -- Metadata
  status text not null default 'new' check (status in ('new', 'in_progress', 'completed', 'archived')),
  submitted_ip text,
  user_agent text
);

create trigger submissions_set_updated_at
before update on public.submissions
for each row
execute function public.set_updated_at_timestamp();

create index if not exists submissions_created_at_idx on public.submissions (created_at desc);
create index if not exists submissions_status_idx on public.submissions (status);
create index if not exists submissions_contact_email_idx on public.submissions (contact_email);
create index if not exists submissions_contact_method_idx on public.submissions (contact_method);

-- Storage bucket for brandbooks
do $$
begin
  if not exists (
    select 1
    from storage.buckets
    where id = 'brandbooks'
  ) then
    perform storage.create_bucket(
      'brandbooks',
      'brandbooks',
      true,
      (10 * 1024 * 1024)::bigint,
      array['application/pdf', 'application/zip', 'application/x-zip-compressed']
    );
  end if;
end
$$;

-- Storage policies for brandbooks
-- Only admin members may read/write brandbooks
create policy if not exists "Admins can read brandbooks"
on storage.objects
for select
using (
  bucket_id = 'brandbooks'
  and exists (
    select 1
    from public.admin_members am
    where am.auth_user_id = auth.uid()
  )
);

create policy if not exists "Admins can insert brandbooks"
on storage.objects
for insert
with check (
  bucket_id = 'brandbooks'
  and exists (
    select 1
    from public.admin_members am
    where am.auth_user_id = auth.uid()
  )
);

create policy if not exists "Admins can delete brandbooks"
on storage.objects
for delete
using (
  bucket_id = 'brandbooks'
  and exists (
    select 1
    from public.admin_members am
    where am.auth_user_id = auth.uid()
  )
);

-- RLS policies
alter table public.admin_members enable row level security;
alter table public.submissions enable row level security;

-- Allow admins (stored in admin_members) to manage submissions
create policy "Admin members can manage submissions"
on public.submissions
for all
to authenticated
using (
  exists (
    select 1
    from public.admin_members am
    where am.auth_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.admin_members am
    where am.auth_user_id = auth.uid()
  )
);

-- Allow anonymous inserts (public brief submissions)
create policy "Anonymous can submit brief"
on public.submissions
for insert
to anon
with check (true);

-- Ensure admin_members can manage their entries
create policy "Authenticated users manage admin_members"
on public.admin_members
for all
to authenticated
using (auth.uid() = auth_user_id)
with check (auth.uid() = auth_user_id);

-- Maintain updated_at on admin_members
create trigger admin_members_set_updated_at
before update on public.admin_members
for each row
execute function public.set_updated_at_timestamp();

comment on table public.admin_members is 'Stores Supabase auth user IDs that have access to submissions.';
comment on table public.submissions is 'Captured briefs from the public onboarding form.';

