import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  PatientSummary,
  PatientComplete,
  PatientPersonalInfo,
  PatientMedicalInfoExtended,
  PatientMetrics,
  SpecialistConsultation,
  ClinicalNote,
  NutritionistDashboardData,
  DashboardStats,
  NutritionistProfile,
  CalendarEvent,
  CreatePatientMinimal,
  CreatePatientComplete,
  CreateAppointment,
  InviteSpecialist,
  Nutritionist,
  Appointment,
  Conversation,
  Message,
  NutritionPlan,
  DocumentFile
} from '../models/nutritionist.model';
import { ClinicalHistory, ClinicalSectionStatus } from '../models/clinical-history.model';

/**
 * Mock API Service for Nutritionist Portal
 * In production, this would call the actual backend API
 */
@Injectable({ providedIn: 'root' })
export class NutritionistPortalApiService {

  // ============================================
  // DASHBOARD
  // ============================================

  getDashboardData(nutritionistId: string): Observable<NutritionistDashboardData> {
    const mockData: NutritionistDashboardData = {
      nutritionist: this.getMockNutritionist(),
      patients: this.getMockPatientSummaries(),
      todayAppointments: this.getMockTodayAppointments(),
      pendingConsultations: this.getMockPendingConsultations(),
      sharedWithMe: this.getMockSharedWithMe(),
      stats: this.getMockStats()
    };
    return of(mockData);
  }

  // ============================================
  // NUTRITIONIST PROFILE
  // ============================================

  getNutritionistProfile(nutritionistId: string): Observable<NutritionistProfile> {
    return of(this.getMockNutritionistProfile());
  }

  updateNutritionistProfile(profile: Partial<NutritionistProfile>): Observable<NutritionistProfile> {
    return of({ ...this.getMockNutritionistProfile(), ...profile });
  }

  // ============================================
  // PATIENTS
  // ============================================

  getPatients(nutritionistId: string): Observable<PatientSummary[]> {
    return of(this.getMockPatientSummaries());
  }

  getPatientDetail(patientId: string): Observable<PatientComplete> {
    return of(this.getMockPatientComplete(patientId));
  }

  createPatient(data: CreatePatientMinimal): Observable<PatientSummary> {
    const newPatient: PatientSummary = {
      id: `PAT-${Date.now()}`,
      expedienteNumber: `EXP-${String(Date.now()).slice(-4)}`,
      fullName: data.fullName,
      status: 'active',
      hasUnreadMessages: false
    };
    return of(newPatient);
  }

  updatePatient(patientId: string, data: Partial<CreatePatientComplete>): Observable<PatientComplete> {
    return of(this.getMockPatientComplete(patientId));
  }

  updatePatientStatus(patientId: string, status: 'active' | 'inactive'): Observable<PatientSummary> {
    const patient = this.getMockPatientSummaries().find(p => p.id === patientId);
    return of({ ...patient!, status });
  }

  // ============================================
  // APPOINTMENTS
  // ============================================

  getAppointments(nutritionistId: string): Observable<Appointment[]> {
    return of(this.getMockAppointments());
  }

  getCalendarEvents(nutritionistId: string, startDate: Date, endDate: Date): Observable<CalendarEvent[]> {
    return of(this.getMockCalendarEvents());
  }

  createAppointment(data: CreateAppointment): Observable<Appointment> {
    const patient = this.getMockPatientSummaries().find(p => p.id === data.patientId);
    const newAppointment: Appointment = {
      id: `APT-${Date.now()}`,
      patientId: data.patientId,
      nutritionistId: '1',
      nutritionistName: 'Dra. Ana López',
      patientName: patient?.fullName ?? 'Paciente',
      date: data.date,
      time: data.time,
      duration: data.duration,
      type: data.type,
      status: 'scheduled',
      location: data.location,
      notes: data.notes
    };
    return of(newAppointment);
  }

  updateAppointment(appointmentId: string, data: Partial<Appointment>): Observable<Appointment> {
    const appointment = this.getMockAppointments().find(a => a.id === appointmentId);
    return of({ ...appointment!, ...data });
  }

  cancelAppointment(appointmentId: string): Observable<void> {
    return of(undefined);
  }

  // ============================================
  // CONSULTATIONS
  // ============================================

  getMyConsultationRequests(nutritionistId: string): Observable<SpecialistConsultation[]> {
    return of(this.getMockPendingConsultations());
  }

  getSharedWithMe(nutritionistId: string): Observable<SpecialistConsultation[]> {
    return of(this.getMockSharedWithMe());
  }

  inviteSpecialist(data: InviteSpecialist): Observable<SpecialistConsultation> {
    const newConsultation: SpecialistConsultation = {
      id: `CONS-${Date.now()}`,
      patientId: data.patientId,
      patientName: 'María García',
      requestingNutritionistId: '1',
      requestingNutritionistName: 'Dra. Ana López',
      invitedSpecialistId: data.specialistId,
      invitedSpecialistName: 'Dr. Carlos Ruiz',
      reason: data.reason,
      status: 'pending',
      permissions: data.permissions,
      createdAt: new Date(),
      expiresAt: data.expiresAt,
      notes: []
    };
    return of(newConsultation);
  }

  respondToConsultation(consultationId: string, accept: boolean): Observable<SpecialistConsultation> {
    const consultation = this.getMockSharedWithMe().find(c => c.id === consultationId);
    return of({
      ...consultation!,
      status: accept ? 'accepted' : 'declined'
    });
  }

  addConsultationNote(consultationId: string, content: string): Observable<ClinicalNote> {
    const note: ClinicalNote = {
      id: `NOTE-${Date.now()}`,
      patientId: '1',
      authorId: '1',
      authorName: 'Dra. Ana López',
      authorRole: 'consultant',
      content,
      createdAt: new Date(),
      isPrivate: false
    };
    return of(note);
  }

  // ============================================
  // MESSAGES
  // ============================================

  getConversations(nutritionistId: string): Observable<Conversation[]> {
    return of(this.getMockConversations());
  }

  getMessages(conversationId: string): Observable<Message[]> {
    return of(this.getMockMessages());
  }

  sendMessage(conversationId: string, content: string): Observable<Message> {
    const now = new Date();
    const message: Message = {
      id: `MSG-${Date.now()}`,
      conversationId,
      senderId: 'nutritionist-1',
      senderType: 'nutritionist',
      content,
      sentAt: now,
      timestamp: now,
      status: 'sent'
    };
    return of(message);
  }

  // ============================================
  // CLINICAL NOTES
  // ============================================

  getClinicalNotes(patientId: string): Observable<ClinicalNote[]> {
    return of(this.getMockClinicalNotes());
  }

  addClinicalNote(patientId: string, content: string, isPrivate: boolean): Observable<ClinicalNote> {
    const note: ClinicalNote = {
      id: `NOTE-${Date.now()}`,
      patientId,
      authorId: '1',
      authorName: 'Dra. Ana López',
      authorRole: 'owner',
      content,
      createdAt: new Date(),
      isPrivate
    };
    return of(note);
  }

  // ============================================
  // CLINICAL HISTORY
  // ============================================

  getClinicalHistory(patientId: string): Observable<ClinicalHistory> {
    return of(this.getMockClinicalHistory(patientId));
  }

  saveClinicalSection(patientId: string, sectionKey: string, data: unknown): Observable<ClinicalHistory> {
    return of(this.getMockClinicalHistory(patientId));
  }

  // ============================================
  // SPECIALISTS (for invitations)
  // ============================================

  searchSpecialists(query: string): Observable<Nutritionist[]> {
    return of(this.getMockSpecialists().filter(s =>
      s.fullName.toLowerCase().includes(query.toLowerCase())
    ));
  }

  // ============================================
  // MOCK DATA HELPERS
  // ============================================

  private getMockNutritionist(): Nutritionist {
    return {
      id: '1',
      fullName: 'Dra. Ana López',
      email: 'ana.lopez@atlantis.com',
      phone: '+52 55 9876 5432',
      specialty: 'Nutrición Clínica',
      clinicName: 'Atlantis Clinic',
      clinicAddress: 'Av. Reforma 123, Col. Centro, CDMX'
    };
  }

  private getMockNutritionistProfile(): NutritionistProfile {
    return {
      id: '1',
      fullName: 'Dra. Ana López',
      email: 'ana.lopez@atlantis.com',
      phone: '+52 55 9876 5432',
      specialty: 'Nutrición Clínica',
      licenseNumber: 'CED-12345678',
      clinic: 'Atlantis Clinic',
      clinicName: 'Atlantis Clinic',
      address: 'Av. Reforma 123, Col. Centro, CDMX',
      clinicAddress: 'Av. Reforma 123, Col. Centro, CDMX',
      clinicPhone: '+52 55 1234 5678',
      bio: 'Especialista en nutrición clínica con más de 10 años de experiencia.',
      workingHours: [
        { dayOfWeek: 1, startTime: '09:00', endTime: '18:00', isAvailable: true },
        { dayOfWeek: 2, startTime: '09:00', endTime: '18:00', isAvailable: true },
        { dayOfWeek: 3, startTime: '09:00', endTime: '18:00', isAvailable: true },
        { dayOfWeek: 4, startTime: '09:00', endTime: '18:00', isAvailable: true },
        { dayOfWeek: 5, startTime: '09:00', endTime: '14:00', isAvailable: true },
        { dayOfWeek: 6, startTime: '00:00', endTime: '00:00', isAvailable: false },
        { dayOfWeek: 0, startTime: '00:00', endTime: '00:00', isAvailable: false }
      ]
    };
  }

  private getMockPatientSummaries(): PatientSummary[] {
    return [
      {
        id: '1',
        expedienteNumber: 'EXP-001',
        fullName: 'María García Hernández',
        photoUrl: undefined,
        status: 'active',
        lastAppointmentDate: this.daysAgo(7),
        nextAppointmentDate: this.daysFromNow(5),
        currentWeight: 72.5,
        targetWeight: 68,
        progressPercentage: 50,
        hasUnreadMessages: true,
        clinicalHistoryCompleteness: 58,
        clinicalHistorySections: [
          { sectionKey: 'personal_info', label: 'Datos Personales', filled: true },
          { sectionKey: 'medical_info', label: 'Info Médica', filled: true },
          { sectionKey: 'family_history', label: 'Ant. Familiares', filled: true },
          { sectionKey: 'pathological_history', label: 'Ant. Patológicos', filled: false },
          { sectionKey: 'current_conditions', label: 'Padecimientos', filled: true },
          { sectionKey: 'gynecological_history', label: 'Gineco-Obst.', filled: true },
          { sectionKey: 'physical_activity', label: 'Act. Física', filled: true },
          { sectionKey: 'habits_customs', label: 'Hábitos', filled: true },
          { sectionKey: 'dietary_recall', label: 'Recordatorio 24h', filled: false },
          { sectionKey: 'habitual_diet', label: 'Dieta Habitual', filled: false },
          { sectionKey: 'physical_examination', label: 'Expl. Física', filled: false },
          { sectionKey: 'biochemical_data', label: 'Datos Bioquím.', filled: false }
        ]
      },
      {
        id: '2',
        expedienteNumber: 'EXP-002',
        fullName: 'Carlos Rodríguez López',
        photoUrl: undefined,
        status: 'active',
        lastAppointmentDate: this.daysAgo(14),
        nextAppointmentDate: this.daysFromNow(3),
        currentWeight: 85.2,
        targetWeight: 78,
        progressPercentage: 35,
        hasUnreadMessages: false
      },
      {
        id: '3',
        expedienteNumber: 'EXP-003',
        fullName: 'Ana Martínez Sánchez',
        photoUrl: undefined,
        status: 'active',
        lastAppointmentDate: this.daysAgo(3),
        nextAppointmentDate: this.daysFromNow(10),
        currentWeight: 65.0,
        targetWeight: 62,
        progressPercentage: 70,
        hasUnreadMessages: false
      },
      {
        id: '4',
        expedienteNumber: 'EXP-004',
        fullName: 'Roberto Díaz Fernández',
        photoUrl: undefined,
        status: 'inactive',
        lastAppointmentDate: this.daysAgo(60),
        currentWeight: 92.3,
        targetWeight: 85,
        progressPercentage: 20,
        hasUnreadMessages: false
      },
      {
        id: '5',
        expedienteNumber: 'EXP-005',
        fullName: 'Laura Hernández García',
        photoUrl: undefined,
        status: 'active',
        lastAppointmentDate: this.daysAgo(1),
        nextAppointmentDate: this.daysFromNow(14),
        currentWeight: 58.5,
        targetWeight: 55,
        progressPercentage: 60,
        hasUnreadMessages: true
      }
    ];
  }

  private getMockPatientComplete(patientId: string): PatientComplete {
    const summary = this.getMockPatientSummaries().find(p => p.id === patientId)
      ?? this.getMockPatientSummaries()[0]!;

    return {
      id: summary.id,
      expedienteNumber: summary.expedienteNumber,
      personalInfo: {
        fullName: summary.fullName,
        email: 'maria.garcia@email.com',
        phone: '+52 55 1234 5678',
        birthDate: new Date('1990-05-15'),
        age: 34,
        gender: 'female',
        photoUrl: summary.photoUrl,
        address: 'Calle Principal 123, Col. Centro, CDMX',
        emergencyContact: {
          name: 'Juan García',
          phone: '+52 55 8765 4321',
          relationship: 'Esposo'
        }
      },
      medicalInfo: {
        allergies: ['Mariscos', 'Nueces'],
        conditions: ['Hipotiroidismo'],
        medications: ['Levotiroxina 50mcg'],
        dietaryRestrictions: ['Sin gluten'],
        bloodType: 'O+',
        notes: 'Paciente con historial familiar de diabetes.'
      },
      currentMetrics: {
        id: '1',
        date: this.daysAgo(3),
        weight: summary.currentWeight ?? 72.5,
        height: 165,
        bmi: 26.6,
        bodyFatPercentage: 28,
        registeredBy: 'Dra. Ana López'
      },
      metricsHistory: [
        { id: '1', date: this.daysAgo(3), weight: 72.5, height: 165, bmi: 26.6, bodyFatPercentage: 28, registeredBy: 'Dra. Ana López' },
        { id: '2', date: this.daysAgo(10), weight: 73.2, height: 165, bmi: 26.9, bodyFatPercentage: 29, registeredBy: 'Dra. Ana López' },
        { id: '3', date: this.daysAgo(17), weight: 74.0, height: 165, bmi: 27.2, bodyFatPercentage: 30, registeredBy: 'Dra. Ana López' }
      ],
      appointments: this.getMockAppointments().filter(a => a.patientId === patientId),
      activePlan: {
        id: '1',
        patientId: summary.id,
        name: 'Pérdida de peso gradual',
        description: 'Plan diseñado para perder peso de forma saludable.',
        startDate: this.daysAgo(30),
        isActive: true,
        dailyCalories: 1800,
        macros: { protein: 90, carbohydrates: 200, fat: 60 },
        createdBy: 'Dra. Ana López'
      },
      documents: [],
      clinicalNotes: this.getMockClinicalNotes(),
      clinicalHistory: this.getMockClinicalHistory(summary.id),
      status: summary.status,
      createdAt: this.daysAgo(180),
      assignedNutritionistId: '1'
    };
  }

  private getMockAppointments(): Appointment[] {
    return [
      {
        id: '1',
        patientId: '1',
        nutritionistId: '1',
        nutritionistName: 'Dra. Ana López',
        patientName: 'María García Hernández',
        date: this.daysFromNow(0),
        time: '10:00',
        duration: 30,
        type: 'follow_up',
        status: 'scheduled',
        location: 'Consultorio 204, Torre Médica'
      },
      {
        id: '2',
        patientId: '2',
        nutritionistId: '1',
        nutritionistName: 'Dra. Ana López',
        patientName: 'Carlos Rodríguez López',
        date: this.daysFromNow(0),
        time: '11:00',
        duration: 45,
        type: 'control',
        status: 'scheduled',
        location: 'Consultorio 204, Torre Médica'
      },
      {
        id: '3',
        patientId: '1',
        nutritionistId: '1',
        nutritionistName: 'Dra. Ana López',
        patientName: 'María García Hernández',
        date: this.daysFromNow(5),
        time: '10:00',
        duration: 30,
        type: 'follow_up',
        status: 'scheduled',
        location: 'Consultorio 204, Torre Médica'
      },
      {
        id: '4',
        patientId: '3',
        nutritionistId: '1',
        nutritionistName: 'Dra. Ana López',
        patientName: 'Ana Martínez Sánchez',
        date: this.daysFromNow(10),
        time: '14:00',
        duration: 60,
        type: 'initial',
        status: 'scheduled',
        location: 'Consultorio 204, Torre Médica'
      }
    ];
  }

  private getMockTodayAppointments(): Appointment[] {
    return this.getMockAppointments().slice(0, 2);
  }

  private getMockCalendarEvents(): CalendarEvent[] {
    return this.getMockAppointments().map(apt => {
      const patient = this.getMockPatientSummaries().find(p => p.id === apt.patientId);
      const [hours, minutes] = apt.time.split(':').map(Number);
      const start = new Date(apt.date);
      start.setHours(hours ?? 0, minutes ?? 0);
      const end = new Date(start.getTime() + apt.duration * 60000);

      return {
        id: apt.id,
        title: patient?.fullName ?? 'Paciente',
        start,
        end,
        patientId: apt.patientId,
        patientName: patient?.fullName ?? 'Paciente',
        type: apt.type,
        status: apt.status,
        location: apt.location
      };
    });
  }

  private getMockPendingConsultations(): SpecialistConsultation[] {
    return [
      {
        id: 'CONS-1',
        patientId: '1',
        patientName: 'María García',
        requestingNutritionistId: '1',
        requestingNutritionistName: 'Dra. Ana López',
        invitedSpecialistId: '2',
        invitedSpecialistName: 'Dr. Carlos Ruiz',
        reason: 'Evaluación de hipotiroidismo y su impacto en el plan nutricional',
        status: 'pending',
        permissions: 'read_notes',
        createdAt: this.daysAgo(2),
        notes: []
      }
    ];
  }

  private getMockSharedWithMe(): SpecialistConsultation[] {
    return [
      {
        id: 'CONS-2',
        patientId: '10',
        patientName: 'Pedro Sánchez',
        patientPhotoUrl: undefined,
        requestingNutritionistId: '3',
        requestingNutritionistName: 'Dra. María Fernández',
        invitedSpecialistId: '1',
        invitedSpecialistName: 'Dra. Ana López',
        reason: 'Segunda opinión sobre plan para paciente diabético',
        status: 'pending',
        permissions: 'read_notes',
        createdAt: this.daysAgo(1),
        notes: []
      }
    ];
  }

  private getMockConversations(): Conversation[] {
    return [
      {
        id: '1',
        patientId: '1',
        nutritionistId: '1',
        participantName: 'María García Hernández',
        lastMessage: '¿Puedo cambiar el pollo por atún?',
        lastMessageTime: this.minutesAgo(30),
        unreadCount: 2
      },
      {
        id: '2',
        patientId: '5',
        nutritionistId: '1',
        participantName: 'Laura Hernández García',
        lastMessage: 'Gracias por el nuevo plan',
        lastMessageTime: this.hoursAgo(3),
        unreadCount: 1
      },
      {
        id: '3',
        patientId: '2',
        nutritionistId: '1',
        participantName: 'Carlos Rodríguez López',
        lastMessage: 'Ok, perfecto. Nos vemos el viernes.',
        lastMessageTime: this.daysAgo(1),
        unreadCount: 0
      }
    ];
  }

  private getMockMessages(): Message[] {
    const msg1Time = this.hoursAgo(2);
    const msg2Time = this.hoursAgo(1);
    const msg3Time = this.minutesAgo(30);
    return [
      {
        id: '1',
        conversationId: '1',
        senderId: 'patient-1',
        senderType: 'patient',
        content: 'Hola Dra., tengo una duda sobre la cena de hoy.',
        sentAt: msg1Time,
        timestamp: msg1Time,
        status: 'read'
      },
      {
        id: '2',
        conversationId: '1',
        senderId: 'nutritionist-1',
        senderType: 'nutritionist',
        content: 'Claro, dime en qué te puedo ayudar.',
        sentAt: msg2Time,
        timestamp: msg2Time,
        status: 'delivered'
      },
      {
        id: '3',
        conversationId: '1',
        senderId: 'patient-1',
        senderType: 'patient',
        content: '¿Puedo cambiar el pollo por atún?',
        sentAt: msg3Time,
        timestamp: msg3Time,
        status: 'delivered'
      }
    ];
  }

  private getMockClinicalNotes(): ClinicalNote[] {
    return [
      {
        id: '1',
        patientId: '1',
        authorId: '1',
        authorName: 'Dra. Ana López',
        authorRole: 'owner',
        content: 'Paciente muestra buen progreso. Continuar con el plan actual. Reducir consumo de sodio.',
        createdAt: this.daysAgo(7),
        isPrivate: false
      },
      {
        id: '2',
        patientId: '1',
        authorId: '1',
        authorName: 'Dra. Ana López',
        authorRole: 'owner',
        content: 'Revisar niveles de tiroides en próxima consulta.',
        createdAt: this.daysAgo(14),
        isPrivate: true
      }
    ];
  }

  private getMockStats(): DashboardStats {
    return {
      totalPatients: 5,
      activePatients: 4,
      appointmentsToday: 2,
      appointmentsThisWeek: 8,
      pendingMessages: 3
    };
  }

  private getMockSpecialists(): Nutritionist[] {
    return [
      {
        id: '2',
        fullName: 'Dr. Carlos Ruiz',
        email: 'carlos.ruiz@atlantis.com',
        phone: '+52 55 1111 2222',
        specialty: 'Endocrinología Nutricional'
      },
      {
        id: '3',
        fullName: 'Dra. María Fernández',
        email: 'maria.fernandez@atlantis.com',
        phone: '+52 55 3333 4444',
        specialty: 'Nutrición Deportiva'
      },
      {
        id: '4',
        fullName: 'Dr. José Martínez',
        email: 'jose.martinez@atlantis.com',
        phone: '+52 55 5555 6666',
        specialty: 'Nutrición Pediátrica'
      }
    ];
  }

  private getMockClinicalHistory(patientId: string): ClinicalHistory {
    return {
      patientId,
      familyHistory: {
        id: 'fh-1',
        patientId,
        records: [
          { id: 'fhr-1', condition: 'diabetes_type_2', relationship: 'father', isAlive: true, notes: 'Diagnosticado a los 55 años' },
          { id: 'fhr-2', condition: 'hypertension', relationship: 'mother', isAlive: true },
          { id: 'fhr-3', condition: 'obesity', relationship: 'maternal_grandmother', isAlive: false }
        ],
        additionalNotes: 'Historial familiar de enfermedades metabólicas.',
        createdAt: this.daysAgo(90),
        updatedAt: this.daysAgo(30),
        registeredBy: 'Dra. Ana López'
      },
      currentConditions: {
        id: 'cc-1',
        patientId,
        conditions: [
          { id: 'cc-r1', diagnosis: 'Hipotiroidismo', diagnosisDate: new Date('2020-03-15'), currentTreatment: 'Levotiroxina 50mcg', treatingPhysician: 'Dr. Martínez', controlledStatus: 'controlled' }
        ],
        createdAt: this.daysAgo(90),
        updatedAt: this.daysAgo(14),
        registeredBy: 'Dra. Ana López'
      },
      gynecologicalHistory: {
        id: 'gyn-1',
        patientId,
        menarcheAge: 12,
        cycleRegular: true,
        cycleDurationDays: 28,
        menstruationDurationDays: 5,
        lastMenstrualPeriodDate: this.daysAgo(14),
        dysmenorrhea: false,
        pregnancies: 1,
        deliveries: 1,
        abortions: 0,
        cesareans: 0,
        currentlyPregnant: false,
        menopause: false,
        hormoneReplacementTherapy: false,
        contraceptiveMethod: 'iud',
        hasPCOS: false,
        createdAt: this.daysAgo(90),
        updatedAt: this.daysAgo(30),
        registeredBy: 'Dra. Ana López'
      },
      physicalActivity: {
        id: 'pa-1',
        patientId,
        generalLevel: 'moderate',
        activities: [
          { id: 'pa-a1', activityType: 'Caminata', frequencyPerWeek: 4, durationMinutes: 30, intensity: 'moderate', yearsOfPractice: 2 },
          { id: 'pa-a2', activityType: 'Yoga', frequencyPerWeek: 2, durationMinutes: 60, intensity: 'light', yearsOfPractice: 1 }
        ],
        additionalNotes: 'Paciente motivada a incrementar actividad.',
        createdAt: this.daysAgo(60),
        updatedAt: this.daysAgo(14),
        registeredBy: 'Dra. Ana López'
      },
      habitsAndCustoms: {
        id: 'hc-1',
        patientId,
        smokingStatus: 'never',
        alcoholConsumption: 'occasional',
        alcoholFrequencyPerWeek: 1,
        alcoholType: 'Vino tinto',
        dailyWaterIntakeLiters: 1.5,
        sleepHoursPerNight: 7,
        sleepQuality: 'good',
        stressLevel: 'moderate',
        usesSupplements: true,
        supplements: ['Vitamina D', 'Omega 3'],
        dailyCaffeineServings: 2,
        createdAt: this.daysAgo(60),
        updatedAt: this.daysAgo(14),
        registeredBy: 'Dra. Ana López'
      },
      dietaryRecalls: [],
      physicalExaminations: [],
      biochemicalData: [],
      lastUpdated: this.daysAgo(14)
    };
  }

  // Helper methods for dates
  private daysAgo(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  }

  private daysFromNow(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }

  private hoursAgo(hours: number): Date {
    const date = new Date();
    date.setHours(date.getHours() - hours);
    return date;
  }

  private minutesAgo(minutes: number): Date {
    const date = new Date();
    date.setMinutes(date.getMinutes() - minutes);
    return date;
  }
}
