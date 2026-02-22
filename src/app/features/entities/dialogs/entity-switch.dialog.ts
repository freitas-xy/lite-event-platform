import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DialogComponent } from '../../../shared/components/dialog.component';
import { EntitiesService } from '../../../core/services/entities.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-entity-switch-dialog',
  standalone: true,
  imports: [DialogComponent, CommonModule],
  template: ` <app-dialog
    #dialog
    size="w-2/5 min-w-[30%] max-w-[30%]"
    [hiddenConfirm]="true"
    title="Unidades"
    (closed)="onClose()"
    (confirmed)="onConfirm()"
  >
    <div class="flex flex-col">
      @for (item of entities; track $index) {
        <div
          (click)="selectEntity(item.id)"
          class="w-full cursor-pointer border border-gray-300 p-6 flex justify-between hover:bg-gray-100"
        >
          {{ item.name }}
          <a class="ml-2 text-blue-500 hover:text-blue-700">Acessar</a>
        </div>
      }
    </div>
  </app-dialog>`,
})
export class EntitySwitchDialog implements OnInit {
  @ViewChild('dialog') dialog!: DialogComponent;

  @Input() set open(value: boolean) {
    if (!!this.dialog) value ? this.dialog.open() : this.dialog.close();
  }

  @Output() close = new EventEmitter<void>();

  protected entity: EntitiesService = inject(EntitiesService);

  public entities: any[] = [];

  ngOnInit() {
    this.listEntities();
  }

  selectEntity(entityId: string) {
    this.entity.selectEntity(entityId);
    location.reload();
  }

  async listEntities() {
    const entities = await this.entity.listEntities();
    this.entities = entities;
  }

  onClose() {
    this.close.emit();
  }

  onConfirm() {
    this.close.emit();
  }
}
