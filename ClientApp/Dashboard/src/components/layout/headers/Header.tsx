import React, { forwardRef } from 'react';
import { cn } from '../../../lib/utils';

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  variant?: 'default' | 'card' | 'bordered' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  sticky?: boolean;
  shadow?: boolean;
}

export interface HeaderTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface HeaderSubtitleProps extends React.HTMLAttributes<HTMLParagraphElement> { }

export interface HeaderActionsProps extends React.HTMLAttributes<HTMLDivElement> { }

const Header = forwardRef<HTMLElement, HeaderProps>(({
  className,
  title,
  subtitle,
  actions,
  breadcrumbs,
  variant = 'default',
  size = 'md',
  sticky = false,
  shadow = false,
  children,
  ...props
}, ref) => {
  const variants = {
    default: 'bg-background',
    card: 'bg-card border border-border rounded-lg',
    bordered: 'border-b border-border bg-background',
    gradient: 'bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5'
  };

  const sizes = {
    sm: 'py-3',
    md: 'py-4',
    lg: 'py-6'
  };

  return (
    <header
      ref={ref}
      className={cn(
        'w-full',
        variants[variant],
        sizes[size],
        sticky && 'sticky top-0 z-40',
        shadow && 'shadow-sm',
        className
      )}
      {...props}
    >
      <div className="px-6">
        {breadcrumbs && (
          <div className="mb-2">
            {breadcrumbs}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {title && (
              <h1 className="text-2xl font-bold text-foreground truncate">
                {title}
              </h1>
            )}

            {subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">
                {subtitle}
              </p>
            )}

            {children}
          </div>

          {actions && (
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  );
});

const HeaderTitle = forwardRef<HTMLHeadingElement, HeaderTitleProps>(({
  className,
  level = 1,
  children,
  ...props
}, ref) => {
  const Tag = `h${level}` as const;
  return React.createElement(
    Tag,
    {
      ref,
      className: cn('font-bold text-foreground', className),
      ...props
    },
    children
  );
});

const HeaderSubtitle = forwardRef<HTMLParagraphElement, HeaderSubtitleProps>(({
  className,
  ...props
}, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));

const HeaderActions = forwardRef<HTMLDivElement, HeaderActionsProps>(({
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-2', className)}
    {...props}
  />
));

Header.displayName = 'Header';
HeaderTitle.displayName = 'HeaderTitle';
HeaderSubtitle.displayName = 'HeaderSubtitle';
HeaderActions.displayName = 'HeaderActions';

// Specialized header components
export const PageHeader: React.FC<Omit<HeaderProps, 'variant' | 'size'>> = (props) => (
  <Header variant="default" size="lg" {...props} />
);

export const HeaderCard: React.FC<Omit<HeaderProps, 'variant'>> = (props) => (
  <Header variant="card" {...props} />
);

export const SectionHeader: React.FC<Omit<HeaderProps, 'variant' | 'size'>> = (props) => (
  <Header variant="bordered" size="md" {...props} />
);

export {
  HeaderTitle,
  HeaderSubtitle,
  HeaderActions
};

export default Header;
