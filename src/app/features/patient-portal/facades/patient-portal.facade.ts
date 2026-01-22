import { Injectable, inject, computed, NgZone } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PatientPortalStore } from '../store/patient-portal.store';
import { PatientPortalApiService } from '../services/patient-portal-api.service';
import { TimeRange, Message } from '../models/patient.model';

/**
 * Facade for Patient Portal
 * Orchestrates all operations and provides a single entry point for components
 */
@Injectable({ providedIn: 'root' })
export class PatientPortalFacade {
  private readonly store = inject(PatientPortalStore);
  private readonly api = inject(PatientPortalApiService);
  private readonly ngZone = inject(NgZone);

  // Current patient ID (would come from auth in real app)
  private readonly currentPatientId = '1';

  // ============================================
  // PUBLIC STATE (from store)
  // ============================================

  // Patient info
  readonly patient = this.store.patient;
  readonly patientName = this.store.patientName;
  readonly patientPhotoUrl = this.store.patientPhotoUrl;
  readonly medicalInfo = this.store.medicalInfo;
  readonly nutritionist = this.store.nutritionist;

  // Metrics
  readonly currentMetrics = this.store.currentMetrics;
  readonly metricsHistory = this.store.metricsHistory;
  readonly currentMeasurements = this.store.currentMeasurements;
  readonly measurementsHistory = this.store.measurementsHistory;
  readonly weightHistory = this.store.weightHistory;
  readonly targetWeight = this.store.targetWeight;
  readonly initialWeight = this.store.initialWeight;
  readonly currentWeight = this.store.currentWeight;
  readonly currentBmi = this.store.currentBmi;
  readonly weightLost = this.store.weightLost;
  readonly weightToGoal = this.store.weightToGoal;

  // Nutrition plan
  readonly activePlan = this.store.activePlan;
  readonly weeklyMenu = this.store.weeklyMenu;
  readonly todayMenu = this.store.todayMenu;
  readonly allowedFoods = this.store.allowedFoods;
  readonly restrictedFoods = this.store.restrictedFoods;

  // Appointments
  readonly nextAppointment = this.store.nextAppointment;
  readonly appointmentHistory = this.store.appointmentHistory;

  // Messages
  readonly conversation = this.store.conversation;
  readonly messages = this.store.messages;
  readonly unreadMessages = this.store.unreadCount;

  // Documents
  readonly documents = this.store.documents;

  // UI state
  readonly isLoading = this.store.isLoading;
  readonly error = this.store.error;

  // ============================================
  // COMPUTED VALUES
  // ============================================

  readonly notificationCount = computed(() => {
    return this.store.unreadCount();
  });

  readonly daysUntilNextAppointment = computed(() => {
    const appointment = this.store.nextAppointment();
    if (!appointment) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentDate = new Date(appointment.date);
    appointmentDate.setHours(0, 0, 0, 0);

    const diffTime = appointmentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  });

  // ============================================
  // DASHBOARD OPERATIONS
  // ============================================

  async loadDashboard(): Promise<void> {
    this.ngZone.run(() => {
      this.store.setLoading(true);
      this.store.setError(null);
    });

    try {
      const data = await firstValueFrom(
        this.api.getDashboardData(this.currentPatientId)
      );

      this.ngZone.run(() => {
        this.store.setPatient(data.patient);
        this.store.setNutritionist(data.nutritionist);

        if (data.currentMetrics) {
          this.store.setCurrentMetrics(data.currentMetrics);
        }
        if (data.targetWeight) {
          this.store.setTargetWeight(data.targetWeight);
        }
        if (data.initialWeight) {
          this.store.setInitialWeight(data.initialWeight);
        }
        if (data.activePlan) {
          this.store.setActivePlan(data.activePlan);
        }
        if (data.nextAppointment) {
          this.store.setNextAppointment(data.nextAppointment);
        }
      });

    } catch (error) {
      this.handleError(error, 'Error al cargar el dashboard');
    } finally {
      this.ngZone.run(() => {
        this.store.setLoading(false);
      });
    }
  }

  // ============================================
  // PROFILE OPERATIONS
  // ============================================

  async loadProfile(): Promise<void> {
    this.ngZone.run(() => {
      this.store.setLoading(true);
      this.store.setError(null);
    });

    try {
      const [patient, medicalInfo, nutritionist] = await Promise.all([
        firstValueFrom(this.api.getPatient(this.currentPatientId)),
        firstValueFrom(this.api.getMedicalInfo(this.currentPatientId)),
        firstValueFrom(this.api.getNutritionist('1'))
      ]);

      this.ngZone.run(() => {
        this.store.setPatient(patient);
        this.store.setMedicalInfo(medicalInfo);
        this.store.setNutritionist(nutritionist);
      });

    } catch (error) {
      this.handleError(error, 'Error al cargar el perfil');
    } finally {
      this.ngZone.run(() => {
        this.store.setLoading(false);
      });
    }
  }

  // ============================================
  // METRICS OPERATIONS
  // ============================================

  async loadProgress(): Promise<void> {
    this.ngZone.run(() => {
      this.store.setLoading(true);
      this.store.setError(null);
    });

    try {
      const [
        currentMetrics,
        metricsHistory,
        weightHistory,
        currentMeasurements,
        initialMeasurements
      ] = await Promise.all([
        firstValueFrom(this.api.getCurrentMetrics(this.currentPatientId)),
        firstValueFrom(this.api.getMetricsHistory(this.currentPatientId)),
        firstValueFrom(this.api.getWeightHistory(this.currentPatientId)),
        firstValueFrom(this.api.getCurrentMeasurements(this.currentPatientId)),
        firstValueFrom(this.api.getInitialMeasurements(this.currentPatientId))
      ]);

      this.ngZone.run(() => {
        this.store.setCurrentMetrics(currentMetrics);
        this.store.setMetricsHistory(metricsHistory);
        this.store.setWeightHistory(weightHistory);
        this.store.setCurrentMeasurements(currentMeasurements);

        // Set initial weight from first metrics
        if (metricsHistory.length > 0) {
          const firstMetric = metricsHistory[metricsHistory.length - 1];
          if (firstMetric) {
            this.store.setInitialWeight(firstMetric.weight);
          }
        }
      });

    } catch (error) {
      this.handleError(error, 'Error al cargar el progreso');
    } finally {
      this.ngZone.run(() => {
        this.store.setLoading(false);
      });
    }
  }

  getFilteredWeightHistory(range: TimeRange) {
    const history = this.store.weightHistory();
    const now = new Date();
    let startDate: Date;

    switch (range) {
      case '1m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case '3m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case '6m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        break;
      case '1y':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      case 'all':
      default:
        return history;
    }

    return history.filter(record => new Date(record.date) >= startDate);
  }

  // ============================================
  // NUTRITION PLAN OPERATIONS
  // ============================================

  async loadNutritionPlan(): Promise<void> {
    this.ngZone.run(() => {
      this.store.setLoading(true);
      this.store.setError(null);
    });

    try {
      const plan = await firstValueFrom(
        this.api.getActivePlan(this.currentPatientId)
      );

      if (plan) {
        const [menu, foodLists] = await Promise.all([
          firstValueFrom(this.api.getWeeklyMenu(plan.id)),
          firstValueFrom(this.api.getFoodLists(plan.id))
        ]);

        this.ngZone.run(() => {
          this.store.setActivePlan(plan);
          this.store.setWeeklyMenu(menu);
          this.store.setFoodLists(foodLists.allowed, foodLists.restricted);
        });
      } else {
        this.ngZone.run(() => {
          this.store.setActivePlan(null);
        });
      }

    } catch (error) {
      this.handleError(error, 'Error al cargar el plan nutricional');
    } finally {
      this.ngZone.run(() => {
        this.store.setLoading(false);
      });
    }
  }

  getMenuForDay(dayOfWeek: number) {
    return this.store.weeklyMenu().find(m => m.dayOfWeek === dayOfWeek) ?? null;
  }

  // ============================================
  // APPOINTMENTS OPERATIONS
  // ============================================

  async loadAppointments(): Promise<void> {
    this.ngZone.run(() => {
      this.store.setLoading(true);
      this.store.setError(null);
    });

    try {
      const [nextAppointment, history] = await Promise.all([
        firstValueFrom(this.api.getNextAppointment(this.currentPatientId)),
        firstValueFrom(this.api.getAppointmentHistory(this.currentPatientId))
      ]);

      this.ngZone.run(() => {
        this.store.setNextAppointment(nextAppointment);
        this.store.setAppointmentHistory(history);
      });

    } catch (error) {
      this.handleError(error, 'Error al cargar las citas');
    } finally {
      this.ngZone.run(() => {
        this.store.setLoading(false);
      });
    }
  }

  generateCalendarUrl(appointmentId: string): string {
    const appointment = this.store.nextAppointment();
    if (!appointment || appointment.id !== appointmentId) return '';

    const startDate = new Date(appointment.date);
    const [hours, minutes] = appointment.time.split(':').map(Number);
    startDate.setHours(hours ?? 0, minutes ?? 0);

    const endDate = new Date(startDate.getTime() + appointment.duration * 60000);

    const formatDate = (date: Date) =>
      date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const title = encodeURIComponent(`Cita con ${appointment.nutritionistName}`);
    const location = encodeURIComponent(appointment.location ?? '');
    const details = encodeURIComponent(`Tipo: ${appointment.type}`);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatDate(startDate)}/${formatDate(endDate)}&location=${location}&details=${details}`;
  }

  // ============================================
  // MESSAGES OPERATIONS
  // ============================================

  async loadMessages(): Promise<void> {
    this.ngZone.run(() => {
      this.store.setLoading(true);
      this.store.setError(null);
    });

    try {
      const conversation = await firstValueFrom(
        this.api.getConversation(this.currentPatientId)
      );

      const messages = await firstValueFrom(
        this.api.getMessages(conversation.id)
      );

      this.ngZone.run(() => {
        this.store.setConversation(conversation);
        this.store.setMessages(messages);
      });

    } catch (error) {
      this.handleError(error, 'Error al cargar los mensajes');
    } finally {
      this.ngZone.run(() => {
        this.store.setLoading(false);
      });
    }
  }

  async sendMessage(content: string): Promise<boolean> {
    const conversation = this.store.conversation();
    if (!conversation || !content.trim()) return false;

    try {
      const message = await firstValueFrom(
        this.api.sendMessage(conversation.id, content)
      );
      this.ngZone.run(() => {
        this.store.addMessage(message);
      });
      return true;

    } catch (error) {
      this.handleError(error, 'Error al enviar el mensaje');
      return false;
    }
  }

  // ============================================
  // DOCUMENTS OPERATIONS
  // ============================================

  async loadDocuments(): Promise<void> {
    this.ngZone.run(() => {
      this.store.setLoading(true);
      this.store.setError(null);
    });

    try {
      const documents = await firstValueFrom(
        this.api.getDocuments(this.currentPatientId)
      );

      this.ngZone.run(() => {
        this.store.setDocuments(documents);
      });

    } catch (error) {
      this.handleError(error, 'Error al cargar los documentos');
    } finally {
      this.ngZone.run(() => {
        this.store.setLoading(false);
      });
    }
  }

  downloadDocument(documentId: string): void {
    const doc = this.store.documents().find(d => d.id === documentId);
    if (doc) {
      // In real app, this would trigger a download
      window.open(doc.url, '_blank');
    }
  }

  // ============================================
  // AUTH OPERATIONS
  // ============================================

  logout(): void {
    this.store.reset();
    // In real app, would also clear auth tokens
  }

  // ============================================
  // ERROR HANDLING
  // ============================================

  private handleError(error: unknown, defaultMessage: string): void {
    console.error(error);
    const message = error instanceof Error ? error.message : defaultMessage;
    this.store.setError(message);
  }
}
