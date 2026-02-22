create policy "Managers can view tickets" on public.tickets for
select
    to authenticated using (
        exists (
            select
                1
            from
                public.entity_managers em
            where
                em.entity_id = tickets.entity_id
                and em.manager_id = auth.uid ()
        )
    );

create policy "Managers can insert tickets" on public.tickets for insert to authenticated
with
    check (
        exists (
            select
                1
            from
                public.entity_managers em
            where
                em.entity_id = tickets.entity_id
                and em.manager_id = auth.uid ()
        )
    );

create policy "Managers can update tickets" on public.tickets for
update to authenticated using (
    exists (
        select
            1
        from
            public.entity_managers em
        where
            em.entity_id = tickets.entity_id
            and em.manager_id = auth.uid ()
    )
);

create policy "Managers can delete tickets" on public.tickets for delete to authenticated using (
    exists (
        select
            1
        from
            public.entity_managers em
        where
            em.entity_id = tickets.entity_id
            and em.manager_id = auth.uid ()
    )
);