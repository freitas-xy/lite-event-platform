import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { UserService } from './user.service';

export interface ITicket {
  id?: string;
  event_id: string;
  entity_id?: string;
  title: string;
  price?: number;
  quantity?: number;
  metadata?: any;
}

@Injectable({ providedIn: 'root' })
export class TicketsService {
  protected readonly supabase: SupabaseService = inject(SupabaseService);
  protected readonly user: UserService = inject(UserService);

  async createTicket(ticket: ITicket): Promise<ITicket> {
    try {
      const userId = this.user.getUser()?.id;
      if (!userId) throw new Error('Usuário não autenticado');

      const { data: eventData, error: errorEvent } = await this.supabase.client
        .from('events')
        .select('*')
        .eq('id', ticket.event_id)
        .single();

      if (errorEvent || !eventData)
        throw new Error(errorEvent?.message || 'Erro ao buscar evento');

      const { data, error } = await this.supabase.client.from('tickets').insert({
        ...ticket,
        create_user_id: userId,
        entity_id: eventData.entity_id,
      })
        .select()
        .single();

      if (error) throw new Error(error.message || 'Erro ao criar ticket');
      return data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getTicketsByEvent(eventId: string): Promise<ITicket[]> {
    try {
      const { data, error } = await this.supabase.client
        .from('tickets')
        .select('*')
        .eq('event_id', eventId);

      if (error) throw new Error(error.message || 'Erro ao buscar tickets');

      return data ?? [];
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getTicketById(ticketId: string): Promise<ITicket | null> {
    try {
      const { data, error } = await this.supabase.client
        .from('tickets')
        .select('*')
        .eq('id', ticketId);

      if (error) throw new Error(error.message || 'Erro ao buscar ticket');

      return data?.[0] ?? null;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateTicket(ticketId: string, patch: Partial<ITicket>): Promise<void> {
    try {
      const { error } = await this.supabase.client
        .from('tickets')
        .update(patch)
        .eq('id', ticketId);

      if (error) throw new Error(error.message || 'Erro ao atualizar ticket');
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteTicket(ticketId: string): Promise<void> {
    try {
      const { error } = await this.supabase.client
        .from('tickets')
        .delete()
        .eq('id', ticketId);

      if (error) throw new Error(error.message || 'Erro ao deletar ticket');
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
