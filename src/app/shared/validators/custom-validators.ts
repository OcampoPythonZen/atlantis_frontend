import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static passwordStrength(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const minLength = value.length >= 8;

    const valid = hasUpperCase && hasLowerCase && hasNumeric && minLength;

    return valid ? null : {
      passwordStrength: {
        hasUpperCase,
        hasLowerCase,
        hasNumeric,
        minLength
      }
    };
  }

  static passwordsMatch(passwordField: string, confirmField: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get(passwordField)?.value;
      const confirm = group.get(confirmField)?.value;

      if (password !== confirm) {
        group.get(confirmField)?.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      }

      return null;
    };
  }

  static termsAccepted(control: AbstractControl): ValidationErrors | null {
    return control.value === true ? null : { termsRequired: true };
  }
}

export const VALIDATION_MESSAGES: Record<string, Record<string, string>> = {
  email: {
    required: 'El correo electrónico es requerido',
    email: 'Ingresa un correo electrónico válido'
  },
  password: {
    required: 'La contraseña es requerida',
    minlength: 'La contraseña debe tener al menos 8 caracteres',
    passwordStrength: 'La contraseña debe contener mayúsculas, minúsculas y números'
  },
  confirmPassword: {
    required: 'Confirma tu contraseña',
    passwordMismatch: 'Las contraseñas no coinciden'
  },
  fullName: {
    required: 'El nombre completo es requerido',
    minlength: 'El nombre debe tener al menos 2 caracteres'
  },
  acceptTerms: {
    termsRequired: 'Debes aceptar los términos y condiciones'
  }
};

export function getValidationMessage(fieldName: string, errors: ValidationErrors): string {
  const field = VALIDATION_MESSAGES[fieldName];
  if (!field) return '';

  const errorKey = Object.keys(errors)[0];
  return field[errorKey] || '';
}
