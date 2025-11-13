# Supabase Setup

## Requirements

- Supabase CLI `>=1.138`
- Configured Supabase project (local or cloud)
- Auth user that will act as the admin for submissions

## Applying migrations

```bash
supabase db push
```

This will create:

- `public.submissions` table with all brief fields
- `public.admin_members` table to store authorized dashboard users
- Storage bucket `brandbooks` (public, 10MB limit, PDF/ZIP only)
- RLS policies allowing anonymous inserts and admin management access

## Granting admin access

After the admin signs in at least once (so their Auth user exists), add them to `admin_members`:

```sql
insert into public.admin_members (auth_user_id, email)
values ('{AUTH_USER_UUID}', 'admin@email.com');
```

Replace `{AUTH_USER_UUID}` with the Supabase Auth `user.id`. Once inserted, the admin can query/update submissions through authenticated APIs.

## Environment variables

Ensure the following variables are set (see `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `BREVO_API_KEY`
- `NEXT_PUBLIC_BREVO_SENDER_EMAIL`
- `BREVO_NOTIFICATION_EMAIL`
