/**
 * Patient Portal Models
 * Domain models for the patient-facing portal
 */

// ============================================
// PATIENT MODELS
// ============================================

export interface Patient {
  readonly id: string;
  readonly fullName: string;
  readonly email: string;
  readonly phone: string;
  readonly birthDate: Date;
  readonly age: number;
  readonly gender: 'male' | 'female' | 'other';
  readonly photoUrl?: string;
  readonly createdAt: Date;
  readonly nutritionistId: string;
}

export interface PatientMedicalInfo {
  readonly patientId: string;
  readonly allergies: string[];
  readonly conditions: string[];
  readonly medications: string[];
  readonly dietaryRestrictions: string[];
}

// ============================================
// BODY METRICS MODELS
// ============================================

export interface BodyMetrics {
  readonly id: string;
  readonly patientId: string;
  readonly date: Date;
  readonly weight: number;
  readonly height: number;
  readonly bmi: number;
  readonly bodyFatPercentage?: number;
  readonly muscleMass?: number;
  readonly registeredBy: string;
}

export interface BodyMeasurements {
  readonly id: string;
  readonly patientId: string;
  readonly date: Date;
  readonly waist: number;
  readonly hip: number;
  readonly chest: number;
  readonly arm: number;
  readonly thigh: number;
  readonly registeredBy: string;
}

export type BmiCategory = 'underweight' | 'normal' | 'overweight' | 'obese';

export interface BmiInfo {
  readonly value: number;
  readonly category: BmiCategory;
  readonly color: string;
  readonly label: string;
}

// ============================================
// NUTRITION PLAN MODELS
// ============================================

export interface NutritionPlan {
  readonly id: string;
  readonly patientId: string;
  readonly name: string;
  readonly description: string;
  readonly startDate: Date;
  readonly endDate?: Date;
  readonly isActive: boolean;
  readonly dailyCalories: number;
  readonly macros: MacroTargets;
  readonly createdBy: string;
}

export interface MacroTargets {
  readonly protein: number;
  readonly carbohydrates: number;
  readonly fat: number;
}

export interface DailyMenu {
  readonly id: string;
  readonly planId: string;
  readonly dayOfWeek: number; // 0-6, Sunday = 0
  readonly meals: Meal[];
}

export interface Meal {
  readonly id: string;
  readonly type: MealType;
  readonly name: string;
  readonly scheduledTime: string; // HH:mm format
  readonly foods: FoodItem[];
  readonly totalCalories: number;
}

export type MealType = 'breakfast' | 'morning_snack' | 'lunch' | 'afternoon_snack' | 'dinner';

export interface FoodItem {
  readonly id: string;
  readonly name: string;
  readonly portion: string;
  readonly calories: number;
  readonly protein?: number;
  readonly carbs?: number;
  readonly fat?: number;
}

export interface FoodList {
  readonly id: string;
  readonly planId: string;
  readonly type: 'allowed' | 'restricted';
  readonly foods: string[];
}

// ============================================
// APPOINTMENT MODELS
// ============================================

export interface Appointment {
  readonly id: string;
  readonly patientId: string;
  readonly nutritionistId: string;
  readonly nutritionistName: string;
  readonly date: Date;
  readonly time: string; // HH:mm format
  readonly duration: number; // minutes
  readonly type: AppointmentType;
  readonly status: AppointmentStatus;
  readonly location?: string;
  readonly videoCallUrl?: string;
  readonly notes?: string;
  readonly attachments?: DocumentFile[];
}

export type AppointmentType = 'initial' | 'follow_up' | 'control' | 'emergency';
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

// ============================================
// MESSAGE MODELS
// ============================================

export interface Message {
  readonly id: string;
  readonly conversationId: string;
  readonly senderId: string;
  readonly senderType: 'patient' | 'nutritionist';
  readonly content: string;
  readonly sentAt: Date;
  readonly readAt?: Date;
  readonly status: MessageStatus;
}

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface Conversation {
  readonly id: string;
  readonly patientId: string;
  readonly nutritionistId: string;
  readonly nutritionistName: string;
  readonly nutritionistPhotoUrl?: string;
  readonly lastMessage?: Message;
  readonly unreadCount: number;
}

// ============================================
// DOCUMENT MODELS
// ============================================

export interface DocumentFile {
  readonly id: string;
  readonly patientId: string;
  readonly name: string;
  readonly type: DocumentType;
  readonly mimeType: string;
  readonly size: number;
  readonly url: string;
  readonly uploadedAt: Date;
  readonly uploadedBy: string;
}

export type DocumentType = 'lab_results' | 'prescription' | 'meal_plan' | 'recipe' | 'educational' | 'other';

// ============================================
// NUTRITIONIST MODELS (for display)
// ============================================

export interface Nutritionist {
  readonly id: string;
  readonly fullName: string;
  readonly email: string;
  readonly phone: string;
  readonly photoUrl?: string;
  readonly specialty?: string;
  readonly clinicName?: string;
  readonly clinicAddress?: string;
}

// ============================================
// DASHBOARD MODELS
// ============================================

export interface PatientDashboardData {
  readonly patient: Patient;
  readonly currentMetrics?: BodyMetrics;
  readonly targetWeight?: number;
  readonly initialWeight?: number;
  readonly activePlan?: NutritionPlan;
  readonly nextAppointment?: Appointment;
  readonly lastMessage?: Message;
  readonly nutritionist: Nutritionist;
}

// ============================================
// WEIGHT HISTORY FOR CHARTS
// ============================================

export interface WeightRecord {
  readonly date: Date;
  readonly weight: number;
}

export type TimeRange = '1m' | '3m' | '6m' | '1y' | 'all';
