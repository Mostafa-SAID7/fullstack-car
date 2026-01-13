import React, { forwardRef } from 'react';
import { useRTL } from '../hooks/useTranslation';
import { cn } from '../lib/utils';

// RTL-aware Container component
interface RTLContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  enableMirroring?: boolean;
}

const RTLContainer = forwardRef<HTMLDivElement, RTLContainerProps>(
  ({ children, className, enableMirroring = true, ...props }, ref) => {
    const { isRTL, direction } = useRTL();

    const containerClasses = cn(
      'rtl-container',
      {
        'rtl-mirrored': enableMirroring && isRTL,
        'flex-row-reverse': enableMirroring && isRTL,
        'text-right': isRTL,
        'text-left': !isRTL,
      },
      className
    );

    return (
      <div
        ref={ref}
        className={containerClasses}
        dir={direction}
        data-rtl={isRTL}
        {...props}
      >
        {children}
      </div>
    );
  }
);

RTLContainer.displayName = 'RTLContainer';

// RTL-aware Flex component
interface RTLFlexProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  wrap?: boolean;
  gap?: number | string;
}

const RTLFlex = forwardRef<HTMLDivElement, RTLFlexProps>(
  ({ 
    children, 
    className, 
    direction = 'row',
    justify = 'start',
    align = 'start',
    wrap = false,
    gap,
    ...props 
  }, ref) => {
    const { isRTL } = useRTL();

    // Adjust direction for RTL
    const getFlexDirection = () => {
      if (direction === 'row' && isRTL) return 'row-reverse';
      if (direction === 'row-reverse' && isRTL) return 'row';
      return direction;
    };

    // Adjust justify for RTL
    const getJustifyContent = () => {
      if (isRTL) {
        switch (justify) {
          case 'start': return 'end';
          case 'end': return 'start';
          default: return justify;
        }
      }
      return justify;
    };

    const flexClasses = cn(
      'flex',
      `flex-${getFlexDirection()}`,
      `justify-${getJustifyContent()}`,
      `items-${align}`,
      {
        'flex-wrap': wrap,
      },
      gap && `gap-${gap}`,
      className
    );

    return (
      <div
        ref={ref}
        className={flexClasses}
        {...props}
      >
        {children}
      </div>
    );
  }
);

RTLFlex.displayName = 'RTLFlex';

// RTL-aware Grid component
interface RTLGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  cols?: number | string;
  rows?: number | string;
  gap?: number | string;
  autoFlow?: 'row' | 'col' | 'row-dense' | 'col-dense';
}

const RTLGrid = forwardRef<HTMLDivElement, RTLGridProps>(
  ({ 
    children, 
    className, 
    cols,
    rows,
    gap,
    autoFlow = 'row',
    ...props 
  }, ref) => {
    const { isRTL } = useRTL();

    const gridClasses = cn(
      'grid',
      cols && `grid-cols-${cols}`,
      rows && `grid-rows-${rows}`,
      gap && `gap-${gap}`,
      autoFlow && `grid-flow-${autoFlow}`,
      {
        'rtl-grid': isRTL,
      },
      className
    );

    return (
      <div
        ref={ref}
        className={gridClasses}
        {...props}
      >
        {children}
      </div>
    );
  }
);

RTLGrid.displayName = 'RTLGrid';

// RTL-aware Text component
interface RTLTextProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  align?: 'left' | 'right' | 'center' | 'justify' | 'auto';
  truncate?: boolean;
}

const RTLText = forwardRef<HTMLElement, RTLTextProps>(
  ({ 
    children, 
    className, 
    as: Component = 'p',
    align = 'auto',
    truncate = false,
    ...props 
  }, ref) => {
    const { isRTL } = useRTL();

    const getTextAlign = () => {
      if (align === 'auto') {
        return isRTL ? 'right' : 'left';
      }
      if (align === 'left' && isRTL) return 'right';
      if (align === 'right' && isRTL) return 'left';
      return align;
    };

    const textClasses = cn(
      `text-${getTextAlign()}`,
      {
        'truncate': truncate,
        'rtl-text': isRTL,
      },
      className
    );

    return (
      <Component
        ref={ref as any}
        className={textClasses}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

RTLText.displayName = 'RTLText';

// RTL-aware Sidebar component
interface RTLSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  position?: 'left' | 'right' | 'auto';
  width?: string | number;
  collapsed?: boolean;
}

const RTLSidebar = forwardRef<HTMLDivElement, RTLSidebarProps>(
  ({ 
    children, 
    className, 
    position = 'auto',
    width = '16rem',
    collapsed = false,
    ...props 
  }, ref) => {
    const { isRTL } = useRTL();

    const getSidebarPosition = () => {
      if (position === 'auto') {
        return isRTL ? 'right' : 'left';
      }
      return position;
    };

    const sidebarPosition = getSidebarPosition();
    const sidebarClasses = cn(
      'fixed top-0 h-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 transition-all duration-300 z-sidebar',
      {
        'left-0 border-r': sidebarPosition === 'left',
        'right-0 border-l': sidebarPosition === 'right',
        'w-16': collapsed,
      },
      className
    );

    const sidebarStyle = {
      width: collapsed ? '4rem' : width,
      ...(!collapsed && { [sidebarPosition]: 0 }),
    };

    return (
      <div
        ref={ref}
        className={sidebarClasses}
        style={sidebarStyle}
        data-position={sidebarPosition}
        data-collapsed={collapsed}
        {...props}
      >
        {children}
      </div>
    );
  }
);

RTLSidebar.displayName = 'RTLSidebar';

// RTL-aware Navigation component
interface RTLNavProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: 'nav' | 'div' | 'ul';
  orientation?: 'horizontal' | 'vertical';
  spacing?: number | string;
}

const RTLNav = forwardRef<HTMLElement, RTLNavProps>(
  ({ 
    children, 
    className, 
    as: Component = 'nav',
    orientation = 'horizontal',
    spacing = 4,
    ...props 
  }, ref) => {
    const { isRTL } = useRTL();

    const navClasses = cn(
      'rtl-nav',
      {
        'flex': orientation === 'horizontal',
        'flex-col': orientation === 'vertical',
        'flex-row-reverse': orientation === 'horizontal' && isRTL,
        'space-x-reverse': orientation === 'horizontal' && isRTL,
      },
      orientation === 'horizontal' ? `space-x-${spacing}` : `space-y-${spacing}`,
      className
    );

    return (
      <Component
        ref={ref as any}
        className={navClasses}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

RTLNav.displayName = 'RTLNav';

// RTL-aware Button component
interface RTLButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  iconPosition?: 'left' | 'right' | 'auto';
  icon?: React.ReactNode;
}

const RTLButton = forwardRef<HTMLButtonElement, RTLButtonProps>(
  ({ 
    children, 
    className, 
    variant = 'primary',
    size = 'md',
    iconPosition = 'auto',
    icon,
    ...props 
  }, ref) => {
    const { isRTL } = useRTL();

    const getIconPosition = () => {
      if (iconPosition === 'auto') {
        return isRTL ? 'right' : 'left';
      }
      if (iconPosition === 'left' && isRTL) return 'right';
      if (iconPosition === 'right' && isRTL) return 'left';
      return iconPosition;
    };

    const actualIconPosition = getIconPosition();
    const buttonClasses = cn(
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      {
        'flex-row-reverse': isRTL,
      },
      className
    );

    return (
      <button
        ref={ref}
        className={buttonClasses}
        {...props}
      >
        {icon && actualIconPosition === 'left' && (
          <span className={cn('btn-icon', isRTL ? 'ml-2' : 'mr-2')}>
            {icon}
          </span>
        )}
        {children}
        {icon && actualIconPosition === 'right' && (
          <span className={cn('btn-icon', isRTL ? 'mr-2' : 'ml-2')}>
            {icon}
          </span>
        )}
      </button>
    );
  }
);

RTLButton.displayName = 'RTLButton';

// RTL-aware Card component
interface RTLCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: number | string;
}

const RTLCard = forwardRef<HTMLDivElement, RTLCardProps>(
  ({ 
    children, 
    className, 
    header,
    footer,
    padding = 6,
    ...props 
  }, ref) => {
    const { isRTL } = useRTL();

    const cardClasses = cn(
      'card',
      {
        'rtl-card': isRTL,
      },
      className
    );

    return (
      <div
        ref={ref}
        className={cardClasses}
        {...props}
      >
        {header && (
          <div className={cn('card-header', `p-${padding}`, { 'text-right': isRTL })}>
            {header}
          </div>
        )}
        <div className={cn('card-body', `p-${padding}`)}>
          {children}
        </div>
        {footer && (
          <div className={cn('card-footer', `p-${padding}`, { 'text-right': isRTL })}>
            {footer}
          </div>
        )}
      </div>
    );
  }
);

RTLCard.displayName = 'RTLCard';

// RTL-aware Form components
interface RTLFormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  label?: string;
  error?: string;
  required?: boolean;
  helpText?: string;
}

const RTLFormField = forwardRef<HTMLDivElement, RTLFormFieldProps>(
  ({ 
    children, 
    className, 
    label,
    error,
    required = false,
    helpText,
    ...props 
  }, ref) => {
    const { isRTL } = useRTL();

    const fieldClasses = cn(
      'form-group',
      {
        'rtl-form-field': isRTL,
      },
      className
    );

    return (
      <div
        ref={ref}
        className={fieldClasses}
        {...props}
      >
        {label && (
          <label className={cn(
            'form-label',
            { 'form-label-required': required },
            { 'text-right': isRTL }
          )}>
            {label}
          </label>
        )}
        {children}
        {error && (
          <div className={cn('form-error', { 'text-right': isRTL })}>
            {error}
          </div>
        )}
        {helpText && (
          <div className={cn('form-help', { 'text-right': isRTL })}>
            {helpText}
          </div>
        )}
      </div>
    );
  }
);

RTLFormField.displayName = 'RTLFormField';

// Export all RTL utilities
export {
  RTLContainer,
  RTLFlex,
  RTLGrid,
  RTLText,
  RTLSidebar,
  RTLNav,
  RTLButton,
  RTLCard,
  RTLFormField,
};