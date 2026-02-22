import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ParticipantsService,
  IParticipant,
} from '../../../core/services/participants.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  QuestionsService,
  IQuestion,
} from '../../../core/services/questions.service';
import { ButtonComponent } from '../../../shared/components/button.component';
import { CardComponent } from '../../../shared/components/card.component';
import { SkeletonComponent } from '../../../shared/components/skeleton.component';
import { ViewParticipantDialogComponent } from './view-participant.dialog';

@Component({
  selector: 'app-participants',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    CardComponent,
    SkeletonComponent,
    ViewParticipantDialogComponent,
  ],
  template: `
    <div class="p-6 h-full flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Participantes</h1>
          <p class="text-sm text-gray-500">
            Gerencie os participantes do seu evento
          </p>
        </div>
        @if (!loading && participants.length !== 0) {
          <cmp-button variant="primary" (click)="addParticipant()">
            + Adicionar participante
          </cmp-button>
        }
      </div>
      @if (!loading && participants.length === 0) {
        <div class="flex-1 flex items-center justify-center">
          <div
            class="flex flex-col items-center rounded-2xl border border-dashed border-gray-300 bg-gradient-to-b from-gray-50 to-white px-12 py-14 text-center shadow-sm"
          >
            <h2 class="text-lg font-semibold text-gray-800">
              Nenhum participante criado
            </h2>
            <p class="mt-2 text-sm text-gray-500">
              Comece criando o primeiro participante para o seu evento
            </p>
            <div class="mt-4">
              <cmp-button variant="primary" (click)="addParticipant()">
                Criar primeiro participante
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
          *ngFor="let p of participants"
          class="flex flex-col justify-between"
        >
          <div class="flex flex-col gap-2">
            <h2 class="font-semibold text-gray-900 leading-tight">
              {{ p.name }}
            </h2>
            <div>
              <div class="text-sm text-gray-600">
                {{ p.email || '-' }}
              </div>
            </div>
          </div>
          <div class="flex gap-2 mt-5 justify-end">
            <cmp-button variant="outline" size="sm" (click)="viewParticipant(p)"
              >Visualizar</cmp-button
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

    <view-participant-dialog #viewParticipantDlg></view-participant-dialog>
  `,
})
export class ParticipantsComponent implements OnInit {
  protected participantsSvc = inject(ParticipantsService);
  protected questionsSvc = inject(QuestionsService);
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);

  @ViewChild('viewParticipantDlg')
  viewParticipantDlg!: ViewParticipantDialogComponent;

  public participants: IParticipant[] = [];
  public questions: IQuestion[] = [];
  public loading = true;

  ngOnInit(): void {
    const eventId = this.getEventId();
    if (!eventId) {
      this.loading = false;
      return;
    }

    Promise.all([
      this.participantsSvc.getParticipantsByEvent(eventId),
      this.questionsSvc.getQuestionsByEvent(eventId),
    ]).then(([participants, questions]) => {
      this.participants = participants;
      this.questions = questions;
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

  viewParticipant(participant: IParticipant) {
    this.viewParticipantDlg.openView(participant, this.questions);
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
