create table
    public.participant_responses (
        id uuid primary key default gen_random_uuid (),
        participant_id uuid not null references public.participants (id) on delete cascade,
        question_id uuid not null references public.questions (id) on delete cascade,
        entity_id uuid not null references public.entities (id) on delete cascade,
        answer text,
        creation_date timestamp default now ()
    );

alter table public.participant_responses enable row level security;