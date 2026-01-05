import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success' | 'warning';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  children,
  className,
  fullWidth = false,
  rounded = false,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';

  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary shadow-sm hover:shadow-md',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary shadow-sm hover:shadow-md',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:ring-primary shadow-sm hover:shadow-md',
    ghost: 'hover:bg-accent hover:text-accent-foreground focus:ring-primary',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive shadow-sm hover:shadow-md',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow-md',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 shadow-sm hover:shadow-md'
  };

  const sizes = {
    xs: 'h-7 px-2 text-xs gap-1',
    sm: 'h-8 px-3 text-sm gap-1.5',
    md: 'h-10 px-4 py-2 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2.5',
    xl: 'h-14 px-8 text-lg gap-3'
  };

  const roundedClass = rounded ? 'rounded-full' : 'rounded-lg';

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        roundedClass,
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      {!loading && icon && icon}
      {children}
    </motion.button>
  );
};

export default Button;
