import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class EntitiesService {
  protected readonly supabase: SupabaseService = inject(SupabaseService);
  protected readonly user: UserService = inject(UserService);
  private readonly entityKey = 'entities';

  async createEntity(name: string, description: string): Promise<void> {
    try {
      const entity = { name, description };
      const { data: entityData, error: entityError } =
        await this.supabase.client
          .from('entities')
          .insert(entity)
          .select()
          .single();

      if (entityError || !entityData)
        throw new Error(entityError?.message || 'Erro ao criar entidade');

      const userId = this.user.getUser()?.id;
      if (!userId) throw new Error('Usuário não autenticado');

      const { error: managerError } = await this.supabase.client
        .from('entity_managers')
        .insert({
          entity_id: entityData.id,
          manager_id: userId,
        });

      if (managerError) throw new Error(managerError.message);

      localStorage.setItem(this.entityKey, JSON.stringify(entityData));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getEntity(): any {
    const entity = localStorage.getItem(this.entityKey);
    return entity ? JSON.parse(entity) : null;
  }

  clearEntity(): void {
    localStorage.removeItem(this.entityKey);
  }

  async listEntities(): Promise<any[]> {
    try {
      const userId = this.user.getUser()?.id;
      if (!userId) throw new Error('Usuário não autenticado');

      const { data, error } = await this.supabase.client
        .from('entity_managers')
        .select('entity_id, entities(name, description, creation_date)')
        .eq('manager_id', userId);

      if (error) throw new Error(error.message || 'Erro ao listar entidades');

      const entities =
        data?.map((em: any) => ({
          id: em.entity_id,
          ...em.entities,
        })) ?? [];

      return entities;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getEntityOrRedirect(): Promise<boolean> {
    const entity = this.getEntity();
    if (entity) return true;

    const entities = await this.listEntities();
    if (entities.length > 0) {
      localStorage.setItem(this.entityKey, JSON.stringify(entities[0]));
      return true;
    }

    return false;
  }
}
