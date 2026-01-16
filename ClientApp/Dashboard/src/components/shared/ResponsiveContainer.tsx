import React, { ReactNode } from 'react';

interface ResponsiveContainerProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
  className?: string;
}

/**
 * Responsive Container Component
 * Provides consistent padding and max-width across breakpoints
 */
export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = 'full',
  padding = true,
  className = ''
}) => {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full'
  };

  const paddingClasses = padding ? 'px-4 sm:px-6 lg:px-8' : '';

  return (
    <div className={`mx-auto ${maxWidthClasses[maxWidth]} ${paddingClasses} ${className}`}>
      {children}
    </div>
  );
};

/**
 * Responsive Page Header
 * Optimized header layout for different screen sizes
 */
export const ResponsivePageHeader: React.FC<{
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
  className?: string;
}> = ({
  title,
  description,
  actions,
  breadcrumbs,
  className = ''
}) => {
  return (
    <div className={`border-b border-border pb-4 md:pb-6 ${className}`}>
      {breadcrumbs && (
        <div className="mb-4">
          {breadcrumbs}
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground truncate">
            {title}
          </h1>
          {description && (
            <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Responsive Card
 * Card component with responsive padding
 */
export const ResponsiveCard: React.FC<{
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}> = ({
  children,
  header,
  footer,
  className = ''
}) => {
  return (
    <div className={`card ${className}`}>
      {header && (
        <div className="card-header px-4 py-3 md:px-6 md:py-4">
          {header}
        </div>
      )}
      <div className="card-body px-4 py-3 md:px-6 md:py-4">
        {children}
      </div>
      {footer && (
        <div className="card-footer px-4 py-3 md:px-6 md:py-4">
          {footer}
        </div>
      )}
    </div>
  );
};
