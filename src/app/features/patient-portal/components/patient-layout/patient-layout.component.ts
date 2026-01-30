import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PatientSidebarComponent } from '../patient-sidebar/patient-sidebar.component';
import { PatientHeaderComponent } from '../patient-header/patient-header.component';
import { PatientPortalFacade } from '../../facades/patient-portal.facade';

@Component({
  selector: 'app-patient-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PatientSidebarComponent,
    PatientHeaderComponent
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
      <app-patient-sidebar
        [isOpen]="isSidebarOpen()"
        [patientName]="patientName()"
        [patientPhotoUrl]="patientPhotoUrl()"
        [unreadMessages]="unreadMessages()"
        (closeSidebar)="closeSidebar()"
      />

      <!-- Main content area -->
      <div class="lg:pl-64 flex flex-col min-h-screen">
        <!-- Header -->
        <app-patient-header
          [patientName]="patientName()"
          [patientPhotoUrl]="patientPhotoUrl()"
          [notificationCount]="notificationCount()"
          (toggleSidebar)="toggleSidebar()"
          (logout)="onLogout()"
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
          <p>Atlantis &copy; {{ currentYear }} - Portal del Paciente</p>
        </footer>
      </div>
    </div>
  `
})
export class PatientLayoutComponent {
  private readonly router = inject(Router);
  private readonly facade = inject(PatientPortalFacade);

  // Sidebar state
  isSidebarOpen = signal(false);

  // Patient data from facade
  patientName = this.facade.patientName;
  patientPhotoUrl = this.facade.patientPhotoUrl;
  unreadMessages = this.facade.unreadMessages;
  notificationCount = this.facade.notificationCount;

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
}
