import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug, WifiOff } from 'lucide-react';

// Declare process for Node.js environment
declare const process: {
  env: {
    NODE_ENV?: string;
  };
};

export interface ErrorCardProps {
  title?: string;
  message?: string;
  error?: Error | string;
  type?: 'network' | 'server' | 'client' | 'unknown';
  showRetry?: boolean;
  showHome?: boolean;
  showReport?: boolean;
  onRetry?: () => void;
  onHome?: () => void;
  onReport?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ErrorCard: React.FC<ErrorCardProps> = ({
  title,
  message,
  error,
  type = 'unknown',
  showRetry = true,
  showHome = false,
  showReport = false,
  onRetry,
  onHome,
  onReport,
  className = '',
  size = 'md'
}) => {
  // Auto-detect error type if not provided
  const detectedType = React.useMemo(() => {
    if (type !== 'unknown') return type;
    
    const errorMessage = error?.toString().toLowerCase() || message?.toLowerCase() || '';
    
    if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('connection')) {
      return 'network';
    }
    if (errorMessage.includes('500') || errorMessage.includes('server') || errorMessage.includes('internal')) {
      return 'server';
    }
    if (errorMessage.includes('400') || errorMessage.includes('401') || errorMessage.includes('403') || errorMessage.includes('404')) {
      return 'client';
    }
    return 'unknown';
  }, [type, error, message]);

  // Get appropriate icon and colors based on error type
  const getErrorConfig = () => {
    switch (detectedType) {
      case 'network':
        return {
          icon: WifiOff,
          title: title || 'Network Error',
          message: message || 'Unable to connect to the server. Please check your internet connection.',
          bgColor: 'bg-orange-50 dark:bg-orange-900/10',
          borderColor: 'border-orange-200 dark:border-orange-800',
          iconColor: 'text-orange-600 dark:text-orange-400',
          iconBg: 'bg-orange-100 dark:bg-orange-900/20'
        };
      case 'server':
        return {
          icon: AlertTriangle,
          title: title || 'Server Error',
          message: message || 'Something went wrong on our end. Our team has been notified.',
          bgColor: 'bg-red-50 dark:bg-red-900/10',
          borderColor: 'border-red-200 dark:border-red-800',
          iconColor: 'text-red-600 dark:text-red-400',
          iconBg: 'bg-red-100 dark:bg-red-900/20'
        };
      case 'client':
        return {
          icon: AlertTriangle,
          title: title || 'Request Error',
          message: message || 'There was an issue with your request. Please try again.',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/10',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          iconBg: 'bg-yellow-100 dark:bg-yellow-900/20'
        };
      default:
        return {
          icon: Bug,
          title: title || 'Something went wrong',
          message: message || 'An unexpected error occurred. Please try again.',
          bgColor: 'bg-gray-50 dark:bg-gray-900/10',
          borderColor: 'border-gray-200 dark:border-gray-800',
          iconColor: 'text-gray-600 dark:text-gray-400',
          iconBg: 'bg-gray-100 dark:bg-gray-900/20'
        };
    }
  };

  const config = getErrorConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const iconInnerSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${config.bgColor} ${config.borderColor} border rounded-xl ${sizeClasses[size]} ${className}`}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Error Icon */}
        <div className={`${config.iconBg} ${iconSizes[size]} rounded-full flex items-center justify-center`}>
          <Icon className={`${iconInnerSizes[size]} ${config.iconColor}`} />
        </div>

        {/* Error Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            {config.title}
          </h3>
          <p className="text-muted-foreground text-sm max-w-md">
            {config.message}
          </p>
          
          {/* Error Details (for development) */}
          {error && process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                Error Details
              </summary>
              <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                {error.toString()}
              </pre>
            </details>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          {showRetry && onRetry && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </motion.button>
          )}
          
          {showHome && onHome && (
            <button
              onClick={onHome}
              className="inline-flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
          )}
          
          {showReport && onReport && (
            <button
              onClick={onReport}
              className="inline-flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <Bug className="w-4 h-4" />
              Report Issue
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ErrorCard;