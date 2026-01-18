/**
 * LoadingSpinner Component
 * Reusable loading spinner for administrative interfaces
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

// Loading spinner props
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'gray' | 'white';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

// Size configurations
const SIZE_CONFIGS = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
};

// Color configurations
const COLOR_CONFIGS = {
  blue: 'text-blue-600 dark:text-blue-400',
  gray: 'text-gray-600 dark:text-gray-400',
  white: 'text-white'
};

/**
 * LoadingSpinner Component
 * 
 * Provides consistent loading indicators with multiple sizes and colors.
 * Can be used inline or as a full-screen overlay.
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'blue',
  text,
  className = '',
  fullScreen = false
}) => {
  const sizeClass = SIZE_CONFIGS[size];
  const colorClass = COLOR_CONFIGS[color];

  const spinner = (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className={`animate-spin ${sizeClass} ${colorClass}`} />
        {text && (
          <p className={`text-sm ${colorClass}`}>
            {text}
          </p>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;