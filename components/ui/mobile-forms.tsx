'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { TouchButton } from './mobile-first-patterns';
import { Eye, EyeOff, ChevronDown, Check, X, AlertCircle } from 'lucide-react';

// Mobile-optimized input field with touch-friendly design
interface MobileInputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'search';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel' | 'numeric' | 'decimal' | 'search';
}

export function MobileInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  autoComplete,
  inputMode,
}: MobileInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <input
          ref={inputRef}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          inputMode={inputMode}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full min-h-[48px] px-4 py-3 text-base
            border-2 rounded-organic
            transition-all duration-200
            ${isFocused 
              ? 'border-agricultural-primary ring-2 ring-agricultural-primary ring-opacity-20' 
              : error 
                ? 'border-red-500' 
                : 'border-gray-300 hover:border-gray-400'
            }
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            focus:outline-none
            placeholder:text-gray-400
            touch-manipulation
          `}
        />
        
        {/* Password visibility toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      
      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

// Mobile-optimized textarea
interface MobileTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
}

export function MobileTextarea({
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  rows = 4,
  maxLength,
  className = '',
}: MobileTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {maxLength && (
          <span className="text-xs text-gray-500">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          w-full px-4 py-3 text-base
          border-2 rounded-organic
          transition-all duration-200
          resize-none
          ${isFocused 
            ? 'border-agricultural-primary ring-2 ring-agricultural-primary ring-opacity-20' 
            : error 
              ? 'border-red-500' 
              : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          focus:outline-none
          placeholder:text-gray-400
          touch-manipulation
        `}
      />
      
      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

// Mobile-optimized select dropdown
interface MobileSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function MobileSelect({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  error,
  required = false,
  disabled = false,
  className = '',
}: MobileSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isMobile = useIsMobile();

  const selectedOption = options.find(option => option.value === value);

  // Use native select on mobile for better UX
  if (isMobile) {
    return (
      <div className={`space-y-2 ${className}`}>
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`
              w-full min-h-[48px] px-4 py-3 text-base
              border-2 rounded-organic
              transition-all duration-200
              appearance-none
              ${isFocused 
                ? 'border-agricultural-primary ring-2 ring-agricultural-primary ring-opacity-20' 
                : error 
                  ? 'border-red-500' 
                  : 'border-gray-300 hover:border-gray-400'
              }
              ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
              focus:outline-none
              touch-manipulation
            `}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
        
        {error && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  // Custom dropdown for desktop
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full min-h-[48px] px-4 py-3 text-base text-left
            border-2 rounded-organic
            transition-all duration-200
            flex items-center justify-between
            ${isFocused 
              ? 'border-agricultural-primary ring-2 ring-agricultural-primary ring-opacity-20' 
              : error 
                ? 'border-red-500' 
                : 'border-gray-300 hover:border-gray-400'
            }
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            focus:outline-none
          `}
        >
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-organic shadow-lg z-20 max-h-60 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  disabled={option.disabled}
                  className={`
                    w-full px-4 py-3 text-left text-base
                    transition-colors duration-150
                    ${option.value === value 
                      ? 'bg-agricultural-50 text-agricultural-700' 
                      : 'text-gray-900 hover:bg-gray-50'
                    }
                    ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    first:rounded-t-organic last:rounded-b-organic
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      
      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

// Mobile-optimized checkbox
interface MobileCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function MobileCheckbox({
  label,
  checked,
  onChange,
  disabled = false,
  error,
  className = '',
}: MobileCheckboxProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="flex items-start space-x-3 cursor-pointer">
        <div className="relative flex-shrink-0 mt-1">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="sr-only"
          />
          <div
            className={`
              w-6 h-6 rounded border-2 transition-all duration-200
              flex items-center justify-center
              ${checked 
                ? 'bg-agricultural-primary border-agricultural-primary' 
                : 'bg-white border-gray-300 hover:border-gray-400'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${error ? 'border-red-500' : ''}
            `}
          >
            {checked && <Check className="w-4 h-4 text-white" />}
          </div>
        </div>
        <span className={`text-base ${disabled ? 'text-gray-400' : 'text-gray-700'} leading-relaxed`}>
          {label}
        </span>
      </label>
      
      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm ml-9">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

// Mobile-optimized radio group
interface MobileRadioGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  error?: string;
  required?: boolean;
  className?: string;
}

export function MobileRadioGroup({
  label,
  value,
  onChange,
  options,
  error,
  required = false,
  className = '',
}: MobileRadioGroupProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="space-y-3">
        {options.map((option) => (
          <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
            <div className="relative flex-shrink-0 mt-1">
              <input
                type="radio"
                name={label}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
                disabled={option.disabled}
                className="sr-only"
              />
              <div
                className={`
                  w-6 h-6 rounded-full border-2 transition-all duration-200
                  flex items-center justify-center
                  ${value === option.value 
                    ? 'bg-agricultural-primary border-agricultural-primary' 
                    : 'bg-white border-gray-300 hover:border-gray-400'
                  }
                  ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  ${error ? 'border-red-500' : ''}
                `}
              >
                {value === option.value && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </div>
            <span className={`text-base ${option.disabled ? 'text-gray-400' : 'text-gray-700'} leading-relaxed`}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
      
      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

// Mobile-optimized form container
interface MobileFormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg';
}

export function MobileForm({
  children,
  onSubmit,
  className = '',
  spacing = 'md',
}: MobileFormProps) {
  const spacingClasses = {
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8',
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`${spacingClasses[spacing]} ${className}`}
      noValidate
    >
      {children}
    </form>
  );
}