import { Injectable, computed, signal } from '@angular/core';
import {
  PatientSummary,
  PatientComplete,
  PatientFilters,
  SpecialistConsultation,
  DashboardStats,
  ClinicalNote,
  NutritionistProfile,
  CalendarEvent,
  Nutritionist,
  Appointment,
  Conversation,
  Message
} from '../models/nutritionist.model';

interface NutritionistPortalState {
  // Nutritionist info
  nutritionist: NutritionistProfile | null;

  // Patients
  patients: PatientSummary[];
  selectedPatient: PatientComplete | null;
  patientFilters: PatientFilters;

  // Appointments
  appointments: Appointment[];
  calendarEvents: CalendarEvent[];
  selectedDate: Date;

  // Consultations
  myConsultationRequests: SpecialistConsultation[];
  sharedWithMe: SpecialistConsultation[];

  // Messages
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];

  // Dashboard stats
  stats: DashboardStats | null;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Modal states
  isCreatePatientModalOpen: boolean;
  isScheduleAppointmentModalOpen: boolean;
  isInviteSpecialistModalOpen: boolean;
}

const initialFilters: PatientFilters = {
  searchTerm: '',
  status: 'all',
  sortBy: 'name',
  sortOrder: 'asc'
};

const initialState: NutritionistPortalState = {
  nutritionist: null,
  patients: [],
  selectedPatient: null,
  patientFilters: initialFilters,
  appointments: [],
  calendarEvents: [],
  selectedDate: new Date(),
  myConsultationRequests: [],
  sharedWithMe: [],
  conversations: [],
  activeConversation: null,
  messages: [],
  stats: null,
  isLoading: false,
  error: null,
  isCreatePatientModalOpen: false,
  isScheduleAppointmentModalOpen: false,
  isInviteSpecialistModalOpen: false
};

@Injectable({ providedIn: 'root' })
export class NutritionistPortalStore {
  private readonly _state = signal<NutritionistPortalState>(initialState);

  // ============================================
  // PUBLIC SELECTORS (Readonly signals)
  // ============================================

  // Nutritionist
  readonly nutritionist = computed(() => this._state().nutritionist);

  // Patients
  readonly patients = computed(() => this._state().patients);
  readonly selectedPatient = computed(() => this._state().selectedPatient);
  readonly patientFilters = computed(() => this._state().patientFilters);

  // Appointments
  readonly appointments = computed(() => this._state().appointments);
  readonly calendarEvents = computed(() => this._state().calendarEvents);
  readonly selectedDate = computed(() => this._state().selectedDate);

  // Consultations
  readonly myConsultationRequests = computed(() => this._state().myConsultationRequests);
  readonly sharedWithMe = computed(() => this._state().sharedWithMe);

  // Messages
  readonly conversations = computed(() => this._state().conversations);
  readonly activeConversation = computed(() => this._state().activeConversation);
  readonly messages = computed(() => this._state().messages);

  // Stats
  readonly stats = computed(() => this._state().stats);

  // UI state
  readonly isLoading = computed(() => this._state().isLoading);
  readonly error = computed(() => this._state().error);

  // Modal states
  readonly isCreatePatientModalOpen = computed(() => this._state().isCreatePatientModalOpen);
  readonly isScheduleAppointmentModalOpen = computed(() => this._state().isScheduleAppointmentModalOpen);
  readonly isInviteSpecialistModalOpen = computed(() => this._state().isInviteSpecialistModalOpen);

  // ============================================
  // COMPUTED VALUES
  // ============================================

  readonly nutritionistName = computed(() => this._state().nutritionist?.fullName ?? '');
  readonly nutritionistPhotoUrl = computed(() => this._state().nutritionist?.photoUrl);

  readonly filteredPatients = computed(() => {
    const { patients, patientFilters } = this._state();
    let filtered = [...patients];

    // Filter by search term
    if (patientFilters.searchTerm) {
      const term = patientFilters.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.fullName.toLowerCase().includes(term) ||
        p.expedienteNumber.toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (patientFilters.status && patientFilters.status !== 'all') {
      filtered = filtered.filter(p => p.status === patientFilters.status);
    }

    // Sort
    if (patientFilters.sortBy) {
      filtered.sort((a, b) => {
        let comparison = 0;
        switch (patientFilters.sortBy) {
          case 'name':
            comparison = a.fullName.localeCompare(b.fullName);
            break;
          case 'expediente':
            comparison = a.expedienteNumber.localeCompare(b.expedienteNumber);
            break;
          case 'lastAppointment':
            const aLast = a.lastAppointmentDate?.getTime() ?? 0;
            const bLast = b.lastAppointmentDate?.getTime() ?? 0;
            comparison = aLast - bLast;
            break;
          case 'nextAppointment':
            const aNext = a.nextAppointmentDate?.getTime() ?? Infinity;
            const bNext = b.nextAppointmentDate?.getTime() ?? Infinity;
            comparison = aNext - bNext;
            break;
          case 'status':
            comparison = a.status.localeCompare(b.status);
            break;
        }
        return patientFilters.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    return filtered;
  });

  readonly activePatients = computed(() =>
    this._state().patients.filter(p => p.status === 'active')
  );

  readonly inactivePatients = computed(() =>
    this._state().patients.filter(p => p.status === 'inactive')
  );

  readonly todayAppointments = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this._state().appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate >= today && aptDate < tomorrow;
    });
  });

  readonly pendingConsultationsCount = computed(() =>
    this._state().myConsultationRequests.filter(c => c.status === 'pending').length +
    this._state().sharedWithMe.filter(c => c.status === 'pending').length
  );

  readonly unreadMessagesCount = computed(() =>
    this._state().conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)
  );

  // ============================================
  // MUTATIONS - Nutritionist
  // ============================================

  setNutritionist(nutritionist: NutritionistProfile): void {
    this._state.update(state => ({ ...state, nutritionist }));
  }

  // ============================================
  // MUTATIONS - Patients
  // ============================================

  setPatients(patients: PatientSummary[]): void {
    this._state.update(state => ({ ...state, patients }));
  }

  addPatient(patient: PatientSummary): void {
    this._state.update(state => ({
      ...state,
      patients: [...state.patients, patient]
    }));
  }

  updatePatient(patientId: string, updates: Partial<PatientSummary>): void {
    this._state.update(state => ({
      ...state,
      patients: state.patients.map(p =>
        p.id === patientId ? { ...p, ...updates } : p
      )
    }));
  }

  setSelectedPatient(patient: PatientComplete | null): void {
    this._state.update(state => ({ ...state, selectedPatient: patient }));
  }

  setPatientFilters(filters: Partial<PatientFilters>): void {
    this._state.update(state => ({
      ...state,
      patientFilters: { ...state.patientFilters, ...filters }
    }));
  }

  resetPatientFilters(): void {
    this._state.update(state => ({
      ...state,
      patientFilters: initialFilters
    }));
  }

  // ============================================
  // MUTATIONS - Appointments
  // ============================================

  setAppointments(appointments: Appointment[]): void {
    this._state.update(state => ({ ...state, appointments }));
  }

  addAppointment(appointment: Appointment): void {
    this._state.update(state => ({
      ...state,
      appointments: [...state.appointments, appointment]
    }));
  }

  updateAppointment(appointmentId: string, updates: Partial<Appointment>): void {
    this._state.update(state => ({
      ...state,
      appointments: state.appointments.map(a =>
        a.id === appointmentId ? { ...a, ...updates } : a
      )
    }));
  }

  setCalendarEvents(events: CalendarEvent[]): void {
    this._state.update(state => ({ ...state, calendarEvents: events }));
  }

  setSelectedDate(date: Date): void {
    this._state.update(state => ({ ...state, selectedDate: date }));
  }

  // ============================================
  // MUTATIONS - Consultations
  // ============================================

  setMyConsultationRequests(consultations: SpecialistConsultation[]): void {
    this._state.update(state => ({ ...state, myConsultationRequests: consultations }));
  }

  addConsultationRequest(consultation: SpecialistConsultation): void {
    this._state.update(state => ({
      ...state,
      myConsultationRequests: [...state.myConsultationRequests, consultation]
    }));
  }

  setSharedWithMe(consultations: SpecialistConsultation[]): void {
    this._state.update(state => ({ ...state, sharedWithMe: consultations }));
  }

  updateConsultation(consultationId: string, updates: Partial<SpecialistConsultation>): void {
    this._state.update(state => ({
      ...state,
      myConsultationRequests: state.myConsultationRequests.map(c =>
        c.id === consultationId ? { ...c, ...updates } : c
      ),
      sharedWithMe: state.sharedWithMe.map(c =>
        c.id === consultationId ? { ...c, ...updates } : c
      )
    }));
  }

  // ============================================
  // MUTATIONS - Messages
  // ============================================

  setConversations(conversations: Conversation[]): void {
    this._state.update(state => ({ ...state, conversations }));
  }

  setActiveConversation(conversation: Conversation | null): void {
    this._state.update(state => ({ ...state, activeConversation: conversation }));
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

  // ============================================
  // MUTATIONS - Stats
  // ============================================

  setStats(stats: DashboardStats): void {
    this._state.update(state => ({ ...state, stats }));
  }

  // ============================================
  // MUTATIONS - UI State
  // ============================================

  setLoading(isLoading: boolean): void {
    this._state.update(state => ({ ...state, isLoading }));
  }

  setError(error: string | null): void {
    this._state.update(state => ({ ...state, error }));
  }

  // ============================================
  // MUTATIONS - Modals
  // ============================================

  openCreatePatientModal(): void {
    this._state.update(state => ({ ...state, isCreatePatientModalOpen: true }));
  }

  closeCreatePatientModal(): void {
    this._state.update(state => ({ ...state, isCreatePatientModalOpen: false }));
  }

  openScheduleAppointmentModal(): void {
    this._state.update(state => ({ ...state, isScheduleAppointmentModalOpen: true }));
  }

  closeScheduleAppointmentModal(): void {
    this._state.update(state => ({ ...state, isScheduleAppointmentModalOpen: false }));
  }

  openInviteSpecialistModal(): void {
    this._state.update(state => ({ ...state, isInviteSpecialistModalOpen: true }));
  }

  closeInviteSpecialistModal(): void {
    this._state.update(state => ({ ...state, isInviteSpecialistModalOpen: false }));
  }

  // ============================================
  // RESET
  // ============================================

  reset(): void {
    this._state.set(initialState);
  }
}
