create type application_outcome as enum ('pending', 'offered', 'rejected', 'withdrawn', 'ghosted');

create table applications (
  id                  uuid primary key default uuid_generate_v4(),
  owner_id            uuid not null references auth.users(id) on delete cascade,
  company_id          uuid not null references companies(id) on delete cascade,
  candidate_id        uuid references candidates(id) on delete set null,
  role_title          text not null,
  current_status      text not null,
  current_round       text,
  outcome             application_outcome not null default 'pending',
  applied_at          date,
  source              text,
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
alter table applications enable row level security;
create policy applications_owner on applications
  using (owner_id = auth.uid());
create index applications_company_id on applications (company_id);
create index applications_outcome    on applications (outcome);
