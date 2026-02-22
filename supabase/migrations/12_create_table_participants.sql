create table
    public.participants (
        id uuid primary key default gen_random_uuid (),
        event_id uuid not null references public.events (id) on delete cascade,
        entity_id uuid not null references public.entities (id) on delete cascade,
        name varchar(255) not null,
        email varchar(255),
        phone varchar(50),
        ticket_id uuid references public.tickets(id),
        status varchar(50) default 'pending',
        creation_date timestamp default now (),
        create_user_id uuid references auth.users (id)
    );

alter table public.participants enable row level security;