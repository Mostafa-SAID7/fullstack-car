/**
 * AdminHeader Component
 * Administrative header with user profile, notifications, and system controls
 */

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useSignalRContext } from '../../contexts/SignalRContext';
import { AdminRole } from '../../types/admin';
import { 
  Menu,
  Bell,
  Search,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  Shield,
  Crown,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  Info,
  X,
  Loader2,
  Wifi,
  WifiOff,
  Activity,
  Zap
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../lib/utils';

// Navigation item interface (shared with AdminMainLayout)
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

// Enhanced notification interface with priority and category
interface AdminNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'system';
  category: 'system' | 'user' | 'security' | 'performance' | 'maintenance';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionUrl?: string;
  actionLabel?: string;
  autoExpire?: boolean;
  expiresAt?: Date;
}

// Enhanced mock notifications with real-time system alerts
const MOCK_NOTIFICATIONS: AdminNotification[] = [
  {
    id: '1',
    type: 'warning',
    category: 'maintenance',
    title: 'System Maintenance',
    message: 'Scheduled maintenance in 2 hours',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    priority: 'high',
    actionUrl: '/admin/super-admin/health',
    actionLabel: 'View Details'
  },
  {
    id: '2',
    type: 'info',
    category: 'user',
    title: 'New User Registration',
    message: '15 new users registered today',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    priority: 'medium',
    actionUrl: '/admin/administration/users',
    actionLabel: 'View Users'
  },
  {
    id: '3',
    type: 'success',
    category: 'system',
    title: 'Backup Completed',
    message: 'Daily backup completed successfully',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true,
    priority: 'low'
  },
  {
    id: '4',
    type: 'system',
    category: 'performance',
    title: 'High CPU Usage',
    message: 'Server CPU usage is at 85%',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    read: false,
    priority: 'critical',
    actionUrl: '/admin/super-admin/health',
    actionLabel: 'Monitor System'
  }
];

// Role display configuration
const ROLE_CONFIG: Record<AdminRole, { label: string; color: string; icon: React.ComponentType<any> }> = {
  [AdminRole.SUPER_ADMIN]: {
    label: 'Super Admin',
    color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20',
    icon: Crown
  },
  [AdminRole.ADMINISTRATION_ADMIN]: {
    label: 'Administration',
    color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20',
    icon: Shield
  },
  [AdminRole.CONTENT_ADMIN]: {
    label: 'Content',
    color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20',
    icon: Shield
  },
  [AdminRole.MARKETPLACE_ADMIN]: {
    label: 'Marketplace',
    color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20',
    icon: Shield
  },
  [AdminRole.AI_AGENT_ADMIN]: {
    label: 'AI Agent',
    color: 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/20',
    icon: Shield
  },
  [AdminRole.MARKETING_ADMIN]: {
    label: 'Marketing',
    color: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20',
    icon: Shield
  }
};

// Enhanced notification dropdown component with real-time features
const NotificationDropdown: React.FC<{
  notifications: AdminNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNotificationAction: (notification: AdminNotification) => void;
}> = ({ notifications, onMarkAsRead, onMarkAllAsRead, onNotificationAction }) => {
  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = notifications.filter(n => n.priority === 'critical' && !n.read).length;

  const getNotificationIcon = (type: AdminNotification['type']) => {
    switch (type) {
      case 'error': return AlertCircle;
      case 'warning': return AlertCircle;
      case 'success': return CheckCircle;
      case 'system': return Activity;
      default: return Info;
    }
  };

  const getNotificationColor = (type: AdminNotification['type'], priority: AdminNotification['priority']) => {
    if (priority === 'critical') {
      return 'text-red-600 dark:text-red-400';
    }
    switch (type) {
      case 'error': return 'text-red-600 dark:text-red-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'success': return 'text-green-600 dark:text-green-400';
      case 'system': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-blue-600 dark:text-blue-400';
    }
  };

  const getPriorityBadge = (priority: AdminNotification['priority']) => {
    const badges = {
      critical: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      low: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    };
    return badges[priority];
  };

  // Sort notifications by priority and timestamp
  const sortedNotifications = [...notifications].sort((a, b) => {
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  return (
    <div className="w-96 max-h-[32rem] overflow-hidden flex flex-col">
      {/* Enhanced Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <Button
              onClick={onMarkAllAsRead}
              variant="ghost"
              size="sm"
              className="text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Mark all read
            </Button>
          )}
        </div>
        
        {/* Notification stats */}
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center space-x-1">
            <Bell className="h-4 w-4" />
            <span>{unreadCount} unread</span>
          </span>
          {criticalCount > 0 && (
            <span className="flex items-center space-x-1 text-red-600 dark:text-red-400">
              <Zap className="h-4 w-4" />
              <span>{criticalCount} critical</span>
            </span>
          )}
        </div>
      </div>

      {/* Notifications list with enhanced styling */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
        {sortedNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No notifications</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              You're all caught up!
            </p>
          </div>
        ) : (
          sortedNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const iconColor = getNotificationColor(notification.type, notification.priority);
            
            return (
              <div
                key={notification.id}
                className={cn(
                  "p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors",
                  !notification.read && "bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500",
                  notification.priority === 'critical' && !notification.read && "bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500"
                )}
                onClick={() => onMarkAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 relative">
                    <Icon className={cn("h-5 w-5 mt-0.5", iconColor)} />
                    {notification.priority === 'critical' && (
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {notification.title}
                          </p>
                          <span className={cn(
                            "px-2 py-0.5 text-xs font-medium rounded-full",
                            getPriorityBadge(notification.priority)
                          )}>
                            {notification.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {notification.timestamp.toLocaleString()}
                          </p>
                          {notification.actionUrl && notification.actionLabel && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                onNotificationAction(notification);
                              }}
                              variant="ghost"
                              size="sm"
                              className="text-xs h-6 px-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                            >
                              {notification.actionLabel}
                            </Button>
                          )}
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="h-2 w-2 bg-blue-600 rounded-full ml-2 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer with notification settings */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <Settings className="h-4 w-4 mr-2" />
          Notification Settings
        </Button>
      </div>
    </div>
  );
};
          </h3>
          {unreadCount > 0 && (
            <Button
              onClick={onMarkAllAsRead}
              variant="ghost"
              size="sm"
              className="text-sm"
            >
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Notifications list */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const iconColor = getNotificationColor(notification.type);
            
            return (
              <div
                key={notification.id}
                className={`
                  p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer
                  ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}
                `}
                onClick={() => onMarkAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  <Icon className={`h-5 w-5 mt-0.5 ${iconColor}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="h-2 w-2 bg-blue-600 rounded-full" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      {notification.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// User profile dropdown component
const UserProfileDropdown: React.FC<{
  adminUser: any;
  onLogout: () => void;
}> = ({ adminUser, onLogout }) => {
  const primaryRole = adminUser?.roles?.[0];
  const roleConfig = primaryRole ? ROLE_CONFIG[primaryRole] : null;
  const RoleIcon = roleConfig?.icon || Shield;

  return (
    <div className="w-64">
      {/* User info */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {adminUser?.firstName} {adminUser?.lastName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {adminUser?.email}
            </p>
          </div>
        </div>
        
        {/* Roles */}
        <div className="mt-3 flex flex-wrap gap-1">
          {adminUser?.roles?.map((role: AdminRole) => {
            const config = ROLE_CONFIG[role];
            const Icon = config.icon;
            
            return (
              <span
                key={role}
                className={`
                  inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                  ${config.color}
                `}
              >
                <Icon className="h-3 w-3 mr-1" />
                {config.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Menu items */}
      <div className="py-2">
        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center">
          <User className="h-4 w-4 mr-3" />
          Profile Settings
        </button>
        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center">
          <Settings className="h-4 w-4 mr-3" />
          Preferences
        </button>
        <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
        <button
          onClick={onLogout}
          className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

// Props for AdminHeader with enhanced functionality
interface AdminHeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
  currentPath?: string;
  navigationItems?: NavigationItem[];
}

/**
 * AdminHeader Component
 * 
 * Provides the main administrative header with user profile dropdown,
 * notification center, theme toggle, system controls, and contextual page titles.
 * 
 * Features:
 * - Dynamic page title based on current route
 * - Enhanced notification system with real-time updates
 * - Improved user profile dropdown with role display
 * - Responsive design with mobile optimization
 * - Keyboard shortcuts and accessibility
 */
export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleSidebar,
  sidebarCollapsed,
  currentPath = '',
  navigationItems = []
}) => {
  const { adminUser, logout } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
  
  // Component state
  const [notifications, setNotifications] = useState<AdminNotification[]>(MOCK_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Refs for dropdowns
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Get current page title from navigation items
  const currentPageTitle = useMemo(() => {
    const findPageTitle = (items: NavigationItem[], path: string): string => {
      for (const item of items) {
        if (item.path === path) {
          return item.label;
        }
        if (item.children) {
          const childTitle = findPageTitle(item.children, path);
          if (childTitle) return childTitle;
        }
      }
      return 'Admin Dashboard';
    };

    return findPageTitle(navigationItems, currentPath);
  }, [currentPath, navigationItems]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle notification actions
  const handleMarkAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  // Handle logout
  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
      setShowUserMenu(false);
    }
  }, [logout]);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 shadow-sm">
      <div className="px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Mobile menu button and page title */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={onToggleSidebar}
              variant="ghost"
              size="sm"
              className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Dynamic page title */}
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {currentPageTitle}
              </h1>
              {currentPath && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {currentPath}
                </span>
              )}
            </div>
          </div>

          {/* Right side - Actions with improved spacing */}
          <div className="flex items-center space-x-3">
            {/* Enhanced search - Hidden on mobile */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search admin... (⌘K)"
                  className={cn(
                    "pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg",
                    "bg-white dark:bg-gray-700 text-sm placeholder-gray-500 dark:placeholder-gray-400",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                    "transition-all duration-200 w-64"
                  )}
                  onFocus={(e) => e.target.select()}
                />
              </div>
            </div>

            {/* Theme toggle with improved styling */}
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </Button>

            {/* Enhanced notifications */}
            <div className="relative" ref={notificationRef}>
              <Button
                onClick={() => setShowNotifications(!showNotifications)}
                variant="ghost"
                size="sm"
                className="p-2 relative hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label={`Notifications ${unreadNotifications > 0 ? `(${unreadNotifications} unread)` : ''}`}
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </Button>

              {/* Enhanced notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 min-w-80">
                  <NotificationDropdown
                    notifications={notifications}
                    onMarkAsRead={handleMarkAsRead}
                    onMarkAllAsRead={handleMarkAllAsRead}
                  />
                </div>
              )}
            </div>

            {/* Enhanced user menu */}
            <div className="relative" ref={userMenuRef}>
              <Button
                onClick={() => setShowUserMenu(!showUserMenu)}
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                disabled={isLoggingOut}
                aria-label="User menu"
              >
                {isLoggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {adminUser?.firstName} {adminUser?.lastName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {adminUser?.roles?.[0] && ROLE_CONFIG[adminUser.roles[0]]?.label}
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </>
                )}
              </Button>

              {/* Enhanced user dropdown */}
              {showUserMenu && !isLoggingOut && (
                <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <UserProfileDropdown
                    adminUser={adminUser}
                    onLogout={handleLogout}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;