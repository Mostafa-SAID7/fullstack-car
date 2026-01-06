import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  count?: number;
}

export interface TabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export interface TabContentProps {
  activeTab: string;
  children: React.ReactNode;
  className?: string;
  animation?: boolean;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className
}) => {
  const variants = {
    default: 'bg-muted p-1 rounded-lg',
    pills: 'gap-2',
    underline: 'border-b border-border'
  };

  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={cn('relative w-full', className)}>
      <div className={cn(
        'flex w-full',
        variants[variant],
        // Responsive scrolling behavior - always allow horizontal scroll when needed
        'overflow-x-auto',
        // Custom scrollbar styling - thin scrollbars that appear when needed
        'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border/50',
        // Show scrollbar on hover or when scrolling
        'hover:scrollbar-thumb-muted-foreground/70',
        // Smooth scrolling behavior
        'scroll-smooth',
        // Prevent vertical scrolling
        'overflow-y-hidden',
        // Ensure proper touch scrolling on mobile
        'overscroll-x-contain'
      )}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isDisabled = tab.disabled;

          return (
            <button
              key={tab.id}
              onClick={() => !isDisabled && onTabChange(tab.id)}
              disabled={isDisabled}
              className={cn(
                'relative flex items-center gap-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
                // Responsive padding and sizing - mobile first approach
                'px-3 py-2 text-sm whitespace-nowrap flex-shrink-0',
                'sm:px-4 sm:py-2.5 sm:text-sm',
                'md:px-5 md:py-3',
                'lg:px-6 lg:py-3',
                sizes[size],
                variant === 'default' && cn(
                  'rounded-md',
                  isActive
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                ),
                variant === 'pills' && cn(
                  'rounded-full px-4 sm:px-6',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                ),
                variant === 'underline' && cn(
                  'border-b-2 rounded-none px-1 pb-3',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                ),
                // Responsive width behavior
                fullWidth && 'flex-1 justify-center min-w-0',
                // Ensure minimum width for readability and touch targets
                'min-w-fit min-h-[40px] sm:min-h-[44px]',
                // On larger screens, distribute evenly if fullWidth
                fullWidth && 'lg:flex-1',
                // Ensure proper touch target size on mobile
                'touch-manipulation'
              )}
            >
              {tab.icon && (
                <span className={cn(
                  'flex-shrink-0',
                  size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-5 h-5 sm:w-6 sm:h-6'
                )}>
                  {tab.icon}
                </span>
              )}
              <span className="truncate">{tab.label}</span>
              {tab.count !== undefined && (
                <span className={cn(
                  'ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 text-xs rounded-full flex-shrink-0',
                  isActive 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-muted-foreground/20 text-muted-foreground'
                )}>
                  {tab.count}
                </span>
              )}

              {variant === 'underline' && isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="activeTab"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Optional: Add fade indicators for scrollable content */}
      <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-background to-transparent pointer-events-none opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-background to-transparent pointer-events-none opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
    </div>
  );
};

export const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  children,
  className,
  animation = true
}) => {
  if (!animation) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default TabNavigation;