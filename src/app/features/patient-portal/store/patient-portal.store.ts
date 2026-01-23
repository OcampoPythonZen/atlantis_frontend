import { Injectable, computed, signal } from '@angular/core';
import {
  Patient,
  PatientMedicalInfo,
  BodyMetrics,
  BodyMeasurements,
  NutritionPlan,
  DailyMenu,
  Appointment,
  Conversation,
  Message,
  DocumentFile,
  Nutritionist,
  WeightRecord,
  FoodList
} from '../models/patient.model';

interface PatientPortalState {
  // Patient info
  patient: Patient | null;
  medicalInfo: PatientMedicalInfo | null;
  nutritionist: Nutritionist | null;

  // Metrics
  currentMetrics: BodyMetrics | null;
  metricsHistory: BodyMetrics[];
  currentMeasurements: BodyMeasurements | null;
  measurementsHistory: BodyMeasurements[];
  weightHistory: WeightRecord[];
  targetWeight: number | null;
  initialWeight: number | null;

  // Nutrition plan
  activePlan: NutritionPlan | null;
  weeklyMenu: DailyMenu[];
  allowedFoods: FoodList | null;
  restrictedFoods: FoodList | null;

  // Appointments
  nextAppointment: Appointment | null;
  appointmentHistory: Appointment[];

  // Messages
  conversation: Conversation | null;
  messages: Message[];
  lastMessage: Message | null;

  // Documents
  documents: DocumentFile[];

  // UI state
  isLoading: boolean;
  error: string | null;
}

const initialState: PatientPortalState = {
  patient: null,
  medicalInfo: null,
  nutritionist: null,
  currentMetrics: null,
  metricsHistory: [],
  currentMeasurements: null,
  measurementsHistory: [],
  weightHistory: [],
  targetWeight: null,
  initialWeight: null,
  activePlan: null,
  weeklyMenu: [],
  allowedFoods: null,
  restrictedFoods: null,
  nextAppointment: null,
  appointmentHistory: [],
  conversation: null,
  messages: [],
  lastMessage: null,
  documents: [],
  isLoading: false,
  error: null
};

@Injectable({ providedIn: 'root' })
export class PatientPortalStore {
  // Private state
  private readonly _state = signal<PatientPortalState>(initialState);

  // ============================================
  // PUBLIC SELECTORS (Readonly signals)
  // ============================================

  // Patient
  readonly patient = computed(() => this._state().patient);
  readonly medicalInfo = computed(() => this._state().medicalInfo);
  readonly nutritionist = computed(() => this._state().nutritionist);

  // Metrics
  readonly currentMetrics = computed(() => this._state().currentMetrics);
  readonly metricsHistory = computed(() => this._state().metricsHistory);
  readonly currentMeasurements = computed(() => this._state().currentMeasurements);
  readonly measurementsHistory = computed(() => this._state().measurementsHistory);
  readonly weightHistory = computed(() => this._state().weightHistory);
  readonly targetWeight = computed(() => this._state().targetWeight);
  readonly initialWeight = computed(() => this._state().initialWeight);

  // Nutrition plan
  readonly activePlan = computed(() => this._state().activePlan);
  readonly weeklyMenu = computed(() => this._state().weeklyMenu);
  readonly allowedFoods = computed(() => this._state().allowedFoods);
  readonly restrictedFoods = computed(() => this._state().restrictedFoods);

  // Appointments
  readonly nextAppointment = computed(() => this._state().nextAppointment);
  readonly appointmentHistory = computed(() => this._state().appointmentHistory);

  // Messages
  readonly conversation = computed(() => this._state().conversation);
  readonly messages = computed(() => this._state().messages);
  readonly lastMessage = computed(() => this._state().lastMessage);
  readonly unreadCount = computed(() => this._state().conversation?.unreadCount ?? 0);

  // Documents
  readonly documents = computed(() => this._state().documents);

  // UI state
  readonly isLoading = computed(() => this._state().isLoading);
  readonly error = computed(() => this._state().error);

  // ============================================
  // COMPUTED VALUES
  // ============================================

  readonly patientName = computed(() => this._state().patient?.fullName ?? '');
  readonly patientPhotoUrl = computed(() => this._state().patient?.photoUrl);

  readonly currentWeight = computed(() => this._state().currentMetrics?.weight ?? null);
  readonly currentBmi = computed(() => this._state().currentMetrics?.bmi ?? null);

  readonly weightLost = computed(() => {
    const initial = this._state().initialWeight;
    const current = this._state().currentMetrics?.weight;
    if (initial && current) {
      return initial - current;
    }
    return null;
  });

  readonly weightToGoal = computed(() => {
    const target = this._state().targetWeight;
    const current = this._state().currentMetrics?.weight;
    if (target && current) {
      return current - target;
    }
    return null;
  });

  readonly todayMenu = computed(() => {
    const dayOfWeek = new Date().getDay();
    return this._state().weeklyMenu.find(m => m.dayOfWeek === dayOfWeek) ?? null;
  });

  // ============================================
  // MUTATIONS
  // ============================================

  setPatient(patient: Patient): void {
    this._state.update(state => ({ ...state, patient }));
  }

  setMedicalInfo(medicalInfo: PatientMedicalInfo): void {
    this._state.update(state => ({ ...state, medicalInfo }));
  }

  setNutritionist(nutritionist: Nutritionist): void {
    this._state.update(state => ({ ...state, nutritionist }));
  }

  setCurrentMetrics(metrics: BodyMetrics): void {
    this._state.update(state => ({ ...state, currentMetrics: metrics }));
  }

  setMetricsHistory(history: BodyMetrics[]): void {
    this._state.update(state => ({ ...state, metricsHistory: history }));
  }

  setCurrentMeasurements(measurements: BodyMeasurements): void {
    this._state.update(state => ({ ...state, currentMeasurements: measurements }));
  }

  setMeasurementsHistory(history: BodyMeasurements[]): void {
    this._state.update(state => ({ ...state, measurementsHistory: history }));
  }

  setWeightHistory(history: WeightRecord[]): void {
    this._state.update(state => ({ ...state, weightHistory: history }));
  }

  setTargetWeight(weight: number): void {
    this._state.update(state => ({ ...state, targetWeight: weight }));
  }

  setInitialWeight(weight: number): void {
    this._state.update(state => ({ ...state, initialWeight: weight }));
  }

  setActivePlan(plan: NutritionPlan | null): void {
    this._state.update(state => ({ ...state, activePlan: plan }));
  }

  setWeeklyMenu(menu: DailyMenu[]): void {
    this._state.update(state => ({ ...state, weeklyMenu: menu }));
  }

  setFoodLists(allowed: FoodList | null, restricted: FoodList | null): void {
    this._state.update(state => ({
      ...state,
      allowedFoods: allowed,
      restrictedFoods: restricted
    }));
  }

  setNextAppointment(appointment: Appointment | null): void {
    this._state.update(state => ({ ...state, nextAppointment: appointment }));
  }

  setAppointmentHistory(history: Appointment[]): void {
    this._state.update(state => ({ ...state, appointmentHistory: history }));
  }

  setConversation(conversation: Conversation): void {
    this._state.update(state => ({ ...state, conversation }));
  }

  setMessages(messages: Message[]): void {
    this._state.update(state => ({ ...state, messages }));
  }

  addMessage(message: Message): void {
    this._state.update(state => ({
      ...state,
      messages: [...state.messages, message]
    }));
  }

  setLastMessage(message: Message | null): void {
    this._state.update(state => ({ ...state, lastMessage: message }));
  }

  setDocuments(documents: DocumentFile[]): void {
    this._state.update(state => ({ ...state, documents }));
  }

  setLoading(isLoading: boolean): void {
    this._state.update(state => ({ ...state, isLoading }));
  }

  setError(error: string | null): void {
    this._state.update(state => ({ ...state, error }));
  }

  reset(): void {
    this._state.set(initialState);
  }
}
