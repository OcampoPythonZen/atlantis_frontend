/**
 * Nutritionist Portal Models
 * Domain models for the nutritionist-facing portal
 */

// Re-export common models from patient portal
export type {
  Nutritionist,
  Patient,
  PatientMedicalInfo,
  BodyMetrics,
  BodyMeasurements,
  NutritionPlan,
  MacroTargets,
  DailyMenu,
  Meal,
  MealType,
  FoodItem,
  FoodList,
  Appointment as BaseAppointment,
  AppointmentType,
  AppointmentStatus,
  Message as BaseMessage,
  MessageStatus,
  Conversation as BaseConversation,
  DocumentFile,
  DocumentType,
  WeightRecord,
  TimeRange
} from '../../patient-portal/models/patient.model';

import type {
  Appointment as BaseAppointment,
  Message as BaseMessage,
  Conversation as BaseConversation,
  AppointmentType,
  AppointmentStatus
} from '../../patient-portal/models/patient.model';

import type { ClinicalHistory, ClinicalSectionStatus } from './clinical-history.model';

// Extended Appointment for nutritionist view (includes patient info)
export interface Appointment extends BaseAppointment {
  readonly patientName: string;
  readonly patientPhotoUrl?: string;
}

// Extended Message for nutritionist view
export interface Message extends BaseMessage {
  readonly timestamp: Date; // Alias for sentAt for convenience
}

// Extended Conversation for nutritionist view (includes patient info instead of nutritionist)
export interface Conversation {
  readonly id: string;
  readonly patientId: string;
  readonly nutritionistId: string;
  readonly participantName: string; // Patient name from nutritionist's perspective
  readonly participantPhotoUrl?: string;
  readonly lastMessage?: string;
  readonly lastMessageTime?: Date;
  readonly unreadCount: number;
}

// ============================================
// PATIENT SUMMARY (for dashboard cards)
// ============================================

export type PatientStatus = 'active' | 'inactive';

export interface PatientSummary {
  readonly id: string;
  readonly expedienteNumber: string;
  readonly fullName: string;
  readonly photoUrl?: string;
  readonly status: PatientStatus;
  readonly lastAppointmentDate?: Date;
  readonly nextAppointmentDate?: Date;
  readonly currentWeight?: number;
  readonly targetWeight?: number;
  readonly progressPercentage?: number;
  readonly hasUnreadMessages: boolean;
  readonly clinicalHistoryCompleteness?: number;
  readonly clinicalHistorySections?: ClinicalSectionStatus[];
}

// ============================================
// PATIENT COMPLETE (for detail view)
// ============================================

export interface PatientComplete {
  readonly id: string;
  readonly expedienteNumber: string;
  readonly personalInfo: PatientPersonalInfo;
  readonly medicalInfo: PatientMedicalInfoExtended;
  readonly currentMetrics?: PatientMetrics;
  readonly metricsHistory: PatientMetrics[];
  readonly appointments: Appointment[];
  readonly activePlan?: import('../../patient-portal/models/patient.model').NutritionPlan;
  readonly documents: import('../../patient-portal/models/patient.model').DocumentFile[];
  readonly clinicalNotes: ClinicalNote[];
  readonly clinicalHistory?: ClinicalHistory;
  readonly status: PatientStatus;
  readonly createdAt: Date;
  readonly assignedNutritionistId: string;
}

export interface PatientPersonalInfo {
  readonly fullName: string;
  readonly email: string;
  readonly phone: string;
  readonly birthDate: Date;
  readonly age: number;
  readonly gender: 'male' | 'female' | 'other';
  readonly photoUrl?: string;
  readonly address?: string;
  readonly emergencyContact?: EmergencyContact;
}

export interface EmergencyContact {
  readonly name: string;
  readonly phone: string;
  readonly relationship: string;
}

export interface PatientMedicalInfoExtended {
  readonly allergies: string[];
  readonly conditions: string[];
  readonly medications: string[];
  readonly dietaryRestrictions: string[];
  readonly bloodType?: string;
  readonly notes?: string;
}

export interface PatientMetrics {
  readonly id: string;
  readonly date: Date;
  readonly weight: number;
  readonly height: number;
  readonly bmi: number;
  readonly bodyFatPercentage?: number;
  readonly muscleMass?: number;
  readonly registeredBy: string;
}

// ============================================
// CLINICAL NOTES
// ============================================

export type AuthorRole = 'owner' | 'consultant';

export interface ClinicalNote {
  readonly id: string;
  readonly patientId: string;
  readonly authorId: string;
  readonly authorName: string;
  readonly authorRole: AuthorRole;
  readonly content: string;
  readonly createdAt: Date;
  readonly isPrivate: boolean;
}

// ============================================
// SPECIALIST CONSULTATIONS
// ============================================

export type ConsultationStatus = 'pending' | 'accepted' | 'declined' | 'completed';
export type ConsultationPermission = 'read' | 'read_notes';

export interface SpecialistConsultation {
  readonly id: string;
  readonly patientId: string;
  readonly patientName: string;
  readonly patientPhotoUrl?: string;
  readonly requestingNutritionistId: string;
  readonly requestingNutritionistName: string;
  readonly invitedSpecialistId: string;
  readonly invitedSpecialistName: string;
  readonly reason: string;
  readonly status: ConsultationStatus;
  readonly permissions: ConsultationPermission;
  readonly createdAt: Date;
  readonly expiresAt?: Date;
  readonly notes: ClinicalNote[];
}

// ============================================
// DASHBOARD DATA
// ============================================

export interface NutritionistDashboardData {
  readonly nutritionist: import('../../patient-portal/models/patient.model').Nutritionist;
  readonly patients: PatientSummary[];
  readonly todayAppointments: Appointment[];
  readonly pendingConsultations: SpecialistConsultation[];
  readonly sharedWithMe: SpecialistConsultation[];
  readonly stats: DashboardStats;
}

export interface DashboardStats {
  readonly totalPatients: number;
  readonly activePatients: number;
  readonly appointmentsToday: number;
  readonly appointmentsThisWeek: number;
  readonly pendingMessages: number;
}

// ============================================
// PATIENT FILTERS
// ============================================

export type PatientSortField = 'name' | 'expediente' | 'lastAppointment' | 'nextAppointment' | 'status';
export type SortOrder = 'asc' | 'desc';
export type PatientFilterStatus = 'all' | 'active' | 'inactive';

export interface PatientFilters {
  searchTerm?: string;
  status?: PatientFilterStatus;
  sortBy?: PatientSortField;
  sortOrder?: SortOrder;
}

// ============================================
// PATIENT CREATION
// ============================================

export interface CreatePatientMinimal {
  fullName: string;
  email: string;
  phone: string;
  birthDate: Date;
  gender: 'male' | 'female' | 'other';
}

export interface CreatePatientComplete extends CreatePatientMinimal {
  address?: string;
  emergencyContact?: EmergencyContact;
  allergies?: string[];
  conditions?: string[];
  medications?: string[];
  dietaryRestrictions?: string[];
  bloodType?: string;
  medicalNotes?: string;
  initialWeight?: number;
  height?: number;
  targetWeight?: number;
}

// ============================================
// CALENDAR VIEWS
// ============================================

export type CalendarView = 'day' | 'week' | 'month';

export interface CalendarEvent {
  readonly id: string;
  readonly title: string;
  readonly start: Date;
  readonly end: Date;
  readonly patientId: string;
  readonly patientName: string;
  readonly type: import('../../patient-portal/models/patient.model').AppointmentType;
  readonly status: import('../../patient-portal/models/patient.model').AppointmentStatus;
  readonly location?: string;
}

// ============================================
// APPOINTMENT CREATION
// ============================================

export interface CreateAppointment {
  patientId: string;
  date: Date;
  time: string;
  duration: number;
  type: import('../../patient-portal/models/patient.model').AppointmentType;
  location?: string;
  notes?: string;
}

// ============================================
// SPECIALIST INVITATION
// ============================================

export interface InviteSpecialist {
  patientId: string;
  specialistId: string;
  reason: string;
  permissions: ConsultationPermission;
  expiresAt?: Date;
}

// ============================================
// NUTRITIONIST PROFILE
// ============================================

export interface NutritionistProfile {
  readonly id: string;
  readonly fullName: string;
  readonly email: string;
  readonly phone?: string;
  readonly photoUrl?: string;
  readonly specialty?: string;
  readonly licenseNumber?: string;
  readonly clinic?: string; // Alias for clinicName
  readonly clinicName?: string;
  readonly address?: string; // Alias for clinicAddress
  readonly clinicAddress?: string;
  readonly clinicPhone?: string;
  readonly bio?: string;
  readonly workingHours?: WorkingHours[];
}

export interface WorkingHours {
  readonly dayOfWeek: number;
  readonly startTime: string;
  readonly endTime: string;
  readonly isAvailable: boolean;
}
