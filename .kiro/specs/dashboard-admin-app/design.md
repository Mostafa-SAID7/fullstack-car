# Dashboard Admin App - Design Specification

## Architecture Overview

The Dashboard Admin App follows a modern React architecture with TypeScript, utilizing functional components, hooks, and context for state management. The application implements a role-based access control system with modular design for different admin types.

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Presentation Layer                       │
├─────────────────────────────────────────────────────────────────┤
│  React 18+ App        │  TypeScript       │  Modern UI/UX       │
│  - Role-based Routes  │  - Type Safety    │  - Responsive Design │
│  - Admin Modules      │  - Interface Defs │  - Dark/Light Theme  │
│  - Dashboard Widgets  │  - API Types      │  - Accessibility     │
│  - Real-time Updates  │  - Component Types│  - Mobile Support    │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                         State Management                        │
├─────────────────────────────────────────────────────────────────┤
│  React Context        │  Custom Hooks     │  Local State        │
│  - Auth Context       │  - useAuth        │  - Component State   │
│  - Theme Context      │  - usePermissions │  - Form State        │
│  - Notification Ctx   │  - useRealTime    │  - UI State          │
│  - Admin Context      │  - useApi         │  - Cache State       │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                         Service Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  API Services         │  Real-time        │  Utility Services    │
│  - Auth Service       │  - SignalR Hub    │  - Storage Service   │
│  - Admin Services     │  - Notifications  │  - Theme Service     │
│  - Content Service    │  - Live Updates   │  - Validation        │
│  - Analytics Service  │  - Collaboration  │  - Error Handling    │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                      Infrastructure Layer                       │
├─────────────────────────────────────────────────────────────────┤
│  HTTP Client          │  Build Tools      │  Development Tools   │
│  - Axios/Fetch        │  - Vite           │  - Hot Reload        │
│  - Request/Response   │  - TypeScript     │  - Dev Server        │
│  - Error Handling     │  - ESLint         │  - Source Maps       │
│  - Interceptors       │  - Tailwind CSS   │  - Bundle Analysis   │
└─────────────────────────────────────────────────────────────────┘
```

## Role-Based Access Control Design

### Role Hierarchy and Permissions

```typescript
// Role definitions and permissions
export enum AdminRole {
  SUPER_ADMIN = 'SuperAdmin',
  ADMINISTRATION_ADMIN = 'AdministrationAdmin',
  CONTENT_ADMIN = 'ContentAdmin',
  MARKETPLACE_ADMIN = 'MarketplaceAdmin',
  AI_AGENT_ADMIN = 'AIAgentAdmin',
  MARKETING_ADMIN = 'MarketingAdmin'
}

export interface Permission {
  module: string;
  actions: string[];
  resources?: string[];
}

export interface RolePermissions {
  role: AdminRole;
  permissions: Permission[];
  inherits?: AdminRole[];
}

// Permission matrix
export const ROLE_PERMISSIONS: Record<AdminRole, RolePermissions> = {
  [AdminRole.SUPER_ADMIN]: {
    role: AdminRole.SUPER_ADMIN,
    permissions: [
      { module: '*', actions: ['*'] } // Full access to everything
    ]
  },
  [AdminRole.ADMINISTRATION_ADMIN]: {
    role: AdminRole.ADMINISTRATION_ADMIN,
    permissions: [
      { module: 'users', actions: ['read', 'create', 'update', 'delete'] },
      { module: 'system', actions: ['read', 'update', 'monitor'] },
      { module: 'analytics', actions: ['read'] },
      { module: 'audit', actions: ['read'] },
      { module: 'notifications', actions: ['read', 'create', 'update'] }
    ]
  },
  [AdminRole.CONTENT_ADMIN]: {
    role: AdminRole.CONTENT_ADMIN,
    permissions: [
      { module: 'content', actions: ['read', 'create', 'update', 'delete', 'publish'] },
      { module: 'media', actions: ['read', 'create', 'update', 'delete'] },
      { module: 'cms', actions: ['read', 'create', 'update', 'delete'] },
      { module: 'seo', actions: ['read', 'update'] },
      { module: 'localization', actions: ['read', 'update'] }
    ]
  },
  [AdminRole.MARKETPLACE_ADMIN]: {
    role: AdminRole.MARKETPLACE_ADMIN,
    permissions: [
      { module: 'marketplace', actions: ['read', 'create', 'update', 'delete'] },
      { module: 'vendors', actions: ['read', 'create', 'update', 'verify'] },
      { module: 'products', actions: ['read', 'create', 'update', 'approve'] },
      { module: 'transactions', actions: ['read', 'update', 'refund'] },
      { module: 'disputes', actions: ['read', 'resolve'] }
    ]
  },
  [AdminRole.AI_AGENT_ADMIN]: {
    role: AdminRole.AI_AGENT_ADMIN,
    permissions: [
      { module: 'ai-agents', actions: ['read', 'create', 'update', 'delete', 'deploy'] },
      { module: 'models', actions: ['read', 'create', 'train', 'evaluate'] },
      { module: 'datasets', actions: ['read', 'create', 'update', 'delete'] },
      { module: 'conversations', actions: ['read', 'monitor'] },
      { module: 'ai-analytics', actions: ['read'] }
    ]
  },
  [AdminRole.MARKETING_ADMIN]: {
    role: AdminRole.MARKETING_ADMIN,
    permissions: [
      { module: 'campaigns', actions: ['read', 'create', 'update', 'delete', 'launch'] },
      { module: 'audiences', actions: ['read', 'create', 'update', 'segment'] },
      { module: 'marketing-content', actions: ['read', 'create', 'update'] },
      { module: 'marketing-analytics', actions: ['read'] },
      { module: 'social-media', actions: ['read', 'create', 'update', 'schedule'] }
    ]
  }
};
```

### Permission System Implementation

```typescript
// Permission checking hook
export const usePermissions = () => {
  const { user } = useAuth();
  
  const hasPermission = useCallback((module: string, action: string, resource?: string): boolean => {
    if (!user || !user.roles) return false;
    
    // Super admin has all permissions
    if (user.roles.includes(AdminRole.SUPER_ADMIN)) return true;
    
    // Check specific role permissions
    for (const role of user.roles) {
      const rolePermissions = ROLE_PERMISSIONS[role as AdminRole];
      if (!rolePermissions) continue;
      
      for (const permission of rolePermissions.permissions) {
        // Check wildcard permissions
        if (permission.module === '*' && permission.actions.includes('*')) return true;
        if (permission.module === module && permission.actions.includes('*')) return true;
        if (permission.module === module && permission.actions.includes(action)) {
          // Check resource-specific permissions if needed
          if (resource && permission.resources) {
            return permission.resources.includes(resource);
          }
          return true;
        }
      }
    }
    
    return false;
  }, [user]);
  
  const hasAnyPermission = useCallback((permissions: Array<{module: string, action: string}>): boolean => {
    return permissions.some(p => hasPermission(p.module, p.action));
  }, [hasPermission]);
  
  const hasAllPermissions = useCallback((permissions: Array<{module: string, action: string}>): boolean => {
    return permissions.every(p => hasPermission(p.module, p.action));
  }, [hasPermission]);
  
  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    userRoles: user?.roles || []
  };
};

// Protected Route Component
export const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requiredPermissions?: Array<{module: string, action: string}>;
  requiredRoles?: AdminRole[];
  fallback?: React.ReactNode;
}> = ({ children, requiredPermissions, requiredRoles, fallback }) => {
  const { hasPermission, hasAnyPermission, userRoles } = usePermissions();
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check role requirements
  if (requiredRoles && !requiredRoles.some(role => userRoles.includes(role))) {
    return fallback || <Navigate to="/error/403" replace />;
  }
  
  // Check permission requirements
  if (requiredPermissions && !hasAnyPermission(requiredPermissions)) {
    return fallback || <Navigate to="/error/403" replace />;
  }
  
  return <>{children}</>;
};
```

## Component Architecture

### Core Layout Components

```typescript
// Main Layout with Role-based Navigation
export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Generate navigation items based on user permissions
  const navigationItems = useMemo(() => {
    const items: NavigationItem[] = [];
    
    // Dashboard (always visible to authenticated admins)
    items.push({
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      isActive: true
    });
    
    // Administration module
    if (hasPermission('users', 'read') || hasPermission('system', 'read')) {
      items.push({
        id: 'administration',
        label: 'Administration',
        icon: Settings,
        children: [
          ...(hasPermission('users', 'read') ? [{
            id: 'users',
            label: 'User Management',
            path: '/administration/users'
          }] : []),
          ...(hasPermission('system', 'read') ? [{
            id: 'system',
            label: 'System Settings',
            path: '/administration/system'
          }] : []),
          ...(hasPermission('analytics', 'read') ? [{
            id: 'analytics',
            label: 'Analytics',
            path: '/administration/analytics'
          }] : [])
        ]
      });
    }
    
    // Content Management module
    if (hasPermission('content', 'read')) {
      items.push({
        id: 'content',
        label: 'Content Management',
        icon: FileText,
        children: [
          { id: 'content-overview', label: 'Overview', path: '/content' },
          { id: 'media', label: 'Media Library', path: '/content/media' },
          { id: 'localization', label: 'Localization', path: '/content/localization' }
        ]
      });
    }
    
    // Marketplace module
    if (hasPermission('marketplace', 'read')) {
      items.push({
        id: 'marketplace',
        label: 'Marketplace',
        icon: ShoppingCart,
        children: [
          { id: 'marketplace-overview', label: 'Overview', path: '/marketplace' },
          { id: 'vendors', label: 'Vendors', path: '/marketplace/vendors' },
          { id: 'products', label: 'Products', path: '/marketplace/products' },
          { id: 'transactions', label: 'Transactions', path: '/marketplace/transactions' }
        ]
      });
    }
    
    // AI Agent module
    if (hasPermission('ai-agents', 'read')) {
      items.push({
        id: 'ai-agent',
        label: 'AI Agents',
        icon: Bot,
        children: [
          { id: 'ai-overview', label: 'Overview', path: '/ai-agent' },
          { id: 'model-training', label: 'Model Training', path: '/ai-agent/training' },
          { id: 'conversations', label: 'Conversations', path: '/ai-agent/conversations' }
        ]
      });
    }
    
    // Marketing module
    if (hasPermission('campaigns', 'read')) {
      items.push({
        id: 'marketing',
        label: 'Marketing',
        icon: TrendingUp,
        children: [
          { id: 'marketing-overview', label: 'Overview', path: '/marketing' },
          { id: 'campaigns', label: 'Campaigns', path: '/marketing/campaigns' },
          { id: 'analytics', label: 'Analytics', path: '/marketing/analytics' },
          { id: 'social-media', label: 'Social Media', path: '/marketing/social-media' }
        ]
      });
    }
    
    return items;
  }, [hasPermission]);
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        items={navigationItems}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          user={user}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
```

### Admin Module Components

```typescript
// Super Admin Dashboard
export const SuperAdminDashboard: React.FC = () => {
  const { data: systemMetrics } = useQuery('system-metrics', fetchSystemMetrics);
  const { data: adminActivity } = useQuery('admin-activity', fetchAdminActivity);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <div className="flex space-x-4">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            System Settings
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Admin
          </Button>
        </div>
      </div>
      
      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={systemMetrics?.totalUsers || 0}
          change={systemMetrics?.userGrowth || 0}
          icon={Users}
        />
        <MetricCard
          title="Active Admins"
          value={systemMetrics?.activeAdmins || 0}
          change={systemMetrics?.adminActivity || 0}
          icon={Shield}
        />
        <MetricCard
          title="System Health"
          value={`${systemMetrics?.systemHealth || 100}%`}
          status={systemMetrics?.systemStatus || 'healthy'}
          icon={Activity}
        />
        <MetricCard
          title="Security Alerts"
          value={systemMetrics?.securityAlerts || 0}
          urgent={systemMetrics?.urgentAlerts || 0}
          icon={AlertTriangle}
        />
      </div>
      
      {/* Admin Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Admin Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminActivityChart data={adminActivity} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Admin Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminActionsList actions={adminActivity?.recentActions || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Enhanced Content Admin Dashboard with Community and Media Review
export const ContentAdminDashboard: React.FC = () => {
  const { data: contentMetrics } = useQuery('content-metrics', fetchContentMetrics);
  const { data: recentContent } = useQuery('recent-content', fetchRecentContent);
  const { data: communityContent } = useQuery('community-content', fetchCommunityContent);
  const { data: mediaReviews } = useQuery('media-reviews', fetchMediaReviews);
  const { data: folderStructure } = useQuery('folder-structure', fetchFolderStructure);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Enhanced Content Management</h1>
        <div className="flex space-x-4">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Content Library
          </Button>
          <Button variant="outline">
            <Users className="w-4 h-4 mr-2" />
            Community Moderation
          </Button>
          <Button variant="outline">
            <Video className="w-4 h-4 mr-2" />
            Media Reviews
          </Button>
          <Button variant="outline">
            <Folder className="w-4 h-4 mr-2" />
            Folder Management
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Content
          </Button>
        </div>
      </div>
      
      {/* Enhanced Content Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <MetricCard
          title="Total Content"
          value={contentMetrics?.totalContent || 0}
          change={contentMetrics?.contentGrowth || 0}
          icon={FileText}
        />
        <MetricCard
          title="Published Today"
          value={contentMetrics?.publishedToday || 0}
          change={contentMetrics?.publishingRate || 0}
          icon={Calendar}
        />
        <MetricCard
          title="Pending Review"
          value={contentMetrics?.pendingReview || 0}
          urgent={contentMetrics?.urgentReviews || 0}
          icon={Clock}
        />
        <MetricCard
          title="Media Assets"
          value={contentMetrics?.mediaAssets || 0}
          change={contentMetrics?.mediaGrowth || 0}
          icon={Image}
        />
        <MetricCard
          title="Community Posts"
          value={communityContent?.totalPosts || 0}
          change={communityContent?.postsGrowth || 0}
          icon={Users}
        />
        <MetricCard
          title="Media Reviews"
          value={mediaReviews?.pendingReviews || 0}
          urgent={mediaReviews?.urgentReviews || 0}
          icon={Video}
        />
      </div>
      
      {/* Enhanced Content Management Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Content Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">All Content</Button>
                <Button variant="outline" size="sm">Community Posts</Button>
                <Button variant="outline" size="sm">Media Reviews</Button>
                <Button variant="outline" size="sm">Folders</Button>
              </div>
            </CardHeader>
            <CardContent>
              <EnhancedContentTable 
                content={recentContent}
                communityContent={communityContent}
                mediaReviews={mediaReviews}
              />
            </CardContent>
          </Card>
          
          {/* Community Moderation Queue */}
          <Card>
            <CardHeader>
              <CardTitle>Community Moderation Queue</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Flag className="w-4 h-4 mr-2" />
                  Flagged Content
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Reported Comments
                </Button>
                <Button variant="outline" size="sm">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Auto-Flagged
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <CommunityModerationQueue content={communityContent?.flaggedContent} />
            </CardContent>
          </Card>
          
          {/* Media Review System */}
          <Card>
            <CardHeader>
              <CardTitle>Media Review System</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Video className="w-4 h-4 mr-2" />
                  Video Reviews
                </Button>
                <Button variant="outline" size="sm">
                  <Headphones className="w-4 h-4 mr-2" />
                  Podcast Reviews
                </Button>
                <Button variant="outline" size="sm">
                  <Image className="w-4 h-4 mr-2" />
                  Image Reviews
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <MediaReviewSystem reviews={mediaReviews} />
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedContentQuickActions />
            </CardContent>
          </Card>
          
          {/* Folder Management */}
          <Card>
            <CardHeader>
              <CardTitle>Folder Structure</CardTitle>
              <Button variant="outline" size="sm">
                <FolderPlus className="w-4 h-4 mr-2" />
                New Folder
              </Button>
            </CardHeader>
            <CardContent>
              <FolderTreeView structure={folderStructure} />
            </CardContent>
          </Card>
          
          {/* Content Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Content Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ContentAnalyticsWidget metrics={contentMetrics} />
            </CardContent>
          </Card>
          
          {/* Moderation Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Moderation Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <ModerationToolsWidget />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Marketplace Admin Dashboard
export const MarketplaceAdminDashboard: React.FC = () => {
  const { data: marketplaceMetrics } = useQuery('marketplace-metrics', fetchMarketplaceMetrics);
  const { data: recentTransactions } = useQuery('recent-transactions', fetchRecentTransactions);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Marketplace Management</h1>
        <div className="flex space-x-4">
          <Button variant="outline">
            <ShoppingCart className="w-4 h-4 mr-2" />
            View Marketplace
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Vendor
          </Button>
        </div>
      </div>
      
      {/* Marketplace Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`$${marketplaceMetrics?.totalRevenue || 0}`}
          change={marketplaceMetrics?.revenueGrowth || 0}
          icon={DollarSign}
        />
        <MetricCard
          title="Active Vendors"
          value={marketplaceMetrics?.activeVendors || 0}
          change={marketplaceMetrics?.vendorGrowth || 0}
          icon={Store}
        />
        <MetricCard
          title="Products Listed"
          value={marketplaceMetrics?.totalProducts || 0}
          change={marketplaceMetrics?.productGrowth || 0}
          icon={Package}
        />
        <MetricCard
          title="Pending Disputes"
          value={marketplaceMetrics?.pendingDisputes || 0}
          urgent={marketplaceMetrics?.urgentDisputes || 0}
          icon={AlertCircle}
        />
      </div>
      
      {/* Marketplace Management Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionTable transactions={recentTransactions} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Vendor Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <VendorPerformanceChart data={marketplaceMetrics?.vendorPerformance} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
```

## State Management Architecture

### Context Providers

```typescript
// Auth Context
export interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  hasRole: (role: AdminRole) => boolean;
  hasAnyRole: (roles: AdminRole[]) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Verify token and get user info
          const userInfo = await authService.getCurrentUser();
          setUser(userInfo);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
  }, []);
  
  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      localStorage.setItem('auth_token', response.token);
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    await authService.logout();
    setUser(null);
    localStorage.removeItem('auth_token');
  };
  
  const hasRole = (role: AdminRole): boolean => {
    return user?.roles?.includes(role) || false;
  };
  
  const hasAnyRole = (roles: AdminRole[]): boolean => {
    return roles.some(role => hasRole(role));
  };
  
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshToken: authService.refreshToken,
    hasRole,
    hasAnyRole
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Theme Context
export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'light';
  });
  
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  
  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## API Integration

### Service Layer Architecture

```typescript
// Base API Service
export class ApiService {
  private baseURL: string;
  private axiosInstance: AxiosInstance;
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    this.setupInterceptors();
  }
  
  private setupInterceptors() {
    // Request interceptor for auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle token expiration
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }
  
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.axiosInstance.get(url, { params });
    return response.data;
  }
  
  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.axiosInstance.post(url, data);
    return response.data;
  }
  
  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.axiosInstance.put(url, data);
    return response.data;
  }
  
  async delete<T>(url: string): Promise<T> {
    const response = await this.axiosInstance.delete(url);
    return response.data;
  }
}

// Admin-specific services
export class AdminService extends ApiService {
  constructor() {
    super('/api/v7/admin');
  }
  
  // Super Admin methods
  async getSystemMetrics(): Promise<SystemMetrics> {
    return this.get('/system/metrics');
  }
  
  async getAdminUsers(): Promise<AdminUser[]> {
    return this.get('/users');
  }
  
  async createAdminUser(userData: CreateAdminRequest): Promise<AdminUser> {
    return this.post('/users', userData);
  }
  
  async updateAdminUser(id: string, userData: UpdateAdminRequest): Promise<AdminUser> {
    return this.put(`/users/${id}`, userData);
  }
  
  async deactivateAdminUser(id: string): Promise<void> {
    return this.delete(`/users/${id}`);
  }
  
  // Administration Admin methods
  async getUserMetrics(): Promise<UserMetrics> {
    return this.get('/users/metrics');
  }
  
  async getSystemHealth(): Promise<SystemHealth> {
    return this.get('/system/health');
  }
  
  async getAuditLogs(params: AuditLogParams): Promise<PagedResult<AuditLog>> {
    return this.get('/audit/logs', params);
  }
}

export class EnhancedContentService extends ApiService {
  constructor() {
    super('/api/v7/content');
  }
  
  // Traditional Content Management
  async getContentMetrics(): Promise<ContentMetrics> {
    return this.get('/metrics');
  }
  
  async getContent(params: ContentParams): Promise<PagedResult<Content>> {
    return this.get('/', params);
  }
  
  async createContent(contentData: CreateContentRequest): Promise<Content> {
    return this.post('/', contentData);
  }
  
  async updateContent(id: string, contentData: UpdateContentRequest): Promise<Content> {
    return this.put(`/${id}`, contentData);
  }
  
  async publishContent(id: string): Promise<Content> {
    return this.post(`/${id}/publish`);
  }
  
  async deleteContent(id: string): Promise<void> {
    return this.delete(`/${id}`);
  }
  
  // Community Content Management
  async getCommunityContent(params: CommunityContentParams): Promise<PagedResult<CommunityContent>> {
    return this.get('/community', params);
  }
  
  async getFlaggedContent(params: ModerationParams): Promise<PagedResult<FlaggedContent>> {
    return this.get('/community/flagged', params);
  }
  
  async moderateContent(contentId: string, action: ModerationAction): Promise<ModerationResult> {
    return this.post(`/community/${contentId}/moderate`, { action });
  }
  
  async bulkModerateContent(contentIds: string[], action: ModerationAction): Promise<BulkModerationResult> {
    return this.post('/community/bulk-moderate', { contentIds, action });
  }
  
  async getReportedComments(params: ReportParams): Promise<PagedResult<ReportedComment>> {
    return this.get('/community/reported-comments', params);
  }
  
  async resolveReport(reportId: string, resolution: ReportResolution): Promise<ReportResult> {
    return this.post(`/community/reports/${reportId}/resolve`, resolution);
  }
  
  // Media Review System
  async getMediaReviews(params: MediaReviewParams): Promise<PagedResult<MediaReview>> {
    return this.get('/media/reviews', params);
  }
  
  async getPendingMediaReviews(): Promise<MediaReview[]> {
    return this.get('/media/reviews/pending');
  }
  
  async reviewMedia(mediaId: string, review: MediaReviewData): Promise<MediaReviewResult> {
    return this.post(`/media/${mediaId}/review`, review);
  }
  
  async approveMedia(mediaId: string, approvalData: MediaApprovalData): Promise<MediaApprovalResult> {
    return this.post(`/media/${mediaId}/approve`, approvalData);
  }
  
  async rejectMedia(mediaId: string, rejectionData: MediaRejectionData): Promise<MediaRejectionResult> {
    return this.post(`/media/${mediaId}/reject`, rejectionData);
  }
  
  async getMediaAnalytics(mediaId: string): Promise<MediaAnalytics> {
    return this.get(`/media/${mediaId}/analytics`);
  }
  
  async bulkReviewMedia(mediaIds: string[], reviewAction: BulkReviewAction): Promise<BulkReviewResult> {
    return this.post('/media/bulk-review', { mediaIds, reviewAction });
  }
  
  // Folder Management System
  async getFolderStructure(): Promise<FolderStructure> {
    return this.get('/folders/structure');
  }
  
  async createFolder(folderData: CreateFolderRequest): Promise<Folder> {
    return this.post('/folders', folderData);
  }
  
  async updateFolder(folderId: string, folderData: UpdateFolderRequest): Promise<Folder> {
    return this.put(`/folders/${folderId}`, folderData);
  }
  
  async deleteFolder(folderId: string): Promise<void> {
    return this.delete(`/folders/${folderId}`);
  }
  
  async moveContent(contentId: string, targetFolderId: string): Promise<MoveResult> {
    return this.post(`/folders/move-content`, { contentId, targetFolderId });
  }
  
  async bulkMoveContent(contentIds: string[], targetFolderId: string): Promise<BulkMoveResult> {
    return this.post('/folders/bulk-move', { contentIds, targetFolderId });
  }
  
  async getFolderContents(folderId: string, params: FolderContentParams): Promise<PagedResult<FolderContent>> {
    return this.get(`/folders/${folderId}/contents`, params);
  }
  
  async setFolderPermissions(folderId: string, permissions: FolderPermissions): Promise<PermissionResult> {
    return this.post(`/folders/${folderId}/permissions`, permissions);
  }
  
  // Advanced Search and Filtering
  async searchContent(searchParams: AdvancedSearchParams): Promise<SearchResult> {
    return this.post('/search', searchParams);
  }
  
  async getContentTags(): Promise<ContentTag[]> {
    return this.get('/tags');
  }
  
  async createContentTag(tagData: CreateTagRequest): Promise<ContentTag> {
    return this.post('/tags', tagData);
  }
  
  async getContentCategories(): Promise<ContentCategory[]> {
    return this.get('/categories');
  }
  
  async createContentCategory(categoryData: CreateCategoryRequest): Promise<ContentCategory> {
    return this.post('/categories', categoryData);
  }
  
  // Automated Moderation Rules
  async getModerationRules(): Promise<ModerationRule[]> {
    return this.get('/moderation/rules');
  }
  
  async createModerationRule(ruleData: CreateModerationRuleRequest): Promise<ModerationRule> {
    return this.post('/moderation/rules', ruleData);
  }
  
  async updateModerationRule(ruleId: string, ruleData: UpdateModerationRuleRequest): Promise<ModerationRule> {
    return this.put(`/moderation/rules/${ruleId}`, ruleData);
  }
  
  async deleteModerationRule(ruleId: string): Promise<void> {
    return this.delete(`/moderation/rules/${ruleId}`);
  }
  
  async testModerationRule(ruleId: string, testContent: TestContentData): Promise<ModerationTestResult> {
    return this.post(`/moderation/rules/${ruleId}/test`, testContent);
  }
}
  
  async updateContent(id: string, contentData: UpdateContentRequest): Promise<Content> {
    return this.put(`/${id}`, contentData);
  }
  
  async publishContent(id: string): Promise<Content> {
    return this.post(`/${id}/publish`);
  }
  
  async deleteContent(id: string): Promise<void> {
    return this.delete(`/${id}`);
  }
}

export class MarketplaceService extends ApiService {
  constructor() {
    super('/api/v7/marketplace');
  }
  
  async getMarketplaceMetrics(): Promise<MarketplaceMetrics> {
    return this.get('/metrics');
  }
  
  async getVendors(params: VendorParams): Promise<PagedResult<Vendor>> {
    return this.get('/vendors', params);
  }
  
  async approveVendor(id: string): Promise<Vendor> {
    return this.post(`/vendors/${id}/approve`);
  }
  
  async getTransactions(params: TransactionParams): Promise<PagedResult<Transaction>> {
    return this.get('/transactions', params);
  }
  
  async processRefund(transactionId: string, amount: number): Promise<Transaction> {
    return this.post(`/transactions/${transactionId}/refund`, { amount });
  }
}
```

## Real-time Features

### SignalR Integration

```typescript
// Real-time service using SignalR
export class RealTimeService {
  private connection: HubConnection | null = null;
  private listeners: Map<string, Set<Function>> = new Map();
  
  async connect(): Promise<void> {
    if (this.connection?.state === HubConnectionState.Connected) {
      return;
    }
    
    this.connection = new HubConnectionBuilder()
      .withUrl('/hubs/admin', {
        accessTokenFactory: () => localStorage.getItem('auth_token') || ''
      })
      .withAutomaticReconnect()
      .build();
    
    // Set up event handlers
    this.connection.on('SystemAlert', (alert: SystemAlert) => {
      this.emit('systemAlert', alert);
    });
    
    this.connection.on('AdminActivity', (activity: AdminActivity) => {
      this.emit('adminActivity', activity);
    });
    
    this.connection.on('MetricUpdate', (metric: MetricUpdate) => {
      this.emit('metricUpdate', metric);
    });
    
    await this.connection.start();
  }
  
  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }
  
  on(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }
  
  private emit(event: string, data: any): void {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }
  
  async joinAdminGroup(adminType: AdminRole): Promise<void> {
    if (this.connection?.state === HubConnectionState.Connected) {
      await this.connection.invoke('JoinAdminGroup', adminType);
    }
  }
  
  async leaveAdminGroup(adminType: AdminRole): Promise<void> {
    if (this.connection?.state === HubConnectionState.Connected) {
      await this.connection.invoke('LeaveAdminGroup', adminType);
    }
  }
}

// Real-time hook
export const useRealTime = () => {
  const [isConnected, setIsConnected] = useState(false);
  const realTimeService = useRef(new RealTimeService());
  
  useEffect(() => {
    const connect = async () => {
      try {
        await realTimeService.current.connect();
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to connect to real-time service:', error);
      }
    };
    
    connect();
    
    return () => {
      realTimeService.current.disconnect();
    };
  }, []);
  
  const subscribe = useCallback((event: string, callback: Function) => {
    return realTimeService.current.on(event, callback);
  }, []);
  
  return {
    isConnected,
    subscribe,
    joinAdminGroup: realTimeService.current.joinAdminGroup.bind(realTimeService.current),
    leaveAdminGroup: realTimeService.current.leaveAdminGroup.bind(realTimeService.current)
  };
};
```

## UI Component Library

### Design System Components

```typescript
// Button Component with variants
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-500',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base'
  };
  
  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

// Card Components
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={cn('bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm', className)}>
    {children}
  </div>
);

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={cn('px-6 py-4 border-b border-gray-200 dark:border-gray-700', className)}>
    {children}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={cn('px-6 py-4', className)}>
    {children}
  </div>
);

// Metric Card Component
export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  status?: 'healthy' | 'warning' | 'error';
  urgent?: number;
  icon: React.ComponentType<{ className?: string }>;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  status,
  urgent,
  icon: Icon
}) => {
  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            {change !== undefined && (
              <p className={cn('text-sm', getChangeColor(change))}>
                {change > 0 ? '+' : ''}{change}%
              </p>
            )}
            {urgent && urgent > 0 && (
              <p className="text-sm text-red-600 font-medium">
                {urgent} urgent
              </p>
            )}
          </div>
          <div className={cn('p-3 rounded-full bg-gray-100 dark:bg-gray-700', status && getStatusColor(status))}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

This comprehensive design specification provides a complete technical foundation for the Dashboard Admin App with role-based access control, modern React architecture, and specialized modules for each admin type. The design maintains consistency with the existing codebase while introducing advanced features for administrative management.