import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DialogComponent } from '../../../shared/components/dialog.component';
import { InputComponent } from '../../../shared/components/input.component';
import { TextareaComponent } from '../../../shared/components/textarea.component';
import { IEvent } from '../../../core/services/events.service';

@Component({
  selector: 'add-event-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogComponent,
    InputComponent,
    TextareaComponent,
  ],
  template: `<app-dialog
    #dlg
    [title]="'Adicionar evento'"
    (closed)="resetForm()"
    (confirmed)="onSubmit()"
  >
    <form [formGroup]="form" class="p-4 space-y-3">
      <cmp-input formControlName="title" placeholder="Digite o título">
        Título *
        <div
          class="errorText"
          *ngIf="form.get('title')?.touched && form.get('title')?.invalid"
        >
          Campo obrigatório
        </div>
      </cmp-input>

      <cmp-textarea
        formControlName="description"
        placeholder="Descrição do evento"
      >
        Descrição
      </cmp-textarea>

      <cmp-input type="date" formControlName="start_date">
        Data início
      </cmp-input>

      <cmp-input formControlName="location" placeholder="Local do evento">
        Local
      </cmp-input>
    </form>
  </app-dialog>`,
})
export class AddEventDialogComponent {
  @Output() saved = new EventEmitter<IEvent>();
  @ViewChild('dlg') dlg!: DialogComponent;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      start_date: [null],
      location: [''],
    });
  }

  open = () => this.dlg.open();

  close = () => this.dlg.close();

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    const ev: IEvent = {
      title: value.title,
      description: value.description,
      start_date: value.start_date,
      location: value.location,
      entity_id: '',
      status: 'ativo',
    };

    this.saved.emit(ev);
    this.dlg.close();
  }

  resetForm = () => this.form.reset();
}
