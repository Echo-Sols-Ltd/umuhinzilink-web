'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MoreVertical, Search, Filter } from 'lucide-react';
import { TouchOptimizedButton } from './responsive-layout';
import { useIsMobile } from '@/hooks/use-mobile';

interface Column<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
  mobileHidden?: boolean;
}

interface MobileTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  onRowClick?: (item: T) => void;
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
  sortKey?: keyof T;
  sortDirection?: 'asc' | 'desc';
  loading?: boolean;
  emptyMessage?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  filterable?: boolean;
  onFilter?: () => void;
  className?: string;
}

export function MobileTable<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  onRowClick,
  onSort,
  sortKey,
  sortDirection,
  loading = false,
  emptyMessage = 'No data available',
  searchable = false,
  searchPlaceholder = 'Search...',
  onSearch,
  filterable = false,
  onFilter,
  className = '',
}: MobileTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const isMobile = useIsMobile();

  const handleSort = (key: keyof T) => {
    if (!onSort) return;
    
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(key, newDirection);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const toggleRowExpansion = (rowKey: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowKey)) {
      newExpanded.delete(rowKey);
    } else {
      newExpanded.add(rowKey);
    }
    setExpandedRows(newExpanded);
  };

  const visibleColumns = columns.filter(col => !col.mobileHidden || !isMobile);
  const hiddenColumns = columns.filter(col => col.mobileHidden && isMobile);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isMobile) {
    // Desktop table
    return (
      <div className={`bg-white rounded-lg shadow-sm border overflow-hidden ${className}`}>
        {/* Search and Filter Bar */}
        {(searchable || filterable) && (
          <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
            {searchable && (
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            )}
            {filterable && (
              <TouchOptimizedButton
                onClick={onFilter}
                variant="outline"
                size="sm"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </TouchOptimizedButton>
            )}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                    }`}
                    style={{ width: column.width }}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.title}</span>
                      {column.sortable && sortKey === column.key && (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr
                    key={String(item[keyField])}
                    className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                    onClick={() => onRowClick?.(item)}
                  >
                    {columns.map((column) => (
                      <td key={String(column.key)} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {column.render ? column.render(item[column.key], item) : String(item[column.key] || '')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Mobile card view
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Filter Bar */}
      {(searchable || filterable) && (
        <div className="flex items-center space-x-3">
          {searchable && (
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          )}
          {filterable && (
            <TouchOptimizedButton
              onClick={onFilter}
              variant="outline"
              size="sm"
            >
              <Filter className="w-4 h-4" />
            </TouchOptimizedButton>
          )}
        </div>
      )}

      {/* Mobile Cards */}
      {data.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        data.map((item) => {
          const rowKey = String(item[keyField]);
          const isExpanded = expandedRows.has(rowKey);

          return (
            <div
              key={rowKey}
              className="bg-white rounded-lg shadow-sm border overflow-hidden"
            >
              {/* Main Card Content */}
              <div
                className={`p-4 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(item)}
              >
                <div className="space-y-3">
                  {visibleColumns.slice(0, 3).map((column) => (
                    <div key={String(column.key)} className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-500 flex-shrink-0 mr-3">
                        {column.title}:
                      </span>
                      <span className="text-sm text-gray-900 text-right flex-1">
                        {column.render ? column.render(item[column.key], item) : String(item[column.key] || '')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Expand/Collapse Button */}
                {(hiddenColumns.length > 0 || visibleColumns.length > 3) && (
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <TouchOptimizedButton
                      onClick={() => {
                        toggleRowExpansion(rowKey);
                      }}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-center"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-1" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-1" />
                          Show More
                        </>
                      )}
                    </TouchOptimizedButton>
                  </div>
                )}
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-200 bg-gray-50">
                  <div className="space-y-3 pt-3">
                    {/* Remaining visible columns */}
                    {visibleColumns.slice(3).map((column) => (
                      <div key={String(column.key)} className="flex justify-between items-start">
                        <span className="text-sm font-medium text-gray-500 flex-shrink-0 mr-3">
                          {column.title}:
                        </span>
                        <span className="text-sm text-gray-900 text-right flex-1">
                          {column.render ? column.render(item[column.key], item) : String(item[column.key] || '')}
                        </span>
                      </div>
                    ))}

                    {/* Hidden columns */}
                    {hiddenColumns.map((column) => (
                      <div key={String(column.key)} className="flex justify-between items-start">
                        <span className="text-sm font-medium text-gray-500 flex-shrink-0 mr-3">
                          {column.title}:
                        </span>
                        <span className="text-sm text-gray-900 text-right flex-1">
                          {column.render ? column.render(item[column.key], item) : String(item[column.key] || '')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

// Utility component for action buttons in mobile table
interface MobileTableActionsProps {
  actions: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost';
    icon?: React.ComponentType<{ className?: string }>;
  }>;
  className?: string;
}

export function MobileTableActions({ actions, className = '' }: MobileTableActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (actions.length <= 2) {
    return (
      <div className={`flex space-x-2 ${className}`}>
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <TouchOptimizedButton
              key={index}
              onClick={action.onClick}
              variant={action.variant === 'default' ? 'primary' : (action.variant || 'outline')}
              size="sm"
            >
              {Icon && <Icon className="w-4 h-4 mr-1" />}
              {action.label}
            </TouchOptimizedButton>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <TouchOptimizedButton
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
      >
        <MoreVertical className="w-4 h-4" />
      </TouchOptimizedButton>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border z-20">
            <div className="py-1">
              {actions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      action.onClick();
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}