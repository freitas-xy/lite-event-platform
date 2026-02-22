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
import { IParticipant } from '../../../core/services/participants.service';

@Component({
  selector: 'add-participant-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogComponent, InputComponent],
  template: `<app-dialog
    #dlg
    [title]="isEditMode ? 'Editar participante' : 'Adicionar participante'"
    (confirmed)="onSubmit()"
  >
    <form [formGroup]="form" class="p-4 space-y-3">
      <cmp-input formControlName="name" placeholder="Nome do participante"
        >Nome *</cmp-input
      >
      <cmp-input type="email" formControlName="email" placeholder="Email"
        >Email</cmp-input
      >
    </form>
  </app-dialog>`,
})
export class AddParticipantDialogComponent {
  @Output() saved = new EventEmitter<Partial<IParticipant>>();
  @ViewChild('dlg') dlg!: DialogComponent;
  @Input() participant?: IParticipant;

  get isEditMode(): boolean {
    return !!this.participant?.id;
  }

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: [''],
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
    this.saved.emit({ id: this.participant?.id, name: v.name, email: v.email });
    this.dlg.close();
  }

  resetForm = () => {
    this.participant = undefined;
    this.form.reset({ name: '', email: '' });
  };

  openEdit(participant: IParticipant) {
    this.participant = participant;
    this.form.patchValue({
      name: participant.name,
      email: participant.email,
    });
    this.dlg.open();
  }

  openAdd() {
    this.participant = undefined;
    this.form.reset({ name: '', email: '' });
    this.dlg.open();
  }
}
