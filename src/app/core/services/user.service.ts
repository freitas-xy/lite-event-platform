import { inject, Injectable } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

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
  protected readonly supabase: SupabaseService = inject(SupabaseService);
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
  
  public async login(email: string, password: string): Promise<User> {
    const { data, error } = await this.supabase.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user)
      throw new Error(error?.message || 'Erro ao fazer login');

    this.setUser(data.user);
    return data.user;
  }

  public async signUp(
    userName: string,
    email: string,
    password: string,
  ): Promise<User> {
    const { data, error } = await this.supabase.client.auth.signUp({
      email,
      password,
      options: { data: { display_name: userName } },
    });

    if (error || !data.user)
      throw new Error(error?.message || 'Erro ao criar conta');

    this.setUser(data.user);
    return data.user;
  }

  public getUser(): IUser | null {
    const raw = localStorage.getItem(this.userKey);
    return raw ? JSON.parse(raw) : null;
  }

  public clear(): void {
    localStorage.removeItem(this.userKey);
  }
}
