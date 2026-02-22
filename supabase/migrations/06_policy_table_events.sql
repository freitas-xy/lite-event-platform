create policy "Users can view events of their entities" on public.events for
select
    to authenticated using (
        exists (
            select
                1
            from
                public.entity_managers em
            where
                em.entity_id = events.entity_id
                and em.manager_id = auth.uid ()
        )
    );

create policy "Managers can create events" on public.events for insert to authenticated
with
    check (
        exists (
            select
                1
            from
                public.entity_managers em
            where
                em.entity_id = events.entity_id
                and em.manager_id = auth.uid ()
        )
    );

create policy "Managers can update events" on public.events for
update to authenticated using (
    exists (
        select
            1
        from
            public.entity_managers em
        where
            em.entity_id = events.entity_id
            and em.manager_id = auth.uid ()
    )
);

create policy "Managers can delete events" on public.events for delete to authenticated using (
    exists (
        select
            1
        from
            public.entity_managers em
        where
            em.entity_id = events.entity_id
            and em.manager_id = auth.uid ()
    )
);