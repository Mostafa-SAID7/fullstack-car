import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  hover = false,
  padding = 'md'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <motion.div
      whileHover={hover ? { y: -2 } : undefined}
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => (
  <div className={cn('flex flex-col space-y-1.5 pb-6', className)}>
    {children}
  </div>
);

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => (
  <div className={cn('pt-0', className)}>
    {children}
  </div>
);

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => (
  <div className={cn('flex items-center pt-6', className)}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)}>
    {children}
  </h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <p className={cn('text-sm text-muted-foreground', className)}>
    {children}
  </p>
);