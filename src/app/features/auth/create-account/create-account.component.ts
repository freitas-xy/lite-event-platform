import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { InputComponent } from '../../../shared/components/input.component';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../core/services/supabase.service';
import { ToastService } from '../../../core/services/toast.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-create-account',
  imports: [InputComponent, ReactiveFormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './create-account.component.html',
})
export class CreateAccountPage {
  protected supabase: SupabaseService = inject(SupabaseService);
  protected toast: ToastService = inject(ToastService);
  protected router: Router = inject(Router);
  protected cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  protected fb: FormBuilder = inject(FormBuilder);
  protected user: UserService = inject(UserService);

  loading: boolean = false;

  form: FormGroup = this.fb.group({
    userName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  async onSubmit() {
    if (this.loading) return;

    if (this.form.invalid)
      return this.showErrorToast('Preencha todos os campos corretamente');

    const { userName, email, password, confirmPassword } = this.form.value;

    if (password !== confirmPassword)
      return this.showErrorToast('Senhas diferentes');

    this.loading = true;
    this.cdr.markForCheck();

    try {
      this.loading = true;
      await this.user.signUp(userName, email, password);
      await this.router.navigate(['/app']);
    } catch (error: any) {
      this.showErrorToast(error.message || 'Ocorreu um erro ao criar a conta');
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

  navigateToLogin = (): Promise<boolean> =>
    this.router.navigate(['/auth/login']);

  textError(field: string): string {
    if (this.form.get(field)?.errors?.['required']) return 'Campo obrigatório';
    else if (this.form.get(field)?.errors?.['email']) return 'Email inválido';
    else if (this.form.get(field)?.errors?.['minlength'])
      return 'A senha precisa ter no mínimo 6 caracteres.';

    return '';
  }
}
