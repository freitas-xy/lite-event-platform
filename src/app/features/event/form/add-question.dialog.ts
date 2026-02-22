import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DialogComponent } from '../../../shared/components/dialog.component';
import { InputComponent } from '../../../shared/components/input.component';
import { IQuestion } from '../../../core/services/questions.service';

@Component({
  selector: 'add-question-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogComponent, InputComponent],
  template: `<app-dialog
    #dlg
    [title]="isEditMode ? 'Editar pergunta' : 'Adicionar pergunta'"
    (confirmed)="onSubmit()"
  >
    <form [formGroup]="form" class="p-4 space-y-3">
      <cmp-input formControlName="title" placeholder="Pergunta"
        >Pergunta *</cmp-input
      >
    </form>
  </app-dialog>`,
})
export class AddQuestionDialogComponent {
  @Output() saved = new EventEmitter<Partial<IQuestion>>();
  @ViewChild('dlg') dlg!: DialogComponent;
  @Input() question?: IQuestion;

  get isEditMode(): boolean {
    return !!this.question?.id;
  }

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
    });
  }

  open = () => this.dlg.open();
  close = () => this.dlg.close();

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;
    this.saved.emit({ id: this.question?.id, title: v.title });
    this.dlg.close();
  }

  resetForm = () => {
    this.question = undefined;
    this.form.reset({ title: '' });
  };

  openEdit(question: IQuestion) {
    this.question = question;
    this.form.patchValue({
      title: question.title,
    });
    this.dlg.open();
  }

  openAdd() {
    this.question = undefined;
    this.form.reset({ title: '' });
    this.dlg.open();
  }
}
