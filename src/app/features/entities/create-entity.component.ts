import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { EntitiesService } from '../../core/services/entities.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-entity',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex h-screen w-full items-center justify-center">
      <h1 class="text-2xl font-bold">
        Estamos criando sua área de trabalho
        <span class="dots">.</span>
      </h1>
    </div>
  `,
  styles: [
    `
      .dots {
        display: inline-block;
        width: 1em;
        text-align: left;
      }

      .dots::after {
        content: '.';
        animation: blink 1s steps(2, end) infinite;
      }

      @keyframes blink {
        0%,
        20% {
          content: '';
        }
        40% {
          content: '.';
        }
        60% {
          content: '.';
        }
        80%,
        100% {
          content: '..';
        }
      }
    `,
  ],
})
export class CreateEntityPage implements OnInit {
  protected entityService: EntitiesService = inject(EntitiesService);
  protected router: Router = inject(Router);

  ngOnInit(): void {
    this.createEntity();
  }

  private async createEntity() {
    this.entityService.createEntity(
      'Minha nova entidade',
      'Descrição da minha nova entidade',
    );

    this.router.navigate(['/app']);
  }
}
