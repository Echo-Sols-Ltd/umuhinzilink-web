'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  X, 
  Check, 
  AlertCircle, 
  Camera, 
  MapPin, 
  Calendar,
  DollarSign,
  Package,
  Info,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EnhancedButton } from '@/components/ui/animations/enhanced-button';
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/animations/enhanced-card';
import { ProgressiveImage } from '@/components/ui/progressive-loading';

// Enhanced Input Component with floating labels and validation
interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: boolean;
  helpText?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
}

const EnhancedInput: React.FC<EnhancedInputProps> = ({
  label,
  error,
  success,
  helpText,
  icon,
  variant = 'outlined',
  className,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value);
    props.onChange?.(e);
  };

  const variantClasses = {
    default: 'border-gray-300 bg-white',
    filled: 'border-transparent bg-gray-100',
    outlined: 'border-2 border-gray-300 bg-transparent'
  };

  const getStateClasses = () => {
    if (error) return 'border-red-500 focus:border-red-500 focus:ring-red-500/20';
    if (success) return 'border-green-500 focus:border-green-500 focus:ring-green-500/20';
    return 'focus:border-[var(--primary-green)] focus:ring-[var(--primary-green)]/20';
  };

  return (
    <div className="relative">
      <div className={cn(
        'relative flex items-center',
        variantClasses[variant],
        getStateClasses(),
        'rounded-lg transition-all duration-200',
        className
      )}>
        {icon && (
          <div className="absolute left-3 text-gray-500">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={cn(
            'w-full px-3 py-3 text-sm bg-transparent border-0 outline-none',
            icon && 'pl-10',
            'placeholder-transparent peer'
          )}
          placeholder={label}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={handleChange}
        />
        <label
          className={cn(
            'absolute left-3 text-sm transition-all duration-200 pointer-events-none',
            icon && 'left-10',
            'peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500',
            'peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1',
            (focused || hasValue) && '-top-2 left-2 text-xs bg-white px-1',
            error ? 'text-red-500' : success ? 'text-green-500' : 'text-[var(--primary-green)]'
          )}
        >
          {label}
        </label>
        {success && (
          <div className="absolute right-3 text-green-500">
            <Check size={16} />
          </div>
        )}
        {error && (
          <div className="absolute right-3 text-red-500">
            <AlertCircle size={16} />
          </div>
        )}
      </div>
      {(error || helpText) && (
        <div className="mt-1 text-xs">
          {error && <span className="text-red-500">{error}</span>}
          {!error && helpText && <span className="text-gray-500">{helpText}</span>}
        </div>
      )}
    </div>
  );
};