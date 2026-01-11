import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-strength',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './password-strength.component.html'
})
export class PasswordStrengthComponent implements OnChanges {
  @Input() password = '';

  strength = 0;
  strengthText = '';
  strengthTextClass = '';

  ngOnChanges(): void {
    this.calculateStrength();
  }

  private calculateStrength(): void {
    if (!this.password) {
      this.strength = 0;
      return;
    }

    let score = 0;

    if (this.password.length >= 8) score++;
    if (/[a-z]/.test(this.password) && /[A-Z]/.test(this.password)) score++;
    if (/[0-9]/.test(this.password)) score++;
    if (/[^A-Za-z0-9]/.test(this.password)) score++;

    this.strength = score;

    const messages = ['Muy débil', 'Débil', 'Aceptable', 'Fuerte'];
    const classes = [
      'text-red-600 dark:text-red-400',
      'text-orange-600 dark:text-orange-400',
      'text-yellow-600 dark:text-yellow-400',
      'text-green-600 dark:text-green-400'
    ];

    this.strengthText = messages[score - 1] || '';
    this.strengthTextClass = classes[score - 1] || '';
  }
}
