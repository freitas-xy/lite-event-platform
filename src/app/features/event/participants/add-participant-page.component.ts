import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  ParticipantsService,
  IParticipant,
} from '../../../core/services/participants.service';
import {
  TicketsService,
  ITicket,
} from '../../../core/services/tickets.service';
import {
  QuestionsService,
  IQuestion,
} from '../../../core/services/questions.service';
import {
  ParticipantResponsesService,
  IParticipantResponse,
} from '../../../core/services/participant-responses.service';
import { UserService } from '../../../core/services/user.service';
import { EventsService } from '../../../core/services/events.service';
import { ButtonComponent } from '../../../shared/components/button.component';
import { InputComponent } from '../../../shared/components/input.component';
import { SkeletonComponent } from '../../../shared/components/skeleton.component';

@Component({
  selector: 'app-add-participant-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    SkeletonComponent,
  ],
  template: `
    <div class="p-6 mx-auto">
      <button
        (click)="goBack()"
        class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
      >
        <span>← Voltar</span>
      </button>

      <div class="mb-8 flex items-center gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">
            Adicionar Participante
          </h1>
          <p class="text-sm text-gray-500">
            Preencha as informações do participante
          </p>
        </div>
      </div>

      @if (loading) {
        <div class="space-y-4">
          <cmp-skeleton height="50px" width="100%"></cmp-skeleton>
          <cmp-skeleton height="50px" width="100%"></cmp-skeleton>
          <cmp-skeleton height="50px" width="100%"></cmp-skeleton>
          <cmp-skeleton height="50px" width="100%"></cmp-skeleton>
        </div>
      }

      @if (!loading) {
        <form [formGroup]="form" class="space-y-6">
          <div class="space-y-4 p-2">
            <h2 class="text-lg font-semibold text-gray-900">
              Informações do Participante
            </h2>
            <cmp-input formControlName="name" placeholder="Nome completo">
              Nome *
            </cmp-input>
            <cmp-input
              type="email"
              formControlName="email"
              placeholder="email@example.com"
            >
              Email
            </cmp-input>
          </div>

          <div class="space-y-4 p-2">
            <h2 class="text-lg font-semibold text-gray-900">Ingresso</h2>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Selecione um ingresso *
              </label>
              <select
                formControlName="ticket_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Selecione um ingresso --</option>
                @for (ticket of tickets; track ticket.id) {
                  <option [value]="ticket.id">
                    {{ ticket.title }}
                    @if (ticket.price) {
                      (R$ {{ ticket.price }})
                    }
                  </option>
                }
              </select>
              @if (
                form.get('ticket_id')?.hasError('required') &&
                form.get('ticket_id')?.touched
              ) {
                <p class="text-red-500 text-sm mt-1">Selecione um ingresso</p>
              }
            </div>
          </div>

          @if (questions.length > 0) {
            <div class="space-y-4 p-2">
              <h2 class="text-lg font-semibold text-gray-900">Perguntas</h2>
              <div class="space-y-4">
                @for (question of questions; track question.id) {
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ question.title }}
                      @if (question.required) {
                        <span class="text-red-500">*</span>
                      }
                    </label>
                    <input
                      type="text"
                      [formControlName]="'answer_' + question.id"
                      placeholder="Sua resposta"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    @if (
                      form.get('answer_' + question.id)?.hasError('required') &&
                      form.get('answer_' + question.id)?.touched
                    ) {
                      <p class="text-red-500 text-sm mt-1">
                        Esta pergunta é obrigatória
                      </p>
                    }
                  </div>
                }
              </div>
            </div>
          }

          <div class="flex gap-3 justify-end pt-4">
            <cmp-button variant="outline" (click)="goBack()">
              Cancelar
            </cmp-button>
            <cmp-button
              variant="primary"
              [disabled]="form.invalid || submitting"
              (click)="onSubmit()"
            >
              @if (submitting) {
                Salvando...
              } @else {
                Salvar Participante
              }
            </cmp-button>
          </div>
        </form>
      }
    </div>
  `,
})
export class AddParticipantPageComponent implements OnInit {
  protected participantsSvc = inject(ParticipantsService);
  protected ticketsSvc = inject(TicketsService);
  protected questionsSvc = inject(QuestionsService);
  protected responsesSvc = inject(ParticipantResponsesService);
  protected userSvc = inject(UserService);
  protected eventsSvc = inject(EventsService);
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);
  protected fb = inject(FormBuilder);

  form: FormGroup;
  tickets: ITicket[] = [];
  questions: IQuestion[] = [];
  loading = true;
  submitting = false;

  constructor() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: [''],
      ticket_id: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const eventId = this.getEventId();
    if (!eventId) {
      this.router.navigate(['/']);
      return;
    }

    this.loadData(eventId);
  }

  async loadData(eventId: string) {
    try {
      const [tickets, questions] = await Promise.all([
        this.ticketsSvc.getTicketsByEvent(eventId),
        this.questionsSvc.getQuestionsByEvent(eventId),
      ]);

      this.tickets = tickets;
      this.questions = questions;

      this.questions.forEach((q) => {
        const validators = q.required ? [Validators.required] : [];
        this.form.addControl('answer_' + q.id, this.fb.control('', validators));
      });

      this.loading = false;
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      this.loading = false;
    }
  }

  getEventId(): string | null {
    return (
      this.route.parent?.snapshot.paramMap.get('id') ??
      this.route.snapshot.paramMap.get('id')
    );
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const eventId = this.getEventId();
    if (!eventId) return;

    try {
      const userId = this.userSvc.getUser()?.id;
      if (!userId) throw new Error('Usuário não autenticado');

      const participantPayload: IParticipant = {
        event_id: eventId,
        name: this.form.value.name,
        email: this.form.value.email || undefined,
        ticket_id: this.form.value.ticket_id,
      };

      const createdParticipant =
        await this.participantsSvc.createParticipant(participantPayload);

      const event = await this.getEventEntity(eventId);
      if (!event) throw new Error('Evento não encontrado');

      const responsesToCreate: IParticipantResponse[] = this.questions
        .filter((q) => {
          const answer = this.form.value['answer_' + q.id];
          return answer && answer.trim();
        })
        .map((q) => ({
          participant_id: createdParticipant.id!,
          question_id: q.id!,
          entity_id: event.entity_id,
          answer: this.form.value['answer_' + q.id],
        }));

      if (responsesToCreate.length > 0) {
        await this.responsesSvc.createBulk(responsesToCreate);
      }

      this.router.navigate(['/', 'app', 'events', eventId, 'participants']);
    } catch (error) {
      console.error('Erro ao salvar participante:', error);
      alert('Erro ao salvar participante. Tente novamente.');
    } finally {
      this.submitting = false;
    }
  }

  goBack() {
    const eventId = this.getEventId();
    if (eventId) {
      this.router.navigate(['/', 'app', 'events', eventId, 'participants']);
    } else {
      this.router.navigate(['/']);
    }
  }

  private async getEventEntity(eventId: string) {
    try {
      const event = await this.eventsSvc.getEventById(eventId);
      return event;
    } catch (error) {
      console.error('Erro ao buscar evento:', error);
      return null;
    }
  }
}
