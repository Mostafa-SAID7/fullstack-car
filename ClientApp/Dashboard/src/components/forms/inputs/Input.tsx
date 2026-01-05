import React, { forwardRef } from 'react';
import { cn } from '../../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'default' | 'filled' | 'outlined' | 'glass';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  placeholder,
  value,
  defaultValue,
  disabled = false,
  required = false,
  error,
  label,
  helperText,
  startIcon,
  endIcon,
  className,
  fullWidth = false,
  variant = 'default',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const variants = {
    default: 'border-input bg-background',
    filled: 'border-transparent bg-muted',
    outlined: 'border-input bg-background shadow-sm',
    glass: 'border-white/10 bg-black/20 text-white placeholder:text-gray-400 focus-visible:ring-primary/50 focus-visible:border-primary/50 backdrop-blur-md'
  };

  const baseClasses = 'flex h-10 w-full rounded-lg border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors';

  const inputClasses = cn(
    baseClasses,
    variants[variant],
    error && 'border-destructive focus-visible:ring-destructive',
    startIcon && 'pl-10',
    endIcon && 'pr-10',
    className
  );

  return (
    <div className={cn('space-y-2', fullWidth && 'w-full')}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-foreground flex items-center gap-1"
        >
          {label}
          {required && <span className="text-destructive">*</span>}
        </label>
      )}

      <div className="relative">
        {startIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {startIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...props}
        />

        {endIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {endIcon}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <span className="w-1 h-1 bg-destructive rounded-full flex-shrink-0" />
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
