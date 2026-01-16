import React, { ReactNode } from 'react';

interface ResponsiveGridProps {
  children: ReactNode;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: number;
  className?: string;
}

/**
 * Responsive Grid Component
 * Automatically adjusts columns based on screen size
 */
export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  cols = { xs: 1, sm: 2, md: 2, lg: 3, xl: 4, '2xl': 4 },
  gap = 6,
  className = ''
}) => {
  const gridClasses = [
    'grid',
    `gap-${gap}`,
    cols.xs && `grid-cols-${cols.xs}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    cols['2xl'] && `2xl:grid-cols-${cols['2xl']}`,
    className
  ].filter(Boolean).join(' ');

  return <div className={gridClasses}>{children}</div>;
};

/**
 * Responsive Stats Grid
 * Optimized for stat cards
 */
export const ResponsiveStatsGrid: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 ${className}`}>
      {children}
    </div>
  );
};

/**
 * Responsive Two Column Layout
 * Main content + sidebar
 */
export const ResponsiveTwoColumn: React.FC<{
  main: ReactNode;
  sidebar: ReactNode;
  sidebarPosition?: 'left' | 'right';
  className?: string;
}> = ({
  main,
  sidebar,
  sidebarPosition = 'right',
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${className}`}>
      {sidebarPosition === 'left' && (
        <aside className="lg:col-span-3">{sidebar}</aside>
      )}
      <main className={sidebarPosition === 'left' ? 'lg:col-span-9' : 'lg:col-span-9'}>
        {main}
      </main>
      {sidebarPosition === 'right' && (
        <aside className="lg:col-span-3">{sidebar}</aside>
      )}
    </div>
  );
};
