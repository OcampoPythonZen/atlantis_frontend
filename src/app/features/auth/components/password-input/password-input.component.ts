import { Component, Input, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [CommonModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PasswordInputComponent),
    multi: true
  }],
  templateUrl: './password-input.component.html'
})
export class PasswordInputComponent implements ControlValueAccessor {
  @Input() id = `password-${Math.random().toString(36).substr(2, 9)}`;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() error = '';

  value = '';
  disabled = false;
  showPassword = signal(false);

  onChange: any = () => {};
  onTouched: any = () => {};

  toggleVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
