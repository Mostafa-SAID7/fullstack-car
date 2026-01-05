import React, { forwardRef, useState, useRef } from 'react';
import { cn } from '../../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  showCount?: boolean;
  maxLength?: number;
  variant?: 'default' | 'filled' | 'outlined';
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  autoResize?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  description,
  error,
  required = false,
  showCount = false,
  maxLength,
  variant = 'default',
  resize = 'vertical',
  autoResize = false,
  className,
  value,
  defaultValue,
  onChange,
  id,
  rows = 3,
  ...props
}, ref) => {
  const [internalValue, setInternalValue] = useState(defaultValue || value || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const currentValue = value !== undefined ? value : internalValue;
  const characterCount = String(currentValue).length;
  const isOverLimit = maxLength && characterCount > maxLength;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;

    if (value === undefined) {
      setInternalValue(newValue);
    }

    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }

    onChange?.(e);
  };

  const variants = {
    default: 'border-input bg-background',
    filled: 'border-transparent bg-muted',
    outlined: 'border-input bg-background shadow-sm'
  };

  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize'
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-foreground flex items-center gap-1">
          {label}
          {required && <span className="text-destructive">*</span>}
        </label>
      )}

      <textarea
        ref={(el) => {
          textareaRef.current = el!;
          if (typeof ref === 'function') {
            ref(el);
          } else if (ref) {
            ref.current = el;
          }
        }}
        id={textareaId}
        value={currentValue}
        onChange={handleChange}
        maxLength={maxLength}
        rows={rows}
        className={cn(
          'flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
          variants[variant],
          resizeClasses[resize],
          error && 'border-destructive focus-visible:ring-destructive',
          isOverLimit && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        {...props}
      />

      <div className="flex items-center justify-between">
        <div className="flex-1">
          {description && !error && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}

          {error && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span className="w-1 h-1 bg-destructive rounded-full flex-shrink-0" />
              {error}
            </p>
          )}

          {isOverLimit && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span className="w-1 h-1 bg-destructive rounded-full flex-shrink-0" />
              Character limit exceeded ({characterCount}/{maxLength})
            </p>
          )}
        </div>

        {showCount && maxLength && (
          <div className={cn(
            'text-xs',
            isOverLimit ? 'text-destructive' : 'text-muted-foreground'
          )}>
            {characterCount}/{maxLength}
          </div>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
