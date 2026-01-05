import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/utils';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
        success: 'border-green-500/50 text-green-700 bg-green-50 dark:border-green-500 dark:text-green-400 dark:bg-green-950',
        warning: 'border-yellow-500/50 text-yellow-700 bg-yellow-50 dark:border-yellow-500 dark:text-yellow-400 dark:bg-yellow-950',
        info: 'border-blue-500/50 text-blue-700 bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:bg-blue-950'
      },
      size: {
        sm: 'p-3 text-sm [&>svg~*]:pl-6 [&>svg]:left-3 [&>svg]:top-3 [&>svg]:w-4 [&>svg]:h-4',
        md: 'p-4 text-sm [&>svg~*]:pl-7 [&>svg]:left-4 [&>svg]:top-4 [&>svg]:w-5 [&>svg]:h-5',
        lg: 'p-6 text-base [&>svg~*]:pl-8 [&>svg]:left-5 [&>svg]:top-5 [&>svg]:w-6 [&>svg]:h-6'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
);

const alertIcons = {
  default: Info,
  destructive: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof alertVariants> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  closable?: boolean;
  action?: React.ReactNode;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(({
  className,
  variant,
  size,
  title,
  description,
  icon,
  onClose,
  closable = false,
  action,
  children,
  ...props
}, ref) => {
  const Icon = icon || (alertIcons[variant || 'default']);
  const DynamicIcon = Icon as any;

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant, size }), className)}
      {...props}
    >
      {Icon && (React.isValidElement(Icon) ? (Icon as React.ReactNode) : <DynamicIcon />)}
      <div className="flex-1">
        {title && (
          <h5 className="mb-1 font-medium leading-none tracking-tight">
            {title}
          </h5>
        )}
        <div className="text-sm">
          {description || children}
        </div>
      </div>

      {(closable || action) && (
        <div className="flex items-center gap-2 ml-4">
          {action}
          {closable && onClose && (
            <button
              onClick={onClose}
              className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-transparent bg-transparent p-0 text-foreground/50 hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
});

Alert.displayName = 'Alert';

// Preset alert components for common use cases
export const SuccessAlert: React.FC<Omit<AlertProps, 'variant'>> = (props) => (
  <Alert variant="success" {...props} />
);

export const ErrorAlert: React.FC<Omit<AlertProps, 'variant'>> = (props) => (
  <Alert variant="destructive" {...props} />
);

export const WarningAlert: React.FC<Omit<AlertProps, 'variant'>> = (props) => (
  <Alert variant="warning" {...props} />
);

export const InfoAlert: React.FC<Omit<AlertProps, 'variant'>> = (props) => (
  <Alert variant="info" {...props} />
);

// Alert with auto-dismiss functionality
export const AutoDismissAlert: React.FC<AlertProps & { duration?: number }> = ({
  duration = 5000,
  onClose,
  ...props
}) => {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!visible) return null;

  return <Alert onClose={onClose} closable {...props} />;
};

export default Alert;
