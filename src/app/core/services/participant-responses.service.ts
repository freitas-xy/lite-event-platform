import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { UserService } from './user.service';

export interface IParticipantResponse {
  id?: string;
  participant_id: string;
  question_id: string;
  entity_id: string;
  answer: string;
}

@Injectable({ providedIn: 'root' })
export class ParticipantResponsesService {
  protected readonly supabase: SupabaseService = inject(SupabaseService);
  protected readonly user: UserService = inject(UserService);

  async createResponse(response: IParticipantResponse): Promise<IParticipantResponse> {
    try {
      const { data, error } = await this.supabase.client
        .from('participant_responses')
        .insert(response)
        .select()
        .single();

      if (error) throw new Error(error.message || 'Erro ao criar resposta');
      return data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async createBulk(responses: IParticipantResponse[]): Promise<IParticipantResponse[]> {
    try {
      const { data, error } = await this.supabase.client
        .from('participant_responses')
        .insert(responses)
        .select();

      if (error) throw new Error(error.message || 'Erro ao criar respostas');
      return data ?? [];
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getResponsesByParticipant(participantId: string): Promise<IParticipantResponse[]> {
    try {
      const { data, error } = await this.supabase.client
        .from('participant_responses')
        .select('*')
        .eq('participant_id', participantId);

      if (error) throw new Error(error.message || 'Erro ao buscar respostas');
      return data ?? [];
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateResponse(
    responseId: string,
    patch: Partial<IParticipantResponse>,
  ): Promise<void> {
    try {
      const { error } = await this.supabase.client
        .from('participant_responses')
        .update(patch)
        .eq('id', responseId);

      if (error) throw new Error(error.message || 'Erro ao atualizar resposta');
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteResponse(responseId: string): Promise<void> {
    try {
      const { error } = await this.supabase.client
        .from('participant_responses')
        .delete()
        .eq('id', responseId);

      if (error) throw new Error(error.message || 'Erro ao deletar resposta');
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
