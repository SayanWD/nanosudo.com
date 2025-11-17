-- Ensure the set_updated_at_timestamp function exists (in case it wasn't created in previous migration)
create or replace function public.set_updated_at_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- Create brief_submissions table for new interactive brief form
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

-- Create indexes for better query performance
create index if not exists brief_submissions_created_at_idx on public.brief_submissions (created_at desc);
create index if not exists brief_submissions_status_idx on public.brief_submissions (status);
create index if not exists brief_submissions_contact_email_idx on public.brief_submissions (contact_email);
create index if not exists brief_submissions_project_type_idx on public.brief_submissions (project_type);

-- Add trigger for updated_at
create trigger brief_submissions_set_updated_at
before update on public.brief_submissions
for each row
execute function public.set_updated_at_timestamp();

-- Enable RLS
alter table public.brief_submissions enable row level security;

-- Allow admins to manage brief submissions
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

-- Allow anonymous inserts (public brief submissions)
create policy "Anonymous can submit brief"
on public.brief_submissions
for insert
to anon
with check (true);

comment on table public.brief_submissions is 'Captured briefs from the new interactive brief form with calculation data.';

