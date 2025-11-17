-- Setup script for database initialization
-- Run this script to ensure all tables, functions, and policies are created

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================
-- 1. Admin Members Table
-- ============================================
create table if not exists public.admin_members (
  auth_user_id uuid primary key,
  email text unique,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists admin_members_email_idx on public.admin_members (email);

-- ============================================
-- 2. Helper Function for updated_at
-- ============================================
create or replace function public.set_updated_at_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- ============================================
-- 3. Submissions Table (Old Brief Form)
-- ============================================
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

drop trigger if exists submissions_set_updated_at on public.submissions;
create trigger submissions_set_updated_at
before update on public.submissions
for each row
execute function public.set_updated_at_timestamp();

create index if not exists submissions_created_at_idx on public.submissions (created_at desc);
create index if not exists submissions_status_idx on public.submissions (status);
create index if not exists submissions_contact_email_idx on public.submissions (contact_email);
create index if not exists submissions_contact_method_idx on public.submissions (contact_method);

-- ============================================
-- 4. Brief Submissions Table (New Interactive Form)
-- ============================================
create table if not exists public.brief_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  -- Project information
  project_name text not null,
  project_type text not null check (project_type in ('landing', 'corporate', 'ecommerce', 'saas', 'custom-mvp')),
  project_description text not null,

  -- Contact information
  contact_name text not null,
  contact_email text not null,
  contact_phone text,
  company_name text,

  -- Calculation data
  total_cost numeric(12, 2) not null,
  total_hours integer not null,
  calculation_breakdown jsonb not null default '{}'::jsonb,
  cost_breakdown jsonb not null default '{}'::jsonb,

  -- Full form data (for reference and future use)
  form_data jsonb not null default '{}'::jsonb,

  -- Metadata
  status text not null default 'new' check (status in ('new', 'in_progress', 'contacted', 'quoted', 'archived')),
  submitted_ip text,
  user_agent text
);

create index if not exists brief_submissions_created_at_idx on public.brief_submissions (created_at desc);
create index if not exists brief_submissions_status_idx on public.brief_submissions (status);
create index if not exists brief_submissions_contact_email_idx on public.brief_submissions (contact_email);
create index if not exists brief_submissions_project_type_idx on public.brief_submissions (project_type);

drop trigger if exists brief_submissions_set_updated_at on public.brief_submissions;
create trigger brief_submissions_set_updated_at
before update on public.brief_submissions
for each row
execute function public.set_updated_at_timestamp();

-- ============================================
-- 5. Storage Bucket for Brandbooks
-- ============================================
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

-- ============================================
-- 6. Row Level Security (RLS)
-- ============================================
alter table public.admin_members enable row level security;
alter table public.submissions enable row level security;
alter table public.brief_submissions enable row level security;

-- ============================================
-- 7. RLS Policies for Admin Members
-- ============================================
drop policy if exists "Authenticated users manage admin_members" on public.admin_members;
create policy "Authenticated users manage admin_members"
on public.admin_members
for all
to authenticated
using (auth.uid() = auth_user_id)
with check (auth.uid() = auth_user_id);

-- ============================================
-- 8. RLS Policies for Submissions (Old Form)
-- ============================================
drop policy if exists "Admin members can manage submissions" on public.submissions;
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

drop policy if exists "Anonymous can submit brief" on public.submissions;
create policy "Anonymous can submit brief"
on public.submissions
for insert
to anon
with check (true);

-- ============================================
-- 9. RLS Policies for Brief Submissions (New Form)
-- ============================================
drop policy if exists "Admin members can manage brief submissions" on public.brief_submissions;
create policy "Admin members can manage brief submissions"
on public.brief_submissions
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

drop policy if exists "Anonymous can submit brief" on public.brief_submissions;
create policy "Anonymous can submit brief"
on public.brief_submissions
for insert
to anon
with check (true);

-- ============================================
-- 10. Storage Policies for Brandbooks
-- ============================================
drop policy if exists "Admins can read brandbooks" on storage.objects;
create policy "Admins can read brandbooks"
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

drop policy if exists "Admins can insert brandbooks" on storage.objects;
create policy "Admins can insert brandbooks"
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

drop policy if exists "Admins can delete brandbooks" on storage.objects;
create policy "Admins can delete brandbooks"
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

-- ============================================
-- 11. Triggers for updated_at
-- ============================================
drop trigger if exists admin_members_set_updated_at on public.admin_members;
create trigger admin_members_set_updated_at
before update on public.admin_members
for each row
execute function public.set_updated_at_timestamp();

-- ============================================
-- 12. Comments
-- ============================================
comment on table public.admin_members is 'Stores Supabase auth user IDs that have access to submissions.';
comment on table public.submissions is 'Captured briefs from the public onboarding form (old form).';
comment on table public.brief_submissions is 'Captured briefs from the new interactive brief form with calculation data.';

-- ============================================
-- Setup Complete!
-- ============================================
-- Next steps:
-- 1. Add admin user to admin_members table:
--    insert into public.admin_members (auth_user_id, email)
--    values ('{AUTH_USER_UUID}', 'your-email@example.com');
--
-- 2. Verify tables were created:
--    select table_name from information_schema.tables 
--    where table_schema = 'public' 
--    and table_name in ('admin_members', 'submissions', 'brief_submissions');
--
-- 3. Verify storage bucket was created:
--    select * from storage.buckets where id = 'brandbooks';

