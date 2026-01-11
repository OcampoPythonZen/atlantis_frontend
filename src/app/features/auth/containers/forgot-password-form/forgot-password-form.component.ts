import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { AuthFacade } from '../../facades/auth.facade';
import { getValidationMessage } from '../../../../shared/validators/custom-validators';

@Component({
  selector: 'app-forgot-password-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    InputComponent,
    SpinnerComponent
  ],
  templateUrl: './forgot-password-form.component.html',
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
export class ForgotPasswordFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authFacade = inject(AuthFacade);

  readonly isLoading = this.authFacade.isLoading;
  readonly authError = this.authFacade.error;
  readonly emailSent = signal(false);
  readonly submittedEmail = signal('');

  readonly form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

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

    const { email } = this.form.value;
    const success = await this.authFacade.requestPasswordReset(email);

    if (success) {
      this.submittedEmail.set(email);
      this.emailSent.set(true);
    }
  }

  resetForm(): void {
    this.emailSent.set(false);
    this.submittedEmail.set('');
    this.submitted.set(false);
    this.form.reset();
    this.authFacade.clearError();
  }
}
