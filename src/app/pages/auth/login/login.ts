import { Component, inject } from '@angular/core';
import { InputComponent } from "../../../components/input/input";
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    InputComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.html',
})
export class LoginPage {
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  public navigateCreateAccount() {
    this.router.navigate(['/auth/create-account']);
  }

  public onSubmit() {
    if (this.form.valid) {
      const value = this.form.value;
      console.log('Login', value);
      this.router.navigate(['/']);
    } else {
      this.form.markAllAsTouched();
    }
  }

  public textError(field: string): string {
    if (this.form.get(field)?.errors?.['required'])
      return 'Campo obrigatório';
    else if (this.form.get(field)?.errors?.['email'])
      return 'Email inválido';
    else if (this.form.get(field)?.errors?.['minlength'])
      return 'A senha precisa ter no mínimo 6 caracteres.';
    
    return '';
  }
}
