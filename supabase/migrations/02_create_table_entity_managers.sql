create table
    entity_managers (
        entity_id uuid references entities (id) on delete cascade,
        manager_id uuid references auth.users (id) on delete cascade,
        assigned_date timestamp default now (),
        primary key (entity_id, manager_id)
    );

alter table entity_managers enable row level security;
