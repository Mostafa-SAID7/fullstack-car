import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Wifi, 
  Server, 
  FileX, 
  Shield, 
  Clock,
  HelpCircle
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from '../../forms/buttons/Button';

export interface ErrorStateProps {
  type?: 'network' | 'server' | 'notFound' | 'unauthorized' | 'forbidden' | 'timeout' | 'validation' | 'generic';
  title?: string;
  message?: string;
  details?: string;
  showRetry?: boolean;
  showHome?: boolean;
  showDetails?: boolean;
  onRetry?: () => void;
  onHome?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  type = 'generic',
  title,
  message,
  details,
  showRetry = true,
  showHome = true,
  showDetails = false,
  onRetry,
  onHome,
  className,
  size = 'md'
}) => {
  const errorConfig = {
    network: {
      icon: Wifi,
      title: 'Connection Error',
      message: 'Unable to connect to the server. Please check your internet connection.',
      color: 'text-orange-500'
    },
    server: {
      icon: Server,
      title: 'Server Error',
      message: 'Something went wrong on our end. Please try again later.',
      color: 'text-red-500'
    },
    notFound: {
      icon: FileX,
      title: 'Not Found',
      message: 'The content you\'re looking for doesn\'t exist or has been moved.',
      color: 'text-blue-500'
    },
    unauthorized: {
      icon: Shield,
      title: 'Access Denied',
      message: 'You need to sign in to access this content.',
      color: 'text-yellow-500'
    },
    forbidden: {
      icon: Shield,
      title: 'Forbidden',
      message: 'You don\'t have permission to access this content.',
      color: 'text-red-500'
    },
    timeout: {
      icon: Clock,
      title: 'Request Timeout',
      message: 'The request took too long to complete. Please try again.',
      color: 'text-orange-500'
    },
    validation: {
      icon: AlertTriangle,
      title: 'Validation Error',
      message: 'Please check your input and try again.',
      color: 'text-yellow-500'
    },
    generic: {
      icon: AlertTriangle,
      title: 'Something went wrong',
      message: 'An unexpected error occurred. Please try again.',
      color: 'text-red-500'
    }
  };

  const config = errorConfig[type];
  const Icon = config.icon;

  const sizes = {
    sm: {
      container: 'p-4',
      icon: 'w-8 h-8',
      iconContainer: 'w-12 h-12',
      title: 'text-lg',
      message: 'text-sm',
      button: 'sm'
    },
    md: {
      container: 'p-6',
      icon: 'w-10 h-10',
      iconContainer: 'w-16 h-16',
      title: 'text-xl',
      message: 'text-base',
      button: 'md'
    },
    lg: {
      container: 'p-8',
      icon: 'w-12 h-12',
      iconContainer: 'w-20 h-20',
      title: 'text-2xl',
      message: 'text-lg',
      button: 'lg'
    }
  };

  const sizeConfig = sizes[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('text-center max-w-md mx-auto', sizeConfig.container, className)}
    >
      <div className="mb-6">
        <div className={cn(
          'bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4',
          sizeConfig.iconContainer
        )}>
          <Icon className={cn(sizeConfig.icon, config.color)} />
        </div>
        
        <h2 className={cn('font-semibold text-foreground mb-2', sizeConfig.title)}>
          {title || config.title}
        </h2>
        
        <p className={cn('text-muted-foreground', sizeConfig.message)}>
          {message || config.message}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {showRetry && (
          <Button
            variant="primary"
            size={sizeConfig.button as any}
            onClick={onRetry}
            icon={<RefreshCw className="w-4 h-4" />}
          >
            Try Again
          </Button>
        )}
        
        {showHome && (
          <Button
            variant="outline"
            size={sizeConfig.button as any}
            onClick={onHome || (() => window.location.href = '/')}
            icon={<Home className="w-4 h-4" />}
          >
            Go Home
          </Button>
        )}
      </div>

      {showDetails && details && (
        <details className="mt-6 text-left">
          <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 justify-center">
            <HelpCircle className="w-4 h-4" />
            Error Details
          </summary>
          <div className="mt-2 p-3 bg-muted rounded-md text-xs font-mono overflow-auto max-h-32 text-left">
            {details}
          </div>
        </details>
      )}
    </motion.div>
  );
};

// Specialized error components
export const NetworkError: React.FC<Omit<ErrorStateProps, 'type'>> = (props) => (
  <ErrorState type="network" {...props} />
);

export const ServerError: React.FC<Omit<ErrorStateProps, 'type'>> = (props) => (
  <ErrorState type="server" {...props} />
);

export const NotFoundError: React.FC<Omit<ErrorStateProps, 'type'>> = (props) => (
  <ErrorState type="notFound" {...props} />
);

export const UnauthorizedError: React.FC<Omit<ErrorStateProps, 'type'>> = (props) => (
  <ErrorState type="unauthorized" {...props} />
);

export const ValidationError: React.FC<{
  errors: Record<string, string>;
  className?: string;
}> = ({ errors, className }) => (
  <div className={cn('space-y-2', className)}>
    {Object.entries(errors).map(([field, error]) => (
      <div key={field} className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-red-800 capitalize">
            {field.replace(/([A-Z])/g, ' $1').trim()}
          </p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    ))}
  </div>
);

// Inline error component for forms
export const InlineError: React.FC<{
  message: string;
  className?: string;
}> = ({ message, className }) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    exit={{ opacity: 0, height: 0 }}
    className={cn('flex items-center gap-2 text-sm text-red-600', className)}
  >
    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
    <span>{message}</span>
  </motion.div>
);

// Toast error component
export const ErrorToast: React.FC<{
  title: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}> = ({ title, message, onDismiss, className }) => (
  <motion.div
    initial={{ opacity: 0, x: 300 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 300 }}
    className={cn(
      'bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg max-w-sm',
      className
    )}
  >
    <div className="flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-red-800">{title}</h4>
        <p className="text-sm text-red-600 mt-1">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-600 transition-colors"
        >
          <span className="sr-only">Dismiss</span>
          ×
        </button>
      )}
    </div>
  </motion.div>
);

export default ErrorState;