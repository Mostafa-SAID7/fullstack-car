import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface TabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className
}) => {
  return (
    <div className={cn("relative", className)}>
      <div className="flex gap-1 p-1 bg-card border border-border/50 rounded-2xl shadow-sm overflow-x-auto scrollbar-hide">
        <div className="flex gap-1 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "relative flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 group whitespace-nowrap",
                  isActive
                    ? 'text-primary bg-primary/10 shadow-lg shadow-primary/10 border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <Icon className={cn(
                  "w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200 flex-shrink-0",
                  isActive
                    ? 'text-primary scale-110'
                    : 'group-hover:scale-105'
                )} />
                <span className={cn(
                  "transition-all duration-200 text-sm sm:text-base",
                  isActive
                    ? 'font-bold'
                    : 'group-hover:font-semibold',
                  "hidden sm:inline" // Hide text on mobile, show icon only
                )}>
                  {tab.label}
                </span>
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl -z-10" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface TabContentProps {
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}

export const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  children,
  className
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
