import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  QuestionsService,
  IQuestion,
} from '../../../core/services/questions.service';
import { ActivatedRoute } from '@angular/router';
import { AddQuestionDialogComponent } from './add-question.dialog';
import { ButtonComponent } from '../../../shared/components/button.component';
import { CardComponent } from '../../../shared/components/card.component';
import { SkeletonComponent } from '../../../shared/components/skeleton.component';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    CardComponent,
    SkeletonComponent,
    AddQuestionDialogComponent,
  ],
  template: `
    <div class="p-6 h-full flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Formulários</h1>
          <p class="text-sm text-gray-500">
            Gerencie as perguntas do seu evento
          </p>
        </div>
        @if (!loading && questions.length !== 0) {
          <cmp-button variant="primary" (click)="addQuestionDlg.openAdd()">
            + Adicionar pergunta
          </cmp-button>
        }
      </div>

      @if (!loading && questions.length === 0) {
        <div class="flex-1 flex items-center justify-center">
          <div
            class="flex flex-col items-center rounded-2xl border border-dashed border-gray-300 bg-gradient-to-b from-gray-50 to-white px-12 py-14 text-center shadow-sm"
          >
            <h2 class="text-lg font-semibold text-gray-800">
              Nenhuma pergunta criada ainda
            </h2>
            <p class="mt-2 text-sm text-gray-500">
              Comece criando a primeira pergunta para o seu evento
            </p>
            <div class="mt-4">
              <cmp-button variant="primary" (click)="addQuestionDlg.openAdd()">
                Criar primeira pergunta
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
          *ngFor="let q of questions"
          class="flex flex-col justify-between"
        >
          <div class="flex flex-col gap-2">
            <h2 class="font-semibold text-gray-900 leading-tight">
              {{ q.title }}
            </h2>
          </div>
          <div class="flex gap-2 mt-5 justify-end">
            <cmp-button variant="outline" size="sm" (click)="editQuestion(q)"
              >Editar</cmp-button
            >
            <cmp-button
              variant="danger"
              size="sm"
              (click)="removeQuestion(q.id!)"
              >Remover</cmp-button
            >
          </div>
        </cmp-card>
      </div>
    </div>

    <add-question-dialog
      #addQuestionDlg
      (saved)="onQuestionSaved($event)"
    ></add-question-dialog>
  `,
})
export class FormComponent implements OnInit {
  protected questionsSvc = inject(QuestionsService);
  protected route = inject(ActivatedRoute);

  @ViewChild('addQuestionDlg') addQuestionDlg!: AddQuestionDialogComponent;

  public questions: IQuestion[] = [];
  public loading = true;

  ngOnInit(): void {
    const eventId = this.getEventId();
    if (!eventId) {
      this.loading = false;
      return;
    }

    this.questionsSvc.getQuestionsByEvent(eventId).then((q) => {
      this.questions = q;
      this.loading = false;
    });
  }

  getEventId(): string | null {
    return (
      this.route.parent?.snapshot.paramMap.get('id') ??
      this.route.snapshot.paramMap.get('id')
    );
  }

  async onQuestionSaved(v: Partial<IQuestion>) {
    const eventId = this.getEventId();
    if (!eventId) return;

    const questionId = v.id;

    if (questionId) {
      const patch: Partial<IQuestion> = {
        title: v.title ?? '',
      };

      try {
        await this.questionsSvc.updateQuestion(questionId, patch);

        const idx = this.questions.findIndex((q) => q.id === questionId);
        if (idx !== -1) {
          this.questions[idx] = { ...this.questions[idx], ...patch };
        }

        this.addQuestionDlg.resetForm();
      } catch (err) {
        console.error(err);
      }
    } else {
      const payload: IQuestion = {
        event_id: eventId,
        title: v.title ?? '',
      };

      try {
        const created = await this.questionsSvc.createQuestion(payload);

        this.questions = [
          created,
          ...this.questions.filter((q) => q.id !== created.id),
        ];

        this.addQuestionDlg.resetForm();
      } catch (err) {
        console.error(err);
      }
    }
  }

  editQuestion(question: IQuestion) {
    this.addQuestionDlg.openEdit(question);
  }

  async removeQuestion(questionId: string) {
    if (!confirm('Tem certeza que deseja remover esta pergunta?')) return;

    try {
      await this.questionsSvc.deleteQuestion(questionId);
      this.questions = this.questions.filter((q) => q.id !== questionId);
    } catch (err) {
      console.error(err);
    }
  }
}
