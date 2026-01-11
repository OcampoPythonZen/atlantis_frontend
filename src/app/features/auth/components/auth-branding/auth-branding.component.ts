import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-branding',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-branding.component.html'
})
export class AuthBrandingComponent {
  currentYear = new Date().getFullYear();
}
