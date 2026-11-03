create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

create or replace function database_ping()
returns boolean language sql as $$ select true; $$;
