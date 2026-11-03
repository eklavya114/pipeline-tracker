create table outcome_history (
  id             uuid primary key default uuid_generate_v4(),
  owner_id       uuid not null references auth.users(id) on delete cascade,
  application_id uuid not null references applications(id) on delete cascade,
  previous_outcome application_outcome,
  new_outcome      application_outcome not null,
  changed_at       timestamptz not null default now(),
  note             text
);
alter table outcome_history enable row level security;
create policy outcome_history_owner on outcome_history
  using (owner_id = auth.uid());
