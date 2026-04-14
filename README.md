# Gabriel Turgeon Portfolio

Static portfolio site for `gabrielturgeon.dev`.

## Pages

- `index.html` - main portfolio
- `contact.html` - standalone contact page

## Deploy

This project is configured for Vercel as a static site.

## Contact Storage

Contact forms post to `/api/contact`, which saves messages to Supabase when these Vercel environment variables are set:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_CONTACT_TABLE` optional, defaults to `contacts`

Suggested table:

```sql
create table if not exists contacts (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  source text default 'portfolio',
  created_at timestamptz not null default now()
);
```
