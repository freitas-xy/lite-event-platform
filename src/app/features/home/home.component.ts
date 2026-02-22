import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventsService, IEvent } from '../../core/services/events.service';
import { ParticipantsService, IParticipant } from '../../core/services/participants.service';
import { TicketsService, ITicket } from '../../core/services/tickets.service';
import { UserService } from '../../core/services/user.service';
import { EntitiesService } from '../../core/services/entities.service';
import { SkeletonComponent } from '../../shared/components/skeleton.component';

interface DashboardStats {
  totalEvents: number;
  totalParticipants: number;
  totalRevenue: number;
  activeEvents: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SkeletonComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomePage implements OnInit {
  protected eventsSvc = inject(EventsService);
  protected participantsSvc = inject(ParticipantsService);
  protected ticketsSvc = inject(TicketsService);
  protected userSvc = inject(UserService);
  protected entitiesSvc = inject(EntitiesService);

  stats: DashboardStats = {
    totalEvents: 0,
    totalParticipants: 0,
    totalRevenue: 0,
    activeEvents: 0,
  };

  allEvents: IEvent[] = [];
  allParticipants: IParticipant[] = [];
  allTickets: ITicket[] = [];

  upcomingEvents: IEvent[] = [];
  recentParticipants: IParticipant[] = [];

  loading = true;

  async ngOnInit() {
    try {
      const userEntity = this.entitiesSvc.getEntity();
      if (!userEntity?.id) {
        this.loading = false;
        return;
      }

      this.allEvents = await this.eventsSvc.getEventsByEntity(userEntity.id);
      this.allTickets = (await Promise.all(
        this.allEvents.map((e) => this.ticketsSvc.getTicketsByEvent(e.id!)),
      )).flat();

      this.allParticipants = (await Promise.all(
        this.allEvents.map((e) => this.participantsSvc.getParticipantsByEvent(e.id!)),
      )).flat();

      this.calculateStats();

      this.upcomingEvents = this.allEvents.sort(
        (a, b) =>
          new Date(b.id || '').getTime() - new Date(a.id || '').getTime(),
      ).slice(0, 5);

      this.recentParticipants = this.allParticipants.slice(0, 5);

      this.loading = false;
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      this.loading = false;
    }
  }

  private calculateStats() {
    this.stats.totalEvents = this.allEvents.length;
    this.stats.activeEvents = this.allEvents.length;
    this.stats.totalParticipants = this.allParticipants.length;

    this.stats.totalRevenue = this.allParticipants.reduce((total, participant) => {
      const ticket = this.allTickets.find((t) => t.id === participant.ticket_id);
      return total + (ticket?.price ? Number(ticket.price) : 0);
    }, 0);
  }

  getEventParticipantCount(eventId: string): number {
    return this.allParticipants.filter((p) => p.event_id === eventId).length;
  }

  getEventTicketCount(eventId: string): number {
    const tickets = this.allTickets.filter((t) => t.event_id === eventId);
    return tickets.reduce((sum, t) => sum + (t.quantity || 0), 0);
  }
}
