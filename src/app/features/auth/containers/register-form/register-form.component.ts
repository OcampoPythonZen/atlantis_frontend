import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { PasswordInputComponent } from '../../components/password-input/password-input.component';
import { CheckboxComponent } from '../../../../shared/components/ui/checkbox/checkbox.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { PasswordStrengthComponent } from '../../../../shared/components/ui/password-strength/password-strength.component';
import { AuthFacade } from '../../facades/auth.facade';
import { CustomValidators, getValidationMessage } from '../../../../shared/validators/custom-validators';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    InputComponent,
    PasswordInputComponent,
    CheckboxComponent,
    SpinnerComponent,
    PasswordStrengthComponent
  ],
  templateUrl: './register-form.component.html',
  styles: [`
    .animate-fade-in-up {
      animation: fadeInUp 0.4s ease-out;
    }

    @keyframes fadeInUp {
      0% {
        opacity: 0;
        transform: translateY(16px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class RegisterFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authFacade = inject(AuthFacade);

  readonly isLoading = this.authFacade.isLoading;
  readonly authError = this.authFacade.error;

  readonly form: FormGroup = this.fb.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), CustomValidators.passwordStrength]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [CustomValidators.termsAccepted]]
    },
    {
      validators: [CustomValidators.passwordsMatch('password', 'confirmPassword')]
    }
  );

  private submitted = signal(false);

  getError(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !this.submitted() || !control.errors) return '';
    return getValidationMessage(fieldName, control.errors);
  }

  async onSubmit(): Promise<void> {
    this.submitted.set(true);
    this.authFacade.clearError();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { fullName, email, password } = this.form.value;
    await this.authFacade.register({ fullName, email, password });
  }
}
