import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface MobileNavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  children?: MobileNavItem[];
  disabled?: boolean;
  badge?: string | number;
  external?: boolean;
}

export interface MobileNavProps {
  items: MobileNavItem[];
  activeItem?: string;
  isOpen: boolean;
  onToggle: () => void;
  onItemClick?: (item: MobileNavItem) => void;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  items,
  activeItem,
  isOpen,
  onToggle,
  onItemClick,
  className,
  header,
  footer
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleItemClick = (item: MobileNavItem) => {
    if (item.children && item.children.length > 0) {
      toggleExpanded(item.id);
    } else {
      onItemClick?.(item);
      onToggle(); // Close menu after navigation
    }
  };

  const renderNavItem = (item: MobileNavItem, level = 0): React.ReactNode => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isActive = activeItem === item.id;
    const isParentOfActive = item.children?.some(child => activeItem === child.id);

    return (
      <div key={item.id}>
        <button
          onClick={() => handleItemClick(item)}
          disabled={item.disabled}
          className={cn(
            'w-full flex items-center justify-between px-4 py-3 text-left transition-colors',
            'hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset',
            isActive && 'bg-primary/10 text-primary font-medium',
            isParentOfActive && 'text-primary',
            item.disabled && 'opacity-50 cursor-not-allowed',
            level > 0 && 'pl-8 text-sm'
          )}
        >
          <div className="flex items-center gap-3">
            {item.icon && (
              <span className="flex-shrink-0 w-5 h-5">
                {item.icon}
              </span>
            )}
            <span className="truncate">{item.label}</span>
            {item.badge && (
              <span className={cn(
                'px-2 py-1 text-xs rounded-full',
                isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              )}>
                {item.badge}
              </span>
            )}
          </div>

          {hasChildren && (
            <span className="flex-shrink-0">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
          )}
        </button>

        {hasChildren && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {item.children?.map(child => renderNavItem(child, level + 1))}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className={cn(
          'inline-flex items-center justify-center p-2 rounded-md text-muted-foreground',
          'hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring',
          className
        )}
        aria-expanded={isOpen}
        aria-label="Toggle navigation menu"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile navigation overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={onToggle}
            />

            {/* Mobile menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 z-50 h-full w-80 max-w-[90vw] bg-card border-l border-border shadow-xl lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                {header && (
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    {header}
                    <button
                      onClick={onToggle}
                      className="p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto">
                  <div className="py-2">
                    {items.map(item => renderNavItem(item))}
                  </div>
                </nav>

                {/* Footer */}
                {footer && (
                  <div className="p-4 border-t border-border">
                    {footer}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Hook for managing mobile nav state
export const useMobileNav = (initialOpen = false) => {
  const [isOpen, setIsOpen] = React.useState(initialOpen);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle
  };
};

export default MobileNav;
