import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ParticipantsService,
  IParticipant,
} from '../../../core/services/participants.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button.component';
import { CardComponent } from '../../../shared/components/card.component';
import { SkeletonComponent } from '../../../shared/components/skeleton.component';

@Component({
  selector: 'app-participants',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardComponent, SkeletonComponent],
  template: `
    <div class="p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Participantes</h1>
          <p class="text-sm text-gray-500">
            Gerencie os participantes do seu evento
          </p>
        </div>

        <cmp-button variant="primary" (click)="addParticipant()">
          + Adicionar participante
        </cmp-button>
      </div>

      <div *ngIf="loading">
        <cmp-skeleton height="56px" width="100%"></cmp-skeleton>
      </div>

      <div class="grid gap-3">
        <cmp-card
          *ngFor="let p of participants"
          class="flex flex-col justify-between"
        >
          <div>
            <h2 class="font-semibold text-gray-900 leading-tight">
              {{ p.name }}
            </h2>
            <div class="text-sm text-gray-600">{{ p.email || '-' }}</div>
          </div>
          <div class="flex gap-2 mt-3">
            <cmp-button variant="outline" size="sm" (click)="editParticipant(p)"
              >Editar</cmp-button
            >
            <cmp-button
              variant="danger"
              size="sm"
              (click)="removeParticipant(p.id!)"
              >Remover</cmp-button
            >
          </div>
        </cmp-card>
      </div>
    </div>
  `,
})
export class ParticipantsComponent implements OnInit {
  protected participantsSvc = inject(ParticipantsService);
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);

  public participants: IParticipant[] = [];
  public loading = true;

  ngOnInit(): void {
    const eventId = this.getEventId();
    if (!eventId) {
      this.loading = false;
      return;
    }

    this.participantsSvc.getParticipantsByEvent(eventId).then((p) => {
      this.participants = p;
      this.loading = false;
    });
  }

  getEventId(): string | null {
    return (
      this.route.parent?.snapshot.paramMap.get('id') ??
      this.route.snapshot.paramMap.get('id')
    );
  }

  addParticipant() {
    const eventId = this.getEventId();
    if (eventId) {
      this.router.navigate([
        '/',
        'app',
        'events',
        eventId,
        'participants',
        'add',
      ]);
    }
  }

  editParticipant(participant: IParticipant) {
    // TODO: Implementar edição de participante com página separada
    // Por enquanto, mostrar apenas uma mensagem
    alert('Edição de participante em desenvolvimento');
  }

  async removeParticipant(participantId: string) {
    if (!confirm('Tem certeza que deseja remover este participante?')) return;

    try {
      await this.participantsSvc.deleteParticipant(participantId);
      this.participants = this.participants.filter(
        (p) => p.id !== participantId,
      );
    } catch (err) {
      console.error(err);
    }
  }
}
