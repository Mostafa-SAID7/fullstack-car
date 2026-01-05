import React, { forwardRef } from 'react';
import { cn } from '../../../lib/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  center?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  maxWidth?: boolean;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(({
  className,
  size = 'lg',
  center = false,
  padding = 'md',
  maxWidth = true,
  children,
  ...props
}, ref) => {
  const sizes = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full'
  };

  const paddings = {
    none: '',
    sm: 'px-4 py-2',
    md: 'px-6 py-4',
    lg: 'px-8 py-6',
    xl: 'px-12 py-8'
  };

  return (
    <div
      ref={ref}
      className={cn(
        'w-full',
        maxWidth && sizes[size],
        center && 'mx-auto',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Container.displayName = 'Container';

// Specialized container components
export const PageContainer: React.FC<Omit<ContainerProps, 'padding'>> = (props) => (
  <Container padding="lg" {...props} />
);

export const SectionContainer: React.FC<Omit<ContainerProps, 'padding'>> = (props) => (
  <Container padding="xl" {...props} />
);

export const CardContainer: React.FC<ContainerProps> = (props) => (
  <Container
    className="bg-card border border-border rounded-lg shadow-sm"
    {...props}
  />
);

export const FluidContainer: React.FC<Omit<ContainerProps, 'size' | 'maxWidth'>> = (props) => (
  <Container size="full" maxWidth={false} {...props} />
);

export default Container;
