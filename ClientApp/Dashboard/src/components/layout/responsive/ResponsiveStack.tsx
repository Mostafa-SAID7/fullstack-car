import React from 'react';
import { cn } from '../../../lib/utils';

export interface ResponsiveStackProps {
  children: React.ReactNode;
  className?: string;
  direction?: {
    default?: 'row' | 'col';
    sm?: 'row' | 'col';
    md?: 'row' | 'col';
    lg?: 'row' | 'col';
    xl?: 'row' | 'col';
  };
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
}

export const ResponsiveStack: React.FC<ResponsiveStackProps> = ({
  children,
  className,
  direction = { default: 'col', md: 'row' },
  gap = 'md',
  align = 'start',
  justify = 'start',
  wrap = false
}) => {
  const gapClasses = {
    none: 'gap-0',
    xs: 'gap-2',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  const getDirectionClasses = () => {
    const classes = [];
    
    if (direction.default) {
      classes.push(direction.default === 'row' ? 'flex-row' : 'flex-col');
    }
    if (direction.sm) {
      classes.push(direction.sm === 'row' ? 'sm:flex-row' : 'sm:flex-col');
    }
    if (direction.md) {
      classes.push(direction.md === 'row' ? 'md:flex-row' : 'md:flex-col');
    }
    if (direction.lg) {
      classes.push(direction.lg === 'row' ? 'lg:flex-row' : 'lg:flex-col');
    }
    if (direction.xl) {
      classes.push(direction.xl === 'row' ? 'xl:flex-row' : 'xl:flex-col');
    }
    
    return classes.join(' ');
  };

  return (
    <div
      className={cn(
        'flex',
        getDirectionClasses(),
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        wrap && 'flex-wrap',
        className
      )}
    >
      {children}
    </div>
  );
};

export default ResponsiveStack;