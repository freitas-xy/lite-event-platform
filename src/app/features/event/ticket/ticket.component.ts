import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TicketsService,
  ITicket,
} from '../../../core/services/tickets.service';
import { ActivatedRoute } from '@angular/router';
import { AddTicketDialogComponent } from './add-or-edit-ticket.dialog';
import { ButtonComponent } from '../../../shared/components/button.component';
import { CardComponent } from '../../../shared/components/card.component';
import { SkeletonComponent } from '../../../shared/components/skeleton.component';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    CardComponent,
    SkeletonComponent,
    AddTicketDialogComponent,
  ],
  template: `
    <div class="p-6 h-full flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Ingressos</h1>
          <p class="text-sm text-gray-500">
            Gerencie os ingressos do seu evento
          </p>
        </div>
        @if (!loading && tickets.length !== 0) {
          <cmp-button variant="primary" (click)="addTicketDlg.openAdd()">
            + Adicionar ingresso
          </cmp-button>
        }
      </div>
      @if (!loading && tickets.length === 0) {
        <div class="flex-1 flex items-center justify-center">
          <div
            class="flex flex-col items-center rounded-2xl border border-dashed border-gray-300 bg-gradient-to-b from-gray-50 to-white px-12 py-14 text-center shadow-sm"
          >
            <h2 class="text-lg font-semibold text-gray-800">
              Nenhum ingresso criado ainda
            </h2>
            <p class="mt-2 text-sm text-gray-500">
              Comece criando o primeiro ingresso para o seu evento
            </p>
            <div class="mt-4">
              <cmp-button variant="primary" (click)="addTicketDlg.openAdd()">
                Criar primeiro ingresso
              </cmp-button>
            </div>
          </div>
        </div>
      }
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        @if (!!loading) {
          @for (i of [1, 2, 3, 4]; track $index) {
            <cmp-skeleton height="155.2px" width="100%"></cmp-skeleton>
          }
        }

        <cmp-card
          *ngFor="let t of tickets"
          class="flex flex-col justify-between"
        >
          <div class="flex flex-col gap-2">
            <h2 class="font-semibold text-gray-900 leading-tight">
              {{ t.title }}
            </h2>
            <div>
              <div class="text-sm text-gray-600">
                Preço: {{ t.price ?? '-' }}
              </div>
              <div class="text-sm text-gray-600">
                Quantidade: {{ t.quantity ?? '-' }}
              </div>
            </div>
          </div>
          <div class="flex gap-2 mt-5 justify-end">
            <cmp-button variant="outline" size="sm" (click)="editTicket(t)"
              >Editar</cmp-button
            >
            <cmp-button variant="danger" size="sm" (click)="removeTicket(t.id!)"
              >Remover</cmp-button
            >
          </div>
        </cmp-card>
      </div>
    </div>

    <add-or-edit-ticket-dialog
      #addTicketDlg
      (saved)="onTicketSaved($event)"
    ></add-or-edit-ticket-dialog>
  `,
})
export class TicketComponent implements OnInit {
  protected ticketsSvc = inject(TicketsService);
  protected route = inject(ActivatedRoute);

  @ViewChild('addTicketDlg') addTicketDlg!: AddTicketDialogComponent;

  public tickets: ITicket[] = [];
  public loading = true;

  ngOnInit(): void {
    const eventId = this.getEventId();
    if (!eventId) {
      this.loading = false;
      return;
    }

    this.ticketsSvc.getTicketsByEvent(eventId).then((t) => {
      this.tickets = t;
      this.loading = false;
    });
  }

  getEventId(): string | null {
    return (
      this.route.parent?.snapshot.paramMap.get('id') ??
      this.route.snapshot.paramMap.get('id')
    );
  }

  async onTicketSaved(v: Partial<ITicket>) {
    const eventId = this.getEventId();
    if (!eventId) return;

    const ticketId = v.id;

    if (ticketId) {
      const patch: Partial<ITicket> = {
        title: v.title ?? '',
        price: v.price == null ? undefined : Number(v.price),
        quantity: v.quantity == null ? undefined : Number(v.quantity),
      };

      try {
        await this.ticketsSvc.updateTicket(ticketId, patch);
        const idx = this.tickets.findIndex((t) => t.id === ticketId);
        if (idx !== -1) {
          this.tickets[idx] = { ...this.tickets[idx], ...patch };
        }
        this.addTicketDlg.resetForm();
      } catch (err) {
        console.error(err);
      }
      } else {
      const payload: ITicket = {
        event_id: eventId,
        title: v.title ?? '',
        price: v.price == null ? undefined : Number(v.price),
        quantity: v.quantity == null ? undefined : Number(v.quantity),
      };

      try {
        const created = await this.ticketsSvc.createTicket(payload);
        this.tickets.unshift(created);
        this.addTicketDlg.resetForm();
      } catch (err) {
        console.error(err);
      }
    }
  }

  editTicket(ticket: ITicket) {
    this.addTicketDlg.openEdit(ticket);
  }

  async removeTicket(ticketId: string) {
    if (!confirm('Tem certeza que deseja remover este ingresso?')) return;

    try {
      await this.ticketsSvc.deleteTicket(ticketId);
      this.tickets = this.tickets.filter((t) => t.id !== ticketId);
    } catch (err) {
      console.error(err);
    }
  }
}
