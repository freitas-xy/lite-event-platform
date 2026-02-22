create table
    public.questions (
        id uuid primary key default gen_random_uuid (),
        event_id uuid not null references public.events (id) on delete cascade,
        entity_id uuid not null references public.entities (id) on delete cascade,
        title varchar(255) not null,
        required boolean default false,
        creation_date timestamp default now (),
        create_user_id uuid references auth.users (id)
    );

alter table public.questions enable row level security;