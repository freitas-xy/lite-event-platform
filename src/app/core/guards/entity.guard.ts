import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { EntitiesService } from '../services/entities.service';

export const entityGuard: CanActivateFn = async () => {
  const entitiesService = inject(EntitiesService);
  const router = inject(Router);

  try {
    const hasEntity = await entitiesService.getEntityOrRedirect();

    if (hasEntity) return true;

    router.navigate(['/create-entities']);
    return false;
  } catch (error) {
    console.error('Erro ao buscar entidades:', error);
    router.navigate(['/login']);
    return false;
  }
};
