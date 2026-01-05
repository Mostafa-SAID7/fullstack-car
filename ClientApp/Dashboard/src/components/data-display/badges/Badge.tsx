import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        success: 'border-transparent bg-green-500 text-white hover:bg-green-600',
        warning: 'border-transparent bg-yellow-500 text-white hover:bg-yellow-600',
        info: 'border-transparent bg-blue-500 text-white hover:bg-blue-600'
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  dot?: boolean;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({
  className,
  variant,
  size,
  children,
  removable = false,
  onRemove,
  dot = false,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {dot && (
        <span className="mr-1.5 h-2 w-2 rounded-full bg-current opacity-75" />
      )}
      {children}
      {removable && onRemove && (
        <button
          onClick={onRemove}
          className="ml-1.5 rounded-full hover:bg-black/10 focus:outline-none focus:ring-1 focus:ring-current"
          aria-label="Remove"
        >
          <span className="sr-only">Remove</span>
          ×
        </button>
      )}
    </div>
  );
});

Badge.displayName = 'Badge';

export default Badge;

