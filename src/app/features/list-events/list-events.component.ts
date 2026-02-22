import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { EventsService, IEvent } from '../../core/services/events.service';
import { EntitiesService } from '../../core/services/entities.service';
import { AddEventDialogComponent } from './dialogs/add-event.dialog';
import { ButtonComponent } from '../../shared/components/button.component';
import { SkeletonComponent } from '../../shared/components/skeleton.component';
import { CardComponent } from '../../shared/components/card.component';

@Component({
  selector: 'cmp-list-events',
  imports: [
    CommonModule,
    AddEventDialogComponent,
    ButtonComponent,
    CardComponent,
    SkeletonComponent,
  ],
  templateUrl: './list-events.component.html',
})
export class ListEventsComponent implements OnInit {
  protected readonly entitySrc: EntitiesService = inject(EntitiesService);
  protected readonly eventsSrc: EventsService = inject(EventsService);

  public loading: boolean = true;
  public events: IEvent[] = [];

  ngOnInit() {
    this.loading = true;
    const entity = this.entitySrc.getEntity();

    if (!entity) {
      this.loading = false;
      return;
    }

    this.eventsSrc.getEventsByEntity(entity.id).then((events) => {
      this.events = events;
      this.loading = false;
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
