'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Eye, 
  EyeOff, 
  Loader2,
  HelpCircle,
  X,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFormValidation, FormFieldError } from '@/hooks/useFormValidation';
import { ValidationRule } from '@/lib/validation';

// Enhanced Form Field Props
export interface EnhancedFormFieldProps extends React.ComponentProps<'input'> {
  label: string;
  name?: string;
  error?: string;
  success?: boolean;
  loading?: boolean;
  helpText?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
  showPasswordToggle?: boolean;
  validationRules?: ValidationRule;
  onValidationChange?: (isValid: boolean, error?: string) => void;
  showSuccessAnimation?: boolean;
  contextualHelp?: {
    title: string;
    examples: string[];
    tips: string[];
  };
}

// Animation variants
const fieldVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

const errorVariants = {
  initial: { opacity: 0, x: -10, scale: 0.95 },
  animate: { 
    opacity: 1, 
    x: 0, 
    scale: 1
  },
  exit: { opacity: 0, x: -10, scale: 0.95 }
};

const successVariants = {
  initial: { opacity: 0, scale: 0 },
  animate: { 
    opacity: 1, 
    scale: 1
  },
  exit: { opacity: 0, scale: 0 }
};

const shakeVariants = {
  shake: {
    x: [-10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
  }
};

// Enhanced Form Field Component
export const EnhancedFormField = React.forwardRef<HTMLInputElement, EnhancedFormFieldProps>(
  ({ 
    className, 
    type, 
    label,
    name,
    error,
    success,
    loading,
    helpText,
    icon,
    variant = 'default',
    showPasswordToggle = false,
    validationRules,
    onValidationChange,
    showSuccessAnimation = true,
    contextualHelp,
    onFocus,
    onBlur,
    onChange,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const [showContextualHelp, setShowContextualHelp] = useState(false);
    const [shouldShake, setShouldShake] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    
    const inputType = showPasswordToggle && type === 'password' 
      ? (showPassword ? 'text' : 'password') 
      : type;
    
    const hasError = !!error;
    const hasSuccess = success && !hasError && !loading;
    
    // Update hasValue when props change
    useEffect(() => {
      const currentValue = props.value || props.defaultValue || '';
      setHasValue(String(currentValue).length > 0);
    }, [props.value, props.defaultValue]);

    // Trigger shake animation on error
    useEffect(() => {
      if (hasError) {
        setShouldShake(true);
        const timer = setTimeout(() => setShouldShake(false), 500);
        return () => clearTimeout(timer);
      }
    }, [hasError]);
    
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setHasValue(value.length > 0);
      onChange?.(e);
    }, [onChange]);

    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (hasError && contextualHelp) {
        setShowContextualHelp(true);
      }
      onFocus?.(e);
    }, [onFocus, hasError, contextualHelp]);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setShowContextualHelp(false);
      onBlur?.(e);
    }, [onBlur]);
    
    const baseInputClasses = cn(
      'peer w-full bg-transparent px-4 py-3 text-base transition-all duration-300 placeholder:text-transparent focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
      // Variant styles
      variant === 'filled' && 'bg-[var(--gray-50)] dark:bg-[var(--gray-800)]',
      variant === 'outlined' && 'border-2',
      variant === 'default' && 'border border-input',
      // State styles with enhanced colors
      hasError && 'border-[var(--error)] focus:border-[var(--error)] focus:ring-4 focus:ring-[var(--error)]/10',
      hasSuccess && 'border-[var(--success)] focus:border-[var(--success)] focus:ring-4 focus:ring-[var(--success)]/10',
      !hasError && !hasSuccess && 'border-input focus:border-[var(--primary-green)] focus:ring-4 focus:ring-[var(--primary-green)]/10',
      // Enhanced focus styles
      'focus:ring-offset-0',
      // Rounded corners
      'rounded-xl',
      // Icon padding
      icon && 'pl-12',
      (showPasswordToggle && type === 'password') && 'pr-12',
      (hasSuccess || hasError || loading) && 'pr-12',
      className
    );
    
    const labelClasses = cn(
      'absolute left-4 top-3 text-sm text-muted-foreground transition-all duration-300 pointer-events-none select-none',
      // Floating label animation with enhanced positioning
      (isFocused || hasValue) && 'top-1 text-xs font-medium',
      // Icon offset
      icon && 'left-12',
      // State colors
      hasError && 'text-[var(--error)]',
      hasSuccess && 'text-[var(--success)]',
      isFocused && !hasError && !hasSuccess && 'text-[var(--primary-green)]'
    );

    const containerClasses = cn(
      'relative w-full',
      shouldShake && 'animate-shake'
    );
    
    return (
      <motion.div 
        className={containerClasses}
        variants={fieldVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="relative">
          {/* Left Icon */}
          {icon && (
            <motion.div 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground z-10"
              initial={{ opacity: 0.7 }}
              animate={{ 
                opacity: isFocused ? 1 : 0.7,
                color: hasError ? 'var(--error)' : hasSuccess ? 'var(--success)' : undefined
              }}
              transition={{ duration: 0.2 }}
            >
              {icon}
            </motion.div>
          )}
          
          {/* Input Field */}
          <input
            ref={ref || inputRef}
            type={inputType}
            name={name}
            className={baseInputClasses}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleInputChange}
            {...props}
          />
          
          {/* Floating Label */}
          {label && (
            <motion.label 
              className={labelClasses}
              initial={false}
              animate={{
                y: (isFocused || hasValue) ? -8 : 0,
                scale: (isFocused || hasValue) ? 0.85 : 1,
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {label}
            </motion.label>
          )}
          
          {/* Right Icons Container */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Loading Spinner */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Loader2 className="h-4 w-4 animate-spin text-[var(--primary-green)]" />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Success Icon with Animation */}
            <AnimatePresence>
              {hasSuccess && showSuccessAnimation && !loading && (
                <motion.div
                  variants={successVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <CheckCircle className="h-4 w-4 text-[var(--success)]" />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Error Icon */}
            <AnimatePresence>
              {hasError && !loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <AlertCircle className="h-4 w-4 text-[var(--error)]" />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Password Toggle */}
            {showPasswordToggle && type === 'password' && !loading && (
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </motion.button>
            )}
          </div>
        </div>
        
        {/* Help Text */}
        <AnimatePresence>
          {helpText && !error && !showContextualHelp && (
            <motion.div 
              className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Info className="h-3 w-3 flex-shrink-0" />
              <span>{helpText}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Contextual Help */}
        <AnimatePresence>
          {showContextualHelp && contextualHelp && (
            <motion.div
              className="mt-3 p-4 bg-[var(--bg-info)] border border-[var(--info)]/20 rounded-lg"
              variants={errorVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="flex items-start gap-2">
                <HelpCircle className="h-4 w-4 text-[var(--info)] flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-[var(--info)]">
                    {contextualHelp.title}
                  </h4>
                  {contextualHelp.examples.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Examples:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {contextualHelp.examples.map((example, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <Check className="h-3 w-3 text-[var(--success)]" />
                            <code className="bg-muted px-1 py-0.5 rounded text-xs">
                              {example}
                            </code>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {contextualHelp.tips.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Tips:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {contextualHelp.tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <Info className="h-3 w-3 text-[var(--info)] flex-shrink-0 mt-0.5" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Error Message with Animation */}
        <AnimatePresence>
          {error && (
            <motion.div 
              className="mt-2 flex items-center gap-2 text-xs text-[var(--error)]"
              variants={errorVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <AlertCircle className="h-3 w-3 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

EnhancedFormField.displayName = 'EnhancedFormField';

// Enhanced Form Container
export interface EnhancedFormProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  loading?: boolean;
  className?: string;
}

export const EnhancedForm: React.FC<EnhancedFormProps> = ({
  children,
  onSubmit,
  loading,
  className
}) => {
  return (
    <motion.form
      className={cn('space-y-6', className)}
      onSubmit={onSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <fieldset disabled={loading} className="space-y-6">
        {children}
      </fieldset>
    </motion.form>
  );
};

// Form Success Animation Component
export interface FormSuccessAnimationProps {
  show: boolean;
  message: string;
  onComplete?: () => void;
}

export const FormSuccessAnimation: React.FC<FormSuccessAnimationProps> = ({
  show,
  message,
  onComplete
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={() => {
            if (!show) onComplete?.();
          }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-md mx-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="text-center space-y-4">
              <motion.div
                className="w-16 h-16 bg-[var(--success)] rounded-full flex items-center justify-center mx-auto"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 600 }}
                >
                  <CheckCircle className="h-8 w-8 text-white" />
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Success!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {message}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnhancedFormField;