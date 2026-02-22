create policy "Enable insert for authenticated users only" on "public"."entities" as PERMISSIVE for INSERT to authenticated
with
    check (auth.uid () is not null);

create policy "Users can update their entities" on public.entities for
update to authenticated using (
    exists (
        select
            1
        from
            public.entity_managers em
        where
            em.entity_id = entities.id
            and em.manager_id = auth.uid ()
    )
);

create policy "Users can view their own entities" on public.entities for
select
    to authenticated using (
        exists (
            select
                1
            from
                public.entity_managers em
            where
                em.entity_id = entities.id
                and em.manager_id = auth.uid ()
        )
    );