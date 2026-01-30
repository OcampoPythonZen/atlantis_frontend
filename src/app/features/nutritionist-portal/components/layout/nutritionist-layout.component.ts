import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NutritionistSidebarComponent } from './nutritionist-sidebar.component';
import { NutritionistHeaderComponent } from './nutritionist-header.component';
import { CreatePatientModalComponent } from '../modals/create-patient-modal/create-patient-modal.component';
import { NutritionistPortalFacade } from '../../facades/nutritionist-portal.facade';

@Component({
  selector: 'app-nutritionist-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NutritionistSidebarComponent,
    NutritionistHeaderComponent,
    CreatePatientModalComponent
  ],
  template: `
    <div class="min-h-screen bg-dark-50 dark:bg-dark-950 overflow-x-hidden">
      <!-- Skip Navigation Link (WCAG 2.4.1) -->
      <a
        href="#main-content"
        class="
          sr-only focus:not-sr-only
          focus:absolute focus:top-4 focus:left-4 focus:z-50
          bg-navy-800 text-white
          px-4 py-2 rounded-lg font-medium
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500
        "
      >
        Saltar al contenido principal
      </a>

      <!-- Sidebar -->
      <app-nutritionist-sidebar
        [isOpen]="isSidebarOpen()"
        [nutritionistName]="nutritionistName()"
        [nutritionistPhotoUrl]="nutritionistPhotoUrl()"
        [unreadMessages]="unreadMessagesCount()"
        [pendingConsultations]="pendingConsultationsCount()"
        (closeSidebar)="closeSidebar()"
        (logout)="onLogout()"
      />

      <!-- Main content area -->
      <div class="lg:pl-64 flex flex-col min-h-screen">
        <!-- Header -->
        <app-nutritionist-header
          [nutritionistName]="nutritionistName()"
          [nutritionistPhotoUrl]="nutritionistPhotoUrl()"
          [notificationCount]="notificationCount()"
          (toggleSidebar)="toggleSidebar()"
          (logout)="onLogout()"
          (addPatient)="onAddPatient()"
        />

        <!-- Page content -->
        <main
          id="main-content"
          class="flex-1 p-4 lg:p-6 xl:p-8 2xl:p-10"
          role="main"
        >
          <div class="max-w-7xl mx-auto">
            <router-outlet />
          </div>
        </main>

        <!-- Footer -->
        <footer class="
          py-4 px-6
          text-center text-sm
          text-dark-500 dark:text-dark-400
          border-t border-dark-200 dark:border-dark-700
        ">
          <p>Atlantis &copy; {{ currentYear }} - Portal del Nutriólogo</p>
        </footer>
      </div>

      <!-- Modals -->
      <app-create-patient-modal />
    </div>
  `
})
export class NutritionistLayoutComponent {
  private readonly router = inject(Router);
  private readonly facade = inject(NutritionistPortalFacade);

  // Sidebar state
  isSidebarOpen = signal(false);

  // Nutritionist data from facade
  nutritionistName = this.facade.nutritionistName;
  nutritionistPhotoUrl = this.facade.nutritionistPhotoUrl;
  unreadMessagesCount = this.facade.unreadMessagesCount;
  pendingConsultationsCount = this.facade.pendingConsultationsCount;

  // Notification count (messages + consultations)
  notificationCount = () =>
    this.facade.unreadMessagesCount() + this.facade.pendingConsultationsCount();

  // Current year for footer
  currentYear = new Date().getFullYear();

  toggleSidebar(): void {
    this.isSidebarOpen.update(open => !open);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  onLogout(): void {
    this.facade.logout();
    this.router.navigate(['/auth/login']);
  }

  onAddPatient(): void {
    this.facade.openCreatePatientModal();
  }
}
