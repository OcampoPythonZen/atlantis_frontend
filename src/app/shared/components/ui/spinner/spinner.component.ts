import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html'
})
export class SpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get sizeClass(): string {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8'
    };
    return sizes[this.size];
  }
}
