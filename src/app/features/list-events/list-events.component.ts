import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { EventsService, IEvent } from '../../core/services/events.service';
import { EntitiesService } from '../../core/services/entities.service';
import { AddEventDialogComponent } from './dialogs/add-event.dialog';
import { ButtonComponent } from '../../shared/components/button.component';

@Component({
  selector: 'cmp-list-events',
  imports: [CommonModule, AddEventDialogComponent, ButtonComponent],
  templateUrl: './list-events.component.html',
})
export class ListEventsComponent implements OnInit {
  protected readonly entitySrc: EntitiesService = inject(EntitiesService);
  protected readonly eventsSrc: EventsService = inject(EventsService);

  public events: IEvent[] = [];

  ngOnInit() {
    const entity = this.entitySrc.getEntity();

    if (!entity) return;

    this.eventsSrc.getEventsByEntity(entity.id).then((events) => {
      this.events = events;
    });
  }

  async onEventSaved(event: IEvent) {
    const entity = this.entitySrc.getEntity();
    if (!entity) return;

    event.entity_id = entity.id;

    try {
      await this.eventsSrc.createEvent(event);
      this.events.unshift(event);
    } catch (error) {
      console.error('Erro ao criar evento', error);
    }
  }
}
