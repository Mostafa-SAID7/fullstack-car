/**
 * AdminSidebar Component
 * Collapsible administrative sidebar with role-based navigation and search
 */

import React, { useState } from 'react';
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

// Navigation item component
const NavigationItemComponent: React.FC<{
  item: NavigationItem;
  isActive: boolean;
  isCollapsed: boolean;
  onNavigate: (path: string) => void;
  level?: number;
}> = ({ item, isActive, isCollapsed, onNavigate, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (hasChildren && !isCollapsed) {
      setIsExpanded(!isExpanded);
    } else {
      onNavigate(item.path);
    }
  };

  return (
    <div>
      {/* Main item */}
      <button
        onClick={handleClick}
        className={`
          w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors duration-200
          ${level > 0 ? 'ml-4' : ''}
          ${isActive 
            ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }
        `}
        title={isCollapsed ? item.label : undefined}
      >
        <Icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0`} />
        
        {!isCollapsed && (
          <>
            <span className="flex-1 text-sm font-medium truncate">
              {item.label}
            </span>
            
            {/* Badge */}
            {item.badge && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full">
                {item.badge}
              </span>
            )}
            
            {/* Expand/collapse icon for items with children */}
            {hasChildren && (
              <ChevronRight 
                className={`h-4 w-4 ml-2 transition-transform duration-200 ${
                  isExpanded ? 'rotate-90' : ''
                }`} 
              />
            )}
          </>
        )}
      </button>

      {/* Children (only show when not collapsed and expanded) */}
      {hasChildren && !isCollapsed && isExpanded && (
        <div className="mt-1 space-y-1">
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
      )}
    </div>
  );
};

// Search results component
const SearchResults: React.FC<{
  results: NavigationItem[];
  onNavigate: (path: string) => void;
  onClearSearch: () => void;
}> = ({ results, onNavigate, onClearSearch }) => {
  if (results.length === 0) {
    return (
      <div className="px-3 py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
        No results found
      </div>
    );
  }

  return (
    <div className="px-3 py-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Search Results ({results.length})
        </span>
        <Button
          onClick={onClearSearch}
          variant="ghost"
          size="sm"
          className="p-1"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      
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
              className="w-full flex items-center px-2 py-2 text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <Icon className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {item.label}
                </div>
                {item.description && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {item.description}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Props for AdminSidebar
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
}

/**
 * AdminSidebar Component
 * 
 * Provides collapsible sidebar navigation with role-based menu items,
 * search functionality, and responsive design.
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
  searchResults
}) => {
  const [searchFocused, setSearchFocused] = useState(false);

  // Check if a navigation item or its children are active
  const isItemActive = (item: NavigationItem): boolean => {
    if (currentPath === item.path) return true;
    if (item.children) {
      return item.children.some(child => isItemActive(child));
    }
    return currentPath.startsWith(item.path + '/');
  };

  // Clear search
  const handleClearSearch = () => {
    onSearchChange('');
    setSearchFocused(false);
  };

  return (
    <>
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'w-16' : 'w-64'}
        lg:translate-x-0
      `}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                Admin
              </span>
            </div>
          )}
          
          {/* Collapse toggle (desktop only) */}
          <Button
            onClick={onToggleCollapse}
            variant="ghost"
            size="sm"
            className="hidden lg:flex p-1.5"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Search bar */}
        {!isCollapsed && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search navigation..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {searchQuery && (
                <Button
                  onClick={handleClearSearch}
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Navigation content */}
        <div className="flex-1 overflow-y-auto">
          {searchQuery && !isCollapsed ? (
            /* Search results */
            <SearchResults
              results={searchResults}
              onNavigate={onNavigate}
              onClearSearch={handleClearSearch}
            />
          ) : (
            /* Regular navigation */
            <nav className="p-4 space-y-2">
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

        {/* Sidebar footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Admin Dashboard v1.0
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default AdminSidebar;