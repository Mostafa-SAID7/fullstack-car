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
  ChevronLeft,
  Car,
  Sparkles
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
      color: 'text-blue-500'
    },
    {
      path: '/analytics',
      icon: BarChart3,
      label: t('analytics', 'Analytics'),
      color: 'text-green-500'
    },
    {
      path: '/users',
      icon: Users,
      label: t('users', 'Users'),
      color: 'text-purple-500'
    },
    {
      path: '/content',
      icon: FileText,
      label: t('content', 'Content'),
      color: 'text-orange-500'
    },
    {
      path: '/ai-agent',
      icon: Bot,
      label: t('ai_agent', 'AI Agent'),
      color: 'text-pink-500'
    },
    {
      path: '/system',
      icon: Server,
      label: t('system', 'System'),
      color: 'text-red-500'
    },
    {
      path: '/settings',
      icon: Settings,
      label: t('settings', 'Settings'),
      color: 'text-gray-500'
    }
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-card border-r border-border/50 flex flex-col relative z-40 shadow-xl"
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
        <motion.div
          initial={false}
          animate={{ opacity: collapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center shadow-lg">
            <Car className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Community Car
              </h1>
              <p className="text-xs text-muted-foreground font-medium">Admin Dashboard</p>
            </div>
          )}
        </motion.div>
        
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                  isActive
                    ? "bg-primary/10 text-primary shadow-lg shadow-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  <div className={cn(
                    "relative z-10 p-2 rounded-lg transition-all",
                    isActive ? "bg-primary/20 shadow-lg" : "group-hover:bg-muted"
                  )}>
                    <Icon className={cn(
                      "w-5 h-5 transition-all",
                      isActive ? item.color : "text-muted-foreground group-hover:text-foreground"
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
                      isActive ? "text-primary" : "group-hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </motion.span>
                  
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-3 w-2 h-2 bg-primary rounded-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border/50">
        <div className={cn(
          "bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20",
          collapsed && "p-3"
        )}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <motion.div
              initial={false}
              animate={{ opacity: collapsed ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {!collapsed && (
                <div>
                  <p className="text-sm font-semibold text-primary">AI Powered</p>
                  <p className="text-xs text-muted-foreground">Smart Analytics</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};