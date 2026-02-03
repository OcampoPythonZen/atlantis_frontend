import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientComplete } from '../../../models/nutritionist.model';
import { ClinicalSectionKey, ClinicalSectionStatus, ClinicalHistory } from '../../../models/clinical-history.model';
import { ClinicalRecordSidebarComponent } from './clinical-record-sidebar.component';
import { ClinicalRecordOverviewComponent } from './clinical-record-overview.component';
import { PersonalInfoSectionComponent } from './sections/personal-info-section.component';
import { MedicalInfoSectionComponent } from './sections/medical-info-section.component';
import { FamilyHistorySectionComponent } from './sections/family-history-section.component';
import { PathologicalHistorySectionComponent } from './sections/pathological-history-section.component';
import { CurrentConditionsSectionComponent } from './sections/current-conditions-section.component';
import { PerinatalHistorySectionComponent } from './sections/perinatal-history-section.component';
import { GynecologicalHistorySectionComponent } from './sections/gynecological-history-section.component';
import { PhysicalActivitySectionComponent } from './sections/physical-activity-section.component';
import { HabitsCustomsSectionComponent } from './sections/habits-customs-section.component';
import { DietaryRecallSectionComponent } from './sections/dietary-recall-section.component';
import { HabitualDietSectionComponent } from './sections/habitual-diet-section.component';
import { PhysicalExaminationSectionComponent } from './sections/physical-examination-section.component';
import { BiochemicalDataSectionComponent } from './sections/biochemical-data-section.component';

@Component({
  selector: 'app-clinical-record-tab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ClinicalRecordSidebarComponent,
    ClinicalRecordOverviewComponent,
    PersonalInfoSectionComponent,
    MedicalInfoSectionComponent,
    FamilyHistorySectionComponent,
    PathologicalHistorySectionComponent,
    CurrentConditionsSectionComponent,
    PerinatalHistorySectionComponent,
    GynecologicalHistorySectionComponent,
    PhysicalActivitySectionComponent,
    HabitsCustomsSectionComponent,
    DietaryRecallSectionComponent,
    HabitualDietSectionComponent,
    PhysicalExaminationSectionComponent,
    BiochemicalDataSectionComponent
  ],
  template: `
    @if (patient) {
      <div class="flex flex-col lg:flex-row gap-0 -m-4 lg:-m-6">
        <!-- Mobile: Dropdown selector -->
        <div class="lg:hidden border-b border-dark-200 dark:border-dark-700">
          <button
            (click)="isMobileMenuOpen.set(!isMobileMenuOpen())"
            class="w-full flex items-center justify-between px-4 py-3 text-left"
          >
            <span class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full"
                [class]="activeSection() === 'overview' ? 'bg-teal-500' : (getActiveStatus() ? 'bg-teal-500' : 'bg-dark-300')">
              </span>
              <span class="text-sm font-medium text-dark-900 dark:text-dark-50">{{ activeSectionLabel() }}</span>
            </span>
            <svg class="w-5 h-5 text-dark-400 transition-transform" [class.rotate-180]="isMobileMenuOpen()" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          @if (isMobileMenuOpen()) {
            <div class="bg-white dark:bg-dark-800 border-t border-dark-200 dark:border-dark-700 max-h-64 overflow-y-auto">
              <app-clinical-record-sidebar
                [activeSection]="activeSection()"
                [patientGender]="patient.personalInfo.gender"
                [patientAge]="patient.personalInfo.age"
                [sectionStatuses]="sectionStatuses()"
                (sectionSelected)="onSectionSelected($event)"
              />
            </div>
          }
        </div>

        <!-- Desktop: Sidebar -->
        <div class="hidden lg:flex lg:flex-col lg:w-60 lg:flex-shrink-0 border-r border-dark-200 dark:border-dark-700 pt-4">
          <app-clinical-record-sidebar
            [activeSection]="activeSection()"
            [patientGender]="patient.personalInfo.gender"
            [patientAge]="patient.personalInfo.age"
            [sectionStatuses]="sectionStatuses()"
            (sectionSelected)="onSectionSelected($event)"
          />
        </div>

        <!-- Content -->
        <div class="flex-1 p-4 lg:p-6 min-w-0">
          @switch (activeSection()) {
            @case ('overview') {
              <app-clinical-record-overview
                [sectionStatuses]="sectionStatuses()"
                [medicalInfo]="patient.medicalInfo"
                [lastUpdated]="clinicalHistory()?.lastUpdated ?? null"
                (goToSection)="onSectionSelected($event)"
              />
            }
            @case ('personal_info') {
              <app-personal-info-section [personalInfo]="patient.personalInfo" />
            }
            @case ('medical_info') {
              <app-medical-info-section [medicalInfo]="patient.medicalInfo" />
            }
            @case ('family_history') {
              <app-family-history-section [data]="clinicalHistory()?.familyHistory ?? null" />
            }
            @case ('pathological_history') {
              <app-pathological-history-section [data]="clinicalHistory()?.pathologicalHistory ?? null" />
            }
            @case ('current_conditions') {
              <app-current-conditions-section [data]="clinicalHistory()?.currentConditions ?? null" />
            }
            @case ('perinatal_history') {
              <app-perinatal-history-section [data]="clinicalHistory()?.perinatalHistory ?? null" />
            }
            @case ('gynecological_history') {
              <app-gynecological-history-section [data]="clinicalHistory()?.gynecologicalHistory ?? null" />
            }
            @case ('physical_activity') {
              <app-physical-activity-section [data]="clinicalHistory()?.physicalActivity ?? null" />
            }
            @case ('habits_customs') {
              <app-habits-customs-section [data]="clinicalHistory()?.habitsAndCustoms ?? null" />
            }
            @case ('dietary_recall') {
              <app-dietary-recall-section [records]="clinicalHistory()?.dietaryRecalls ?? []" />
            }
            @case ('habitual_diet') {
              <app-habitual-diet-section [data]="clinicalHistory()?.habitualDiet ?? null" />
            }
            @case ('physical_examination') {
              <app-physical-examination-section [records]="clinicalHistory()?.physicalExaminations ?? []" />
            }
            @case ('biochemical_data') {
              <app-biochemical-data-section [records]="clinicalHistory()?.biochemicalData ?? []" />
            }
          }
        </div>
      </div>
    }
  `
})
export class ClinicalRecordTabComponent {
  @Input() patient: PatientComplete | null = null;

  activeSection = signal<ClinicalSectionKey | 'overview'>('overview');
  isMobileMenuOpen = signal(false);

  clinicalHistory = computed<ClinicalHistory | null>(() => {
    return this.patient?.clinicalHistory ?? null;
  });

  sectionStatuses = computed<ClinicalSectionStatus[]>(() => {
    const ch = this.clinicalHistory();
    const patient = this.patient;
    if (!patient) return [];

    const sections: ClinicalSectionStatus[] = [
      { sectionKey: 'personal_info', label: 'Datos Personales', filled: !!patient.personalInfo },
      { sectionKey: 'medical_info', label: 'Información Médica', filled: !!patient.medicalInfo },
      { sectionKey: 'family_history', label: 'Ant. Familiares', filled: !!ch?.familyHistory },
      { sectionKey: 'pathological_history', label: 'Ant. Patológicos', filled: !!ch?.pathologicalHistory },
      { sectionKey: 'current_conditions', label: 'Padecimientos', filled: !!ch?.currentConditions },
    ];

    if (patient.personalInfo.age < 18) {
      sections.push({ sectionKey: 'perinatal_history', label: 'Ant. Perinatales', filled: !!ch?.perinatalHistory });
    }

    if (patient.personalInfo.gender === 'female') {
      sections.push({ sectionKey: 'gynecological_history', label: 'Gineco-Obst.', filled: !!ch?.gynecologicalHistory });
    }

    sections.push(
      { sectionKey: 'physical_activity', label: 'Act. Física', filled: !!ch?.physicalActivity },
      { sectionKey: 'habits_customs', label: 'Hábitos', filled: !!ch?.habitsAndCustoms },
      { sectionKey: 'dietary_recall', label: 'Recordatorio 24h', filled: (ch?.dietaryRecalls?.length ?? 0) > 0 },
      { sectionKey: 'habitual_diet', label: 'Dieta Habitual', filled: !!ch?.habitualDiet },
      { sectionKey: 'physical_examination', label: 'Expl. Física', filled: (ch?.physicalExaminations?.length ?? 0) > 0 },
      { sectionKey: 'biochemical_data', label: 'Datos Bioquím.', filled: (ch?.biochemicalData?.length ?? 0) > 0 },
    );

    return sections;
  });

  activeSectionLabel = computed(() => {
    if (this.activeSection() === 'overview') return 'Resumen';
    const section = this.sectionStatuses().find(s => s.sectionKey === this.activeSection());
    return section?.label ?? 'Resumen';
  });

  getActiveStatus(): boolean {
    const section = this.sectionStatuses().find(s => s.sectionKey === this.activeSection());
    return section?.filled ?? false;
  }

  onSectionSelected(key: ClinicalSectionKey | 'overview'): void {
    this.activeSection.set(key);
    this.isMobileMenuOpen.set(false);
  }
}
