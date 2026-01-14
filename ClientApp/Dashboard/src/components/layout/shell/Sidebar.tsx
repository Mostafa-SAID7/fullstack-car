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
  UserCheck,
  Package,
  Wrench,
  ChevronLeft,
  ChevronRight,
  X,
  Languages,
  FileImage,
  Palette,
  Shield,
  Activity,
  Share2,
  Target,
  TrendingUp,
  Calendar,
  Bell,
  HelpCircle,
  Book,
  Star,
  Map,
  Newspaper,
  Layout,
  Video
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
        }
      ]
    },
    {
      title: 'Marketplace',
      icon: Users,
      items: [
        {
          path: '/marketplace/customers',
          icon: UserCheck,
          label: t('customers', 'Customers'),
          color: 'text-cyan-600',
          description: 'Customer relationships'
        },
        {
          path: '/marketplace/products',
          icon: Package,
          label: t('products', 'Products'),
          color: 'text-emerald-600',
          description: 'Product catalog'
        },
        {
          path: '/marketplace/services',
          icon: Wrench,
          label: t('services', 'Services'),
          color: 'text-blue-600',
          description: 'Marketplace services'
        }
      ]
    },
    {
      title: 'Community',
      icon: Users,
      items: [
        {
          path: '/community/qa',
          icon: HelpCircle,
          label: t('qa_system', 'QA System'),
          color: 'text-green-600',
          description: 'Question & Answer management'
        },
        {
          path: '/community/posts',
          icon: FileText,
          label: t('posts', 'Posts'),
          color: 'text-blue-600',
          description: 'Community posts'
        },
        {
          path: '/community/groups',
          icon: Users,
          label: t('groups', 'Groups'),
          color: 'text-purple-600',
          description: 'Community groups'
        },
        {
          path: '/community/friends',
          icon: UserCheck,
          label: t('friends', 'Friends'),
          color: 'text-pink-600',
          description: 'Friend connections'
        },
        {
          path: '/community/guides',
          icon: Book,
          label: t('guides', 'Guides'),
          color: 'text-orange-600',
          description: 'Community guides'
        },
        {
          path: '/community/reviews',
          icon: Star,
          label: t('reviews', 'Reviews'),
          color: 'text-yellow-500',
          description: 'Community reviews'
        },
        {
          path: '/community/maps',
          icon: Map,
          label: t('maps', 'Maps'),
          color: 'text-blue-500',
          description: 'Community locations'
        },
        {
          path: '/community/news',
          icon: Newspaper,
          label: t('news', 'News'),
          color: 'text-red-500',
          description: 'Community news'
        },
        {
          path: '/community/pages',
          icon: Layout,
          label: t('pages', 'Pages'),
          color: 'text-violet-600',
          description: 'Community pages'
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
          label: t('pages', 'Pages'),
          color: 'text-orange-600',
          description: 'Pages management'
        },
        {
          path: '/media',
          icon: Video,
          label: t('media_management', 'Media Management'),
          color: 'text-red-600',
          description: 'Video and podcast management'
        },
        {
          path: '/content/media',
          icon: FileImage,
          label: t('media_library', 'Media Library'),
          color: 'text-indigo-600',
          description: 'Media files and assets'
        },
        {
          path: '/content/localization',
          icon: Languages,
          label: t('localization', 'Localization'),
          color: 'text-blue-600',
          description: 'Translation management'
        },
        {
          path: '/content/themes',
          icon: Palette,
          label: t('themes', 'Themes'),
          color: 'text-purple-600',
          description: 'Theme management'
        }
      ]
    },
    {
      title: 'AI Agent',
      icon: Bot,
      items: [
        {
          path: '/ai-agent',
          icon: Bot,
          label: t('ai_agent', 'AI Agent'),
          color: 'text-pink-600',
          description: 'AI assistant and automation'
        },
        {
          path: '/ai-agent/model-training',
          icon: Activity,
          label: t('model_training', 'Model Training'),
          color: 'text-purple-600',
          description: 'Train and fine-tune AI models'
        }
      ]
    },
    {
      title: 'Marketing',
      icon: TrendingUp,
      items: [
        {
          path: '/marketing',
          icon: BarChart3,
          label: t('marketing_overview', 'Marketing Overview'),
          color: 'text-indigo-600',
          description: 'Marketing dashboard and overview'
        },
        {
          path: '/marketing/social-media',
          icon: Share2,
          label: t('social_media', 'Social Media'),
          color: 'text-blue-600',
          description: 'Social media management'
        },
        {
          path: '/marketing/campaigns',
          icon: Target,
          label: t('campaigns', 'Campaigns'),
          color: 'text-green-600',
          description: 'Marketing campaigns'
        },
        {
          path: '/marketing/analytics',
          icon: TrendingUp,
          label: t('marketing_analytics', 'Analytics'),
          color: 'text-purple-600',
          description: 'Marketing analytics and insights'
        },
        {
          path: '/marketing/content-planning',
          icon: Calendar,
          label: t('content_planning', 'Content Planning'),
          color: 'text-orange-600',
          description: 'Content planning and scheduling'
        }
      ]
    },
    {
      title: 'Administration',
      icon: Server,
      items: [
        {
          path: '/administration/users',
          icon: Users,
          label: t('users', 'Users'),
          color: 'text-purple-600',
          description: 'User management'
        },
        {
          path: '/administration/analytics',
          icon: BarChart3,
          label: t('analytics', 'Analytics'),
          color: 'text-green-600',
          description: 'Advanced analytics and insights'
        },
        {
          path: '/administration/system',
          icon: Server,
          label: t('system', 'System'),
          color: 'text-red-600',
          description: 'System administration'
        },
        {
          path: '/administration/audit-logs',
          icon: Shield,
          label: t('audit', 'Audit Logs'),
          color: 'text-orange-600',
          description: 'System audit and security logs'
        },
        {
          path: '/administration/health-monitor',
          icon: Activity,
          label: t('health', 'Health Monitor'),
          color: 'text-blue-600',
          description: 'System health and monitoring'
        },
        {
          path: '/administration/notifications',
          icon: Bell,
          label: t('notifications', 'Notifications'),
          color: 'text-yellow-600',
          description: 'Notification management and settings'
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
                        className={() =>
                          cn(
                            "group relative flex items-center rounded-xl transition-all duration-200",
                            "focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:ring-offset-1",
                            "min-h-[44px] touch-manipulation",
                            (isMobileOpen || !collapsed)
                              ? "px-3 py-3 gap-3"
                              : "justify-center px-2 py-3",
                            // Remove active state styling - all links look the same
                            "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
                          )
                        }
                      >
                        {() => (
                          <>

                            {/* Icon Container */}
                            <div className={cn(
                              "relative flex items-center justify-center rounded-lg transition-all duration-200 flex-shrink-0",
                              (isMobileOpen || !collapsed) ? "w-10 h-10" : "w-8 h-8",
                              // Remove active state styling for icon container
                              hoveredItem === item.path
                                ? "bg-gray-200/50"
                                : "group-hover:bg-gray-200/30"
                            )}>
                              {(Icon as any) && <Icon className={cn(
                                "transition-all duration-200",
                                collapsed ? "w-5 h-5" : "w-5 h-5",
                                // Always use the item's original color, no active state override
                                item.color
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
                                  "font-medium text-sm truncate block"
                                  // Remove active state text color override
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

        {/* Fixed Settings Button at Bottom */}
        <div className="flex-shrink-0 p-3 border-t border-border">
          <NavLink
            to="/settings"
            onMouseEnter={() => setHoveredItem('/settings')}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={onMobileClose}
            className={() =>
              cn(
                "group relative flex items-center rounded-xl transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:ring-offset-1",
                "min-h-[44px] touch-manipulation w-full",
                (isMobileOpen || !collapsed)
                  ? "px-3 py-3 gap-3"
                  : "justify-center px-2 py-3",
                // Always show focused/active background for Settings
                "bg-gradient-to-r from-pink-50 to-pink-100/50 text-pink-700 shadow-lg shadow-pink-500/10",
                "hover:from-pink-100 hover:to-pink-150/60 hover:shadow-pink-500/20"
              )
            }
          >
            {() => (
              <>
                {/* Icon Container */}
                <div className={cn(
                  "relative flex items-center justify-center rounded-lg transition-all duration-200 flex-shrink-0",
                  (isMobileOpen || !collapsed) ? "w-10 h-10" : "w-8 h-8",
                  // Always show focused/active background for Settings icon
                  "bg-pink-500/20 shadow-md"
                )}>
                  <Settings className={cn(
                    "transition-all duration-200",
                    collapsed ? "w-5 h-5" : "w-5 h-5",
                    // Always show focused/active color for Settings icon
                    "text-pink-600"
                  )} />
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
                      // Always show focused/active text color for Settings
                      "text-pink-700"
                    )}>
                      {t('settings', 'Settings')}
                    </span>
                    {(isMobileOpen || !collapsed) && (
                      <span className="text-xs text-gray-500 truncate">
                        Application settings
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* Hover Tooltip for Collapsed State */}
                {collapsed && hoveredItem === '/settings' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: -10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -10 }}
                    className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50"
                  >
                    <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                      <div className="font-medium text-sm">Settings</div>
                      <div className="text-xs text-gray-300 mt-1">Application settings</div>
                    </div>
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                  </motion.div>
                )}
              </>
            )}
          </NavLink>
        </div>
      </motion.aside>
    </>
  );
};
