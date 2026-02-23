'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  className?: string;
  showSummary?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
  className,
  showSummary = false,
  totalItems = 0,
  itemsPerPage = 10,
}: PaginationProps) {
  const startItem = totalPages <= 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const canPrev = currentPage > 1 && !disabled;
  const canNext = currentPage < totalPages && !disabled;

  const pageNumbers: number[] = [];
  const showPages = Math.min(5, totalPages);
  let start = Math.max(1, currentPage - Math.floor(showPages / 2));
  const end = Math.min(totalPages, start + showPages - 1);
  if (end - start + 1 < showPages) start = Math.max(1, end - showPages + 1);
  for (let i = start; i <= end; i++) pageNumbers.push(i);

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-4', className)}>
      {showSummary && totalItems > 0 && (
        <p className="text-sm text-gray-500 order-2 sm:order-1">
          Showing {startItem} to {endItem} of {totalItems} results
        </p>
      )}
      <div className="flex items-center gap-1 order-1 sm:order-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canPrev}
          className="p-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pageNumbers.map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onPageChange(num)}
            disabled={disabled}
            className={cn(
              'min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition-colors',
              num === currentPage
                ? 'bg-green-600 text-white border border-green-600'
                : 'border border-gray-200 bg-white text-gray-700 hover:bg-white'
            )}
          >
            {num}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canNext}
          className="p-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
