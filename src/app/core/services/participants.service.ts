import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { UserService } from './user.service';

export interface IParticipant {
  id?: string;
  event_id: string;
  name: string;
  email?: string;
  ticket_id?: string;
  metadata?: any;
}

@Injectable({ providedIn: 'root' })
export class ParticipantsService {
  protected readonly supabase: SupabaseService = inject(SupabaseService);
  protected readonly user: UserService = inject(UserService);

  async createParticipant(participant: IParticipant): Promise<IParticipant> {
    try {
      const userId = this.user.getUser()?.id;
      if (!userId) throw new Error('Usuário não autenticado');

      const { data, error } = await this.supabase.client
        .from('participants')
        .insert({ ...participant, create_user_id: userId })
        .select()
        .single();

      if (error) throw new Error(error.message || 'Erro ao criar participante');
      return data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getParticipantsByEvent(eventId: string): Promise<IParticipant[]> {
    try {
      const { data, error } = await this.supabase.client
        .from('participants')
        .select('*')
        .eq('event_id', eventId)
        .order('id', { ascending: true });

      if (error)
        throw new Error(error.message || 'Erro ao buscar participantes');

      return data ?? [];
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getParticipantById(
    participantId: string,
  ): Promise<IParticipant | null> {
    try {
      const { data, error } = await this.supabase.client
        .from('participants')
        .select('*')
        .eq('id', participantId);

      if (error)
        throw new Error(error.message || 'Erro ao buscar participante');

      return data?.[0] ?? null;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateParticipant(
    participantId: string,
    patch: Partial<IParticipant>,
  ): Promise<void> {
    try {
      const { error } = await this.supabase.client
        .from('participants')
        .update(patch)
        .eq('id', participantId);

      if (error)
        throw new Error(error.message || 'Erro ao atualizar participante');
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteParticipant(participantId: string): Promise<void> {
    try {
      const { error } = await this.supabase.client
        .from('participants')
        .delete()
        .eq('id', participantId);

      if (error)
        throw new Error(error.message || 'Erro ao deletar participante');
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
