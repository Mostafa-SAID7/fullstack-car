import React, { forwardRef } from 'react';
import { cn } from '../../../lib/utils';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'size'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'card';
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled = false,
  label,
  description,
  error,
  required = false,
  size = 'md',
  variant = 'default',
  className,
  id,
  ...props
}, ref) => {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked || false);

  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;

    if (!isControlled) {
      setInternalChecked(newChecked);
    }

    onCheckedChange?.(newChecked);
  };

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  if (variant === 'card') {
    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          'relative flex items-center gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer',
          isChecked
            ? 'border-primary bg-primary/5 shadow-sm'
            : 'border-muted hover:border-primary/50',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <div className="relative">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            checked={isChecked}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            className="sr-only"
            {...props}
          />
          <div className={cn(
            'flex items-center justify-center rounded border-2 transition-all',
            sizes[size],
            isChecked
              ? 'bg-primary border-primary'
              : 'bg-background border-muted-foreground/30',
            !disabled && 'hover:border-primary/70'
          )}>
            {isChecked && (
              <Check className={cn('text-primary-foreground', iconSizes[size])} />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {label && (
            <div className="flex items-center gap-1">
              <span className="font-medium text-sm">{label}</span>
              {required && <span className="text-destructive">*</span>}
            </div>
          )}
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </label>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <label
        htmlFor={checkboxId}
        className={cn(
          'flex items-start gap-3 cursor-pointer',
          disabled && 'cursor-not-allowed'
        )}
      >
        <div className="relative mt-0.5">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            checked={isChecked}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            className="sr-only"
            {...props}
          />
          <div className={cn(
            'flex items-center justify-center rounded border-2 transition-all',
            sizes[size],
            isChecked
              ? 'bg-primary border-primary'
              : 'bg-background border-muted-foreground/30',
            !disabled && 'hover:border-primary/70'
          )}>
            {isChecked && (
              <Check className={cn('text-primary-foreground', iconSizes[size])} />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {label && (
            <div className="flex items-center gap-1">
              <span className={cn(
                'font-medium',
                size === 'sm' ? 'text-sm' : size === 'md' ? 'text-sm' : 'text-base'
              )}>
                {label}
              </span>
              {required && <span className="text-destructive">*</span>}
            </div>
          )}
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </label>

      {error && (
        <p className="text-sm text-destructive flex items-center gap-1 ml-8">
          <span className="w-1 h-1 bg-destructive rounded-full flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
