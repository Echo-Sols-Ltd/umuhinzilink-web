'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import { validateForm, validateField, ValidationResult, type FormField } from '@/lib/validation';

interface EnhancedFormValidationOptions {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  showErrorsOnSubmit?: boolean;
  debounceMs?: number;
  showSuccessStates?: boolean;
  enableRealTimeValidation?: boolean;
}

interface FieldState {
  value: any;
  error?: string;
  touched: boolean;
  focused: boolean;
  success: boolean;
  loading: boolean;
  validating: boolean;
}

interface FormSubmissionState {
  isSubmitting: boolean;
  hasSubmitted: boolean;
  submitCount: number;
  lastSubmitTime?: number;
}

export function useEnhancedFormValidation(
  initialFields: Record<string, FormField>,
  options: EnhancedFormValidationOptions = {}
) {
  const {
    validateOnChange = true,
    validateOnBlur = true,
    showErrorsOnSubmit = true,
    debounceMs = 300,
    showSuccessStates = true,
    enableRealTimeValidation = true,
  } = options;

  // Core state
  const [fields, setFields] = useState(initialFields);
  const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>(() => {
    const states: Record<string, FieldState> = {};
    Object.keys(initialFields).forEach(key => {
      states[key] = {
        value: initialFields[key].value || '',
        touched: false,
        focused: false,
        success: false,
        loading: false,
        validating: false,
      };
    });
    return states;
  });

  const [submissionState, setSubmissionState] = useState<FormSubmissionState>({
    isSubmitting: false,
    hasSubmitted: false,
    submitCount: 0,
  });

  // Refs for debouncing
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});
  const validationPromises = useRef<Record<string, Promise<string | null>>>({});

  // Validate a single field with debouncing
  const validateFieldDebounced = useCallback(async (
    fieldName: string, 
    value: any,
    immediate = false
  ): Promise<string | null> => {
    const field = fields[fieldName];
    if (!field || !field.rules) return null;

    // Clear existing timer
    if (debounceTimers.current[fieldName]) {
      clearTimeout(debounceTimers.current[fieldName]);
    }

    // Set validating state
    setFieldStates(prev => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], validating: !immediate }
    }));

    const performValidation = async (): Promise<string | null> => {
      try {
        const error = validateField(value, field.rules!, field.label || fieldName);
        
        // Update field state
        setFieldStates(prev => ({
          ...prev,
          [fieldName]: {
            ...prev[fieldName],
            error: error || undefined,
            success: showSuccessStates && !error && value && String(value).length > 0,
            validating: false,
          }
        }));

        return error;
      } catch (err) {
        setFieldStates(prev => ({
          ...prev,
          [fieldName]: {
            ...prev[fieldName],
            error: 'Validation error occurred',
            success: false,
            validating: false,
          }
        }));
        return 'Validation error occurred';
      }
    };

    if (immediate) {
      return performValidation();
    }

    // Create debounced validation promise
    const validationPromise = new Promise<string | null>((resolve) => {
      debounceTimers.current[fieldName] = setTimeout(async () => {
        const result = await performValidation();
        resolve(result);
      }, debounceMs);
    });

    validationPromises.current[fieldName] = validationPromise;
    return validationPromise;
  }, [fields, debounceMs, showSuccessStates]);

  // Update field value
  const setFieldValue = useCallback(async (fieldName: string, value: any) => {
    // Update field value
    setFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value,
      },
    }));

    // Update field state
    setFieldStates(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value,
        error: undefined, // Clear error immediately when typing
        success: false, // Clear success state when typing
      }
    }));

    // Validate on change if enabled
    if ((validateOnChange || enableRealTimeValidation) && 
        (submissionState.hasSubmitted || fieldStates[fieldName]?.touched)) {
      await validateFieldDebounced(fieldName, value);
    }
  }, [validateOnChange, enableRealTimeValidation, submissionState.hasSubmitted, fieldStates, validateFieldDebounced]);

  // Set field as touched and focused
  const setFieldTouched = useCallback(async (fieldName: string, isTouched = true) => {
    setFieldStates(prev => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], touched: isTouched }
    }));

    // Validate on blur if enabled
    if (validateOnBlur && isTouched) {
      const currentValue = fieldStates[fieldName]?.value || fields[fieldName]?.value;
      await validateFieldDebounced(fieldName, currentValue, true);
    }
  }, [validateOnBlur, fieldStates, fields, validateFieldDebounced]);

  // Set field focus state
  const setFieldFocused = useCallback((fieldName: string, isFocused = true) => {
    setFieldStates(prev => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], focused: isFocused }
    }));
  }, []);

  // Set field loading state
  const setFieldLoading = useCallback((fieldName: string, isLoading = true) => {
    setFieldStates(prev => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], loading: isLoading }
    }));
  }, []);

  // Validate all fields
  const validateAllFields = useCallback(async (): Promise<ValidationResult> => {
    const errors: Record<string, string> = {};
    let isValid = true;

    // Wait for any pending validations
    await Promise.all(Object.values(validationPromises.current));

    // Validate all fields immediately
    const fieldValidationPromises = Object.keys(fields).map(async (fieldName) => {
      const field = fields[fieldName];
      if (field.rules) {
        const currentValue = fieldStates[fieldName]?.value ?? field.value;
        const error = await validateFieldDebounced(fieldName, currentValue, true);
        if (error) {
          errors[fieldName] = error;
          isValid = false;
        }
      }
    });

    await Promise.all(fieldValidationPromises);

    return { isValid, errors };
  }, [fields, fieldStates, validateFieldDebounced]);

  // Handle form submission
  const handleSubmit = useCallback(async (
    onSubmit: (values: Record<string, any>) => Promise<void> | void
  ) => {
    const submitTime = Date.now();
    
    setSubmissionState(prev => ({
      ...prev,
      isSubmitting: true,
      hasSubmitted: true,
      submitCount: prev.submitCount + 1,
      lastSubmitTime: submitTime,
    }));

    try {
      const validation = await validateAllFields();
      
      if (!validation.isValid) {
        // Mark all fields as touched to show errors
        setFieldStates(prev => {
          const newStates = { ...prev };
          Object.keys(fields).forEach(fieldName => {
            newStates[fieldName] = { ...newStates[fieldName], touched: true };
          });
          return newStates;
        });

        return { success: false, errors: validation.errors };
      }

      // Extract values from field states
      const values = Object.keys(fields).reduce((acc, key) => {
        acc[key] = fieldStates[key]?.value ?? fields[key].value;
        return acc;
      }, {} as Record<string, any>);

      await onSubmit(values);
      
      // Set success states for all fields
      if (showSuccessStates) {
        setFieldStates(prev => {
          const newStates = { ...prev };
          Object.keys(fields).forEach(fieldName => {
            if (newStates[fieldName] && !newStates[fieldName].error) {
              newStates[fieldName] = { ...newStates[fieldName], success: true };
            }
          });
          return newStates;
        });
      }

      return { success: true, errors: {} };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      return { success: false, errors: { _form: errorMessage } };
    } finally {
      setSubmissionState(prev => ({
        ...prev,
        isSubmitting: false,
      }));
    }
  }, [validateAllFields, fields, fieldStates, showSuccessStates]);

  // Reset form
  const reset = useCallback((newFields?: Record<string, FormField>) => {
    const fieldsToUse = newFields || initialFields;
    
    setFields(fieldsToUse);
    
    const newStates: Record<string, FieldState> = {};
    Object.keys(fieldsToUse).forEach(key => {
      newStates[key] = {
        value: fieldsToUse[key].value || '',
        touched: false,
        focused: false,
        success: false,
        loading: false,
        validating: false,
      };
    });
    setFieldStates(newStates);
    
    setSubmissionState({
      isSubmitting: false,
      hasSubmitted: false,
      submitCount: 0,
    });

    // Clear all timers
    Object.values(debounceTimers.current).forEach(timer => clearTimeout(timer));
    debounceTimers.current = {};
    validationPromises.current = {};
  }, [initialFields]);

  // Get field props for easy integration
  const getFieldProps = useCallback((fieldName: string) => {
    const field = fields[fieldName];
    const state = fieldStates[fieldName];

    if (!field || !state) {
      return {
        value: '',
        onChange: () => {},
        onBlur: () => {},
        onFocus: () => {},
        error: undefined,
        success: false,
        loading: false,
      };
    }

    return {
      name: fieldName,
      value: state.value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFieldValue(fieldName, e.target.value);
      },
      onBlur: () => {
        setFieldTouched(fieldName, true);
        setFieldFocused(fieldName, false);
      },
      onFocus: () => {
        setFieldFocused(fieldName, true);
      },
      error: (state.touched || submissionState.hasSubmitted) ? state.error : undefined,
      success: state.success,
      loading: state.loading || state.validating,
    };
  }, [fields, fieldStates, submissionState.hasSubmitted, setFieldValue, setFieldTouched, setFieldFocused]);

  // Computed values
  const isValid = useMemo(() => {
    return Object.values(fieldStates).every(state => !state.error);
  }, [fieldStates]);

  const values = useMemo(() => {
    return Object.keys(fields).reduce((acc, key) => {
      acc[key] = fieldStates[key]?.value ?? fields[key].value;
      return acc;
    }, {} as Record<string, any>);
  }, [fields, fieldStates]);

  const errors = useMemo(() => {
    const result: Record<string, string> = {};
    Object.keys(fieldStates).forEach(key => {
      const state = fieldStates[key];
      if (state.error && (state.touched || submissionState.hasSubmitted)) {
        result[key] = state.error;
      }
    });
    return result;
  }, [fieldStates, submissionState.hasSubmitted]);

  const isDirty = useMemo(() => {
    return Object.keys(fields).some(key => {
      const initialValue = initialFields[key]?.value;
      const currentValue = fieldStates[key]?.value;
      return initialValue !== currentValue;
    });
  }, [fields, fieldStates, initialFields]);

  const isValidating = useMemo(() => {
    return Object.values(fieldStates).some(state => state.validating);
  }, [fieldStates]);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    Object.values(debounceTimers.current).forEach(timer => clearTimeout(timer));
  }, []);

  return {
    // State
    fields,
    fieldStates,
    submissionState,
    isValid,
    isDirty,
    values,
    errors,
    isValidating,

    // Actions
    setFieldValue,
    setFieldTouched,
    setFieldFocused,
    setFieldLoading,
    handleSubmit,
    reset,
    validateAllFields,
    validateFieldDebounced,
    getFieldProps,
    cleanup,

    // Utilities
    setFields,
    setFieldStates,
  };
}

export default useEnhancedFormValidation;