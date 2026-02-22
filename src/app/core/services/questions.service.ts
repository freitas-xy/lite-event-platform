import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { UserService } from './user.service';

export interface IQuestion {
  id?: string;
  event_id: string;
  title: string;
  type?: string;
  required?: boolean;
  options?: any[];
  metadata?: any;
}

@Injectable({ providedIn: 'root' })
export class QuestionsService {
  protected readonly supabase: SupabaseService = inject(SupabaseService);
  protected readonly user: UserService = inject(UserService);

  async createQuestion(question: IQuestion): Promise<IQuestion> {
    try {
      const userId = this.user.getUser()?.id;
      if (!userId) throw new Error('Usuário não autenticado');

      const { data: eventData, error: errorEvent } = await this.supabase.client
        .from('events')
        .select('*')
        .eq('id', question.event_id)
        .single();

      if (errorEvent || !eventData)
        throw new Error(errorEvent?.message || 'Erro ao buscar evento');

      const { data, error } = await this.supabase.client
        .from('questions')
        .insert({
          ...question,
          create_user_id: userId,
          entity_id: eventData.entity_id,
        })
        .select()
        .single();

      if (error) throw new Error(error.message || 'Erro ao criar pergunta');
      return data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getQuestionsByEvent(eventId: string): Promise<IQuestion[]> {
    try {
      const { data, error } = await this.supabase.client
        .from('questions')
        .select('*')
        .eq('event_id', eventId)
        .order('id', { ascending: true });

      if (error) throw new Error(error.message || 'Erro ao buscar perguntas');

      return data ?? [];
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getQuestionById(questionId: string): Promise<IQuestion | null> {
    try {
      const { data, error } = await this.supabase.client
        .from('questions')
        .select('*')
        .eq('id', questionId);

      if (error) throw new Error(error.message || 'Erro ao buscar pergunta');

      return data?.[0] ?? null;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateQuestion(
    questionId: string,
    patch: Partial<IQuestion>,
  ): Promise<void> {
    try {
      const { error } = await this.supabase.client
        .from('questions')
        .update(patch)
        .eq('id', questionId);

      if (error) throw new Error(error.message || 'Erro ao atualizar pergunta');
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteQuestion(questionId: string): Promise<void> {
    try {
      const { error } = await this.supabase.client
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) throw new Error(error.message || 'Erro ao deletar pergunta');
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
