export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  email?: boolean;
  phone?: boolean;
  custom?: (value: any) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FormField {
  value: any;
  rules?: ValidationRule;
  label?: string;
}

export function validateField(value: any, rules: ValidationRule, label = 'Field'): string | null {
  if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return `${label} is required`;
  }

  if (!value && !rules.required) {
    return null; // Optional field with no value is valid
  }

  if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
    return `${label} must be at least ${rules.minLength} characters long`;
  }

  if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
    return `${label} must be no more than ${rules.maxLength} characters long`;
  }

  if (rules.min && typeof value === 'number' && value < rules.min) {
    return `${label} must be at least ${rules.min}`;
  }

  if (rules.max && typeof value === 'number' && value > rules.max) {
    return `${label} must be no more than ${rules.max}`;
  }

  if (rules.email && typeof value === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return `${label} must be a valid email address`;
    }
  }

  if (rules.phone && typeof value === 'string') {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
      return `${label} must be a valid phone number`;
    }
  }

  if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    return `${label} format is invalid`;
  }

  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      return customError;
    }
  }

  return null;
}

export function validateForm(fields: Record<string, FormField>): ValidationResult {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [fieldName, field] of Object.entries(fields)) {
    if (field.rules) {
      const error = validateField(field.value, field.rules, field.label || fieldName);
      if (error) {
        errors[fieldName] = error;
        isValid = false;
      }
    }
  }

  return { isValid, errors };
}

// Common validation rules
export const commonRules = {
  required: { required: true },
  email: { required: true, email: true },
  phone: { required: true, phone: true },
  password: { 
    required: true, 
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    custom: (value: string) => {
      if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
      if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
      if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
      if (!/(?=.*[@$!%*?&])/.test(value)) return 'Password must contain at least one special character';
      return null;
    }
  },
  positiveNumber: { 
    required: true, 
    min: 0.01,
    custom: (value: any) => {
      const num = parseFloat(value);
      if (isNaN(num)) return 'Must be a valid number';
      return null;
    }
  },
  nonNegativeInteger: {
    required: true,
    min: 0,
    custom: (value: any) => {
      const num = parseInt(value);
      if (isNaN(num) || num !== parseFloat(value)) return 'Must be a valid whole number';
      return null;
    }
  },
};

// Form field component helpers
export function getFieldError(fieldName: string, errors: Record<string, string>): string | undefined {
  return errors[fieldName];
}

export function hasFieldError(fieldName: string, errors: Record<string, string>): boolean {
  return !!errors[fieldName];
}

export function getFieldClassName(
  fieldName: string, 
  errors: Record<string, string>, 
  baseClassName = '',
  errorClassName = 'border-red-500 focus:border-red-500 focus:ring-red-500'
): string {
  return hasFieldError(fieldName, errors) 
    ? `${baseClassName} ${errorClassName}`.trim()
    : baseClassName;
}