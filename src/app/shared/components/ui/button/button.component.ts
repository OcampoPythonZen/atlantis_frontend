import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html'
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'ghost' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() loading = false;

  get buttonClasses(): string {
    const baseClasses = 'font-medium rounded-lg';

    const variantClasses = {
      primary: 'bg-primary-500 hover:bg-primary-600 text-dark-950 focus:ring-primary-500/50',
      secondary: 'bg-dark-100 dark:bg-dark-700 hover:bg-dark-200 dark:hover:bg-dark-600 text-dark-800 dark:text-dark-100 focus:ring-dark-400/50',
      ghost: 'bg-transparent hover:bg-dark-100 dark:hover:bg-dark-800 text-dark-600 dark:text-dark-400 focus:ring-dark-400/50'
    };

    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3',
      lg: 'px-8 py-4 text-lg'
    };

    return `${baseClasses} ${variantClasses[this.variant]} ${sizeClasses[this.size]}`;
  }
}
