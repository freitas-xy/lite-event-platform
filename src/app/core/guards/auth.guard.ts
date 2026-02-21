import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = async () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);
  const userService = inject(UserService);

  const { data } = await supabase.client.auth.getSession();
  const session = data.session;

  if (session?.user) {
    userService.setUser(session.user);
    return true;
  }

  router.navigate(['/login']);
  return false;
};