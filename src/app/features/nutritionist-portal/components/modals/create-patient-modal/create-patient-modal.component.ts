import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NutritionistPortalFacade } from '../../../facades/nutritionist-portal.facade';

@Component({
  selector: 'app-create-patient-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    @if (facade.isCreatePatientModalOpen()) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 z-50 bg-dark-900/60 backdrop-blur-sm"
        (click)="onBackdropClick($event)"
        aria-hidden="true"
      ></div>

      <!-- Modal -->
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          class="
            w-full max-w-lg max-h-[90vh] overflow-y-auto
            bg-white dark:bg-dark-800
            rounded-2xl shadow-2xl
            transform transition-all
          "
          (click)="$event.stopPropagation()"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-dark-200 dark:border-dark-700">
            <div>
              <h2 id="modal-title" class="text-xl font-display font-bold text-dark-900 dark:text-dark-50">
                Nuevo Paciente
              </h2>
              <p class="text-sm text-dark-500 dark:text-dark-400 mt-1">
                Ingresa la información básica del paciente
              </p>
            </div>
            <button
              (click)="closeModal()"
              class="p-2 rounded-lg text-dark-500 hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-200 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
              aria-label="Cerrar modal"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Form -->
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-6 space-y-5">
            <!-- Full Name -->
            <div>
              <label for="fullName" class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
                Nombre completo <span class="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                formControlName="fullName"
                placeholder="Ej: María García López"
                class="
                  w-full px-4 py-2.5 rounded-xl
                  bg-dark-50 dark:bg-dark-900
                  border border-dark-200 dark:border-dark-700
                  text-dark-900 dark:text-dark-50
                  placeholder-dark-400
                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                  transition-all
                "
                [class.border-red-500]="isFieldInvalid('fullName')"
              />
              @if (isFieldInvalid('fullName')) {
                <p class="mt-1.5 text-sm text-red-500">Este campo es requerido</p>
              }
            </div>

            <!-- Email & Phone Row -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
                  Correo electrónico <span class="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  formControlName="email"
                  placeholder="correo@ejemplo.com"
                  class="
                    w-full px-4 py-2.5 rounded-xl
                    bg-dark-50 dark:bg-dark-900
                    border border-dark-200 dark:border-dark-700
                    text-dark-900 dark:text-dark-50
                    placeholder-dark-400
                    focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                    transition-all
                  "
                  [class.border-red-500]="isFieldInvalid('email')"
                />
                @if (isFieldInvalid('email')) {
                  <p class="mt-1.5 text-sm text-red-500">
                    @if (form.get('email')?.errors?.['required']) {
                      Este campo es requerido
                    } @else {
                      Correo electrónico inválido
                    }
                  </p>
                }
              </div>

              <!-- Phone -->
              <div>
                <label for="phone" class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
                  Teléfono <span class="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  formControlName="phone"
                  placeholder="+52 55 1234 5678"
                  class="
                    w-full px-4 py-2.5 rounded-xl
                    bg-dark-50 dark:bg-dark-900
                    border border-dark-200 dark:border-dark-700
                    text-dark-900 dark:text-dark-50
                    placeholder-dark-400
                    focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                    transition-all
                  "
                  [class.border-red-500]="isFieldInvalid('phone')"
                />
                @if (isFieldInvalid('phone')) {
                  <p class="mt-1.5 text-sm text-red-500">Este campo es requerido</p>
                }
              </div>
            </div>

            <!-- Birth Date & Gender Row -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Birth Date -->
              <div>
                <label for="birthDate" class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
                  Fecha de nacimiento <span class="text-red-500">*</span>
                </label>
                <input
                  id="birthDate"
                  type="date"
                  formControlName="birthDate"
                  class="
                    w-full px-4 py-2.5 rounded-xl
                    bg-dark-50 dark:bg-dark-900
                    border border-dark-200 dark:border-dark-700
                    text-dark-900 dark:text-dark-50
                    focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                    transition-all
                  "
                  [class.border-red-500]="isFieldInvalid('birthDate')"
                />
                @if (isFieldInvalid('birthDate')) {
                  <p class="mt-1.5 text-sm text-red-500">Este campo es requerido</p>
                }
              </div>

              <!-- Gender -->
              <div>
                <label for="gender" class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
                  Género <span class="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  formControlName="gender"
                  class="
                    w-full px-4 py-2.5 rounded-xl
                    bg-dark-50 dark:bg-dark-900
                    border border-dark-200 dark:border-dark-700
                    text-dark-900 dark:text-dark-50
                    focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                    transition-all appearance-none
                  "
                  [class.border-red-500]="isFieldInvalid('gender')"
                >
                  <option value="" disabled>Seleccionar...</option>
                  <option value="female">Femenino</option>
                  <option value="male">Masculino</option>
                  <option value="other">Otro</option>
                </select>
                @if (isFieldInvalid('gender')) {
                  <p class="mt-1.5 text-sm text-red-500">Este campo es requerido</p>
                }
              </div>
            </div>

            <!-- Optional Section Header -->
            <div class="pt-4 border-t border-dark-200 dark:border-dark-700">
              <button
                type="button"
                (click)="showOptionalFields.set(!showOptionalFields())"
                class="flex items-center gap-2 text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
              >
                <svg
                  class="w-4 h-4 transition-transform"
                  [class.rotate-180]="showOptionalFields()"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
                {{ showOptionalFields() ? 'Ocultar' : 'Mostrar' }} campos adicionales
              </button>
            </div>

            <!-- Optional Fields -->
            @if (showOptionalFields()) {
              <div class="space-y-5 animate-in slide-in-from-top-2">
                <!-- Initial Weight & Height Row -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Initial Weight -->
                  <div>
                    <label for="initialWeight" class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
                      Peso inicial (kg)
                    </label>
                    <input
                      id="initialWeight"
                      type="number"
                      step="0.1"
                      formControlName="initialWeight"
                      placeholder="70.5"
                      class="
                        w-full px-4 py-2.5 rounded-xl
                        bg-dark-50 dark:bg-dark-900
                        border border-dark-200 dark:border-dark-700
                        text-dark-900 dark:text-dark-50
                        placeholder-dark-400
                        focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                        transition-all
                      "
                    />
                  </div>

                  <!-- Height -->
                  <div>
                    <label for="height" class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
                      Estatura (cm)
                    </label>
                    <input
                      id="height"
                      type="number"
                      formControlName="height"
                      placeholder="170"
                      class="
                        w-full px-4 py-2.5 rounded-xl
                        bg-dark-50 dark:bg-dark-900
                        border border-dark-200 dark:border-dark-700
                        text-dark-900 dark:text-dark-50
                        placeholder-dark-400
                        focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                        transition-all
                      "
                    />
                  </div>
                </div>

                <!-- Target Weight -->
                <div>
                  <label for="targetWeight" class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
                    Peso objetivo (kg)
                  </label>
                  <input
                    id="targetWeight"
                    type="number"
                    step="0.1"
                    formControlName="targetWeight"
                    placeholder="65.0"
                    class="
                      w-full px-4 py-2.5 rounded-xl
                      bg-dark-50 dark:bg-dark-900
                      border border-dark-200 dark:border-dark-700
                      text-dark-900 dark:text-dark-50
                      placeholder-dark-400
                      focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                      transition-all
                    "
                  />
                </div>

                <!-- Medical Notes -->
                <div>
                  <label for="medicalNotes" class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
                    Notas médicas iniciales
                  </label>
                  <textarea
                    id="medicalNotes"
                    formControlName="medicalNotes"
                    rows="3"
                    placeholder="Alergias, condiciones médicas, medicamentos..."
                    class="
                      w-full px-4 py-2.5 rounded-xl
                      bg-dark-50 dark:bg-dark-900
                      border border-dark-200 dark:border-dark-700
                      text-dark-900 dark:text-dark-50
                      placeholder-dark-400
                      focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                      transition-all resize-none
                    "
                  ></textarea>
                </div>
              </div>
            }

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-dark-200 dark:border-dark-700">
              <button
                type="button"
                (click)="closeModal()"
                class="
                  px-5 py-2.5 rounded-xl
                  bg-dark-100 hover:bg-dark-200 dark:bg-dark-700 dark:hover:bg-dark-600
                  text-dark-700 dark:text-dark-300
                  font-medium transition-colors
                "
              >
                Cancelar
              </button>
              <button
                type="submit"
                [disabled]="isSubmitting()"
                class="
                  px-5 py-2.5 rounded-xl
                  bg-primary-500 hover:bg-primary-600
                  text-dark-950 font-medium
                  transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center gap-2
                "
              >
                @if (isSubmitting()) {
                  <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                } @else {
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Crear Paciente
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class CreatePatientModalComponent {
  readonly facade = inject(NutritionistPortalFacade);
  private readonly fb = inject(FormBuilder);

  showOptionalFields = signal(false);
  isSubmitting = signal(false);

  form: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    birthDate: ['', [Validators.required]],
    gender: ['', [Validators.required]],
    initialWeight: [null],
    height: [null],
    targetWeight: [null],
    medicalNotes: ['']
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  closeModal(): void {
    this.form.reset();
    this.showOptionalFields.set(false);
    this.facade.closeCreatePatientModal();
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.form.value;
    const patientData = {
      fullName: formValue.fullName,
      email: formValue.email,
      phone: formValue.phone,
      birthDate: new Date(formValue.birthDate),
      gender: formValue.gender,
      ...(formValue.initialWeight && { initialWeight: formValue.initialWeight }),
      ...(formValue.height && { height: formValue.height }),
      ...(formValue.targetWeight && { targetWeight: formValue.targetWeight }),
      ...(formValue.medicalNotes && { medicalNotes: formValue.medicalNotes })
    };

    const success = await this.facade.createPatient(patientData);

    if (success) {
      this.form.reset();
      this.showOptionalFields.set(false);
    }

    this.isSubmitting.set(false);
  }
}
