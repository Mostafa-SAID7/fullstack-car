/**
 * AdminInput Component
 * Enhanced input component for administrative forms
 */

import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

// Input variant types
type InputVariant = 'default' | 'error' | 'success';
type InputSize = 'sm' | 'md' | 'lg';

// Input props interface
interface AdminInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  description?: string;
  error?: string;
  success?: string;
  variant?: InputVariant;
  size?: InputSize;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  onRightIconClick?: () => void;
  loading?: boolean;
  required?: boolean;
}

// Size configurations
const SIZE_CONFIGS = {
  sm: {
    input: 'px-3 py-1.5 text-sm',
    icon: 'h-4 w-4',
    iconContainer: 'px-2.5'
  },
  md: {
    input: 'px-3 py-2 text-sm',
    icon: 'h-4 w-4',
    iconContainer: 'px-3'
  },
  lg: {
    input: 'px-4 py-3 text-base',
    icon: 'h-5 w-5',
    iconContainer: 'px-3'
  }
};

// Variant configurations
const VARIANT_CONFIGS = {
  default: {
    input: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500',
    label: 'text-gray-700 dark:text-gray-300',
    description: 'text-gray-500 dark:text-gray-400',
    message: ''
  },
  error: {
    input: 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500',
    label: 'text-gray-700 dark:text-gray-300',
    description: 'text-gray-500 dark:text-gray-400',
    message: 'text-red-600 dark:text-red-400'
  },
  success: {
    input: 'border-green-300 dark:border-green-600 focus:ring-green-500 focus:border-green-500',
    label: 'text-gray-700 dark:text-gray-300',
    description: 'text-gray-500 dark:text-gray-400',
    message: 'text-green-600 dark:text-green-400'
  }
};

/**
 * AdminInput Component
 * 
 * Enhanced input component with support for:
 * - Icons (left and right)
 * - Validation states (error, success)
 * - Loading states
 * - Multiple sizes
 * - Labels and descriptions
 */
export const AdminInput = forwardRef<HTMLInputElement, AdminInputProps>(({
  label,
  description,
  error,
  success,
  variant = 'default',
  size = 'md',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onRightIconClick,
  loading = false,
  required = false,
  className = '',
  id,
  ...props
}, ref) => {
  // Determine variant based on error/success states
  const effectiveVariant = error ? 'error' : success ? 'success' : variant;
  const sizeConfig = SIZE_CONFIGS[size];
  const variantConfig = VARIANT_CONFIGS[effectiveVariant];
  
  // Generate unique ID if not provided
  const inputId = id || `admin-input-${Math.random().toString(36).substr(2, 9)}`;
  
  // Message to display (error takes precedence over success)
  const message = error || success;

  return (
    <div className={className}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId}
          className={`block text-sm font-medium mb-1 ${variantConfig.label}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Description */}
      {description && (
        <p className={`text-xs mb-2 ${variantConfig.description}`}>
          {description}
        </p>
      )}
      
      {/* Input container */}
      <div className="relative">
        {/* Left icon */}
        {LeftIcon && (
          <div className={`
            absolute inset-y-0 left-0 flex items-center pointer-events-none
            ${sizeConfig.iconContainer}
          `}>
            <LeftIcon className={`${sizeConfig.icon} text-gray-400`} />
          </div>
        )}
        
        {/* Input field */}
        <input
          ref={ref}
          id={inputId}
          className={`
            block w-full border rounded-md shadow-sm placeholder-gray-400 
            focus:outline-none focus:ring-2 
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            dark:bg-gray-800 dark:text-white dark:placeholder-gray-500
            ${sizeConfig.input}
            ${variantConfig.input}
            ${LeftIcon ? `pl-${size === 'lg' ? '10' : '9'}` : ''}
            ${RightIcon ? `pr-${size === 'lg' ? '10' : '9'}` : ''}
            ${loading ? 'pr-10' : ''}
          `}
          {...props}
        />
        
        {/* Right icon or loading spinner */}
        {(RightIcon || loading) && (
          <div className={`
            absolute inset-y-0 right-0 flex items-center
            ${sizeConfig.iconContainer}
            ${onRightIconClick ? 'cursor-pointer' : 'pointer-events-none'}
          `}>
            {loading ? (
              <div className="animate-spin">
                <div className={`
                  border-2 border-gray-300 border-t-blue-600 rounded-full
                  ${size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}
                `} />
              </div>
            ) : RightIcon ? (
              <RightIcon 
                className={`
                  ${sizeConfig.icon} text-gray-400 
                  ${onRightIconClick ? 'hover:text-gray-600 dark:hover:text-gray-300' : ''}
                `}
                onClick={onRightIconClick}
              />
            ) : null}
          </div>
        )}
      </div>
      
      {/* Error/Success message */}
      {message && (
        <p className={`text-xs mt-1 ${variantConfig.message}`}>
          {message}
        </p>
      )}
    </div>
  );
});

AdminInput.displayName = 'AdminInput';

export default AdminInput;