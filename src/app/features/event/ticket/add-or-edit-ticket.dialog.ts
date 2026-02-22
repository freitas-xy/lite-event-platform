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
import { ITicket } from '../../../core/services/tickets.service';

@Component({
  selector: 'add-or-edit-ticket-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogComponent, InputComponent],
  template: `<app-dialog
    #dlg
    [title]="isEditMode ? 'Editar ingresso' : 'Adicionar ingresso'"
    (confirmed)="onSubmit()"
  >
    <form [formGroup]="form" class="p-4 space-y-3">
      <cmp-input formControlName="title" placeholder="Título do ingresso"
        >Título *</cmp-input
      >
      <cmp-input type="number" formControlName="price" placeholder="Preço"
        >Preço</cmp-input
      >
      <cmp-input
        type="number"
        formControlName="quantity"
        placeholder="Quantidade"
        >Quantidade</cmp-input
      >
    </form>
  </app-dialog>`,
})
export class AddTicketDialogComponent {
  @Output() saved = new EventEmitter<Partial<ITicket>>();
  @ViewChild('dlg') dlg!: DialogComponent;
  @Input() ticket?: ITicket;

  get isEditMode(): boolean {
    return !!this.ticket?.id;
  }

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      price: [null],
      quantity: [null],
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
    this.saved.emit({ id: this.ticket?.id, title: v.title, price: v.price, quantity: v.quantity });
    this.dlg.close();
  }

  resetForm = () => {
    this.ticket = undefined;
    this.form.reset({ title: '', price: null, quantity: null });
  };

  openEdit(ticket: ITicket) {
    this.ticket = ticket;
    this.form.patchValue({
      title: ticket.title,
      price: ticket.price,
      quantity: ticket.quantity,
    });
    this.dlg.open();
  }

  openAdd() {
    this.ticket = undefined;
    this.form.reset({ title: '', price: null, quantity: null });
    this.dlg.open();
  }
}
