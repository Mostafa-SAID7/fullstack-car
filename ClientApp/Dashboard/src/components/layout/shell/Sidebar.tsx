import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '../../../lib/utils';
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
  Package,
  ChevronLeft,
  ChevronRight,
  X,
  Languages,
  Shield,
  FileImage
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

interface MenuSection {
  title: string;
  icon: React.ComponentType<any>;
  items: MenuItem[];
}

interface MenuItem {
  path: string;
  icon: React.ComponentType<any>;
  label: string;
  color: string;
  badge?: string | number;
  description?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose
}) => {
  const { t } = useTranslation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle mobile backdrop click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isMobileOpen) {
        onMobileClose?.();
      }
    };

    if (isMobileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileOpen, onMobileClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileOpen) {
        onMobileClose?.();
      }
    };

    if (isMobileOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileOpen, onMobileClose]);

  const menuSections: MenuSection[] = [
    {
      title: 'Overview',
      icon: LayoutDashboard,
      items: [
        {
          path: '/dashboard',
          icon: LayoutDashboard,
          label: t('dashboard', 'Dashboard'),
          color: 'text-blue-600',
          description: 'Main dashboard overview'
        },
        {
          path: '/analytics',
          icon: BarChart3,
          label: t('analytics', 'Analytics'),
          color: 'text-green-600',
          description: 'Data insights and reports'
        }
      ]
    },
    {
      title: 'Management',
      icon: Users,
      items: [
        {
          path: '/users',
          icon: Users,
          label: t('users', 'Users'),
          color: 'text-purple-600',
          description: 'User management'
        },
        {
          path: '/customers',
          icon: UserCheck,
          label: t('customers', 'Customers'),
          color: 'text-cyan-600',
          description: 'Customer relationships'
        },
        {
          path: '/products',
          icon: Package,
          label: t('products', 'Products'),
          color: 'text-emerald-600',
          description: 'Product catalog'
        }
      ]
    },
    {
      title: 'Content',
      icon: FileText,
      items: [
        {
          path: '/content',
          icon: FileText,
          label: t('content', 'Content'),
          color: 'text-orange-600',
          description: 'Content management'
        },
        {
          path: '/media',
          icon: FileImage,
          label: t('media', 'Media'),
          color: 'text-indigo-600',
          description: 'Media library'
        }
      ]
    },
    {
      title: 'AI & System',
      icon: Bot,
      items: [
        {
          path: '/ai-agent',
          icon: Bot,
          label: t('ai_agent', 'AI Agent'),
          color: 'text-pink-600',
          description: 'AI assistant'
        },
        {
          path: '/system',
          icon: Server,
          label: t('system', 'System'),
          color: 'text-red-600',
          description: 'System administration'
        },
        {
          path: '/settings',
          icon: Settings,
          label: t('settings', 'Settings'),
          color: 'text-gray-600',
          description: 'Application settings'
        }
      ]
    },
    {
      title: 'Administration',
      icon: Shield,
      items: [
        {
          path: '/localization',
          icon: Languages,
          label: 'Localization',
          color: 'text-blue-600',
          description: 'Translation management'
        }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        ref={sidebarRef}
        initial={false}
        animate={{
          width: isMobileOpen ? 280 : (collapsed ? 72 : 280),
          x: isMobileOpen ? 0 : window.innerWidth < 768 ? -280 : 0
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
          type: 'spring',
          stiffness: 300,
          damping: 30
        }}
        className={cn(
          "main-content-bg border-r border-border flex flex-col shadow-2xl",
          "fixed inset-y-0 left-0 z-50 md:relative md:z-40",
          "bg-card",
          "min-h-screen md:min-h-0",
          "overflow-hidden"
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border flex-shrink-0">
          {/* Logo */}
          <motion.div
            initial={false}
            animate={{
              opacity: (isMobileOpen || !collapsed) ? 1 : 0,
              scale: (isMobileOpen || !collapsed) ? 1 : 0.8
            }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 flex-1 min-w-0"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Car className="w-5 h-5 text-white" />
            </div>
            {(isMobileOpen || !collapsed) && (
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-bold bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent truncate">
                  Community Car
                </h1>
                <p className="text-xs text-muted-foreground font-medium truncate">
                  Admin Dashboard
                </p>
              </div>
            )}
          </motion.div>

          {/* Controls */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Mobile Close */}
            <button
              onClick={onMobileClose}
              className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground"
              title="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Desktop Collapse */}
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex p-2 rounded-lg hover:bg-muted/50  transition-colors text-muted-foreground "
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <nav className="p-3 space-y-6">
            {menuSections.map((section) => (
              <div key={section.title} className="space-y-2">
                {/* Section Header */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: (isMobileOpen || !collapsed) ? 1 : 0,
                    height: (isMobileOpen || !collapsed) ? 'auto' : 0
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-2 px-3 py-1">
                    {(section.icon as any) && <section.icon className="w-4 h-4 text-gray-500  flex-shrink-0" />}
                    <h3 className="text-xs font-semibold text-gray-500  uppercase tracking-wider">
                      {section.title}
                    </h3>
                  </div>
                </motion.div>

                {/* Section Items */}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onMouseEnter={() => setHoveredItem(item.path)}
                        onMouseLeave={() => setHoveredItem(null)}
                        onClick={onMobileClose}
                        className={({ isActive: navActive }) =>
                          cn(
                            "group relative flex items-center rounded-xl transition-all duration-200",
                            "focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:ring-offset-1",
                            "min-h-[44px] touch-manipulation",
                            (isMobileOpen || !collapsed)
                              ? "px-3 py-3 gap-3"
                              : "justify-center px-2 py-3",
                            navActive
                              ? "bg-gradient-to-r from-pink-50 to-pink-100/50  text-pink-700  shadow-lg shadow-pink-500/10"
                              : "text-gray-600  hover:text-gray-900  hover:bg-gray-100/50 /50"
                          )
                        }
                      >
                        {({ isActive: navActive }) => (
                          <>

                            {/* Icon Container */}
                            <div className={cn(
                              "relative flex items-center justify-center rounded-lg transition-all duration-200 flex-shrink-0",
                              (isMobileOpen || !collapsed) ? "w-10 h-10" : "w-8 h-8",
                              navActive
                                ? "bg-pink-500/20  shadow-md"
                                : hoveredItem === item.path
                                  ? "bg-gray-200/50 "
                                  : "group-hover:bg-gray-200/30 "
                            )}>
                              {(Icon as any) && <Icon className={cn(
                                "transition-all duration-200",
                                collapsed ? "w-5 h-5" : "w-5 h-5",
                                navActive
                                  ? "text-pink-600"
                                  : item.color
                              )} />}

                              {/* Badge */}
                              {item.badge && (
                                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                                  {item.badge}
                                </span>
                              )}
                            </div>

                            {/* Text Content */}
                            <motion.div
                              initial={false}
                              animate={{
                                opacity: (isMobileOpen || !collapsed) ? 1 : 0,
                                x: (isMobileOpen || !collapsed) ? 0 : -20,
                                width: (isMobileOpen || !collapsed) ? 'auto' : 0
                              }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden flex-1 min-w-0"
                            >
                              <div className="flex flex-col gap-0.5">
                                <span className={cn(
                                  "font-medium text-sm truncate block",
                                  navActive && "text-pink-700 "
                                )}>
                                  {item.label}
                                </span>
                                {item.description && (isMobileOpen || !collapsed) && (
                                  <span className="text-xs text-gray-500  truncate">
                                    {item.description}
                                  </span>
                                )}
                              </div>
                            </motion.div>

                            {/* Hover Tooltip for Collapsed State */}
                            {collapsed && hoveredItem === item.path && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.8, x: -10 }}
                                className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50"
                              >
                                <div className="bg-gray-900  text-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                                  <div className="font-medium text-sm">{item.label}</div>
                                  {item.description && (
                                    <div className="text-xs text-gray-300 mt-1">{item.description}</div>
                                  )}
                                </div>
                                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 "></div>
                              </motion.div>
                            )}
                          </>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200/50  flex-shrink-0">
          <div className={cn(
            "bg-gradient-to-br from-pink-50/50 to-pink-100/30  rounded-xl border border-pink-200/50  transition-all duration-200",
            (isMobileOpen || !collapsed) ? "p-4" : "p-3 flex items-center justify-center"
          )}>
            <div className={cn(
              "flex items-center transition-all duration-200",
              (isMobileOpen || !collapsed) ? "gap-3" : "justify-center"
            )}>
              <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-pink-200  rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                <Sparkles className="w-5 h-5 text-pink-600" />
              </div>
              {(isMobileOpen || !collapsed) && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="min-w-0 flex-1 overflow-hidden"
                >
                  <p className="text-sm font-semibold text-pink-700  whitespace-nowrap">
                    AI Powered
                  </p>
                  <p className="text-xs text-gray-600 whitespace-nowrap">
                    Smart Analytics
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};
