import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientPersonalInfo } from '../../../../models/nutritionist.model';

@Component({
  selector: 'app-personal-info-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (personalInfo) {
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50 flex items-center gap-2">
            <svg class="w-5 h-5 text-navy-600 dark:text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Datos Personales
          </h3>
        </div>

        <div class="bg-dark-50 dark:bg-dark-900 rounded-xl p-5">
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt class="text-sm text-dark-500 dark:text-dark-400">Nombre Completo</dt>
              <dd class="text-sm font-medium text-dark-900 dark:text-dark-50 mt-0.5">{{ personalInfo.fullName }}</dd>
            </div>
            <div>
              <dt class="text-sm text-dark-500 dark:text-dark-400">Correo Electrónico</dt>
              <dd class="text-sm font-medium text-dark-900 dark:text-dark-50 mt-0.5">{{ personalInfo.email }}</dd>
            </div>
            <div>
              <dt class="text-sm text-dark-500 dark:text-dark-400">Teléfono</dt>
              <dd class="text-sm font-medium text-dark-900 dark:text-dark-50 mt-0.5">{{ personalInfo.phone }}</dd>
            </div>
            <div>
              <dt class="text-sm text-dark-500 dark:text-dark-400">Género</dt>
              <dd class="text-sm font-medium text-dark-900 dark:text-dark-50 mt-0.5">
                {{ personalInfo.gender === 'male' ? 'Masculino' : personalInfo.gender === 'female' ? 'Femenino' : 'Otro' }}
              </dd>
            </div>
            <div>
              <dt class="text-sm text-dark-500 dark:text-dark-400">Fecha de Nacimiento</dt>
              <dd class="text-sm font-medium text-dark-900 dark:text-dark-50 mt-0.5">{{ personalInfo.birthDate | date:'longDate' }}</dd>
            </div>
            <div>
              <dt class="text-sm text-dark-500 dark:text-dark-400">Edad</dt>
              <dd class="text-sm font-medium text-dark-900 dark:text-dark-50 mt-0.5">{{ personalInfo.age }} años</dd>
            </div>
            @if (personalInfo.address) {
              <div class="md:col-span-2">
                <dt class="text-sm text-dark-500 dark:text-dark-400">Dirección</dt>
                <dd class="text-sm font-medium text-dark-900 dark:text-dark-50 mt-0.5">{{ personalInfo.address }}</dd>
              </div>
            }
          </dl>

          @if (personalInfo.emergencyContact) {
            <div class="mt-4 pt-4 border-t border-dark-200 dark:border-dark-700">
              <h4 class="text-sm font-medium text-dark-500 dark:text-dark-400 mb-3">Contacto de Emergencia</h4>
              <dl class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <dt class="text-sm text-dark-500 dark:text-dark-400">Nombre</dt>
                  <dd class="text-sm font-medium text-dark-900 dark:text-dark-50 mt-0.5">{{ personalInfo.emergencyContact.name }}</dd>
                </div>
                <div>
                  <dt class="text-sm text-dark-500 dark:text-dark-400">Teléfono</dt>
                  <dd class="text-sm font-medium text-dark-900 dark:text-dark-50 mt-0.5">{{ personalInfo.emergencyContact.phone }}</dd>
                </div>
                <div>
                  <dt class="text-sm text-dark-500 dark:text-dark-400">Relación</dt>
                  <dd class="text-sm font-medium text-dark-900 dark:text-dark-50 mt-0.5">{{ personalInfo.emergencyContact.relationship }}</dd>
                </div>
              </dl>
            </div>
          }
        </div>
      </div>
    } @else {
      <div class="border-2 border-dashed border-teal-300 dark:border-teal-700 rounded-xl p-8 text-center">
        <svg class="w-12 h-12 mx-auto mb-3 text-teal-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <p class="font-medium text-dark-700 dark:text-dark-300">Sin datos personales</p>
        <p class="text-sm text-dark-500 dark:text-dark-400 mt-1">Agrega la información personal del paciente</p>
        <button class="mt-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors text-sm">
          Agregar
        </button>
      </div>
    }
  `
})
export class PersonalInfoSectionComponent {
  @Input() personalInfo: PatientPersonalInfo | null = null;
}
