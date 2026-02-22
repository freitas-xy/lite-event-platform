create table
    events (
        id uuid primary key default gen_random_uuid (),
        entity_id uuid not null references entities (id) on delete cascade,
        title varchar(255) not null,
        description text,
        creation_date timestamp default now (),
        create_user_id uuid references auth.users (id)
    );

alter table events enable row level security;