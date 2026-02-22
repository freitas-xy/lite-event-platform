create policy "Managers can view responses" on public.participant_responses for
select
    to authenticated using (
        exists (
            select
                1
            from
                public.entity_managers em
            where
                em.entity_id = participant_responses.entity_id
                and em.manager_id = auth.uid ()
        )
    );

create policy "Managers can insert responses" on public.participant_responses for insert to authenticated
with
    check (
        exists (
            select
                1
            from
                public.entity_managers em
            where
                em.entity_id = participant_responses.entity_id
                and em.manager_id = auth.uid ()
        )
    );