import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { InputComponent } from '../../../shared/components/input.component';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { SupabaseService } from '../../../core/services/supabase.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  imports: [InputComponent, ReactiveFormsModule, CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
})
export class LoginPage {
  protected supabase: SupabaseService = inject(SupabaseService);
  protected cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  protected toast: ToastService = inject(ToastService);
  protected user: UserService = inject(UserService);
  protected fb: FormBuilder = inject(FormBuilder);
  protected router: Router = inject(Router);

  loading: boolean = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async onSubmit() {
    if (this.loading) return;

    if (this.form.invalid)
      return this.showErrorToast('Preencha todos os campos corretamente');

    const { email, password } = this.form.value;

    this.loading = true;
    this.cdr.markForCheck();

    try {
      await this.user.login(email!, password!);
      await this.router.navigate(['/app']);
    } catch (error: any) {
      this.showErrorToast(error.message || 'Ocorreu um erro ao fazer login');
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  public showErrorToast(message: string): void {
    this.form.markAllAsTouched();
    this.toast.show(message, 'danger');
    this.loading = false;
    this.cdr.markForCheck();
  }

  textError(field: string): string {
    if (this.form.get(field)?.errors?.['required']) return 'Campo obrigatório';
    else if (this.form.get(field)?.errors?.['email']) return 'Email inválido';
    else if (this.form.get(field)?.errors?.['minlength'])
      return 'A senha precisa ter no mínimo 6 caracteres.';

    return '';
  }

  navigateCreateAccount = () => this.router.navigate(['/auth/create-account']);
}
