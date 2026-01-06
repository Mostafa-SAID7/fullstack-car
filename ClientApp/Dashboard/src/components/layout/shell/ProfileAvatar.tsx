import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Shield,
  Bell,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../../hooks';
import { cn } from '../../../lib/utils';

export const ProfileAvatar: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    {
      icon: User,
      label: t('profile', 'Profile'),
      action: () => {
        navigate('/settings');
        setIsOpen(false);
      },
      color: 'text-blue-600'
    },
    {
      icon: Settings,
      label: t('settings', 'Settings'),
      action: () => {
        navigate('/settings');
        setIsOpen(false);
      },
      color: 'text-gray-600'
    },
    {
      icon: Shield,
      label: t('security', 'Security'),
      action: () => {
        navigate('/settings');
        setIsOpen(false);
      },
      color: 'text-green-600'
    },
    {
      icon: Bell,
      label: t('notifications', 'Notifications'),
      action: () => {
        navigate('/settings');
        setIsOpen(false);
      },
      color: 'text-purple-600'
    },
    {
      icon: HelpCircle,
      label: t('help', 'Help & Support'),
      action: () => {
        // Could navigate to help page
        setIsOpen(false);
      },
      color: 'text-orange-600'
    }
  ];

  if (!user) {
    return null;
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getUserDisplayName = () => {
    if (user.name) return user.name;
    return `${user.firstName} ${user.lastName}`.trim();
  };

  const avatarUrl = user.avatar || user.profileImageUrl;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 p-1.5 rounded-lg transition-all duration-200",
          "hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50",
          "group",
          isOpen && "bg-muted/50"
        )}
        title={getUserDisplayName()}
      >
        {/* Avatar */}
        <div className="relative">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={getUserDisplayName()}
              className="w-8 h-8 rounded-full object-cover border-2 border-border group-hover:border-pink-300 transition-colors"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-white text-sm font-semibold border-2 border-border group-hover:border-pink-300 transition-colors">
              {getInitials(user.firstName, user.lastName)}
            </div>
          )}
          
          {/* Online Status Indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
        </div>

        {/* User Info - Hidden on mobile */}
        <div className="hidden lg:flex flex-col items-start min-w-0">
          <span className="text-sm font-medium text-foreground truncate max-w-[120px]">
            {getUserDisplayName()}
          </span>
          <span className="text-xs text-muted-foreground truncate max-w-[120px]">
            {user.roles.includes('Admin') ? t('administrator', 'Administrator') : t('user', 'User')}
          </span>
        </div>

        {/* Dropdown Arrow - Hidden on mobile */}
        <ChevronDown className={cn(
          "hidden lg:block w-4 h-4 text-muted-foreground transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-64 bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* User Info Header */}
            <div className="p-4 border-b border-gray-700/50 bg-gray-800/50">
              <div className="flex items-center gap-3">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={getUserDisplayName()}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-white text-lg font-semibold border-2 border-gray-600">
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">
                    {getUserDisplayName()}
                  </h3>
                  <p className="text-sm text-gray-300 truncate">
                    {user.email}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      {user.roles.includes('Admin') ? t('administrator', 'Administrator') : t('user', 'User')}
                    </span>
                    {user.isEmailConfirmed && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                        {t('verified', 'Verified')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={item.action}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800/50 transition-colors group"
                  >
                    <Icon className={cn("w-4 h-4", item.color)} />
                    <span className="text-sm font-medium text-gray-200 group-hover:text-white">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Logout */}
            <div className="border-t border-gray-700/50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-900/30 hover:text-red-300 transition-colors group"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium text-gray-200 group-hover:text-red-300">
                  {t('logout', 'Sign Out')}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};