import React, { forwardRef } from 'react';
import { cn } from '../../../lib/utils';

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onChange' | 'value'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled = false,
  size = 'md',
  className,
  id,
  ...props
}, ref) => {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked || false);

  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const handleClick = () => {
    if (disabled) return;

    if (!isControlled) {
      setInternalChecked(!isChecked);
    }

    onCheckedChange?.(!isChecked);
  };

  const sizes = {
    sm: 'w-8 h-5',
    md: 'w-11 h-6',
    lg: 'w-14 h-7'
  };

  const thumbSizes = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        'relative inline-flex items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        isChecked ? 'bg-primary' : 'bg-input',
        sizes[size],
        className
      )}
      {...props}
    >
      <span
        className={cn(
          'inline-block rounded-full bg-background shadow transition-transform',
          thumbSizes[size],
          isChecked
            ? size === 'sm' ? 'translate-x-4' : size === 'md' ? 'translate-x-6' : 'translate-x-8'
            : size === 'sm' ? 'translate-x-1' : 'translate-x-1'
        )}
      />
    </button>
  );
});

Switch.displayName = 'Switch';

export default Switch;

