create table dropdown_options (
  id            uuid primary key default uuid_generate_v4(),
  owner_id      uuid not null references auth.users(id) on delete cascade,
  category      text not null,
  label         text not null,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  unique (owner_id, category, label)
);
alter table dropdown_options enable row level security;
create policy dropdown_options_owner on dropdown_options
  using (owner_id = auth.uid());
