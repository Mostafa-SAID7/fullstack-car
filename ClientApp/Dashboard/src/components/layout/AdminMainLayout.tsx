/**
 * AdminMainLayout Component
 * Responsive administrative layout with role-based navigation and adaptive sidebar
 * 
 * Features:
 * - Role-based navigation with dynamic menu generation
 * - Responsive design with collapsible sidebar
 * - Breadcrumb navigation with contextual page titles
 * - Search functionality for navigation items
 * - Modern React hooks-based architecture
 * - Shadcn/ui components integration
 * - Tailwind CSS responsive design
 * - Lucide React icons
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { AdminRole } from '../../types/admin';
import { 
  Menu, 
  X, 
  ChevronRight,
  Home,
  Users,
  Settings,
  FileText,
  ShoppingCart,
  Bot,
  TrendingUp,
  Shield,
  Bell,
  Search,
  Crown,
  BarChart3,
  Database,
  Lock,
  Globe,
  MessageSquare,
  Calendar,
  Archive,
  Activity,
  FolderTree,
  Video,
  Image,
  Flag,
  Headphones,
  FileCheck,
  FolderPlus,
  Store,
  Package,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { cn } from '../../lib/utils';

// Navigation item interface
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

// Enhanced navigation configuration with comprehensive admin modules
const ADMIN_NAVIGATION: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/admin/dashboard',
    roles: [
      AdminRole.SUPER_ADMIN,
      AdminRole.ADMINISTRATION_ADMIN,
      AdminRole.CONTENT_ADMIN,
      AdminRole.MARKETPLACE_ADMIN,
      AdminRole.AI_AGENT_ADMIN,
      AdminRole.MARKETING_ADMIN
    ],
    description: 'Administrative overview and key metrics'
  },
  {
    id: 'super-admin',
    label: 'System Management',
    icon: Crown,
    path: '/admin/super-admin',
    roles: [AdminRole.SUPER_ADMIN],
    description: 'System administration and admin management',
    children: [
      {
        id: 'admin-users',
        label: 'Admin Users',
        icon: Shield,
        path: '/admin/super-admin/users',
        roles: [AdminRole.SUPER_ADMIN],
        description: 'Manage administrative users and roles'
      },
      {
        id: 'system-health',
        label: 'System Health',
        icon: Activity,
        path: '/admin/super-admin/health',
        roles: [AdminRole.SUPER_ADMIN],
        description: 'Monitor system performance and health'
      },
      {
        id: 'system-config',
        label: 'Configuration',
        icon: Settings,
        path: '/admin/super-admin/config',
        roles: [AdminRole.SUPER_ADMIN],
        description: 'System settings and configuration'
      },
      {
        id: 'audit-logs',
        label: 'Audit Logs',
        icon: Archive,
        path: '/admin/super-admin/audit',
        roles: [AdminRole.SUPER_ADMIN],
        description: 'System audit and activity logs'
      }
    ]
  },
  {
    id: 'administration',
    label: 'User Administration',
    icon: Users,
    path: '/admin/administration',
    roles: [AdminRole.ADMINISTRATION_ADMIN, AdminRole.SUPER_ADMIN],
    description: 'User management and system administration',
    children: [
      {
        id: 'user-management',
        label: 'User Management',
        icon: Users,
        path: '/admin/administration/users',
        roles: [AdminRole.ADMINISTRATION_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Manage platform users and accounts'
      },
      {
        id: 'user-analytics',
        label: 'User Analytics',
        icon: BarChart3,
        path: '/admin/administration/analytics',
        roles: [AdminRole.ADMINISTRATION_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'User engagement and analytics'
      },
      {
        id: 'system-settings',
        label: 'System Settings',
        icon: Settings,
        path: '/admin/administration/settings',
        roles: [AdminRole.ADMINISTRATION_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Platform configuration and settings'
      },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: Bell,
        path: '/admin/administration/notifications',
        roles: [AdminRole.ADMINISTRATION_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'System notifications and alerts'
      }
    ]
  },
  {
    id: 'content',
    label: 'Content Management',
    icon: FileText,
    path: '/admin/content',
    roles: [AdminRole.CONTENT_ADMIN, AdminRole.SUPER_ADMIN],
    description: 'Enhanced content management and moderation',
    children: [
      {
        id: 'content-overview',
        label: 'Content Overview',
        icon: FileText,
        path: '/admin/content/overview',
        roles: [AdminRole.CONTENT_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Administrative content dashboard'
      },
      {
        id: 'content-moderation',
        label: 'Content Moderation',
        icon: Shield,
        path: '/admin/content/moderation',
        roles: [AdminRole.CONTENT_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Review and moderate platform content',
        badge: 'New'
      },
      {
        id: 'media-review',
        label: 'Media Review',
        icon: Video,
        path: '/admin/content/media-review',
        roles: [AdminRole.CONTENT_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Review videos, podcasts, and images'
      },
      {
        id: 'folder-management',
        label: 'Folder Management',
        icon: FolderTree,
        path: '/admin/content/folders',
        roles: [AdminRole.CONTENT_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Hierarchical content organization'
      },
      {
        id: 'media-library',
        label: 'Media Library',
        icon: Database,
        path: '/admin/content/media',
        roles: [AdminRole.CONTENT_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Manage media assets and files'
      },
      {
        id: 'community-reports',
        label: 'Community Reports',
        icon: Flag,
        path: '/admin/content/reports',
        roles: [AdminRole.CONTENT_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Handle community content reports'
      },
      {
        id: 'seo-tools',
        label: 'SEO Tools',
        icon: Globe,
        path: '/admin/content/seo',
        roles: [AdminRole.CONTENT_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'SEO optimization and analytics'
      }
    ]
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    icon: ShoppingCart,
    path: '/admin/marketplace',
    roles: [AdminRole.MARKETPLACE_ADMIN, AdminRole.SUPER_ADMIN],
    description: 'Marketplace and vendor management',
    children: [
      {
        id: 'marketplace-overview',
        label: 'Overview',
        icon: BarChart3,
        path: '/admin/marketplace/overview',
        roles: [AdminRole.MARKETPLACE_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Marketplace performance dashboard'
      },
      {
        id: 'vendors',
        label: 'Vendor Management',
        icon: Store,
        path: '/admin/marketplace/vendors',
        roles: [AdminRole.MARKETPLACE_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Manage marketplace vendors'
      },
      {
        id: 'products',
        label: 'Product Management',
        icon: Package,
        path: '/admin/marketplace/products',
        roles: [AdminRole.MARKETPLACE_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Manage products and listings'
      },
      {
        id: 'transactions',
        label: 'Transactions',
        icon: DollarSign,
        path: '/admin/marketplace/transactions',
        roles: [AdminRole.MARKETPLACE_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Transaction monitoring and management'
      },
      {
        id: 'disputes',
        label: 'Dispute Resolution',
        icon: AlertCircle,
        path: '/admin/marketplace/disputes',
        roles: [AdminRole.MARKETPLACE_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Handle customer disputes and issues'
      }
    ]
  },
  {
    id: 'ai-agent',
    label: 'AI Agent',
    icon: Bot,
    path: '/admin/ai-agent',
    roles: [AdminRole.AI_AGENT_ADMIN, AdminRole.SUPER_ADMIN],
    description: 'AI agent configuration and training',
    children: [
      {
        id: 'ai-overview',
        label: 'AI Overview',
        icon: BarChart3,
        path: '/admin/ai-agent/overview',
        roles: [AdminRole.AI_AGENT_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'AI agent performance dashboard'
      },
      {
        id: 'model-training',
        label: 'Model Training',
        icon: Bot,
        path: '/admin/ai-agent/training',
        roles: [AdminRole.AI_AGENT_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Train and manage AI models'
      },
      {
        id: 'agent-config',
        label: 'Agent Configuration',
        icon: Settings,
        path: '/admin/ai-agent/config',
        roles: [AdminRole.AI_AGENT_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Configure AI agent behavior'
      },
      {
        id: 'conversations',
        label: 'Conversation Monitoring',
        icon: MessageSquare,
        path: '/admin/ai-agent/conversations',
        roles: [AdminRole.AI_AGENT_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Monitor AI conversations and interactions'
      },
      {
        id: 'performance',
        label: 'Performance Analysis',
        icon: BarChart3,
        path: '/admin/ai-agent/performance',
        roles: [AdminRole.AI_AGENT_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'AI performance metrics and analysis'
      }
    ]
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: TrendingUp,
    path: '/admin/marketing',
    roles: [AdminRole.MARKETING_ADMIN, AdminRole.SUPER_ADMIN],
    description: 'Marketing campaigns and analytics',
    children: [
      {
        id: 'marketing-overview',
        label: 'Marketing Overview',
        icon: BarChart3,
        path: '/admin/marketing/overview',
        roles: [AdminRole.MARKETING_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Marketing performance dashboard'
      },
      {
        id: 'campaigns',
        label: 'Campaign Management',
        icon: TrendingUp,
        path: '/admin/marketing/campaigns',
        roles: [AdminRole.MARKETING_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Create and manage marketing campaigns'
      },
      {
        id: 'audience',
        label: 'Audience Targeting',
        icon: Users,
        path: '/admin/marketing/audience',
        roles: [AdminRole.MARKETING_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Audience segmentation and targeting'
      },
      {
        id: 'analytics',
        label: 'Marketing Analytics',
        icon: BarChart3,
        path: '/admin/marketing/analytics',
        roles: [AdminRole.MARKETING_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Campaign performance and ROI analytics'
      },
      {
        id: 'social-media',
        label: 'Social Media',
        icon: Globe,
        path: '/admin/marketing/social',
        roles: [AdminRole.MARKETING_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Social media management and scheduling'
      }
    ]
  }
];

// Enhanced breadcrumb component with contextual page titles
const AdminBreadcrumb: React.FC<{ currentPath: string; navigationItems: NavigationItem[] }> = ({ 
  currentPath, 
  navigationItems 
}) => {
  const pathSegments = currentPath.split('/').filter(Boolean);
  
  // Generate breadcrumb items from path with navigation context
  const breadcrumbItems = useMemo(() => {
    const items: Array<{ label: string; path: string; isLast: boolean; description?: string }> = [];
    
    // Find matching navigation items for better breadcrumb labels
    const findNavigationItem = (path: string): NavigationItem | undefined => {
      for (const item of navigationItems) {
        if (item.path === path) return item;
        if (item.children) {
          const childItem = item.children.find(child => child.path === path);
          if (childItem) return childItem;
        }
      }
      return undefined;
    };

    pathSegments.forEach((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      const navItem = findNavigationItem(path);
      
      const label = navItem?.label || segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
      const description = navItem?.description;
      
      items.push({
        label,
        path,
        isLast: index === pathSegments.length - 1,
        description
      });
    });

    return items;
  }, [currentPath, pathSegments, navigationItems]);

  if (breadcrumbItems.length <= 1) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
      <Home className="h-4 w-4" />
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.path}>
          <ChevronRight className="h-4 w-4" />
          <div className="flex flex-col">
            <span
              className={cn(
                "transition-colors duration-200",
                item.isLast 
                  ? 'text-gray-900 dark:text-white font-medium' 
                  : 'hover:text-gray-900 dark:hover:text-white cursor-pointer'
              )}
              title={item.description}
            >
              {item.label}
            </span>
            {item.description && item.isLast && (
              <span className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                {item.description}
              </span>
            )}
          </div>
        </React.Fragment>
      ))}
    </nav>
  );
};

// Props for AdminMainLayout
interface AdminMainLayoutProps {
  children?: React.ReactNode;
}

/**
 * AdminMainLayout Component
 * 
 * Provides the main administrative layout with responsive sidebar navigation,
 * role-based menu items, adaptive design for different screen sizes, and
 * enhanced breadcrumb navigation with contextual page titles.
 * 
 * Features:
 * - Role-based navigation filtering
 * - Responsive sidebar with collapse/expand functionality
 * - Enhanced search functionality with results highlighting
 * - Contextual breadcrumb navigation
 * - Mobile-optimized design
 * - Keyboard navigation support
 * - Real-time navigation updates
 */
export const AdminMainLayout: React.FC<AdminMainLayoutProps> = ({ children }) => {
  const { adminUser, hasRole } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Layout state with improved state management
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Initialize based on screen size and user preference
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('admin-sidebar-collapsed');
      if (savedState !== null) {
        return JSON.parse(savedState);
      }
      return window.innerWidth < 1024; // Default to collapsed on smaller screens
    }
    return false;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NavigationItem[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);

  // Memoized navigation filtering for performance
  const filteredNavigation = useMemo(() => {
    return ADMIN_NAVIGATION.filter(item => 
      item.roles.some(role => hasRole(role))
    ).map(item => ({
      ...item,
      children: item.children?.filter(child => 
        child.roles.some(role => hasRole(role))
      )
    }));
  }, [hasRole]);

  // Enhanced search functionality with debouncing
  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (searchQuery.trim()) {
        const results: NavigationItem[] = [];
        
        filteredNavigation.forEach(item => {
          // Check main item
          if (item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
            results.push(item);
          }
          
          // Check children
          item.children?.forEach(child => {
            if (child.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                child.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
              results.push(child);
            }
          });
        });
        
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 150); // Debounce search for better performance

    return () => clearTimeout(searchTimeout);
  }, [searchQuery, filteredNavigation]);

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem('admin-sidebar-collapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Enhanced responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const isLargeScreen = window.innerWidth >= 1024;
      
      // Auto-close mobile sidebar on large screens
      if (isLargeScreen && sidebarOpen) {
        setSidebarOpen(false);
      }
      
      // Auto-expand sidebar on very large screens if user hasn't manually collapsed it
      if (window.innerWidth >= 1440 && !localStorage.getItem('admin-sidebar-manually-collapsed')) {
        setSidebarCollapsed(false);
      }
    };

    const debouncedResize = debounce(handleResize, 100);
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, [sidebarOpen]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
    setSearchQuery(''); // Clear search on navigation
  }, [location.pathname]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + K for search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setSearchFocused(true);
      }
      
      // Escape to close search or mobile sidebar
      if (event.key === 'Escape') {
        if (searchQuery) {
          setSearchQuery('');
          setSearchFocused(false);
        } else if (sidebarOpen) {
          setSidebarOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery, sidebarOpen]);

  // Enhanced navigation handler with analytics
  const handleNavigation = useCallback((path: string) => {
    navigate(path);
    setSidebarOpen(false);
    
    // Optional: Track navigation for analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'admin_navigation', {
        page_path: path,
        user_role: adminUser?.roles?.[0] || 'unknown'
      });
    }
  }, [navigate, adminUser?.roles]);

  // Enhanced active route checking
  const isActiveRoute = useCallback((path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  }, [location.pathname]);

  // Toggle sidebar with manual collapse tracking
  const handleToggleCollapse = useCallback(() => {
    setSidebarCollapsed(prev => {
      const newState = !prev;
      localStorage.setItem('admin-sidebar-manually-collapsed', JSON.stringify(newState));
      return newState;
    });
  }, []);

  // Debounce utility function
  function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
    let timeout: NodeJS.Timeout;
    return ((...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    }) as T;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Mobile sidebar overlay with improved accessibility */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === 'Enter' && setSidebarOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      {/* Enhanced Sidebar */}
      <AdminSidebar
        navigation={filteredNavigation}
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
        onNavigate={handleNavigation}
        currentPath={location.pathname}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchResults={searchResults}
        searchFocused={searchFocused}
        onSearchFocusChange={setSearchFocused}
      />

      {/* Main content area with smooth transitions */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      )}>
        {/* Enhanced Header */}
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarCollapsed={sidebarCollapsed}
          currentPath={location.pathname}
          navigationItems={filteredNavigation}
        />

        {/* Page content with improved spacing and accessibility */}
        <main className="p-4 lg:p-6 min-h-[calc(100vh-4rem)]" role="main">
          {/* Enhanced Breadcrumb navigation */}
          <AdminBreadcrumb 
            currentPath={location.pathname} 
            navigationItems={filteredNavigation}
          />
          
          {/* Page content container with max width and centering */}
          <div className="max-w-7xl mx-auto">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminMainLayout;