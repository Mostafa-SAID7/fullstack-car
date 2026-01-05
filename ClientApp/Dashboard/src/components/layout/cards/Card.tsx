import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  className,
  variant = 'default',
  padding = 'md',
  hover = false,
  clickable = false,
  onClick,
  ...props
}, ref) => {
  const variants = {
    default: 'bg-card text-card-foreground border border-border',
    elevated: 'bg-card text-card-foreground border border-border shadow-lg',
    outlined: 'bg-background text-foreground border-2 border-border',
    filled: 'bg-muted text-foreground border border-border'
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const hoverClass = hover || clickable ? 'hover:shadow-md transition-shadow duration-200' : '';
  const clickableClass = clickable || onClick ? 'cursor-pointer' : '';

  const Component = clickable || onClick ? motion.div : 'div';

  const cardProps = {
    ref,
    className: cn(
      'rounded-lg',
      variants[variant],
      paddings[padding],
      hoverClass,
      clickableClass,
      className
    ),
    onClick,
    ...props
  };

  if (clickable || onClick) {
    return (
      <Component
        {...(cardProps as any)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </Component>
    );
  }

  return <div {...cardProps}>{children}</div>;
});

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 pb-4', className)}
    {...props}
  />
));

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('pt-0', className)}
    {...props}
  />
));

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4', className)}
    {...props}
  />
));

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(({
  className,
  level = 3,
  ...props
}, ref) => {
  const Component = `h${level}` as any;
  return (
    <Component
      ref={ref}
      className={cn('font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  );
});

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(({
  className,
  ...props
}, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';

export {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription
};

export default Card;
