import React from 'react';
import { motion } from 'framer-motion';
import { Grid3X3, List } from 'lucide-react';

export type ViewMode = 'table' | 'cards';

export interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  viewMode,
  onViewModeChange,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={`inline-flex items-center bg-muted rounded-lg p-1 ${className}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onViewModeChange('table')}
        className={`relative ${sizeClasses[size]} rounded-md transition-all duration-200 ${
          viewMode === 'table'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Table View"
      >
        <List className={iconSizes[size]} />
        {viewMode === 'table' && (
          <motion.div
            layoutId="viewToggleIndicator"
            className="absolute inset-0 bg-background rounded-md shadow-sm"
            style={{ zIndex: -1 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onViewModeChange('cards')}
        className={`relative ${sizeClasses[size]} rounded-md transition-all duration-200 ${
          viewMode === 'cards'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Cards View"
      >
        <Grid3X3 className={iconSizes[size]} />
        {viewMode === 'cards' && (
          <motion.div
            layoutId="viewToggleIndicator"
            className="absolute inset-0 bg-background rounded-md shadow-sm"
            style={{ zIndex: -1 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}
      </motion.button>
    </div>
  );
};

export default ViewToggle;