import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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
  FoodList,
  PatientDashboardData
} from '../models/patient.model';

/**
 * Mock API Service for Patient Portal
 * In production, this would call the actual backend API
 */
@Injectable({ providedIn: 'root' })
export class PatientPortalApiService {

  // ============================================
  // DASHBOARD
  // ============================================

  getDashboardData(patientId: string): Observable<PatientDashboardData> {
    // Mock data for development
    const mockData: PatientDashboardData = {
      patient: this.getMockPatient(),
      currentMetrics: this.getMockMetrics(),
      targetWeight: 68,
      initialWeight: 77,
      activePlan: this.getMockNutritionPlan(),
      nextAppointment: this.getMockNextAppointment(),
      lastMessage: this.getMockLastMessage(),
      nutritionist: this.getMockNutritionist()
    };

    return of(mockData);
  }

  // ============================================
  // PATIENT INFO
  // ============================================

  getPatient(patientId: string): Observable<Patient> {
    return of(this.getMockPatient());
  }

  getMedicalInfo(patientId: string): Observable<PatientMedicalInfo> {
    const mockMedical: PatientMedicalInfo = {
      patientId: '1',
      allergies: ['Mariscos', 'Nueces'],
      conditions: ['Hipotiroidismo'],
      medications: ['Levotiroxina 50mcg'],
      dietaryRestrictions: ['Sin gluten']
    };
    return of(mockMedical);
  }

  getNutritionist(nutritionistId: string): Observable<Nutritionist> {
    return of(this.getMockNutritionist());
  }

  // ============================================
  // METRICS
  // ============================================

  getCurrentMetrics(patientId: string): Observable<BodyMetrics> {
    return of(this.getMockMetrics());
  }

  getMetricsHistory(patientId: string): Observable<BodyMetrics[]> {
    const history: BodyMetrics[] = [
      { ...this.getMockMetrics(), date: this.daysAgo(3), weight: 72.5, bmi: 24.2 },
      { ...this.getMockMetrics(), id: '2', date: this.daysAgo(10), weight: 73.1, bmi: 24.4 },
      { ...this.getMockMetrics(), id: '3', date: this.daysAgo(17), weight: 74.0, bmi: 24.7 },
      { ...this.getMockMetrics(), id: '4', date: this.daysAgo(24), weight: 74.8, bmi: 25.0 },
      { ...this.getMockMetrics(), id: '5', date: this.daysAgo(31), weight: 75.5, bmi: 25.2 },
      { ...this.getMockMetrics(), id: '6', date: this.daysAgo(40), weight: 77.0, bmi: 25.7 },
    ];
    return of(history);
  }

  /** Helper to create a date N days ago */
  private daysAgo(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  }

  getWeightHistory(patientId: string): Observable<WeightRecord[]> {
    const history: WeightRecord[] = [
      { date: new Date('2024-08-15'), weight: 77.0 },
      { date: new Date('2024-09-01'), weight: 76.2 },
      { date: new Date('2024-09-15'), weight: 75.8 },
      { date: new Date('2024-10-01'), weight: 75.0 },
      { date: new Date('2024-10-15'), weight: 74.5 },
      { date: new Date('2024-11-01'), weight: 74.0 },
      { date: new Date('2024-11-15'), weight: 73.8 },
      { date: new Date('2024-12-01'), weight: 73.5 },
      { date: new Date('2024-12-15'), weight: 74.0 },
      { date: new Date('2025-01-01'), weight: 73.2 },
      { date: new Date('2025-01-15'), weight: 72.5 },
    ];
    return of(history);
  }

  getCurrentMeasurements(patientId: string): Observable<BodyMeasurements> {
    const measurements: BodyMeasurements = {
      id: '1',
      patientId: '1',
      date: new Date('2025-01-20'),
      waist: 85,
      hip: 94,
      chest: 99,
      arm: 31,
      thigh: 55,
      registeredBy: 'Dra. Ana López'
    };
    return of(measurements);
  }

  getInitialMeasurements(patientId: string): Observable<BodyMeasurements> {
    const measurements: BodyMeasurements = {
      id: '0',
      patientId: '1',
      date: new Date('2024-08-15'),
      waist: 92,
      hip: 98,
      chest: 102,
      arm: 32,
      thigh: 58,
      registeredBy: 'Dra. Ana López'
    };
    return of(measurements);
  }

  // ============================================
  // NUTRITION PLAN
  // ============================================

  getActivePlan(patientId: string): Observable<NutritionPlan | null> {
    return of(this.getMockNutritionPlan());
  }

  getWeeklyMenu(planId: string): Observable<DailyMenu[]> {
    const menu = this.getMockWeeklyMenu();
    return of(menu);
  }

  getFoodLists(planId: string): Observable<{ allowed: FoodList; restricted: FoodList }> {
    const allowed: FoodList = {
      id: '1',
      planId: '1',
      type: 'allowed',
      foods: [
        'Pollo, pavo, pescado',
        'Huevos',
        'Verduras de hoja verde',
        'Frutas frescas',
        'Arroz integral, quinoa',
        'Legumbres',
        'Frutos secos (con moderación)',
        'Aceite de oliva',
        'Aguacate'
      ]
    };

    const restricted: FoodList = {
      id: '2',
      planId: '1',
      type: 'restricted',
      foods: [
        'Refrescos y jugos industriales',
        'Pan blanco y harinas refinadas',
        'Frituras',
        'Embutidos',
        'Azúcar añadida',
        'Alcohol',
        'Comida rápida',
        'Dulces y postres'
      ]
    };

    return of({ allowed, restricted });
  }

  // ============================================
  // APPOINTMENTS
  // ============================================

  getNextAppointment(patientId: string): Observable<Appointment | null> {
    return of(this.getMockNextAppointment());
  }

  getAppointmentHistory(patientId: string): Observable<Appointment[]> {
    const history: Appointment[] = [
      {
        id: '2',
        patientId: '1',
        nutritionistId: '1',
        nutritionistName: 'Dra. Ana López',
        date: new Date('2025-01-13'),
        time: '10:00',
        duration: 30,
        type: 'follow_up',
        status: 'completed',
        location: 'Consultorio 204, Torre Médica',
        notes: 'Buen progreso. Continuar con el plan actual. Reducir consumo de sodio.'
      },
      {
        id: '3',
        patientId: '1',
        nutritionistId: '1',
        nutritionistName: 'Dra. Ana López',
        date: new Date('2024-12-15'),
        time: '11:00',
        duration: 60,
        type: 'initial',
        status: 'completed',
        location: 'Consultorio 204, Torre Médica',
        notes: 'Primera consulta. Se estableció plan de pérdida gradual de 500g por semana.'
      }
    ];
    return of(history);
  }

  // ============================================
  // MESSAGES
  // ============================================

  getConversation(patientId: string): Observable<Conversation> {
    const conversation: Conversation = {
      id: '1',
      patientId: '1',
      nutritionistId: '1',
      nutritionistName: 'Dra. Ana López',
      nutritionistPhotoUrl: undefined,
      unreadCount: 1
    };
    return of(conversation);
  }

  getMessages(conversationId: string): Observable<Message[]> {
    const messages: Message[] = [
      {
        id: '1',
        conversationId: '1',
        senderId: '1',
        senderType: 'nutritionist',
        content: 'Hola María, excelente progreso esta semana. Sigue así 💪',
        sentAt: new Date('2025-01-20T10:30:00'),
        status: 'read'
      },
      {
        id: '2',
        conversationId: '1',
        senderId: '2',
        senderType: 'patient',
        content: 'Gracias Dra! Una pregunta, ¿puedo cambiar el pollo por atún en la comida?',
        sentAt: new Date('2025-01-20T10:45:00'),
        readAt: new Date('2025-01-20T11:00:00'),
        status: 'read'
      },
      {
        id: '3',
        conversationId: '1',
        senderId: '1',
        senderType: 'nutritionist',
        content: 'Sí, claro. El atún es una excelente opción. Usa la misma cantidad (150g).',
        sentAt: new Date('2025-01-20T11:02:00'),
        status: 'delivered'
      }
    ];
    return of(messages);
  }

  sendMessage(conversationId: string, content: string): Observable<Message> {
    const message: Message = {
      id: Date.now().toString(),
      conversationId,
      senderId: '2',
      senderType: 'patient',
      content,
      sentAt: new Date(),
      status: 'sent'
    };
    return of(message);
  }

  // ============================================
  // DOCUMENTS
  // ============================================

  getDocuments(patientId: string): Observable<DocumentFile[]> {
    const documents: DocumentFile[] = [
      {
        id: '1',
        patientId: '1',
        name: 'Plan Alimenticio Enero 2025.pdf',
        type: 'meal_plan',
        mimeType: 'application/pdf',
        size: 245000,
        url: '/documents/plan-enero.pdf',
        uploadedAt: new Date('2025-01-15'),
        uploadedBy: 'Dra. Ana López'
      },
      {
        id: '2',
        patientId: '1',
        name: 'Análisis de laboratorio.pdf',
        type: 'lab_results',
        mimeType: 'application/pdf',
        size: 1200000,
        url: '/documents/lab-results.pdf',
        uploadedAt: new Date('2025-01-10'),
        uploadedBy: 'Dra. Ana López'
      },
      {
        id: '3',
        patientId: '1',
        name: 'Receta - Ensalada mediterránea.pdf',
        type: 'recipe',
        mimeType: 'application/pdf',
        size: 89000,
        url: '/documents/recipe-salad.pdf',
        uploadedAt: new Date('2025-01-05'),
        uploadedBy: 'Dra. Ana López'
      }
    ];
    return of(documents);
  }

  // ============================================
  // MOCK DATA HELPERS
  // ============================================

  private getMockPatient(): Patient {
    return {
      id: '1',
      fullName: 'María García Hernández',
      email: 'maria.garcia@email.com',
      phone: '+52 55 1234 5678',
      birthDate: new Date('1990-05-15'),
      age: 34,
      gender: 'female',
      photoUrl: undefined,
      createdAt: new Date('2024-08-15'),
      nutritionistId: '1'
    };
  }

  private getMockMetrics(): BodyMetrics {
    // Use relative date (3 days ago)
    const date = new Date();
    date.setDate(date.getDate() - 3);

    return {
      id: '1',
      patientId: '1',
      date,
      weight: 72.5,
      height: 173,
      bmi: 24.2,
      bodyFatPercentage: 22,
      registeredBy: 'Dra. Ana López'
    };
  }

  private getMockNutritionPlan(): NutritionPlan {
    return {
      id: '1',
      patientId: '1',
      name: 'Pérdida de peso gradual',
      description: 'Plan diseñado para perder peso de forma saludable, aproximadamente 500g por semana.',
      startDate: new Date('2024-12-15'),
      isActive: true,
      dailyCalories: 1800,
      macros: {
        protein: 90,
        carbohydrates: 200,
        fat: 60
      },
      createdBy: 'Dra. Ana López'
    };
  }

  private getMockNextAppointment(): Appointment {
    // Use relative date (5 days from now)
    const date = new Date();
    date.setDate(date.getDate() + 5);
    date.setHours(10, 0, 0, 0);

    return {
      id: '1',
      patientId: '1',
      nutritionistId: '1',
      nutritionistName: 'Dra. Ana López',
      date,
      time: '10:00',
      duration: 30,
      type: 'follow_up',
      status: 'scheduled',
      location: 'Consultorio 204, Torre Médica'
    };
  }

  private getMockLastMessage(): Message {
    // Use relative date (2 hours ago)
    const sentAt = new Date();
    sentAt.setHours(sentAt.getHours() - 2);

    return {
      id: '3',
      conversationId: '1',
      senderId: '1',
      senderType: 'nutritionist',
      content: 'Sí, claro. El atún es una excelente opción. Usa la misma cantidad (150g).',
      sentAt,
      status: 'delivered'
    };
  }

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

  private getMockWeeklyMenu(): DailyMenu[] {
    const baseMenu: DailyMenu = {
      id: '1',
      planId: '1',
      dayOfWeek: 0,
      meals: [
        {
          id: '1',
          type: 'breakfast',
          name: 'Desayuno',
          scheduledTime: '07:00',
          totalCalories: 400,
          foods: [
            { id: '1', name: '2 huevos revueltos', portion: '2 piezas', calories: 180 },
            { id: '2', name: 'Pan integral', portion: '1 rebanada', calories: 80 },
            { id: '3', name: 'Aguacate', portion: '1/2 pieza', calories: 80 },
            { id: '4', name: 'Fruta fresca', portion: '1 taza', calories: 60 }
          ]
        },
        {
          id: '2',
          type: 'morning_snack',
          name: 'Colación matutina',
          scheduledTime: '10:30',
          totalCalories: 150,
          foods: [
            { id: '5', name: 'Manzana', portion: '1 pieza', calories: 80 },
            { id: '6', name: 'Almendras', portion: '10 piezas', calories: 70 }
          ]
        },
        {
          id: '3',
          type: 'lunch',
          name: 'Comida',
          scheduledTime: '14:00',
          totalCalories: 600,
          foods: [
            { id: '7', name: 'Pechuga de pollo a la plancha', portion: '150g', calories: 250 },
            { id: '8', name: 'Arroz integral', portion: '1 taza', calories: 150 },
            { id: '9', name: 'Ensalada mixta con limón', portion: '2 tazas', calories: 50 },
            { id: '10', name: 'Aceite de oliva', portion: '1 cucharada', calories: 150 }
          ]
        },
        {
          id: '4',
          type: 'afternoon_snack',
          name: 'Colación vespertina',
          scheduledTime: '17:00',
          totalCalories: 150,
          foods: [
            { id: '11', name: 'Yogurt natural', portion: '1 taza', calories: 100 },
            { id: '12', name: 'Berries', portion: '1/2 taza', calories: 50 }
          ]
        },
        {
          id: '5',
          type: 'dinner',
          name: 'Cena',
          scheduledTime: '20:00',
          totalCalories: 500,
          foods: [
            { id: '13', name: 'Salmón al horno', portion: '150g', calories: 280 },
            { id: '14', name: 'Verduras al vapor', portion: '2 tazas', calories: 100 },
            { id: '15', name: 'Quinoa', portion: '1/2 taza', calories: 120 }
          ]
        }
      ]
    };

    // Create menu for each day of the week
    return Array.from({ length: 7 }, (_, i) => ({
      ...baseMenu,
      id: `menu-${i}`,
      dayOfWeek: i
    }));
  }
}
