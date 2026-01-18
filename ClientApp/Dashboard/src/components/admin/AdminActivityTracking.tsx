/**
 * AdminActivityTracking Component
 * Admin action logging and activity tracking system for Super Administrators
 */

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { AdminRole } from '../../types/admin';
import { 
  Activity,
  Clock,
  Shield,
  Search,
  Filter,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  X,
  User,
  Calendar,
  MapPin,
  Monitor,
  FileText,
  Settings,
  Crown,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AdminInput, LoadingSpinner, ErrorBoundary } from '../ui';
import { Card, CardContent, CardHeader, CardTitle } from '../ui';
import { Button } from '../ui';

// Admin activity interface
interface AdminActivity {
  id: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  adminRole: AdminRole;
  action: string;
  category: 'user_management' | 'content' | 'system' | 'security' | 'marketplace' | 'ai_agent' | 'marketing';
  target: string;
  targetType: 'user' | 'content' | 'system' | 'admin' | 'vendor' | 'product' | 'campaign';
  details: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'error';
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  duration?: number;
  metadata?: Record<string, any>;
}

// Filter options
interface ActivityFilters {
  search: string;
  adminRole?: AdminRole;
  category?: AdminActivity['category'];
  status?: AdminActivity['status'];
  dateFrom?: Date;
  dateTo?: Date;
}

// Mock activity data
const MOCK_ACTIVITIES: AdminActivity[] = [
  {
    id: '1',
    adminId: 'admin_1',
    adminName: 'John Smith',
    adminEmail: 'john.smith@example.com',
    adminRole: AdminRole.ADMINISTRATION_ADMIN,
    action: 'User Account Suspended',
    category: 'user_management',
    target: 'user@example.com',
    targetType: 'user',
    details: 'Suspended user account due to policy violation',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    status: 'success',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'sess_abc123',
    duration: 2500,
    metadata: { reason: 'Policy violation', previousStatus: 'active' }
  },
  {
    id: '2',
    adminId: 'admin_2',
    adminName: 'Sarah Johnson',
    adminEmail: 'sarah.johnson@example.com',
    adminRole: AdminRole.CONTENT_ADMIN,
    action: 'Content Moderation',
    category: 'content',
    target: 'Post #12847',
    targetType: 'content',
    details: 'Flagged content for review and removed from public view',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    status: 'warning',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    sessionId: 'sess_def456',
    duration: 1800,
    metadata: { contentType: 'post', flagReason: 'inappropriate' }
  },
  {
    id: '3',
    adminId: 'admin_3',
    adminName: 'Mike Wilson',
    adminEmail: 'mike.wilson@example.com',
    adminRole: AdminRole.MARKETPLACE_ADMIN,
    action: 'Vendor Verification',
    category: 'marketplace',
    target: 'TechCorp Ltd.',
    targetType: 'vendor',
    details: 'Completed vendor verification process and approved for marketplace',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    status: 'success',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'sess_ghi789',
    duration: 4200,
    metadata: { verificationLevel: 'premium', documentsReviewed: 5 }
  },
  {
    id: '4',
    adminId: 'admin_4',
    adminName: 'Emily Davis',
    adminEmail: 'emily.davis@example.com',
    adminRole: AdminRole.SUPER_ADMIN,
    action: 'System Configuration Update',
    category: 'system',
    target: 'Security Settings',
    targetType: 'system',
    details: 'Updated password policy and session timeout settings',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'success',
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (Ubuntu; Linux x86_64) AppleWebKit/537.36',
    sessionId: 'sess_jkl012',
    duration: 3600,
    metadata: { configSection: 'security', changesCount: 3 }
  },
  {
    id: '5',
    adminId: 'admin_5',
    adminName: 'Alex Chen',
    adminEmail: 'alex.chen@example.com',
    adminRole: AdminRole.AI_AGENT_ADMIN,
    action: 'AI Model Training Failed',
    category: 'ai_agent',
    target: 'Customer Support Model v2.1',
    targetType: 'system',
    details: 'AI model training failed due to insufficient data quality',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    status: 'error',
    ipAddress: '192.168.1.104',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    sessionId: 'sess_mno345',
    duration: 7200,
    metadata: { modelVersion: '2.1', errorCode: 'DATA_QUALITY_INSUFFICIENT' }
  }
];

// Role configuration
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
    icon: FileText
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

// Category configuration
const CATEGORY_CONFIG: Record<AdminActivity['category'], { label: string; color: string; icon: React.ComponentType<any> }> = {
  user_management: {
    label: 'User Management',
    color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20',
    icon: User
  },
  content: {
    label: 'Content',
    color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20',
    icon: FileText
  },
  system: {
    label: 'System',
    color: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20',
    icon: Settings
  },
  security: {
    label: 'Security',
    color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20',
    icon: Shield
  },
  marketplace: {
    label: 'Marketplace',
    color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20',
    icon: Monitor
  },
  ai_agent: {
    label: 'AI Agent',
    color: 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/20',
    icon: Activity
  },
  marketing: {
    label: 'Marketing',
    color: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20',
    icon: Activity
  }
};

// Activity detail component
const ActivityDetail: React.FC<{ 
  activity: AdminActivity; 
  isExpanded: boolean; 
  onToggle: () => void; 
}> = ({ activity, isExpanded, onToggle }) => {
  const roleConfig = ROLE_CONFIG[activity.adminRole];
  const categoryConfig = CATEGORY_CONFIG[activity.category];
  const RoleIcon = roleConfig.icon;
  const CategoryIcon = categoryConfig.icon;

  const getStatusColor = (status: AdminActivity['status']) => {
    switch (status) {
      case 'success': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: AdminActivity['status']) => {
    switch (status) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return X;
      default: return Activity;
    }
  };

  const StatusIcon = getStatusIcon(activity.status);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
      {/* Main activity info */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <StatusIcon className={`h-5 w-5 ${getStatusColor(activity.status)}`} />
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {activity.action}
            </h3>
            <span className={`
              inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
              ${categoryConfig.color}
            `}>
              <CategoryIcon className="h-3 w-3 mr-1" />
              {categoryConfig.label}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {activity.adminName}
            </div>
            <span className={`
              inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
              ${roleConfig.color}
            `}>
              <RoleIcon className="h-3 w-3 mr-1" />
              {roleConfig.label}
            </span>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {activity.timestamp.toLocaleString()}
            </div>
          </div>
          
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            Target: <span className="font-medium">{activity.target}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {activity.details}
          </p>
        </div>
        
        <Button
          onClick={onToggle}
          variant="ghost"
          size="sm"
          className="ml-4"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Session Details</h4>
              <div className="space-y-1 text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  IP: {activity.ipAddress}
                </div>
                <div className="flex items-center">
                  <Monitor className="h-4 w-4 mr-2" />
                  Session: {activity.sessionId}
                </div>
                {activity.duration && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Duration: {Math.round(activity.duration / 1000)}s
                  </div>
                )}
              </div>
            </div>
            
            {activity.metadata && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Additional Details</h4>
                <div className="space-y-1 text-gray-600 dark:text-gray-400">
                  {Object.entries(activity.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              User Agent: {activity.userAgent}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * AdminActivityTracking Component
 * 
 * Provides comprehensive admin activity tracking including:
 * - Activity timeline and audit trail
 * - Advanced filtering and search
 * - Detailed activity information
 * - Session management tracking
 * - Export capabilities
 */
export const AdminActivityTracking: React.FC = () => {
  const { adminUser, hasRole } = useAdminAuth();
  
  // Component state
  const [activities, setActivities] = useState<AdminActivity[]>(MOCK_ACTIVITIES);
  const [filteredActivities, setFilteredActivities] = useState<AdminActivity[]>(MOCK_ACTIVITIES);
  const [filters, setFilters] = useState<ActivityFilters>({ search: '' });
  const [loading, setLoading] = useState(false);
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);

  // Check if user has Super Admin access
  if (!hasRole(AdminRole.SUPER_ADMIN)) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="p-8 text-center">
          <Shield className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Super Administrator access required to view admin activity logs.
          </p>
        </Card>
      </div>
    );
  }

  // Filter activities
  useEffect(() => {
    let filtered = activities;

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(activity => 
        activity.adminName.toLowerCase().includes(searchLower) ||
        activity.action.toLowerCase().includes(searchLower) ||
        activity.target.toLowerCase().includes(searchLower) ||
        activity.details.toLowerCase().includes(searchLower)
      );
    }

    // Role filter
    if (filters.adminRole) {
      filtered = filtered.filter(activity => activity.adminRole === filters.adminRole);
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(activity => activity.category === filters.category);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(activity => activity.status === filters.status);
    }

    // Date filters
    if (filters.dateFrom) {
      filtered = filtered.filter(activity => activity.timestamp >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(activity => activity.timestamp <= filters.dateTo!);
    }

    setFilteredActivities(filtered);
  }, [activities, filters]);

  // Handle export
  const handleExport = () => {
    // In a real implementation, this would generate and download a CSV/Excel file
    console.log('Exporting activity data:', filteredActivities);
  };

  // Handle refresh
  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real implementation, fetch fresh activity data
    } catch (error) {
      console.error('Failed to refresh activities:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Admin Activity Tracking
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor and audit administrative actions and system access
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={handleRefresh}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <AdminInput
                  placeholder="Search activities..."
                  leftIcon={Search}
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>

              {/* Role Filter */}
              <div>
                <select
                  value={filters.adminRole || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    adminRole: e.target.value ? e.target.value as AdminRole : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Roles</option>
                  {Object.entries(ROLE_CONFIG).map(([role, config]) => (
                    <option key={role} value={role}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={filters.category || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    category: e.target.value ? e.target.value as AdminActivity['category'] : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  {Object.entries(CATEGORY_CONFIG).map(([category, config]) => (
                    <option key={category} value={category}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={filters.status || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    status: e.target.value ? e.target.value as AdminActivity['status'] : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Activity Timeline ({filteredActivities.length})
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="p-8">
                <LoadingSpinner text="Loading activities..." />
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No activities found matching your criteria.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredActivities.map((activity) => (
                  <ActivityDetail
                    key={activity.id}
                    activity={activity}
                    isExpanded={expandedActivity === activity.id}
                    onToggle={() => setExpandedActivity(
                      expandedActivity === activity.id ? null : activity.id
                    )}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default AdminActivityTracking;