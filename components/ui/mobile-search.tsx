'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Filter, SlidersHorizontal, ArrowLeft, Mic } from 'lucide-react';
import { TouchOptimizedButton } from './responsive-layout';
import { useIsMobile } from '@/hooks/use-mobile';

interface SearchSuggestion {
  id: string;
  text: string;
  type?: 'recent' | 'popular' | 'suggestion';
}

interface MobileSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  onClearRecent?: () => void;
  showFilters?: boolean;
  onFiltersClick?: () => void;
  className?: string;
}

export function MobileSearch({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  suggestions = [],
  recentSearches = [],
  onClearRecent,
  showFilters = false,
  onFiltersClick,
  className = '',
}: MobileSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  // Voice search support
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onChange(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setSpeechRecognition(recognition);
    }
  }, [onChange]);

  const handleExpand = () => {
    setIsExpanded(true);
    setShowSuggestions(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleVoiceSearch = () => {
    if (speechRecognition && !isListening) {
      setIsListening(true);
      speechRecognition.start();
    }
  };

  const allSuggestions = [
    ...recentSearches.map(search => ({ id: search, text: search, type: 'recent' as const })),
    ...suggestions,
  ];

  if (!isMobile) {
    // Desktop search bar
    return (
      <form onSubmit={handleSubmit} className={`relative ${className}`}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          {value && (
            <TouchOptimizedButton
              onClick={() => onChange('')}
              variant="ghost"
              size="sm"
              className="absolute right-8 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-4 h-4" />
            </TouchOptimizedButton>
          )}
          {showFilters && (
            <TouchOptimizedButton
              onClick={onFiltersClick}
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <Filter className="w-4 h-4" />
            </TouchOptimizedButton>
          )}
        </div>
      </form>
    );
  }

  return (
    <>
      {/* Collapsed Search Bar */}
      {!isExpanded && (
        <div className={`flex items-center space-x-2 ${className}`}>
          <TouchOptimizedButton
            onClick={handleExpand}
            variant="outline"
            className="flex-1 justify-start space-x-2 h-12"
          >
            <Search className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">{placeholder}</span>
          </TouchOptimizedButton>
          
          {showFilters && (
            <TouchOptimizedButton
              onClick={onFiltersClick}
              variant="outline"
              size="sm"
            >
              <Filter className="w-4 h-4" />
            </TouchOptimizedButton>
          )}
        </div>
      )}

      {/* Expanded Search Overlay */}
      {isExpanded && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Search Header */}
          <div className="flex items-center space-x-3 p-4 border-b border-gray-200">
            <TouchOptimizedButton
              onClick={handleCollapse}
              variant="ghost"
              size="sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </TouchOptimizedButton>

            <form onSubmit={handleSubmit} className="flex-1">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 text-lg border-none outline-none"
                  autoFocus
                />
                {value && (
                  <TouchOptimizedButton
                    onClick={() => onChange('')}
                    variant="ghost"
                    size="sm"
                    className="absolute right-12 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="w-4 h-4" />
                  </TouchOptimizedButton>
                )}
                
                {speechRecognition && (
                  <TouchOptimizedButton
                    onClick={handleVoiceSearch}
                    variant="ghost"
                    size="sm"
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
                      isListening ? 'text-red-500' : 'text-gray-400'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                  </TouchOptimizedButton>
                )}
              </div>
            </form>

            {showFilters && (
              <TouchOptimizedButton
                onClick={onFiltersClick}
                variant="ghost"
                size="sm"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </TouchOptimizedButton>
            )}
          </div>

          {/* Suggestions */}
          {showSuggestions && (
            <div className="flex-1 overflow-y-auto">
              {allSuggestions.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {/* Recent Searches Header */}
                  {recentSearches.length > 0 && (
                    <div className="px-4 py-3 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-700">Recent Searches</h3>
                        {onClearRecent && (
                          <TouchOptimizedButton
                            onClick={onClearRecent}
                            variant="ghost"
                            size="sm"
                            className="text-xs text-gray-500"
                          >
                            Clear All
                          </TouchOptimizedButton>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Suggestion Items */}
                  {allSuggestions.map((suggestion, index) => (
                    <TouchOptimizedButton
                      key={`${suggestion.id}-${index}`}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      variant="ghost"
                      className="w-full justify-start space-x-3 h-14 px-4 rounded-none"
                    >
                      <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <p className="text-gray-900">{suggestion.text}</p>
                        {suggestion.type && (
                          <p className="text-xs text-gray-500 capitalize">
                            {suggestion.type}
                          </p>
                        )}
                      </div>
                    </TouchOptimizedButton>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p>Start typing to search</p>
                </div>
              )}
            </div>
          )}

          {/* Voice Search Indicator */}
          {isListening && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <p className="text-lg font-medium text-gray-900">Listening...</p>
                <p className="text-sm text-gray-500 mt-1">Speak now</p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

interface QuickSearchFiltersProps {
  filters: Array<{
    id: string;
    label: string;
    active: boolean;
    count?: number;
  }>;
  onFilterToggle: (filterId: string) => void;
  className?: string;
}

export function QuickSearchFilters({
  filters,
  onFilterToggle,
  className = '',
}: QuickSearchFiltersProps) {
  return (
    <div className={`flex space-x-2 overflow-x-auto pb-2 ${className}`}>
      {filters.map((filter) => (
        <TouchOptimizedButton
          key={filter.id}
          onClick={() => onFilterToggle(filter.id)}
          variant={filter.active ? 'primary' : 'outline'}
          size="sm"
          className={`flex-shrink-0 ${
            filter.active ? 'bg-green-600 hover:bg-green-700' : ''
          }`}
        >
          {filter.label}
          {filter.count !== undefined && (
            <span className="ml-1 text-xs">({filter.count})</span>
          )}
        </TouchOptimizedButton>
      ))}
    </div>
  );
}