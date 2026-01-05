import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  current?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  showHome?: boolean;
  homeHref?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'muted' | 'underline';
  className?: string;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator,
  showHome = true,
  homeHref = '/',
  size = 'md',
  variant = 'default',
  className,
  onItemClick
}) => {
  const defaultSeparator = <ChevronRight className="w-4 h-4" />;

  const sizes = {
    sm: 'text-sm gap-1',
    md: 'text-sm gap-2',
    lg: 'text-base gap-2'
  };

  const variants = {
    default: 'text-foreground',
    muted: 'text-muted-foreground',
    underline: 'text-muted-foreground hover:text-foreground'
  };

  const allItems: BreadcrumbItem[] = showHome
    ? [{ label: 'Home', href: homeHref, icon: <Home className="w-4 h-4" /> }, ...items]
    : items;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className={cn('flex items-center', sizes[size])}>
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isCurrent = item.current || isLast;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="text-muted-foreground mx-1">
                  {separator || defaultSeparator}
                </span>
              )}

              {isCurrent ? (
                <span
                  className={cn(
                    'flex items-center gap-1 font-medium',
                    variants[variant],
                    isCurrent && 'text-foreground'
                  )}
                  aria-current="page"
                >
                  {item.icon && item.icon}
                  <span>{item.label}</span>
                </span>
              ) : (
                <button
                  onClick={() => onItemClick?.(item, index)}
                  className={cn(
                    'flex items-center gap-1 transition-colors hover:text-foreground',
                    variants[variant]
                  )}
                >
                  {item.icon && item.icon}
                  <span>{item.label}</span>
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// Hook for managing breadcrumbs state
export const useBreadcrumbs = (initialItems: BreadcrumbItem[] = []) => {
  const [items, setItems] = React.useState<BreadcrumbItem[]>(initialItems);

  const addItem = React.useCallback((item: BreadcrumbItem) => {
    setItems(prev => [...prev, item]);
  }, []);

  const removeItem = React.useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateItem = React.useCallback((index: number, item: BreadcrumbItem) => {
    setItems(prev => prev.map((prevItem, i) => i === index ? item : prevItem));
  }, []);

  const clearItems = React.useCallback(() => {
    setItems([]);
  }, []);

  return {
    items,
    addItem,
    removeItem,
    updateItem,
    clearItems,
    setItems
  };
};

export default Breadcrumbs;
