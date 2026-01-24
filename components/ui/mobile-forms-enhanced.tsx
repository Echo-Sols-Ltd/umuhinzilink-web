'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  ChevronDown,
  Search,
  Calendar,
  Clock,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Enhanced Mobile Input with floating labels and smooth animations
interface EnhancedMobileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  variant?: 'default' | 'filled' | 'outlined';
  inputMode?: 'text' | 'email' | 'tel' | 'numeric' | 'decimal' | 'search' | 'url';
}

export const EnhancedMobileInput: React.FC<EnhancedMobileInputProps> = ({
  label,
  error,
  success,
  icon,
  rightIcon,
  onRightIconClick,
  variant = 'outlined',
  className,
  inputMode,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    props.onChange?.(e);
  };

  const isFloating = isFocused || hasValue;

  const baseClasses = cn(
    'w-full px-4 py-4 text-base',
    'transition-all duration-300 ease-out',
    'touch-manipulation',
    'min-h-[56px]', // Minimum touch target
    icon && 'pl-12',
    rightIcon && 'pr-12'
  );

  const variantClasses = {
    default: cn(
      'border-b-2 border-gray-300 dark:border-gray-600',
      'bg-transparent',
      'focus:border-green-500 dark:focus:border-green-400',
      'focus:outline-none',
      error && 'border-red-500 dark:border-red-400',
      success && 'border-green-500 dark:border-green-400'
    ),
    filled: cn(
      'bg-gray-100 dark:bg-gray-800',
      'border-b-2 border-transparent',
      'rounded-t-lg',
      'focus:bg-gray-50 dark:focus:bg-gray-750',
      'focus:border-green-500 dark:focus:border-green-400',
      'focus:outline-none',
      error && 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/10',
      success && 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/10'
    ),
    outlined: cn(
      'border-2 border-gray-300 dark:border-gray-600',
      'rounded-lg',
      'bg-white dark:bg-gray-900',
      'focus:border-green-500 dark:focus:border-green-400',
      'focus:outline-none',
      'focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20',
      error && 'border-red-500 dark:border-red-400 ring-2 ring-red-500/20',
      success && 'border-green-500 dark:border-green-400 ring-2 ring-green-500/20'
    )
  };

  return (
    <div className={cn('relative', className)}>
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 z-10">
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          ref={inputRef}
          className={cn(baseClasses, variantClasses[variant])}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleInputChange}
          inputMode={inputMode}
          {...props}
        />

        {/* Floating Label */}
        <motion.label
          htmlFor={props.id}
          className={cn(
            'absolute left-4 pointer-events-none',
            'transition-all duration-300 ease-out',
            'text-gray-500 dark:text-gray-400',
            icon && 'left-12',
            isFloating 
              ? 'top-2 text-xs font-medium text-green-600 dark:text-green-400'
              : 'top-1/2 transform -translate-y-1/2 text-base'
          )}
          animate={{
            y: isFloating ? -8 : 0,
            scale: isFloating ? 0.85 : 1,
            color: isFocused 
              ? 'rgb(34, 197, 94)' 
              : error 
                ? 'rgb(239, 68, 68)'
                : success
                  ? 'rgb(34, 197, 94)'
                  : 'rgb(107, 114, 128)'
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {label}
        </motion.label>

        {/* Right Icon */}
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1 touch-manipulation"
          >
            {rightIcon}
          </button>
        )}

        {/* Success/Error Icons */}
        <AnimatePresence>
          {(success || error) && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className={cn(
                'absolute right-4 top-1/2 transform -translate-y-1/2',
                rightIcon && 'right-12'
              )}
            >
              {success && <Check className="w-5 h-5 text-green-500" />}
              {error && <X className="w-5 h-5 text-red-500" />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced Mobile Password Input
interface EnhancedMobilePasswordInputProps extends Omit<EnhancedMobileInputProps, 'type' | 'rightIcon' | 'onRightIconClick'> {
  showStrengthIndicator?: boolean;
}

export const EnhancedMobilePasswordInput: React.FC<EnhancedMobilePasswordInputProps> = ({
  showStrengthIndicator = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);

  const calculateStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (showStrengthIndicator) {
      setStrength(calculateStrength(e.target.value));
    }
    props.onChange?.(e);
  };

  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div>
      <EnhancedMobileInput
        {...props}
        type={showPassword ? 'text' : 'password'}
        rightIcon={showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        onRightIconClick={() => setShowPassword(!showPassword)}
        onChange={handlePasswordChange}
      />
      
      {showStrengthIndicator && props.value && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-2"
        >
          <div className="flex space-x-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-2 flex-1 rounded-full transition-colors duration-300',
                  i < strength ? strengthColors[strength - 1] : 'bg-gray-200 dark:bg-gray-700'
                )}
              />
            ))}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Password strength: {strength > 0 ? strengthLabels[strength - 1] : 'Enter password'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

// Enhanced Mobile Select
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface EnhancedMobileSelectProps {
  label: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
  searchable?: boolean;
}

export const EnhancedMobileSelect: React.FC<EnhancedMobileSelectProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  placeholder = 'Select an option',
  className,
  searchable = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    if (searchable) {
      setFilteredOptions(
        options.filter(option =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, options, searchable]);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={cn('relative', className)}>
      {/* Select Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full px-4 py-4 text-left',
          'border-2 border-gray-300 dark:border-gray-600 rounded-lg',
          'bg-white dark:bg-gray-900',
          'focus:border-green-500 dark:focus:border-green-400',
          'focus:outline-none focus:ring-2 focus:ring-green-500/20',
          'transition-all duration-200',
          'min-h-[56px] touch-manipulation',
          error && 'border-red-500 dark:border-red-400 ring-2 ring-red-500/20',
          isOpen && 'border-green-500 dark:border-green-400 ring-2 ring-green-500/20'
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">
              {label}
            </div>
            <div className={cn(
              'text-base',
              selectedOption ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'
            )}>
              {selectedOption?.label || placeholder}
            </div>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        </div>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Options */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-60 overflow-hidden"
            >
              {/* Search */}
              {searchable && (
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search options..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                    />
                  </div>
                </div>
              )}

              {/* Options List */}
              <div className="max-h-48 overflow-y-auto">
                {filteredOptions.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      disabled={option.disabled}
                      className={cn(
                        'w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800',
                        'transition-colors duration-150',
                        'min-h-[48px] touch-manipulation',
                        option.value === value && 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
                        option.disabled && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option.label}</span>
                        {option.value === value && (
                          <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced Mobile Textarea
interface EnhancedMobileTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  success?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
  autoResize?: boolean;
}

export const EnhancedMobileTextarea: React.FC<EnhancedMobileTextareaProps> = ({
  label,
  error,
  success,
  maxLength,
  showCharCount = false,
  autoResize = true,
  className,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHasValue(e.target.value.length > 0);
    setCharCount(e.target.value.length);
    
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    
    props.onChange?.(e);
  };

  const isFloating = isFocused || hasValue;

  return (
    <div className={cn('relative', className)}>
      {/* Textarea Container */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          className={cn(
            'w-full px-4 py-4 text-base',
            'border-2 border-gray-300 dark:border-gray-600 rounded-lg',
            'bg-white dark:bg-gray-900',
            'focus:border-green-500 dark:focus:border-green-400',
            'focus:outline-none focus:ring-2 focus:ring-green-500/20',
            'transition-all duration-300 ease-out',
            'touch-manipulation resize-none',
            'min-h-[120px]',
            error && 'border-red-500 dark:border-red-400 ring-2 ring-red-500/20',
            success && 'border-green-500 dark:border-green-400 ring-2 ring-green-500/20'
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleTextareaChange}
          maxLength={maxLength}
          {...props}
        />

        {/* Floating Label */}
        <motion.label
          htmlFor={props.id}
          className={cn(
            'absolute left-4 pointer-events-none',
            'transition-all duration-300 ease-out',
            'text-gray-500 dark:text-gray-400',
            isFloating 
              ? 'top-2 text-xs font-medium text-green-600 dark:text-green-400'
              : 'top-4 text-base'
          )}
          animate={{
            y: isFloating ? 0 : 8,
            scale: isFloating ? 0.85 : 1,
            color: isFocused 
              ? 'rgb(34, 197, 94)' 
              : error 
                ? 'rgb(239, 68, 68)'
                : success
                  ? 'rgb(34, 197, 94)'
                  : 'rgb(107, 114, 128)'
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {label}
        </motion.label>
      </div>

      {/* Character Count */}
      {showCharCount && maxLength && (
        <div className="mt-2 text-right">
          <span className={cn(
            'text-sm',
            charCount > maxLength * 0.9 
              ? 'text-orange-600 dark:text-orange-400'
              : charCount === maxLength
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-500 dark:text-gray-400'
          )}>
            {charCount}/{maxLength}
          </span>
        </div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default {
  EnhancedMobileInput,
  EnhancedMobilePasswordInput,
  EnhancedMobileSelect,
  EnhancedMobileTextarea
};