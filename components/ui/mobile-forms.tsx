'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Check, Search, Camera, Upload } from 'lucide-react';
import { TouchOptimizedButton } from './responsive-layout';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
  className?: string;
  disabled?: boolean;
}

export function MobileSelect({
  value,
  onValueChange,
  placeholder = 'Select an option',
  options,
  className = '',
  disabled = false,
}: MobileSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
    setSearchQuery('');
  };

  if (!isMobile) {
    // Fallback to regular select on desktop
    return (
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        disabled={disabled}
        className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${className}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <>
      <TouchOptimizedButton
        onClick={() => !disabled && setIsOpen(true)}
        variant="outline"
        disabled={disabled}
        className={`w-full justify-between h-12 ${className}`}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </TouchOptimizedButton>

      {/* Full Screen Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{placeholder}</h3>
            <TouchOptimizedButton
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
            >
              <X className="w-6 h-6" />
            </TouchOptimizedButton>
          </div>

          {/* Search */}
          {options.length > 10 && (
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search options..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          )}

          {/* Options */}
          <div className="flex-1 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No options found
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredOptions.map((option) => (
                  <TouchOptimizedButton
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    variant="ghost"
                    className="w-full justify-between h-14 px-4 rounded-none"
                  >
                    <span className="text-left">{option.label}</span>
                    {value === option.value && (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                  </TouchOptimizedButton>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

interface MobileTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  className?: string;
  disabled?: boolean;
}

export function MobileTextArea({
  value,
  onChange,
  placeholder = 'Enter text...',
  maxLength,
  rows = 4,
  className = '',
  disabled = false,
}: MobileTextAreaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className={`relative ${className}`}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full p-4 border rounded-lg resize-none transition-colors ${
          isFocused
            ? 'border-green-500 ring-2 ring-green-500 ring-opacity-20'
            : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        style={{ minHeight: `${rows * 1.5}rem` }}
      />
      
      {maxLength && (
        <div className="absolute bottom-2 right-2 text-xs text-gray-500">
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
}

interface MobileFileUploadProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  className?: string;
  disabled?: boolean;
}

export function MobileFileUpload({
  onFileSelect,
  accept = 'image/*',
  multiple = false,
  maxSize = 5,
  className = '',
  disabled = false,
}: MobileFileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      onFileSelect(validFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const openCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 bg-gray-50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className="w-12 h-12 text-gray-400" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isMobile ? 'Tap to upload files' : 'Drop files here or click to upload'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {accept.includes('image') ? 'Images' : 'Files'} up to {maxSize}MB
            </p>
          </div>

          <div className="flex justify-center space-x-3">
            <TouchOptimizedButton
              onClick={openFileDialog}
              disabled={disabled}
              variant="outline"
              size="sm"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </TouchOptimizedButton>

            {isMobile && accept.includes('image') && (
              <TouchOptimizedButton
                onClick={openCamera}
                disabled={disabled}
                variant="outline"
                size="sm"
              >
                <Camera className="w-4 h-4 mr-2" />
                Camera
              </TouchOptimizedButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface MobileStepperProps {
  steps: Array<{ id: string; title: string; description?: string }>;
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
}

export function MobileStepper({
  steps,
  currentStep,
  onStepClick,
  className = '',
}: MobileStepperProps) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    // Desktop horizontal stepper
    return (
      <div className={`flex items-center justify-between ${className}`}>
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                index <= currentStep
                  ? 'bg-green-600 border-green-600 text-white'
                  : 'bg-white border-gray-300 text-gray-500'
              } ${onStepClick ? 'cursor-pointer' : ''}`}
              onClick={() => onStepClick?.(index)}
            >
              {index < currentStep ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-2 ${
                  index < currentStep ? 'bg-green-600' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  // Mobile vertical stepper
  return (
    <div className={`space-y-4 ${className}`}>
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={`flex items-start space-x-3 ${
            onStepClick ? 'cursor-pointer' : ''
          }`}
          onClick={() => onStepClick?.(index)}
        >
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 flex-shrink-0 ${
              index <= currentStep
                ? 'bg-green-600 border-green-600 text-white'
                : 'bg-white border-gray-300 text-gray-500'
            }`}
          >
            {index < currentStep ? (
              <Check className="w-4 h-4" />
            ) : (
              <span className="text-sm font-medium">{index + 1}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-medium ${
                index <= currentStep ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              {step.title}
            </p>
            {step.description && (
              <p className="text-xs text-gray-500 mt-1">{step.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}