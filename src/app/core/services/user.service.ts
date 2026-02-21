import { Injectable } from '@angular/core';
import { User } from '@supabase/supabase-js';

export interface IUser {
  displayName: string;
  email: string;
  id: string;
  createAt: string;
  updateAt?: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly userKey = 'user';

  public setUser(user: User): void {
    const userInfo: IUser = {
      displayName: user.user_metadata?.['display_name'] ?? '',
      email: user.email ?? '',
      id: user.id,
      createAt: user.created_at,
      updateAt: user.updated_at,
      role: user.user_metadata?.['role'] ?? 'user',
    };

    localStorage.setItem(this.userKey, JSON.stringify(userInfo));
  }

  public getUser(): IUser | null {
    const raw = localStorage.getItem(this.userKey);
    return raw ? JSON.parse(raw) : null;
  }

  public clear(): void {
    localStorage.removeItem(this.userKey);
  }
}
