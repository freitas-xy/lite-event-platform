import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { DialogComponent } from '../../../shared/components/dialog.component';

@Component({
  selector: 'app-entity-switch-dialog',
  standalone: true,
  imports: [DialogComponent],
  template: ` <app-dialog
    #dialog
    size="w-2/5 min-w-[30%] max-w-[30%]"
    [hiddenConfirm]="true"
    title="Unidades"
    (closed)="onClose()"
    (confirmed)="onConfirm()"
  >
  </app-dialog>`,
})
export class EntitySwitchDialog {
  @ViewChild('dialog') dialog!: DialogComponent;

  @Input() set open(value: boolean) {
    if (!!this.dialog) value ? this.dialog.open() : this.dialog.close();
  }

  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onConfirm() {
    this.close.emit();
  }
}
