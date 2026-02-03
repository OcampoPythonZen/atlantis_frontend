/**
 * Clinical History Models
 * Comprehensive clinical history for nutritionist use only.
 * These models are NOT visible to patients — they are part of the
 * specialist's internal evaluation and record-keeping.
 */

// ============================================
// CATEGORY A: MEDICAL HISTORY
// ============================================

// --------------------------------------------
// A1. Family History (Antecedentes Familiares)
// --------------------------------------------

export type FamilyRelationship =
  | 'father'
  | 'mother'
  | 'paternal_grandfather'
  | 'paternal_grandmother'
  | 'maternal_grandfather'
  | 'maternal_grandmother'
  | 'sibling';

export type FamilyConditionType =
  | 'diabetes_type_1'
  | 'diabetes_type_2'
  | 'hypertension'
  | 'obesity'
  | 'cancer'
  | 'cardiovascular_disease'
  | 'dyslipidemia'
  | 'thyroid_disease'
  | 'kidney_disease'
  | 'other';

export interface FamilyConditionRecord {
  readonly id: string;
  readonly condition: FamilyConditionType;
  readonly otherConditionName?: string; // when condition is 'other'
  readonly relationship: FamilyRelationship;
  readonly isAlive?: boolean;
  readonly notes?: string;
}

export interface FamilyHistory {
  readonly id: string;
  readonly patientId: string;
  readonly records: FamilyConditionRecord[];
  readonly additionalNotes?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly registeredBy: string;
}

// --------------------------------------------
// A2. Personal Pathological History
//     (Antecedentes Patologicos Personales)
// --------------------------------------------

export type PathologicalEventType =
  | 'disease'
  | 'surgery'
  | 'hospitalization'
  | 'transfusion'
  | 'trauma'
  | 'drug_allergy';

export interface PathologicalRecord {
  readonly id: string;
  readonly type: PathologicalEventType;
  readonly description: string;
  readonly date?: Date;        // approximate date of the event
  readonly ageAtEvent?: number; // alternative: age when it happened
  readonly treatment?: string;
  readonly resolved: boolean;
  readonly notes?: string;
}

export interface PathologicalHistory {
  readonly id: string;
  readonly patientId: string;
  readonly records: PathologicalRecord[];
  readonly additionalNotes?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly registeredBy: string;
}

// --------------------------------------------
// A3. Current Conditions (Padecimientos Actuales)
// --------------------------------------------

export interface CurrentCondition {
  readonly id: string;
  readonly diagnosis: string;
  readonly diagnosisDate?: Date;
  readonly currentTreatment?: string;
  readonly treatingPhysician?: string;
  readonly controlledStatus: 'controlled' | 'uncontrolled' | 'in_treatment';
  readonly notes?: string;
}

export interface CurrentConditions {
  readonly id: string;
  readonly patientId: string;
  readonly conditions: CurrentCondition[];
  readonly additionalNotes?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly registeredBy: string;
}

// ============================================
// CATEGORY B: SPECIAL HISTORY
// ============================================

// --------------------------------------------
// B1. Perinatal History (Antecedentes Perinatales)
//     — Only for pediatric patients
// --------------------------------------------

export type BirthType = 'vaginal' | 'cesarean';
export type BreastfeedingType = 'exclusive' | 'mixed' | 'formula_only' | 'none';

export interface PerinatalHistory {
  readonly id: string;
  readonly patientId: string;
  readonly birthType: BirthType;
  readonly gestationalWeeks?: number;
  readonly birthWeight?: number;     // kg
  readonly birthHeight?: number;     // cm
  readonly apgarScore?: number;
  readonly complications?: string;
  readonly breastfeedingType: BreastfeedingType;
  readonly breastfeedingDurationMonths?: number;
  readonly ablactationAgeMonths?: number; // age when solid foods introduced
  readonly ablactationNotes?: string;
  readonly additionalNotes?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly registeredBy: string;
}

// --------------------------------------------
// B2. Gyneco-Obstetric History
//     (Antecedentes Gineco-Obstetricos)
//     — Only for female patients
// --------------------------------------------

export type ContraceptiveMethod =
  | 'none'
  | 'oral_pills'
  | 'iud'
  | 'implant'
  | 'injection'
  | 'condom'
  | 'patch'
  | 'ring'
  | 'other';

export interface GynecologicalHistory {
  readonly id: string;
  readonly patientId: string;

  // Menstrual data
  readonly menarcheAge?: number;          // age at first period
  readonly cycleRegular: boolean;
  readonly cycleDurationDays?: number;    // typical cycle length
  readonly menstruationDurationDays?: number; // days of bleeding
  readonly lastMenstrualPeriodDate?: Date; // FUM
  readonly dysmenorrhea: boolean;         // painful periods

  // Obstetric data — G(ravida) P(ara) A(bortos) C(esareas)
  readonly pregnancies: number;           // G - total
  readonly deliveries: number;            // P - vaginal births
  readonly abortions: number;             // A - miscarriages/abortions
  readonly cesareans: number;             // C - cesarean births
  readonly currentlyPregnant: boolean;
  readonly gestationalWeeks?: number;     // if currently pregnant

  // Menopause
  readonly menopause: boolean;
  readonly menopauseAge?: number;
  readonly hormoneReplacementTherapy: boolean;

  // Contraception
  readonly contraceptiveMethod: ContraceptiveMethod;
  readonly otherContraceptiveMethod?: string;

  // Conditions
  readonly hasPCOS: boolean; // Polycystic ovary syndrome (SOP)
  readonly additionalNotes?: string;

  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly registeredBy: string;
}

// ============================================
// CATEGORY C: LIFESTYLE
// ============================================

// --------------------------------------------
// C1. Physical Activity (Actividad Fisica)
// --------------------------------------------

export type ActivityIntensity = 'sedentary' | 'light' | 'moderate' | 'intense' | 'very_intense';

export interface PhysicalActivityEntry {
  readonly id: string;
  readonly activityType: string;        // e.g. "running", "swimming", "yoga"
  readonly frequencyPerWeek: number;
  readonly durationMinutes: number;
  readonly intensity: ActivityIntensity;
  readonly yearsOfPractice?: number;
}

export interface PhysicalActivity {
  readonly id: string;
  readonly patientId: string;
  readonly generalLevel: ActivityIntensity; // overall classification
  readonly activities: PhysicalActivityEntry[];
  readonly additionalNotes?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly registeredBy: string;
}

// --------------------------------------------
// C2. Habits & Customs (Habitos y Costumbres)
// --------------------------------------------

export type SmokingStatus = 'never' | 'former' | 'current';
export type AlcoholConsumption = 'never' | 'occasional' | 'moderate' | 'frequent';
export type StressLevel = 'low' | 'moderate' | 'high' | 'very_high';

export interface HabitsAndCustoms {
  readonly id: string;
  readonly patientId: string;

  // Smoking
  readonly smokingStatus: SmokingStatus;
  readonly cigarettesPerDay?: number;
  readonly smokingYears?: number;

  // Alcohol
  readonly alcoholConsumption: AlcoholConsumption;
  readonly alcoholFrequencyPerWeek?: number;
  readonly alcoholType?: string; // e.g. "beer", "wine", "spirits"

  // Hydration
  readonly dailyWaterIntakeLiters: number;

  // Sleep
  readonly sleepHoursPerNight: number;
  readonly sleepQuality: 'poor' | 'fair' | 'good' | 'excellent';

  // Stress
  readonly stressLevel: StressLevel;

  // Supplements
  readonly usesSupplements: boolean;
  readonly supplements?: string[]; // list of supplement names

  // Caffeine
  readonly dailyCaffeineServings: number; // cups of coffee/tea equivalent

  readonly additionalNotes?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly registeredBy: string;
}

// --------------------------------------------
// C3. 24-Hour Dietary Recall
//     (Recordatorio de 24 Horas)
// --------------------------------------------

export interface RecallMealEntry {
  readonly id: string;
  readonly mealTime: string;    // HH:mm
  readonly mealType: string;    // e.g. "breakfast", "snack", "lunch"
  readonly foodDescription: string;
  readonly portionSize: string;
  readonly preparationMethod?: string; // e.g. "fried", "grilled", "raw"
  readonly brand?: string;            // for processed foods
}

export interface DietaryRecall24h {
  readonly id: string;
  readonly patientId: string;
  readonly recallDate: Date;          // the day being recalled
  readonly isTypicalDay: boolean;     // was it a representative day?
  readonly meals: RecallMealEntry[];
  readonly whoPreparesFood: string;   // who cooked
  readonly mealsEatenOut: number;     // how many meals were outside home
  readonly observations?: string;
  readonly createdAt: Date;
  readonly registeredBy: string;
}

// --------------------------------------------
// C4. Habitual Diet / Food Frequency
//     (Dieta Habitual - Frecuencia de Consumo)
// --------------------------------------------

export type ConsumptionFrequency =
  | 'never'
  | 'rarely'             // < 1 per week
  | '1_2_per_week'
  | '3_4_per_week'
  | '5_6_per_week'
  | 'daily'
  | 'multiple_per_day';

export type FoodGroupCategory =
  | 'dairy'
  | 'meat_poultry'
  | 'fish_seafood'
  | 'eggs'
  | 'legumes'
  | 'cereals_grains'
  | 'bread_tortilla'
  | 'fruits'
  | 'vegetables'
  | 'fats_oils'
  | 'sugar_sweets'
  | 'beverages'
  | 'processed_foods'
  | 'fast_food';

export interface FoodFrequencyEntry {
  readonly id: string;
  readonly foodGroup: FoodGroupCategory;
  readonly specificFood?: string;   // e.g. "whole milk", "white rice"
  readonly frequency: ConsumptionFrequency;
  readonly portionSize?: string;
  readonly notes?: string;
}

export interface HabitualDiet {
  readonly id: string;
  readonly patientId: string;
  readonly entries: FoodFrequencyEntry[];
  readonly numberOfMealsPerDay: number;
  readonly snacksBetweenMeals: boolean;
  readonly eatsBreakfast: boolean;
  readonly mainCookingMethod?: string;  // e.g. "fried", "steamed", "grilled"
  readonly foodPreferences?: string;
  readonly foodAversions?: string;
  readonly additionalNotes?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly registeredBy: string;
}

// ============================================
// CATEGORY D: CLINICAL EVALUATION
// ============================================

// --------------------------------------------
// D1. Physical Examination (Exploracion Fisica)
// --------------------------------------------

export type ClinicalAppearance = 'normal' | 'abnormal';

export interface VitalSigns {
  readonly systolicBP?: number;        // mmHg
  readonly diastolicBP?: number;       // mmHg
  readonly heartRate?: number;         // bpm
  readonly respiratoryRate?: number;   // breaths/min
  readonly temperature?: number;       // Celsius
  readonly oxygenSaturation?: number;  // %
}

export interface PhysicalExamination {
  readonly id: string;
  readonly patientId: string;
  readonly date: Date;

  readonly vitalSigns: VitalSigns;

  // Clinical observation
  readonly skinAppearance: ClinicalAppearance;
  readonly skinNotes?: string;
  readonly hairAppearance: ClinicalAppearance;
  readonly hairNotes?: string;
  readonly nailAppearance: ClinicalAppearance;
  readonly nailNotes?: string;
  readonly dentalHealth: ClinicalAppearance;
  readonly dentalNotes?: string;

  // Edema
  readonly hasEdema: boolean;
  readonly edemaLocation?: string;

  // General observations
  readonly generalObservations?: string;

  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly registeredBy: string;
}

// --------------------------------------------
// D2. Biochemical Data (Datos Bioquimicos)
//     — Basic metabolic & nutritional labs
// --------------------------------------------

export interface BiochemicalData {
  readonly id: string;
  readonly patientId: string;
  readonly date: Date;          // date labs were taken
  readonly labName?: string;    // laboratory name

  // Glucose metabolism
  readonly fastingGlucose?: number;     // mg/dL
  readonly hba1c?: number;              // %
  readonly insulin?: number;            // uUI/mL
  readonly homaIr?: number;             // calculated index

  // Lipid profile
  readonly totalCholesterol?: number;   // mg/dL
  readonly hdlCholesterol?: number;     // mg/dL
  readonly ldlCholesterol?: number;     // mg/dL
  readonly triglycerides?: number;      // mg/dL

  // Kidney function
  readonly creatinine?: number;         // mg/dL
  readonly bun?: number;               // mg/dL (blood urea nitrogen)

  // Liver function
  readonly ast?: number;               // U/L
  readonly alt?: number;               // U/L

  // Blood count basics
  readonly hemoglobin?: number;         // g/dL
  readonly hematocrit?: number;         // %

  // Nutritional markers
  readonly serumIron?: number;          // ug/dL
  readonly ferritin?: number;           // ng/mL
  readonly vitaminD?: number;           // ng/mL

  // Thyroid basics
  readonly tsh?: number;               // mUI/L
  readonly freeT4?: number;            // ng/dL

  // Uric acid
  readonly uricAcid?: number;          // mg/dL

  readonly additionalNotes?: string;
  readonly createdAt: Date;
  readonly registeredBy: string;
}

// ============================================
// AGGREGATE: Complete Clinical History
// ============================================

export interface ClinicalHistory {
  readonly patientId: string;
  readonly familyHistory?: FamilyHistory;
  readonly pathologicalHistory?: PathologicalHistory;
  readonly currentConditions?: CurrentConditions;
  readonly perinatalHistory?: PerinatalHistory;          // pediatric only
  readonly gynecologicalHistory?: GynecologicalHistory;  // female only
  readonly physicalActivity?: PhysicalActivity;
  readonly habitsAndCustoms?: HabitsAndCustoms;
  readonly dietaryRecalls: DietaryRecall24h[];           // multiple over time
  readonly habitualDiet?: HabitualDiet;
  readonly physicalExaminations: PhysicalExamination[];  // multiple over time
  readonly biochemicalData: BiochemicalData[];           // multiple over time
  readonly lastUpdated: Date;
}
