create table companies (
  id              uuid primary key default uuid_generate_v4(),
  owner_id        uuid not null references auth.users(id) on delete cascade,
  name            text not null,
  name_normalized text not null,
  website         text,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (owner_id, name_normalized)
);
alter table companies enable row level security;
create policy companies_owner on companies
  using (owner_id = auth.uid());
create index companies_name_trgm on companies
  using gin (name_normalized gin_trgm_ops);
