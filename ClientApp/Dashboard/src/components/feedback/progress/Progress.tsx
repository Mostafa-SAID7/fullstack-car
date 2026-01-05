import React, { forwardRef } from 'react';
import { cn } from '../../../lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  animated?: boolean;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(({
  className,
  value = 0,
  max = 100,
  variant = 'default',
  size = 'md',
  showValue = false,
  animated = false,
  ...props
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variants = {
    default: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div
      ref={ref}
      className={cn('relative w-full overflow-hidden rounded-full bg-secondary', className)}
      {...props}
    >
      <div
        className={cn(
          'h-full w-full flex-1 transition-all',
          variants[variant],
          sizes[size],
          animated && 'transition-all duration-300 ease-in-out'
        )}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />

      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-primary-foreground">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
});

Progress.displayName = 'Progress';

export default Progress;

