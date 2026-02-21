
import { Component, inject } from '@angular/core';
import { InputComponent } from "../../../components/input/input";
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../services/supabase.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-create-account',
  imports: [
    InputComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './create-account.html'
})
export class CreateAccountPage {
  private supabase = inject(SupabaseService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    userName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  async onSubmit() {
    if (this.form.valid) {
      const value = this.form.value;
      console.log('Login', value);

      if (value.password !== value.confirmPassword) {
        this.toast.show('Senhas diferentes', 'danger');
        return;
      }

      if (!value.userName || !value.email || !value.password) {
        alert('Preencha todos os campos');
        return;
      }

      const { data, error } = await this.supabase.client.auth.signUp(
        {
          email: value.email,
          password: value.password,
          options: {
            data: {
              first_name: value.userName,
            }
          }
        }
      )

      this.router.navigate(['/']);
    } else {
      this.form.markAllAsTouched();
    }
  }

  navigateToLogin() {
    this.router.navigate(['/auth/login']);
  }

  textError(field: string): string {
    if (this.form.get(field)?.errors?.['required'])
      return 'Campo obrigatório';
    else if (this.form.get(field)?.errors?.['email'])
      return 'Email inválido';
    else if (this.form.get(field)?.errors?.['minlength'])
      return 'A senha precisa ter no mínimo 6 caracteres.';

    return '';
  }
}
