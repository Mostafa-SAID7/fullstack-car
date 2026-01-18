/**
 * AdminSidebar Component
 * Collapsible administrative sidebar with role-based navigation and search
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AdminRole } from '../../types/admin';
import { 
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Home,
  Crown
} from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

// Navigation item interface (imported from AdminMainLayout)
interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  roles: AdminRole[];
  children?: NavigationItem[];
  badge?: string | number;
  description?: string;
}

// Enhanced navigation item component with improved accessibility and animations
const NavigationItemComponent: React.FC<{
  item: NavigationItem;
  isActive: boolean;
  isCollapsed: boolean;
  onNavigate: (path: string) => void;
  level?: number;
}> = ({ item, isActive, isCollapsed, onNavigate, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(isActive);
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;

  // Auto-expand if this item or its children are active
  useEffect(() => {
    if (isActive) {
      setIsExpanded(true);
    }
  }, [isActive]);

  const handleClick = useCallback(() => {
    if (hasChildren && !isCollapsed) {
      setIsExpanded(!isExpanded);
    } else {
      onNavigate(item.path);
    }
  }, [hasChildren, isCollapsed, isExpanded, onNavigate, item.path]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  return (
    <div>
      {/* Main item with enhanced styling and accessibility */}
      <button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full flex items-center px-3 py-2.5 text-left rounded-lg transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          "group relative",
          level > 0 && "ml-4",
          isActive 
            ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        )}
        title={isCollapsed ? `${item.label}${item.description ? ` - ${item.description}` : ''}` : undefined}
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-label={`${item.label}${item.description ? ` - ${item.description}` : ''}`}
      >
        {/* Icon with improved styling */}
        <Icon className={cn(
          "h-5 w-5 flex-shrink-0 transition-colors duration-200",
          isCollapsed ? '' : 'mr-3',
          isActive 
            ? 'text-blue-600 dark:text-blue-400' 
            : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
        )} />
        
        {!isCollapsed && (
          <>
            {/* Label and description */}
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium truncate block">
                {item.label}
              </span>
              {item.description && level === 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate block mt-0.5">
                  {item.description}
                </span>
              )}
            </div>
            
            {/* Badge */}
            {item.badge && (
              <span className={cn(
                "ml-2 px-2 py-0.5 text-xs rounded-full font-medium",
                "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300"
              )}>
                {item.badge}
              </span>
            )}
            
            {/* Expand/collapse icon for items with children */}
            {hasChildren && (
              <ChevronRight 
                className={cn(
                  "h-4 w-4 ml-2 transition-transform duration-200 flex-shrink-0",
                  isExpanded && 'rotate-90',
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-400 dark:text-gray-500'
                )} 
              />
            )}
          </>
        )}

        {/* Active indicator */}
        {isActive && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
        )}
      </button>

      {/* Children with smooth animation */}
      {hasChildren && !isCollapsed && (
        <div className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}>
          <div className="mt-1 space-y-1 pb-1">
            {item.children?.map((child) => (
              <NavigationItemComponent
                key={child.id}
                item={child}
                isActive={child.path === window.location.pathname}
                isCollapsed={false}
                onNavigate={onNavigate}
                level={level + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced search results component with highlighting
const SearchResults: React.FC<{
  results: NavigationItem[];
  onNavigate: (path: string) => void;
  onClearSearch: () => void;
  searchQuery: string;
}> = ({ results, onNavigate, onClearSearch, searchQuery }) => {
  // Highlight matching text in search results
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 text-gray-900 dark:text-white px-0.5 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  if (results.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <Search className="h-8 w-8 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
          No results found
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-xs">
          Try adjusting your search terms
        </p>
      </div>
    );
  }

  return (
    <div className="px-3 py-2">
      {/* Search results header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Search Results ({results.length})
        </span>
        <Button
          onClick={onClearSearch}
          variant="ghost"
          size="sm"
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Clear search results"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      {/* Results list with improved styling */}
      <div className="space-y-1">
        {results.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.path);
                onClearSearch();
              }}
              className={cn(
                "w-full flex items-center px-3 py-2.5 text-left rounded-lg",
                "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                "group"
              )}
            >
              <Icon className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {highlightText(item.label, searchQuery)}
                </div>
                {item.description && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    {highlightText(item.description, searchQuery)}
                  </div>
                )}
              </div>
              {item.badge && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Props for AdminSidebar with enhanced functionality
interface AdminSidebarProps {
  navigation: NavigationItem[];
  isOpen: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onNavigate: (path: string) => void;
  currentPath: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchResults: NavigationItem[];
  searchFocused?: boolean;
  onSearchFocusChange?: (focused: boolean) => void;
}

/**
 * AdminSidebar Component
 * 
 * Provides collapsible sidebar navigation with role-based menu items,
 * enhanced search functionality, responsive design, and improved accessibility.
 * 
 * Features:
 * - Role-based navigation filtering
 * - Enhanced search with keyboard shortcuts
 * - Responsive collapse/expand behavior
 * - Improved accessibility with ARIA labels
 * - Smooth animations and transitions
 * - Keyboard navigation support
 */
export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  navigation,
  isOpen,
  isCollapsed,
  onToggleCollapse,
  onNavigate,
  currentPath,
  searchQuery,
  onSearchChange,
  searchResults,
  searchFocused = false,
  onSearchFocusChange
}) => {
  const [searchInputRef, setSearchInputRef] = useState<HTMLInputElement | null>(null);

  // Focus search input when searchFocused changes
  useEffect(() => {
    if (searchFocused && searchInputRef && !isCollapsed) {
      searchInputRef.focus();
      searchInputRef.select();
    }
  }, [searchFocused, searchInputRef, isCollapsed]);

  // Check if a navigation item or its children are active
  const isItemActive = useCallback((item: NavigationItem): boolean => {
    if (currentPath === item.path) return true;
    if (item.children) {
      return item.children.some(child => isItemActive(child));
    }
    return currentPath.startsWith(item.path + '/');
  }, [currentPath]);

  // Clear search with enhanced functionality
  const handleClearSearch = useCallback(() => {
    onSearchChange('');
    onSearchFocusChange?.(false);
  }, [onSearchChange, onSearchFocusChange]);

  // Handle search input focus
  const handleSearchFocus = useCallback(() => {
    onSearchFocusChange?.(true);
  }, [onSearchFocusChange]);

  // Handle search input blur
  const handleSearchBlur = useCallback(() => {
    // Delay blur to allow for click events on search results
    setTimeout(() => {
      onSearchFocusChange?.(false);
    }, 150);
  }, [onSearchFocusChange]);

  return (
    <>
      {/* Sidebar with enhanced styling and accessibility */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700",
          "transition-all duration-300 ease-in-out shadow-lg",
          isOpen ? 'translate-x-0' : '-translate-x-full',
          isCollapsed ? 'w-16' : 'w-64',
          'lg:translate-x-0'
        )}
        role="navigation"
        aria-label="Administrative navigation"
      >
        {/* Sidebar header with improved branding */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  Admin
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Dashboard
                </span>
              </div>
            </div>
          )}
          
          {/* Collapse toggle with improved styling */}
          <Button
            onClick={onToggleCollapse}
            variant="ghost"
            size="sm"
            className={cn(
              "hidden lg:flex p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700",
              "transition-colors duration-200"
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Enhanced search bar with keyboard shortcut hint */}
        {!isCollapsed && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/25">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={setSearchInputRef}
                type="text"
                placeholder="Search navigation... (⌘K)"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className={cn(
                  "w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg",
                  "bg-white dark:bg-gray-700 text-sm placeholder-gray-500 dark:placeholder-gray-400",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                  "transition-all duration-200"
                )}
                aria-label="Search navigation items"
              />
              {searchQuery && (
                <Button
                  onClick={handleClearSearch}
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-600"
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Navigation content with improved scrolling */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {searchQuery && !isCollapsed ? (
            /* Enhanced search results */
            <SearchResults
              results={searchResults}
              onNavigate={onNavigate}
              onClearSearch={handleClearSearch}
              searchQuery={searchQuery}
            />
          ) : (
            /* Regular navigation with improved spacing */
            <nav className="p-4 space-y-2" role="navigation">
              {navigation.map((item) => (
                <NavigationItemComponent
                  key={item.id}
                  item={item}
                  isActive={isItemActive(item)}
                  isCollapsed={isCollapsed}
                  onNavigate={onNavigate}
                />
              ))}
            </nav>
          )}
        </div>

        {/* Enhanced sidebar footer with version and status */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/25">
            <div className="text-center space-y-1">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Admin Dashboard v2.1
              </div>
              <div className="flex items-center justify-center space-x-1">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  System Online
                </span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default AdminSidebar;