create policy "Managers can view participants" on public.participants for
select
    to authenticated using (
        exists (
            select
                1
            from
                public.entity_managers em
            where
                em.entity_id = participants.entity_id
                and em.manager_id = auth.uid ()
        )
    );

create policy "Managers can insert participants" on public.participants for insert to authenticated
with
    check (
        exists (
            select
                1
            from
                public.entity_managers em
            where
                em.entity_id = participants.entity_id
                and em.manager_id = auth.uid ()
        )
    );

create policy "Managers can update participants" on public.participants for
update to authenticated using (
    exists (
        select
            1
        from
            public.entity_managers em
        where
            em.entity_id = participants.entity_id
            and em.manager_id = auth.uid ()
    )
);

create policy "Managers can delete participants" on public.participants for delete to authenticated using (
    exists (
        select
            1
        from
            public.entity_managers em
        where
            em.entity_id = participants.entity_id
            and em.manager_id = auth.uid ()
    )
);