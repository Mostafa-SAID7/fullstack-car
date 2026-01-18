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
        description: 'Platform configuration'
      },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: Bell,
        path: '/admin/administration/notifications',
        roles: [AdminRole.ADMINISTRATION_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'System notifications'
      }
    ]
  },
  {
    id: 'content',
    label: 'Content Management',
    icon: FileText,
    path: '/admin/content',
    roles: [AdminRole.CONTENT_ADMIN, AdminRole.SUPER_ADMIN],
    description: 'Content creation and moderation',
    children: [
      {
        id: 'content-editor',
        label: 'Content Editor',
        icon: FileText,
        path: '/admin/content/editor',
        roles: [AdminRole.CONTENT_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Create and edit content'
      },
      {
        id: 'media-library',
        label: 'Media Library',
        icon: Database,
        path: '/admin/content/media',
        roles: [AdminRole.CONTENT_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Manage media assets'
      },
      {
        id: 'moderation',
        label: 'Content Moderation',
        icon: Shield,
        path: '/admin/content/moderation',
        roles: [AdminRole.CONTENT_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Review and moderate content',
        badge: 'New'
      },
      {
        id: 'seo-tools',
        label: 'SEO Tools',
        icon: Globe,
        path: '/admin/content/seo',
        roles: [AdminRole.CONTENT_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'SEO optimization tools'
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
        id: 'vendors',
        label: 'Vendor Management',
        icon: Users,
        path: '/admin/marketplace/vendors',
        roles: [AdminRole.MARKETPLACE_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Manage marketplace vendors'
      },
      {
        id: 'products',
        label: 'Product Management',
        icon: ShoppingCart,
        path: '/admin/marketplace/products',
        roles: [AdminRole.MARKETPLACE_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Manage products and listings'
      },
      {
        id: 'transactions',
        label: 'Transactions',
        icon: BarChart3,
        path: '/admin/marketplace/transactions',
        roles: [AdminRole.MARKETPLACE_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Transaction monitoring'
      },
      {
        id: 'disputes',
        label: 'Dispute Resolution',
        icon: MessageSquare,
        path: '/admin/marketplace/disputes',
        roles: [AdminRole.MARKETPLACE_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Handle customer disputes'
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
        description: 'Monitor AI conversations'
      },
      {
        id: 'performance',
        label: 'Performance Analysis',
        icon: BarChart3,
        path: '/admin/ai-agent/performance',
        roles: [AdminRole.AI_AGENT_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'AI performance metrics'
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
        id: 'campaigns',
        label: 'Campaign Management',
        icon: TrendingUp,
        path: '/admin/marketing/campaigns',
        roles: [AdminRole.MARKETING_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Create and manage campaigns'
      },
      {
        id: 'audience',
        label: 'Audience Targeting',
        icon: Users,
        path: '/admin/marketing/audience',
        roles: [AdminRole.MARKETING_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Audience segmentation'
      },
      {
        id: 'analytics',
        label: 'Marketing Analytics',
        icon: BarChart3,
        path: '/admin/marketing/analytics',
        roles: [AdminRole.MARKETING_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Campaign performance analytics'
      },
      {
        id: 'social-media',
        label: 'Social Media',
        icon: Globe,
        path: '/admin/marketing/social',
        roles: [AdminRole.MARKETING_ADMIN, AdminRole.SUPER_ADMIN],
        description: 'Social media management'
      }
    ]
  }
];

// Breadcrumb component
const AdminBreadcrumb: React.FC<{ currentPath: string }> = ({ currentPath }) => {
  const pathSegments = currentPath.split('/').filter(Boolean);
  
  // Generate breadcrumb items from path
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
    
    return {
      label,
      path,
      isLast: index === pathSegments.length - 1
    };
  });

  if (breadcrumbItems.length <= 1) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.path}>
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          <span
            className={`
              ${item.isLast 
                ? 'text-gray-900 dark:text-white font-medium' 
                : 'hover:text-gray-900 dark:hover:text-white cursor-pointer'
              }
            `}
          >
            {item.label}
          </span>
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
 * role-based menu items, and adaptive design for different screen sizes.
 */
export const AdminMainLayout: React.FC<AdminMainLayoutProps> = ({ children }) => {
  const { adminUser, hasRole } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Layout state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NavigationItem[]>([]);

  // Filter navigation items based on user roles
  const filteredNavigation = ADMIN_NAVIGATION.filter(item => 
    item.roles.some(role => hasRole(role))
  ).map(item => ({
    ...item,
    children: item.children?.filter(child => 
      child.roles.some(role => hasRole(role))
    )
  }));

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false); // Close mobile sidebar on desktop
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle navigation search
  useEffect(() => {
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
  }, [searchQuery, filteredNavigation]);

  // Handle navigation
  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false); // Close mobile sidebar after navigation
  };

  // Check if current path matches navigation item
  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        navigation={filteredNavigation}
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onNavigate={handleNavigation}
        currentPath={location.pathname}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchResults={searchResults}
      />

      {/* Main content area */}
      <div className={`
        transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
      `}>
        {/* Header */}
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {/* Breadcrumb navigation */}
          <AdminBreadcrumb currentPath={location.pathname} />
          
          {/* Page content */}
          <div className="max-w-7xl mx-auto">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminMainLayout;