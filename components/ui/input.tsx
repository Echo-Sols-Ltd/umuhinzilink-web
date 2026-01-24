import * as React from 'react';
import { Eye, EyeOff, CheckCircle, AlertCircle, Info } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.ComponentProps<'input'> {
  label?: string;
  error?: string;
  success?: boolean;
  loading?: boolean;
  helpText?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
  showPasswordToggle?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    label,
    error,
    success,
    loading,
    helpText,
    icon,
    variant = 'default',
    showPasswordToggle = false,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);
    
    const inputType = showPasswordToggle && type === 'password' 
      ? (showPassword ? 'text' : 'password') 
      : type;
    
    const hasError = !!error;
    const hasSuccess = success && !hasError;
    
    React.useEffect(() => {
      if (props.value || props.defaultValue) {
        setHasValue(true);
      }
    }, [props.value, props.defaultValue]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };
    
    const baseInputClasses = cn(
      'peer w-full bg-transparent px-3 py-3 text-base transition-all duration-200 placeholder:text-transparent focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
      // Variant styles
      variant === 'filled' && 'bg-[var(--gray-50)] dark:bg-[var(--gray-800)]',
      variant === 'outlined' && 'border-2',
      variant === 'default' && 'border border-input',
      // State styles
      hasError && 'border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]/20',
      hasSuccess && 'border-[var(--success)] focus:border-[var(--success)] focus:ring-[var(--success)]/20',
      !hasError && !hasSuccess && 'border-input focus:border-[var(--primary-green)] focus:ring-[var(--primary-green)]/20',
      // Focus styles
      'focus:ring-2 focus:ring-offset-0',
      // Rounded corners
      'rounded-lg',
      // Icon padding
      icon && 'pl-10',
      (showPasswordToggle && type === 'password') && 'pr-10',
      className
    );
    
    const labelClasses = cn(
      'absolute left-3 top-3 text-sm text-muted-foreground transition-all duration-200 pointer-events-none',
      // Floating label animation
      (isFocused || hasValue) && 'top-1 text-xs',
      // Icon offset
      icon && 'left-10',
      // State colors
      hasError && 'text-[var(--error)]',
      hasSuccess && 'text-[var(--success)]',
      isFocused && !hasError && !hasSuccess && 'text-[var(--primary-green)]'
    );
    
    return (
      <div className="relative w-full">
        <div className="relative">
          {/* Left Icon */}
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          
          {/* Input Field */}
          <input
            type={inputType}
            className={baseInputClasses}
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            onChange={handleInputChange}
            {...props}
          />
          
          {/* Floating Label */}
          {label && (
            <label className={labelClasses}>
              {label}
            </label>
          )}
          
          {/* Right Icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Loading Spinner */}
            {loading && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--primary-green)] border-t-transparent" />
            )}
            
            {/* Success Icon */}
            {hasSuccess && !loading && (
              <CheckCircle className="h-4 w-4 text-[var(--success)]" />
            )}
            
            {/* Error Icon */}
            {hasError && !loading && (
              <AlertCircle className="h-4 w-4 text-[var(--error)]" />
            )}
            
            {/* Password Toggle */}
            {showPasswordToggle && type === 'password' && !loading && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Help Text */}
        {helpText && !error && (
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Info className="h-3 w-3" />
            {helpText}
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="mt-1 flex items-center gap-1 text-xs text-[var(--error)] animate-fade-in">
            <AlertCircle className="h-3 w-3" />
            {error}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
