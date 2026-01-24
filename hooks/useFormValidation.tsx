'use client';

import { useState, useCallback, useMemo } from 'react';
import { validateForm, ValidationResult, FormField } from '@/lib/validation';

interface UseFormValidationOptions {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  showErrorsOnSubmit?: boolean;
}

export function useFormValidation(
  initialFields: Record<string, FormField>,
  options: UseFormValidationOptions = {}
) {
  const {
    validateOnChange = false,
    validateOnBlur = true,
    showErrorsOnSubmit = true,
  } = options;

  const [fields, setFields] = useState(initialFields);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Validate all fields
  const validate = useCallback((): ValidationResult => {
    return validateForm(fields);
  }, [fields]);

  // Validate a single field
  const validateField = useCallback((fieldName: string) => {
    const field = fields[fieldName];
    if (!field || !field.rules) return null;

    const { validateField: validateSingleField } = require('@/lib/validation');
    return validateSingleField(field.value, field.rules, field.label || fieldName);
  }, [fields]);

  // Update field value
  const setFieldValue = useCallback((fieldName: string, value: any) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value,
      },
    }));

    // Validate on change if enabled
    if (validateOnChange || (hasSubmitted && showErrorsOnSubmit)) {
      const error = validateField(fieldName);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error || '',
      }));
    }
  }, [validateOnChange, hasSubmitted, showErrorsOnSubmit, validateField]);

  // Mark field as touched
  const setFieldTouched = useCallback((fieldName: string, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: isTouched,
    }));

    // Validate on blur if enabled
    if (validateOnBlur && isTouched) {
      const error = validateField(fieldName);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error || '',
      }));
    }
  }, [validateOnBlur, validateField]);

  // Handle form submission
  const handleSubmit = useCallback(async (
    onSubmit: (values: Record<string, any>) => Promise<void> | void
  ) => {
    setHasSubmitted(true);
    setIsSubmitting(true);

    try {
      const validation = validate();
      
      if (showErrorsOnSubmit) {
        setErrors(validation.errors);
      }

      if (!validation.isValid) {
        return { success: false, errors: validation.errors };
      }

      // Extract values from fields
      const values = Object.keys(fields).reduce((acc, key) => {
        acc[key] = fields[key].value;
        return acc;
      }, {} as Record<string, any>);

      await onSubmit(values);
      return { success: true, errors: {} };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      return { success: false, errors: { _form: errorMessage } };
    } finally {
      setIsSubmitting(false);
    }
  }, [validate, showErrorsOnSubmit, fields]);

  // Reset form
  const reset = useCallback((newFields?: Record<string, FormField>) => {
    setFields(newFields || initialFields);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setHasSubmitted(false);
  }, [initialFields]);

  // Get field props for easy integration with form inputs
  const getFieldProps = useCallback((fieldName: string) => {
    const field = fields[fieldName];
    const error = errors[fieldName];
    const isTouched = touched[fieldName];

    return {
      value: field?.value || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFieldValue(fieldName, e.target.value);
      },
      onBlur: () => {
        setFieldTouched(fieldName, true);
      },
      error: (isTouched || hasSubmitted) ? error : undefined,
      hasError: Boolean((isTouched || hasSubmitted) && error),
    };
  }, [fields, errors, touched, hasSubmitted, setFieldValue, setFieldTouched]);

  // Computed values
  const isValid = useMemo(() => {
    const validation = validate();
    return validation.isValid;
  }, [validate]);

  const values = useMemo(() => {
    return Object.keys(fields).reduce((acc, key) => {
      acc[key] = fields[key].value;
      return acc;
    }, {} as Record<string, any>);
  }, [fields]);

  const isDirty = useMemo(() => {
    return Object.keys(fields).some(key => {
      const initialValue = initialFields[key]?.value;
      const currentValue = fields[key]?.value;
      return initialValue !== currentValue;
    });
  }, [fields, initialFields]);

  return {
    // State
    fields,
    errors,
    touched,
    isSubmitting,
    hasSubmitted,
    isValid,
    isDirty,
    values,

    // Actions
    setFieldValue,
    setFieldTouched,
    handleSubmit,
    reset,
    validate,
    validateField,
    getFieldProps,

    // Utilities
    setErrors,
    setFields,
  };
}

// Helper component for form field errors
export function FormFieldError({ error, className = '' }: { error?: string; className?: string }) {
  if (!error) return null;

  return (
    <p className={`text-sm text-red-600 mt-1 ${className}`}>
      {error}
    </p>
  );
}

// Helper component for form field wrapper
export function FormField({ 
  label, 
  error, 
  required, 
  children, 
  className = '' 
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      <FormFieldError error={error} />
    </div>
  );
}