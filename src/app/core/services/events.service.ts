import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { UserService } from './user.service';
import { EntitiesService } from './entities.service';

export interface IEvent {
  id?: string;
  entity_id: string;
  title: string;
  description: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  status?: string;
}

@Injectable({ providedIn: 'root' })
export class EventsService {
  protected readonly supabase: SupabaseService = inject(SupabaseService);
  protected readonly user: UserService = inject(UserService);
  protected readonly entities: EntitiesService = inject(EntitiesService);

  async createEvent(eventData: IEvent): Promise<void> {
    try {
      const userId = this.user.getUser()?.id;
      if (!userId) throw new Error('Usuário não autenticado');

      const { data, error: eventError } = await this.supabase.client
        .from('events')
        .insert({ ...eventData, create_user_id: userId })
        .select()
        .single();

      if (eventError || !eventData)
        throw new Error(eventError?.message || 'Erro ao criar evento');
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getEventsByEntity(entityId: string): Promise<IEvent[]> {
    try {
      const { data, error } = await this.supabase.client
        .from('events')
        .select('*')
        .eq('entity_id', entityId);

      if (error) throw new Error(error.message || 'Erro ao buscar eventos');

      return data ?? [];
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getEventById(eventId: string): Promise<IEvent | null> {
    try {
      const { data, error } = await this.supabase.client
        .from('events')
        .select('*')
        .eq('id', eventId);

      if (error) throw new Error(error.message || 'Erro ao buscar evento');

      return data?.[0] ?? null;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
