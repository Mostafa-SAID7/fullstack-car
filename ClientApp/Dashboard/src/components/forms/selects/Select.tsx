import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: React.ReactNode;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  label?: string;
  description?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  onChange?: (value: string | string[]) => void;
  onSearch?: (query: string) => void;
  className?: string;
  id?: string;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(({
  options,
  value,
  defaultValue,
  placeholder = 'Select an option...',
  label,
  description,
  error,
  disabled = false,
  required = false,
  multiple = false,
  searchable = false,
  clearable = false,
  size = 'md',
  variant = 'default',
  onChange,
  onSearch,
  className,
  id
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(
    multiple ? (value ? [value] : []) : (value ? [value] : defaultValue ? [defaultValue] : [])
  );
  const [searchQuery, setSearchQuery] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchQuery('');
    }
  };

  const handleOptionClick = (option: SelectOption) => {
    if (option.disabled) return;

    if (multiple) {
      const newValues = selectedValues.includes(option.value)
        ? selectedValues.filter(v => v !== option.value)
        : [...selectedValues, option.value];

      setSelectedValues(newValues);
      onChange?.(newValues);
    } else {
      setSelectedValues([option.value]);
      onChange?.(option.value);
      setIsOpen(false);
    }
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValues([]);
    onChange?.(multiple ? [] : '');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const filteredOptions = searchable && searchQuery
    ? options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : options;

  const selectedOptions = options.filter(option => selectedValues.includes(option.value));
  const displayText = multiple
    ? selectedOptions.length > 0
      ? `${selectedOptions.length} selected`
      : placeholder
    : selectedOptions[0]?.label || placeholder;

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-3 text-sm',
    lg: 'h-12 px-4 text-base'
  };

  const variants = {
    default: 'border-input bg-background',
    filled: 'border-transparent bg-muted',
    outlined: 'border-input bg-background shadow-sm'
  };

  return (
    <div ref={ref} className={cn('space-y-2', className)}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-foreground flex items-center gap-1">
          {label}
          {required && <span className="text-destructive">*</span>}
        </label>
      )}

      <div ref={selectRef} className="relative">
        <button
          type="button"
          id={selectId}
          onClick={handleToggle}
          disabled={disabled}
          className={cn(
            'flex items-center justify-between w-full rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            sizes[size],
            variants[variant],
            error && 'border-destructive focus:ring-destructive',
            isOpen && 'ring-2 ring-ring ring-offset-2'
          )}
        >
          <span className="truncate text-left">
            {displayText}
          </span>

          <div className="flex items-center gap-1 flex-shrink-0">
            {clearable && selectedValues.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-muted rounded"
              >
                ×
              </button>
            )}
            <ChevronDown className={cn(
              'w-4 h-4 transition-transform',
              isOpen && 'rotate-180'
            )} />
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-full mt-1 w-full bg-popover border border-border rounded-md shadow-lg z-50 max-h-60 overflow-auto">
            {searchable && (
              <div className="p-2 border-b border-border">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-3 py-2 text-sm bg-background border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            )}

            <div className="py-1">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = selectedValues.includes(option.value);

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleOptionClick(option)}
                      disabled={option.disabled}
                      className={cn(
                        'w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed',
                        isSelected && 'bg-accent text-accent-foreground',
                        option.disabled && 'cursor-not-allowed'
                      )}
                    >
                      {multiple && (
                        <div className={cn(
                          'w-4 h-4 border rounded flex items-center justify-center flex-shrink-0',
                          isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/30'
                        )}>
                          {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                        </div>
                      )}

                      {option.icon && (
                        <span className="flex-shrink-0">{option.icon}</span>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{option.label}</div>
                        {option.description && (
                          <div className="text-xs text-muted-foreground truncate">
                            {option.description}
                          </div>
                        )}
                      </div>

                      {!multiple && isSelected && (
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {description && !error && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <span className="w-1 h-1 bg-destructive rounded-full flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
