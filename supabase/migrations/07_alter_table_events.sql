alter table public.events
add column start_date timestamp,
add column end_date timestamp,
add column location text,
add column status varchar(50) default 'inativo';

alter table public.events
add constraint events_status_check
check (status in ('ativo', 'inativo', 'cancelado', 'rascunho'));