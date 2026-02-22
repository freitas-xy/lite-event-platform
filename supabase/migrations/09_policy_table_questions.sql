create policy "Managers can view questions" on public.questions for
select
    to authenticated using (
        exists (
            select
                1
            from
                public.entity_managers em
            where
                em.entity_id = questions.entity_id
                and em.manager_id = auth.uid ()
        )
    );

create policy "Managers can insert questions" on public.questions for insert to authenticated
with
    check (
        exists (
            select
                1
            from
                public.entity_managers em
            where
                em.entity_id = questions.entity_id
                and em.manager_id = auth.uid ()
        )
    );

create policy "Managers can update questions" on public.questions for
update to authenticated using (
    exists (
        select
            1
        from
            public.entity_managers em
        where
            em.entity_id = questions.entity_id
            and em.manager_id = auth.uid ()
    )
);

create policy "Managers can delete questions" on public.questions for delete to authenticated using (
    exists (
        select
            1
        from
            public.entity_managers em
        where
            em.entity_id = questions.entity_id
            and em.manager_id = auth.uid ()
    )
);