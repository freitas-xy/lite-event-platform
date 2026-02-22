create table
    entities (
        id uuid primary key default gen_random_uuid (),
        name varchar(255) not null,
        description text,
        creation_date timestamp default now (),
        create_user_id uuid references auth.users (id)
    );

alter table entities enable row level security;
