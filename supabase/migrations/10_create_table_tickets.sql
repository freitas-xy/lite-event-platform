create table
    public.tickets (
        id uuid primary key default gen_random_uuid (),
        event_id uuid not null references public.events (id) on delete cascade,
        entity_id uuid not null references public.entities (id) on delete cascade,
        title varchar(255) not null,
        description text,
        price numeric(10, 2) default 0,
        quantity int,
        creation_date timestamp default now (),
        create_user_id uuid references auth.users (id)
    );

alter table public.tickets enable row level security;