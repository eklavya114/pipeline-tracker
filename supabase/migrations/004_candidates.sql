create table candidates (
  id           uuid primary key default uuid_generate_v4(),
  owner_id     uuid not null references auth.users(id) on delete cascade,
  full_name    text,
  email        text,
  phone        text,
  linkedin_url text,
  resume_url   text,
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
alter table candidates enable row level security;
create policy candidates_owner on candidates
  using (owner_id = auth.uid());
