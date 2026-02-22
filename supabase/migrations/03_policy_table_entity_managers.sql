create policy "Enable insert for authenticated users only" on public.entity_managers for insert to authenticated
with
    check (manager_id = auth.uid ());

create policy "Managers can view their own links" on public.entity_managers for
select
    to authenticated using (manager_id = auth.uid ());

create policy "Managers can update their own links" on public.entity_managers for
update to authenticated using (manager_id = auth.uid ());

create policy "Managers can delete their own links" on public.entity_managers for delete to authenticated using (manager_id = auth.uid ());