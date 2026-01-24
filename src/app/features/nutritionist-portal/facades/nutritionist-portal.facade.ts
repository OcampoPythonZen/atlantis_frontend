import { Injectable, inject, computed, ApplicationRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NutritionistPortalStore } from '../store/nutritionist-portal.store';
import { NutritionistPortalApiService } from '../services/nutritionist-portal-api.service';
import {
  PatientFilters,
  CreatePatientMinimal,
  CreatePatientComplete,
  CreateAppointment,
  InviteSpecialist
} from '../models/nutritionist.model';

/**
 * Facade for Nutritionist Portal
 * Orchestrates all operations and provides a single entry point for components
 */
@Injectable({ providedIn: 'root' })
export class NutritionistPortalFacade {
  private readonly store = inject(NutritionistPortalStore);
  private readonly api = inject(NutritionistPortalApiService);
  private readonly appRef = inject(ApplicationRef);

  // Current nutritionist ID (would come from auth in real app)
  private readonly currentNutritionistId = '1';

  // ============================================
  // PUBLIC STATE (from store)
  // ============================================

  // Nutritionist info
  readonly nutritionist = this.store.nutritionist;
  readonly nutritionistName = this.store.nutritionistName;
  readonly nutritionistPhotoUrl = this.store.nutritionistPhotoUrl;

  // Patients
  readonly patients = this.store.patients;
  readonly filteredPatients = this.store.filteredPatients;
  readonly selectedPatient = this.store.selectedPatient;
  readonly patientFilters = this.store.patientFilters;
  readonly activePatients = this.store.activePatients;
  readonly inactivePatients = this.store.inactivePatients;

  // Appointments
  readonly appointments = this.store.appointments;
  readonly calendarEvents = this.store.calendarEvents;
  readonly selectedDate = this.store.selectedDate;
  readonly todayAppointments = this.store.todayAppointments;

  // Consultations
  readonly myConsultationRequests = this.store.myConsultationRequests;
  readonly sharedWithMe = this.store.sharedWithMe;
  readonly pendingConsultationsCount = this.store.pendingConsultationsCount;

  // Messages
  readonly conversations = this.store.conversations;
  readonly activeConversation = this.store.activeConversation;
  readonly messages = this.store.messages;
  readonly unreadMessagesCount = this.store.unreadMessagesCount;

  // Stats
  readonly stats = this.store.stats;

  // UI state
  readonly isLoading = this.store.isLoading;
  readonly error = this.store.error;

  // Modal states
  readonly isCreatePatientModalOpen = this.store.isCreatePatientModalOpen;
  readonly isScheduleAppointmentModalOpen = this.store.isScheduleAppointmentModalOpen;
  readonly isInviteSpecialistModalOpen = this.store.isInviteSpecialistModalOpen;

  // ============================================
  // DASHBOARD OPERATIONS
  // ============================================

  async loadDashboard(): Promise<void> {
    this.store.setLoading(true);
    this.store.setError(null);

    try {
      const data = await firstValueFrom(
        this.api.getDashboardData(this.currentNutritionistId)
      );

      this.store.setNutritionist({
        ...data.nutritionist,
        licenseNumber: 'CED-12345678'
      });
      this.store.setPatients(data.patients);
      this.store.setAppointments(data.todayAppointments);
      this.store.setMyConsultationRequests(data.pendingConsultations);
      this.store.setSharedWithMe(data.sharedWithMe);
      this.store.setStats(data.stats);

      this.appRef.tick();
    } catch (error) {
      this.handleError(error, 'Error al cargar el dashboard');
    } finally {
      this.store.setLoading(false);
      this.appRef.tick();
    }
  }

  // ============================================
  // PATIENT OPERATIONS
  // ============================================

  async loadPatients(): Promise<void> {
    this.store.setLoading(true);
    this.store.setError(null);

    try {
      const patients = await firstValueFrom(
        this.api.getPatients(this.currentNutritionistId)
      );
      this.store.setPatients(patients);
    } catch (error) {
      this.handleError(error, 'Error al cargar pacientes');
    } finally {
      this.store.setLoading(false);
      this.appRef.tick();
    }
  }

  async loadPatientDetail(patientId: string): Promise<void> {
    this.store.setLoading(true);
    this.store.setError(null);

    try {
      const patient = await firstValueFrom(
        this.api.getPatientDetail(patientId)
      );
      this.store.setSelectedPatient(patient);
    } catch (error) {
      this.handleError(error, 'Error al cargar detalle del paciente');
    } finally {
      this.store.setLoading(false);
      this.appRef.tick();
    }
  }

  async createPatient(data: CreatePatientMinimal): Promise<boolean> {
    this.store.setLoading(true);

    try {
      const newPatient = await firstValueFrom(
        this.api.createPatient(data)
      );
      this.store.addPatient(newPatient);
      this.store.closeCreatePatientModal();
      this.appRef.tick();
      return true;
    } catch (error) {
      this.handleError(error, 'Error al crear paciente');
      return false;
    } finally {
      this.store.setLoading(false);
      this.appRef.tick();
    }
  }

  async updatePatient(patientId: string, data: Partial<CreatePatientComplete>): Promise<boolean> {
    this.store.setLoading(true);

    try {
      const updatedPatient = await firstValueFrom(
        this.api.updatePatient(patientId, data)
      );
      this.store.setSelectedPatient(updatedPatient);
      // Update summary in list
      this.store.updatePatient(patientId, {
        fullName: updatedPatient.personalInfo.fullName
      });
      this.appRef.tick();
      return true;
    } catch (error) {
      this.handleError(error, 'Error al actualizar paciente');
      return false;
    } finally {
      this.store.setLoading(false);
      this.appRef.tick();
    }
  }

  async togglePatientStatus(patientId: string): Promise<void> {
    const patient = this.store.patients().find(p => p.id === patientId);
    if (!patient) return;

    const newStatus = patient.status === 'active' ? 'inactive' : 'active';

    try {
      await firstValueFrom(
        this.api.updatePatientStatus(patientId, newStatus)
      );
      this.store.updatePatient(patientId, { status: newStatus });
      this.appRef.tick();
    } catch (error) {
      this.handleError(error, 'Error al cambiar estatus del paciente');
    }
  }

  clearSelectedPatient(): void {
    this.store.setSelectedPatient(null);
  }

  // Patient filters
  setPatientFilters(filters: Partial<PatientFilters>): void {
    this.store.setPatientFilters(filters);
    this.appRef.tick();
  }

  resetPatientFilters(): void {
    this.store.resetPatientFilters();
    this.appRef.tick();
  }

  // ============================================
  // APPOINTMENT OPERATIONS
  // ============================================

  async loadAppointments(): Promise<void> {
    this.store.setLoading(true);
    this.store.setError(null);

    try {
      const [appointments, events] = await Promise.all([
        firstValueFrom(this.api.getAppointments(this.currentNutritionistId)),
        firstValueFrom(this.api.getCalendarEvents(
          this.currentNutritionistId,
          this.getMonthStart(),
          this.getMonthEnd()
        ))
      ]);

      this.store.setAppointments(appointments);
      this.store.setCalendarEvents(events);
    } catch (error) {
      this.handleError(error, 'Error al cargar citas');
    } finally {
      this.store.setLoading(false);
      this.appRef.tick();
    }
  }

  async createAppointment(data: CreateAppointment): Promise<boolean> {
    this.store.setLoading(true);

    try {
      const newAppointment = await firstValueFrom(
        this.api.createAppointment(data)
      );
      this.store.addAppointment(newAppointment);
      this.store.closeScheduleAppointmentModal();
      // Reload calendar events
      await this.loadAppointments();
      return true;
    } catch (error) {
      this.handleError(error, 'Error al crear cita');
      return false;
    } finally {
      this.store.setLoading(false);
      this.appRef.tick();
    }
  }

  async cancelAppointment(appointmentId: string): Promise<void> {
    try {
      await firstValueFrom(this.api.cancelAppointment(appointmentId));
      this.store.updateAppointment(appointmentId, { status: 'cancelled' });
      this.appRef.tick();
    } catch (error) {
      this.handleError(error, 'Error al cancelar cita');
    }
  }

  setSelectedDate(date: Date): void {
    this.store.setSelectedDate(date);
    this.appRef.tick();
  }

  private getMonthStart(): Date {
    const date = new Date(this.store.selectedDate());
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private getMonthEnd(): Date {
    const date = new Date(this.store.selectedDate());
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  // ============================================
  // CONSULTATION OPERATIONS
  // ============================================

  async loadConsultations(): Promise<void> {
    this.store.setLoading(true);
    this.store.setError(null);

    try {
      const [myRequests, sharedWithMe] = await Promise.all([
        firstValueFrom(this.api.getMyConsultationRequests(this.currentNutritionistId)),
        firstValueFrom(this.api.getSharedWithMe(this.currentNutritionistId))
      ]);

      this.store.setMyConsultationRequests(myRequests);
      this.store.setSharedWithMe(sharedWithMe);
    } catch (error) {
      this.handleError(error, 'Error al cargar consultas');
    } finally {
      this.store.setLoading(false);
      this.appRef.tick();
    }
  }

  async inviteSpecialist(data: InviteSpecialist): Promise<boolean> {
    this.store.setLoading(true);

    try {
      const consultation = await firstValueFrom(
        this.api.inviteSpecialist(data)
      );
      this.store.addConsultationRequest(consultation);
      this.store.closeInviteSpecialistModal();
      this.appRef.tick();
      return true;
    } catch (error) {
      this.handleError(error, 'Error al invitar especialista');
      return false;
    } finally {
      this.store.setLoading(false);
      this.appRef.tick();
    }
  }

  async respondToConsultation(consultationId: string, accept: boolean): Promise<void> {
    try {
      const updated = await firstValueFrom(
        this.api.respondToConsultation(consultationId, accept)
      );
      this.store.updateConsultation(consultationId, {
        status: updated.status
      });
      this.appRef.tick();
    } catch (error) {
      this.handleError(error, 'Error al responder consulta');
    }
  }

  async addConsultationNote(consultationId: string, content: string): Promise<boolean> {
    try {
      await firstValueFrom(
        this.api.addConsultationNote(consultationId, content)
      );
      // Reload consultations to get updated notes
      await this.loadConsultations();
      return true;
    } catch (error) {
      this.handleError(error, 'Error al agregar nota');
      return false;
    }
  }

  // ============================================
  // MESSAGE OPERATIONS
  // ============================================

  async loadConversations(): Promise<void> {
    this.store.setLoading(true);
    this.store.setError(null);

    try {
      const conversations = await firstValueFrom(
        this.api.getConversations(this.currentNutritionistId)
      );
      this.store.setConversations(conversations);
    } catch (error) {
      this.handleError(error, 'Error al cargar conversaciones');
    } finally {
      this.store.setLoading(false);
      this.appRef.tick();
    }
  }

  async loadMessages(conversationId: string): Promise<void> {
    this.store.setLoading(true);

    try {
      const conversation = this.store.conversations().find(c => c.id === conversationId);
      if (conversation) {
        this.store.setActiveConversation(conversation);
      }

      const messages = await firstValueFrom(
        this.api.getMessages(conversationId)
      );
      this.store.setMessages(messages);
    } catch (error) {
      this.handleError(error, 'Error al cargar mensajes');
    } finally {
      this.store.setLoading(false);
      this.appRef.tick();
    }
  }

  async sendMessage(content: string): Promise<boolean> {
    const conversation = this.store.activeConversation();
    if (!conversation || !content.trim()) return false;

    try {
      const message = await firstValueFrom(
        this.api.sendMessage(conversation.id, content)
      );
      this.store.addMessage(message);
      this.appRef.tick();
      return true;
    } catch (error) {
      this.handleError(error, 'Error al enviar mensaje');
      return false;
    }
  }

  clearActiveConversation(): void {
    this.store.setActiveConversation(null);
    this.store.setMessages([]);
  }

  // ============================================
  // CLINICAL NOTES OPERATIONS
  // ============================================

  async addClinicalNote(patientId: string, content: string, isPrivate: boolean): Promise<boolean> {
    try {
      await firstValueFrom(
        this.api.addClinicalNote(patientId, content, isPrivate)
      );
      // Reload patient detail to get updated notes
      await this.loadPatientDetail(patientId);
      return true;
    } catch (error) {
      this.handleError(error, 'Error al agregar nota clínica');
      return false;
    }
  }

  // ============================================
  // SPECIALIST SEARCH
  // ============================================

  async searchSpecialists(query: string) {
    if (!query.trim()) return [];

    try {
      return await firstValueFrom(this.api.searchSpecialists(query));
    } catch (error) {
      this.handleError(error, 'Error al buscar especialistas');
      return [];
    }
  }

  // ============================================
  // MODAL OPERATIONS
  // ============================================

  openCreatePatientModal(): void {
    this.store.openCreatePatientModal();
    this.appRef.tick();
  }

  closeCreatePatientModal(): void {
    this.store.closeCreatePatientModal();
    this.appRef.tick();
  }

  openScheduleAppointmentModal(): void {
    this.store.openScheduleAppointmentModal();
    this.appRef.tick();
  }

  closeScheduleAppointmentModal(): void {
    this.store.closeScheduleAppointmentModal();
    this.appRef.tick();
  }

  openInviteSpecialistModal(): void {
    this.store.openInviteSpecialistModal();
    this.appRef.tick();
  }

  closeInviteSpecialistModal(): void {
    this.store.closeInviteSpecialistModal();
    this.appRef.tick();
  }

  // ============================================
  // PROFILE OPERATIONS
  // ============================================

  async loadProfile(): Promise<void> {
    this.store.setLoading(true);
    this.store.setError(null);

    try {
      const profile = await firstValueFrom(
        this.api.getNutritionistProfile(this.currentNutritionistId)
      );
      this.store.setNutritionist(profile);
    } catch (error) {
      this.handleError(error, 'Error al cargar perfil');
    } finally {
      this.store.setLoading(false);
      this.appRef.tick();
    }
  }

  // ============================================
  // AUTH OPERATIONS
  // ============================================

  logout(): void {
    this.store.reset();
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
