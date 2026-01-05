import React from 'react';
import { cn } from '../../../lib/utils';
import { Button } from '../../forms/buttons/Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  size = 'md',
  className
}) => {
  const sizes = {
    sm: {
      icon: 'w-8 h-8',
      title: 'text-lg',
      description: 'text-sm',
      spacing: 'space-y-3'
    },
    md: {
      icon: 'w-12 h-12',
      title: 'text-xl',
      description: 'text-base',
      spacing: 'space-y-4'
    },
    lg: {
      icon: 'w-16 h-16',
      title: 'text-2xl',
      description: 'text-lg',
      spacing: 'space-y-6'
    }
  };

  const currentSize = sizes[size];

  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center p-8',
      currentSize.spacing,
      className
    )}>
      {icon && (
        <div className={cn(
          'text-muted-foreground/60',
          currentSize.icon
        )}>
          {icon}
        </div>
      )}

      <div className="space-y-2 max-w-md">
        <h3 className={cn(
          'font-semibold text-foreground',
          currentSize.title
        )}>
          {title}
        </h3>

        {description && (
          <p className={cn(
            'text-muted-foreground leading-relaxed',
            currentSize.description
          )}>
            {description}
          </p>
        )}
      </div>

      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || 'primary'}
              size={size === 'sm' ? 'sm' : 'md'}
            >
              {action.label}
            </Button>
          )}

          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant={secondaryAction.variant || 'outline'}
              size={size === 'sm' ? 'sm' : 'md'}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

// Preset empty states for common scenarios
export const EmptyTableState: React.FC<Omit<EmptyStateProps, 'icon' | 'title' | 'description'>> = (props) => (
  <EmptyState
    icon={<TableIcon />}
    title="No data found"
    description="There are no items to display at the moment."
    {...props}
  />
);

export const EmptySearchState: React.FC<Omit<EmptyStateProps, 'icon' | 'title' | 'description'>> = (props) => (
  <EmptyState
    icon={<SearchIcon />}
    title="No results found"
    description="Try adjusting your search terms or filters."
    {...props}
  />
);

export const EmptyCartState: React.FC<Omit<EmptyStateProps, 'icon' | 'title' | 'description'>> = (props) => (
  <EmptyState
    icon={<CartIcon />}
    title="Your cart is empty"
    description="Add some items to get started."
    {...props}
  />
);

export const EmptyNotificationState: React.FC<Omit<EmptyStateProps, 'icon' | 'title' | 'description'>> = (props) => (
  <EmptyState
    icon={<BellIcon />}
    title="No notifications"
    description="You're all caught up! Check back later for updates."
    {...props}
  />
);

// Icon components for common empty states
const TableIcon = () => (
  <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CartIcon = () => (
  <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5V19a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

export default EmptyState;
