import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  FileText,
  Settings,
  Bot,
  Server,
  Car,
  Sparkles,
  UserCheck,
  Package
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const { t } = useTranslation();

  const menuItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: t('dashboard', 'Dashboard'),
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      path: '/analytics',
      icon: BarChart3,
      label: t('analytics', 'Analytics'),
      color: 'text-green-600 dark:text-green-400'
    },
    {
      path: '/users',
      icon: Users,
      label: t('users', 'Users'),
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      path: '/customers',
      icon: UserCheck,
      label: t('customers', 'Customers'),
      color: 'text-cyan-600 dark:text-cyan-400'
    },
    {
      path: '/products',
      icon: Package,
      label: t('products', 'Products'),
      color: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      path: '/content',
      icon: FileText,
      label: t('content', 'Content'),
      color: 'text-orange-600 dark:text-orange-400'
    },
    {
      path: '/ai-agent',
      icon: Bot,
      label: t('ai_agent', 'AI Agent'),
      color: 'text-pink-600 dark:text-pink-400'
    },
    {
      path: '/system',
      icon: Server,
      label: t('system', 'System'),
      color: 'text-red-600 dark:text-red-400'
    },
    {
      path: '/settings',
      icon: Settings,
      label: t('settings', 'Settings'),
      color: 'text-gray-600 dark:text-gray-400'
    }
  ];

  return (
    <motion.aside
      initial={false}
      animate={{
        width: collapsed ? 80 : 320
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        "main-content-bg border-r border-gray-100 dark:border-gray-800 flex flex-col shadow-xl",
        // Mobile overlay behavior - always positioned as overlay on mobile
        "fixed inset-y-0 left-0 z-50",
        // Desktop normal sidebar
        "md:relative md:z-40",
        // Mobile visibility and positioning
        collapsed
          ? "md:translate-x-0 md:w-20"
          : "translate-x-0 md:w-80",
        // Better mobile touch targets
        "min-h-screen md:min-h-0"
      )}
    >
      {/* Logo Section */}
      <div className="h-16 md:h-16 flex items-center px-3 md:px-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <div className={cn(
          "flex items-center transition-all duration-300",
          collapsed ? "justify-center w-full" : "justify-between w-full"
        )}>
          <motion.div
            initial={false}
            animate={{
              opacity: collapsed ? 0 : 1,
              scale: collapsed ? 0.8 : 1
            }}
            transition={{ duration: 0.2 }}
            className={cn(
              "flex items-center",
              collapsed ? "gap-0" : "gap-3"
            )}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center shadow-lg">
              <Car className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Community Car
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Admin Dashboard</p>
              </div>
            )}
          </motion.div>

        </div>

      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1",
        collapsed
          ? "p-1 md:p-2 space-y-1"
          : "p-3 md:p-4 space-y-2"
      )}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-xl transition-all duration-200 group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:ring-offset-1",
                  collapsed
                    ? "justify-center py-2 md:py-3 w-full min-h-[44px] md:min-h-[48px]"
                    : "py-3 px-3 gap-3 min-h-[48px]",
                  isActive
                    ? collapsed
                      ? "bg-pink-100 dark:bg-pink-800/40 text-pink-600 dark:text-pink-400 shadow-lg ring-2 ring-pink-500/30"
                      : "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 shadow-lg shadow-pink-500/10"
                    : collapsed
                      ? "text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className={cn(
                        "absolute rounded-xl",
                        collapsed
                          ? "inset-0 bg-pink-500/10 dark:bg-pink-600/20 border border-pink-500/30 dark:border-pink-600/40"
                          : "inset-0 bg-gradient-to-r from-pink-50 dark:from-pink-900/20 to-pink-25 dark:to-pink-900/10"
                      )}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  <div className={cn(
                    "relative z-10 rounded-lg transition-all flex items-center justify-center",
                    collapsed ? "w-10 h-10 md:w-8 md:h-8" : "p-2",
                    isActive
                      ? collapsed
                        ? "bg-pink-500/20 dark:bg-pink-600/30 shadow-md"
                        : "bg-pink-100 dark:bg-pink-800/30 shadow-lg"
                      : collapsed
                        ? "group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20"
                        : "group-hover:bg-gray-100 dark:group-hover:bg-gray-800"
                  )}>
                    <Icon className={cn(
                      "transition-all",
                      collapsed ? "w-6 h-6 md:w-5 md:h-5" : "w-5 h-5",
                      isActive
                        ? collapsed
                          ? "text-pink-600 dark:text-pink-400"
                          : item.color
                        : collapsed
                          ? "text-gray-500 dark:text-gray-400 group-hover:text-pink-500 dark:group-hover:text-pink-400"
                          : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100"
                    )} />
                  </div>
                  
                  <motion.span
                    initial={false}
                    animate={{ 
                      opacity: collapsed ? 0 : 1,
                      x: collapsed ? -10 : 0
                    }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "font-medium text-sm relative z-10",
                      isActive ? "text-pink-600 dark:text-pink-400" : "group-hover:text-gray-900 dark:group-hover:text-gray-100"
                    )}
                  >
                    {item.label}
                  </motion.span>
                  
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={cn(
                        "absolute rounded-full",
                        collapsed
                          ? "top-1 right-1 w-2 h-2 bg-pink-500 dark:bg-pink-400"
                          : "right-3 w-2 h-2 bg-pink-600 dark:bg-pink-500"
                      )}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 md:p-4 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
        <div className={cn(
          "bg-gradient-to-br from-pink-50 dark:from-pink-900/20 to-pink-25 dark:to-pink-900/10 rounded-xl border border-pink-200 dark:border-pink-800 transition-all duration-200",
          collapsed ? "p-2 flex items-center justify-center" : "p-4"
        )}>
          <div className={cn(
            "flex items-center",
            collapsed ? "justify-center" : "gap-3"
          )}>
            <div className="w-8 h-8 bg-pink-100 dark:bg-pink-800/30 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-pink-600 dark:text-pink-400" />
            </div>
            <motion.div
              initial={false}
              animate={{
                opacity: collapsed ? 0 : 1,
                scale: collapsed ? 0.8 : 1
              }}
              transition={{ duration: 0.2 }}
            >
              {!collapsed && (
                <div>
                  <p className="text-sm font-semibold text-pink-600 dark:text-pink-400">AI Powered</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Smart Analytics</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};