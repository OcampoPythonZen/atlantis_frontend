import { Component, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { PasswordInputComponent } from '../../components/password-input/password-input.component';
import { CheckboxComponent } from '../../../../shared/components/ui/checkbox/checkbox.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { AuthFacade } from '../../facades/auth.facade';
import { getValidationMessage } from '../../../../shared/validators/custom-validators';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    InputComponent,
    PasswordInputComponent,
    CheckboxComponent,
    SpinnerComponent
  ],
  templateUrl: './login-form.component.html',
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
export class LoginFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authFacade = inject(AuthFacade);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = this.authFacade.isLoading;
  readonly authError = this.authFacade.error;

  readonly form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    rememberMe: [false]
  });

  // Signal to track form validity for zoneless change detection
  readonly isFormValid = signal(false);
  private submitted = signal(false);

  constructor() {
    // Subscribe to form status changes to update the signal
    this.form.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isFormValid.set(this.form.valid);
      });
  }

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

    const { email, password, rememberMe } = this.form.value;
    await this.authFacade.login({ email, password }, rememberMe);
  }
}
