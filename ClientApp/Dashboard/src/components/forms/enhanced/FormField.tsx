import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Input, type InputProps } from '../inputs/Input';
import { useFormValidation } from '../../../lib/validation';
import { z } from 'zod';

export interface FormFieldProps extends Omit<InputProps, 'error'> {
  name: string;
  validation?: z.ZodSchema;
  asyncValidation?: (value: string) => Promise<boolean>;
  asyncValidationMessage?: string;
  debounceMs?: number;
  showValidationIcon?: boolean;
  onValidationChange?: (isValid: boolean, error?: string) => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  validation,
  asyncValidation,
  asyncValidationMessage = 'This value is already taken',
  debounceMs = 500,
  showValidationIcon = true,
  onValidationChange,
  value,
  onChange,
  className,
  ...props
}) => {
  const [localValue, setLocalValue] = useState(String(value || ''));
  const [error, setError] = useState<string>();
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean>();
  const { validateField } = useFormValidation();

  // Debounced validation effect
  useEffect(() => {
    if (!localValue && !props.required) {
      setError(undefined);
      setIsValid(undefined);
      onValidationChange?.(true);
      return;
    }

    const timeoutId = setTimeout(async () => {
      let validationError: string | undefined;

      // Sync validation
      if (validation) {
        validationError = validateField(name, String(localValue), validation, props.required);
      }

      if (!validationError && asyncValidation && localValue) {
        setIsValidating(true);
        try {
          const isAvailable = await asyncValidation(String(localValue));
          if (!isAvailable) {
            validationError = asyncValidationMessage;
          }
        } catch (err) {
          validationError = 'Validation failed';
        } finally {
          setIsValidating(false);
        }
      }

      setError(validationError);
      setIsValid(!validationError);
      onValidationChange?.(!validationError, validationError);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [localValue, validation, asyncValidation, name, props.required, debounceMs, asyncValidationMessage, onValidationChange, validateField]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange?.(e);
  };

  const getEndIcon = () => {
    if (!showValidationIcon) return props.endIcon;

    if (isValidating) {
      return <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />;
    }

    if (error) {
      return <AlertTriangle className="w-4 h-4 text-destructive" />;
    }

    if (isValid && localValue) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }

    return props.endIcon;
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Input
        {...props}
        value={localValue}
        onChange={handleChange}
        error={error}
        endIcon={getEndIcon()}
        className={cn(
          error && 'border-destructive focus-visible:ring-destructive',
          isValid && localValue && 'border-green-500 focus-visible:ring-green-500'
        )}
      />
      
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-sm text-destructive"
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormField;