import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  children?: NavItem[];
  disabled?: boolean;
  badge?: string | number;
  external?: boolean;
}

export interface SideNavProps {
  items: NavItem[];
  activeItem?: string;
  collapsed?: boolean;
  onItemClick?: (item: NavItem) => void;
  onToggleCollapse?: () => void;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const SideNav: React.FC<SideNavProps> = ({
  items,
  activeItem,
  collapsed = false,
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

  const handleItemClick = (item: NavItem) => {
    if (item.children && item.children.length > 0) {
      toggleExpanded(item.id);
    } else {
      onItemClick?.(item);
    }
  };

  const renderNavItem = (item: NavItem, level = 0): React.ReactNode => {
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
            'w-full flex items-center gap-3 px-3 py-2 text-left transition-colors rounded-lg mx-2',
            'hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            isActive && 'bg-primary/10 text-primary font-medium',
            isParentOfActive && 'text-primary',
            item.disabled && 'opacity-50 cursor-not-allowed',
            level > 0 && 'ml-4 text-sm'
          )}
        >
          {item.icon && (
            <span className="flex-shrink-0 w-5 h-5">
              {item.icon}
            </span>
          )}

          {!collapsed && (
            <>
              <span className="flex-1 truncate">
                {item.label}
              </span>

              {item.badge && (
                <span className={cn(
                  'px-2 py-1 text-xs rounded-full flex-shrink-0',
                  isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}>
                  {item.badge}
                </span>
              )}

              {hasChildren && (
                <span className="flex-shrink-0">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </span>
              )}
            </>
          )}

          {collapsed && item.icon && (
            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
              <span className="w-4 h-4">
                {item.icon}
              </span>
            </div>
          )}
        </button>

        {hasChildren && isExpanded && !collapsed && (
          <div className="mt-1">
            {item.children?.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className={cn(
      'flex flex-col h-full bg-card border-r border-border transition-all duration-300',
      collapsed ? 'w-16' : 'w-64',
      className
    )}>
      {header && (
        <div className="p-4 border-b border-border">
          {header}
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1">
          {items.map(item => renderNavItem(item))}
        </div>
      </nav>

      {footer && (
        <div className="p-4 border-t border-border">
          {footer}
        </div>
      )}
    </aside>
  );
};

export default SideNav;
