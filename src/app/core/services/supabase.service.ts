import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private readonly supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey,
      {
        auth: {
          persistSession: true,
          detectSessionInUrl: true,
        },
      },
    );
  }

  get client(): SupabaseClient {
    return this.supabase;
  }
}
