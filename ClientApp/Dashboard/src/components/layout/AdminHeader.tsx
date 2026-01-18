/**
 * AdminHeader Component
 * Administrative header with user profile, notifications, and system controls
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
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
  Loader2
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useTheme } from '../../contexts/ThemeContext';

// Notification interface
interface AdminNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

// Mock notifications for demonstration
const MOCK_NOTIFICATIONS: AdminNotification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'System Maintenance',
    message: 'Scheduled maintenance in 2 hours',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    actionUrl: '/admin/super-admin/health'
  },
  {
    id: '2',
    type: 'info',
    title: 'New User Registration',
    message: '15 new users registered today',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    actionUrl: '/admin/administration/users'
  },
  {
    id: '3',
    type: 'success',
    title: 'Backup Completed',
    message: 'Daily backup completed successfully',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true
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

// Notification dropdown component
const NotificationDropdown: React.FC<{
  notifications: AdminNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}> = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: AdminNotification['type']) => {
    switch (type) {
      case 'error': return AlertCircle;
      case 'warning': return AlertCircle;
      case 'success': return CheckCircle;
      default: return Info;
    }
  };

  const getNotificationColor = (type: AdminNotification['type']) => {
    switch (type) {
      case 'error': return 'text-red-600 dark:text-red-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'success': return 'text-green-600 dark:text-green-400';
      default: return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <div className="w-80 max-h-96 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications
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

// Props for AdminHeader
interface AdminHeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

/**
 * AdminHeader Component
 * 
 * Provides the main administrative header with user profile dropdown,
 * notification center, theme toggle, and system controls.
 */
export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleSidebar,
  sidebarCollapsed
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
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
      setShowUserMenu(false);
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Mobile menu button */}
          <div className="flex items-center">
            <Button
              onClick={onToggleSidebar}
              variant="ghost"
              size="sm"
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Page title area - can be customized per page */}
            <div className="ml-4 lg:ml-0">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-2">
            {/* Search - Hidden on mobile */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search admin..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>
            </div>

            {/* Theme toggle */}
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <Button
                onClick={() => setShowNotifications(!showNotifications)}
                variant="ghost"
                size="sm"
                className="p-2 relative"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </Button>

              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <NotificationDropdown
                    notifications={notifications}
                    onMarkAsRead={handleMarkAsRead}
                    onMarkAllAsRead={handleMarkAllAsRead}
                  />
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <Button
                onClick={() => setShowUserMenu(!showUserMenu)}
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 p-2"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>

              {/* User dropdown */}
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