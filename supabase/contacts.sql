-- Contact form submissions. Run once in the Supabase SQL editor.
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  organisation text,
  inquiry_type text not null,
  message text not null,
  created_at bigint not null
);

alter publication supabase_realtime add table contacts;

-- The website inserts through a server action using the secret key, which bypasses RLS.
-- With RLS on and no policies, the public publishable key can't read, change or delete submissions,
-- and Realtime won't broadcast them to anonymous subscribers.
alter table contacts enable row level security;
