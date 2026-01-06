import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ViewToggle, type ViewMode } from './ViewToggle';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterField {
  key: string;
  label: string;
  type: 'select' | 'text' | 'date';
  options?: FilterOption[];
  placeholder?: string;
}

export interface SearchAndFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterFields?: FilterField[];
  filterValues?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
  onApplyFilters?: () => void;
  onClearFilters?: () => void;
  showFiltersButton?: boolean;
  showViewToggle?: boolean;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  className?: string;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filterFields = [],
  filterValues = {},
  onFilterChange,
  onApplyFilters,
  onClearFilters,
  showFiltersButton = true,
  showViewToggle = false,
  viewMode = 'table',
  onViewModeChange,
  className = ''
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleClearFilters = () => {
    if (onClearFilters) {
      onClearFilters();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Controls - Always in one line */}
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm sm:text-base"
          />
        </div>

        {/* Controls - Always visible and in line */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* View Toggle */}
          {showViewToggle && onViewModeChange && (
            <div className="flex-shrink-0">
              <ViewToggle
                viewMode={viewMode}
                onViewModeChange={onViewModeChange}
              />
            </div>
          )}

          {/* Filter Toggle */}
          {showFiltersButton && filterFields.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-2 border rounded-lg transition-all duration-200 flex-shrink-0 text-xs sm:text-sm ${
                showFilters 
                  ? 'border-primary bg-primary/10 text-primary hover:bg-primary/20' 
                  : 'border-border bg-background hover:bg-muted/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              <SlidersHorizontal className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 flex-shrink-0 ${showFilters ? 'rotate-180' : ''}`} />
              <span className="font-medium hidden sm:inline">
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </span>
              <span className="font-medium sm:hidden">
                Filters
              </span>
              {Object.keys(filterValues).some(key => filterValues[key]) && (
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-pulse flex-shrink-0" />
              )}
            </motion.button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && filterFields.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Advanced Filters
            </h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filterFields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {field.label}
                </label>
                {field.type === 'select' && field.options ? (
                  <select
                    value={filterValues[field.key] || ''}
                    onChange={(e) => onFilterChange?.(field.key, e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'text' ? (
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={filterValues[field.key] || ''}
                    onChange={(e) => onFilterChange?.(field.key, e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                ) : field.type === 'date' ? (
                  <input
                    type="date"
                    value={filterValues[field.key] || ''}
                    onChange={(e) => onFilterChange?.(field.key, e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                ) : null}
              </div>
            ))}
          </div>

          {/* Filter Actions */}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onApplyFilters}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Apply Filters
            </motion.button>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchAndFilters;