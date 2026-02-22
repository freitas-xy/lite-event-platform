import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from '../../../shared/components/dialog.component';
import { IParticipant } from '../../../core/services/participants.service';
import {
  ITicket,
  TicketsService,
} from '../../../core/services/tickets.service';
import {
  IQuestion,
  QuestionsService,
} from '../../../core/services/questions.service';
import {
  ParticipantResponsesService,
  IParticipantResponse,
} from '../../../core/services/participant-responses.service';

@Component({
  selector: 'view-participant-dialog',
  standalone: true,
  imports: [CommonModule, DialogComponent],
  template: `<app-dialog
    #dlg
    title="Detalhes do Participante"
    [hiddenConfirm]="true"
  >
    <div class="p-4 max-h-96 overflow-y-auto space-y-4">
      @if (loading) {
        <div class="space-y-3">
          <div class="h-6 bg-gray-200 rounded animate-pulse"></div>
          <div class="h-6 bg-gray-200 rounded animate-pulse"></div>
          <div class="h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
      }

      @if (!loading) {
        <div class="border-b pb-4">
          <h3 class="text-sm font-semibold text-gray-700 mb-2">
            Informações Básicas
          </h3>
          <div class="space-y-2">
            <div>
              <p class="text-xs text-gray-500 uppercase tracking-wide">Nome</p>
              <p class="text-sm font-medium text-gray-900">
                {{ participant?.name }}
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-500 uppercase tracking-wide">Email</p>
              <p class="text-sm font-medium text-gray-900">
                {{ participant?.email || '-' }}
              </p>
            </div>
          </div>
        </div>

        @if (ticket) {
          <div class="border-b pb-4">
            <h3 class="text-sm font-semibold text-gray-700 mb-2">Ingresso</h3>
            <div class="bg-blue-50 rounded p-3 space-y-2">
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">
                  Tipo
                </p>
                <p class="text-sm font-medium text-gray-900">
                  {{ ticket.title }}
                </p>
              </div>
              @if (ticket.price) {
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wide">
                    Preço
                  </p>
                  <p class="text-sm font-medium text-gray-900">
                    R$ {{ ticket.price }}
                  </p>
                </div>
              }
            </div>
          </div>
        }

        @if (responses.length > 0) {
          <div>
            <h3 class="text-sm font-semibold text-gray-700 mb-2">
              Respostas do Formulário
            </h3>
            <div class="space-y-3">
              @for (response of responses; track response.id) {
                <div class="bg-gray-50 rounded p-3">
                  <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    {{ getQuestionTitle(response.question_id) }}
                  </p>
                  <p class="text-sm font-medium text-gray-900">
                    {{ response.answer }}
                  </p>
                </div>
              }
            </div>
          </div>
        }

        @if (responses.length === 0) {
          <div class="text-center py-4">
            <p class="text-sm text-gray-500">Nenhuma resposta de formulário</p>
          </div>
        }
      }
    </div>
  </app-dialog>`,
})
export class ViewParticipantDialogComponent implements OnInit {
  @Output() closed = new EventEmitter<void>();
  @ViewChild('dlg') dlg!: DialogComponent;

  protected ticketsSvc = inject(TicketsService);
  protected questionsSvc = inject(QuestionsService);
  protected responsesSvc = inject(ParticipantResponsesService);

  participant?: IParticipant;
  ticket?: ITicket;
  responses: IParticipantResponse[] = [];
  questions: IQuestion[] = [];
  loading = false;

  open = () => this.dlg.open();
  close = () => {
    this.dlg.close();
    this.closed.emit();
  };

  async openView(participant: IParticipant, questions: IQuestion[]) {
    this.participant = participant;
    this.questions = questions;
    this.responses = [];
    this.ticket = undefined;
    this.loading = true;

    try {
      if (participant.ticket_id) {
        const tickets = await this.ticketsSvc.getTicketsByEvent(
          participant.event_id,
        );
        this.ticket = tickets.find((t) => t.id === participant.ticket_id);
      }

      this.responses = await this.responsesSvc.getResponsesByParticipant(
        participant.id!,
      );
    } catch (error) {
      console.error('Erro ao carregar detalhes do participante:', error);
    } finally {
      this.loading = false;
      this.open();
    }
  }

  getQuestionTitle(questionId: string): string {
    return (
      this.questions.find((q) => q.id === questionId)?.title ||
      'Pergunta desconhecida'
    );
  }

  ngOnInit(): void {}
}
