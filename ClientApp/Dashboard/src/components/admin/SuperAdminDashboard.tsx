/**
 * SuperAdminDashboard Component
 * Comprehensive system overview dashboard for Super Administrators
 */

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { AdminRole } from '../../types/admin';
import { 
  Users,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  Server,
  Database,
  Cpu,
  HardDrive,
  Network,
  Clock,
  TrendingUp,
  TrendingDown,
  Eye,
  Settings,
  RefreshCw,
  Download,
  Upload,
  Zap,
  Globe
} from 'lucide-react';
import { AdminMetricCard, LoadingSpinner, ErrorBoundary } from '../ui';
import { Card, CardContent, CardHeader, CardTitle } from '../ui';
import { Button } from '../ui';

// System health status
interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: string;
  lastCheck: Date;
  services: {
    database: 'online' | 'offline' | 'degraded';
    api: 'online' | 'offline' | 'degraded';
    storage: 'online' | 'offline' | 'degraded';
    cache: 'online' | 'offline' | 'degraded';
  };
}

// System metrics interface
interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalAdmins: number;
  activeAdmins: number;
  systemLoad: number;
  memoryUsage: number;
  diskUsage: number;
  networkTraffic: {
    incoming: number;
    outgoing: number;
  };
  responseTime: number;
  errorRate: number;
}

// Recent activity interface
interface AdminActivity {
  id: string;
  adminName: string;
  adminRole: AdminRole;
  action: string;
  target: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'error';
  ipAddress: string;
}

// Mock data for demonstration
const MOCK_SYSTEM_HEALTH: SystemHealth = {
  status: 'healthy',
  uptime: '15 days, 7 hours',
  lastCheck: new Date(),
  services: {
    database: 'online',
    api: 'online',
    storage: 'online',
    cache: 'degraded'
  }
};

const MOCK_SYSTEM_METRICS: SystemMetrics = {
  totalUsers: 12847,
  activeUsers: 3421,
  totalAdmins: 23,
  activeAdmins: 8,
  systemLoad: 67,
  memoryUsage: 78,
  diskUsage: 45,
  networkTraffic: {
    incoming: 1250,
    outgoing: 890
  },
  responseTime: 245,
  errorRate: 0.02
};

const MOCK_ADMIN_ACTIVITIES: AdminActivity[] = [
  {
    id: '1',
    adminName: 'John Smith',
    adminRole: AdminRole.ADMINISTRATION_ADMIN,
    action: 'User Account Suspended',
    target: 'user@example.com',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    status: 'success',
    ipAddress: '192.168.1.100'
  },
  {
    id: '2',
    adminName: 'Sarah Johnson',
    adminRole: AdminRole.CONTENT_ADMIN,
    action: 'Content Moderation',
    target: 'Post #12847',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    status: 'warning',
    ipAddress: '192.168.1.101'
  },
  {
    id: '3',
    adminName: 'Mike Wilson',
    adminRole: AdminRole.MARKETPLACE_ADMIN,
    action: 'Vendor Verification',
    target: 'TechCorp Ltd.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    status: 'success',
    ipAddress: '192.168.1.102'
  }
];

// System health indicator component
const SystemHealthIndicator: React.FC<{ health: SystemHealth }> = ({ health }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
      case 'degraded':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'critical':
      case 'offline':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return CheckCircle;
      case 'warning':
      case 'degraded':
        return AlertTriangle;
      case 'critical':
      case 'offline':
        return AlertTriangle;
      default:
        return Activity;
    }
  };

  const StatusIcon = getStatusIcon(health.status);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Status</span>
            <div className="flex items-center">
              <StatusIcon className={`h-4 w-4 mr-2 ${getStatusColor(health.status)}`} />
              <span className={`text-sm font-medium capitalize ${getStatusColor(health.status)}`}>
                {health.status}
              </span>
            </div>
          </div>

          {/* Uptime */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
            <span className="text-sm font-medium">{health.uptime}</span>
          </div>

          {/* Services status */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Services</h4>
            {Object.entries(health.services).map(([service, status]) => {
              const ServiceStatusIcon = getStatusIcon(status);
              return (
                <div key={service} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {service}
                  </span>
                  <div className="flex items-center">
                    <ServiceStatusIcon className={`h-3 w-3 mr-1 ${getStatusColor(status)}`} />
                    <span className={`text-xs capitalize ${getStatusColor(status)}`}>
                      {status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Last check */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Last Check</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {health.lastCheck.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Recent admin activity component
const RecentAdminActivity: React.FC<{ activities: AdminActivity[] }> = ({ activities }) => {
  const getStatusColor = (status: AdminActivity['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'error':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getRoleColor = (role: AdminRole) => {
    switch (role) {
      case AdminRole.SUPER_ADMIN:
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case AdminRole.ADMINISTRATION_ADMIN:
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case AdminRole.CONTENT_ADMIN:
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case AdminRole.MARKETPLACE_ADMIN:
        return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20';
      case AdminRole.AI_AGENT_ADMIN:
        return 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/20';
      case AdminRole.MARKETING_ADMIN:
        return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Recent Admin Activity
          </div>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className={`
                w-2 h-2 rounded-full mt-2 flex-shrink-0
                ${getStatusColor(activity.status).split(' ')[2]}
              `} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.adminName}
                  </p>
                  <span className={`
                    inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                    ${getRoleColor(activity.adminRole)}
                  `}>
                    {activity.adminRole.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {activity.action}: <span className="font-medium">{activity.target}</span>
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.timestamp.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.ipAddress}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * SuperAdminDashboard Component
 * 
 * Provides comprehensive system overview for Super Administrators including:
 * - System health monitoring
 * - User and admin metrics
 * - Performance indicators
 * - Recent admin activity
 * - Quick action buttons
 */
export const SuperAdminDashboard: React.FC = () => {
  const { adminUser, hasRole } = useAdminAuth();
  
  // Component state
  const [systemHealth, setSystemHealth] = useState<SystemHealth>(MOCK_SYSTEM_HEALTH);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>(MOCK_SYSTEM_METRICS);
  const [adminActivities, setAdminActivities] = useState<AdminActivity[]>(MOCK_ADMIN_ACTIVITIES);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

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
            Super Administrator access required to view this dashboard.
          </p>
        </Card>
      </div>
    );
  }

  // Refresh dashboard data
  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, fetch fresh data from APIs
      setLastRefresh(new Date());
      setSystemHealth({ ...systemHealth, lastCheck: new Date() });
    } catch (error) {
      console.error('Failed to refresh dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Super Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              System overview and administrative controls
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
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

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminMetricCard
            title="Total Users"
            value={systemMetrics.totalUsers}
            icon={Users}
            description={`${systemMetrics.activeUsers} active`}
            trend={{
              value: 12.5,
              label: 'vs last month',
              isPositive: true
            }}
            color="blue"
            loading={loading}
          />
          
          <AdminMetricCard
            title="Admin Users"
            value={systemMetrics.totalAdmins}
            icon={Shield}
            description={`${systemMetrics.activeAdmins} online`}
            trend={{
              value: 2.1,
              label: 'vs last week',
              isPositive: true
            }}
            color="purple"
            loading={loading}
          />
          
          <AdminMetricCard
            title="System Load"
            value={`${systemMetrics.systemLoad}%`}
            icon={Cpu}
            description="CPU utilization"
            trend={{
              value: 5.3,
              label: 'vs last hour',
              isPositive: false
            }}
            color={systemMetrics.systemLoad > 80 ? 'red' : systemMetrics.systemLoad > 60 ? 'yellow' : 'green'}
            loading={loading}
          />
          
          <AdminMetricCard
            title="Response Time"
            value={`${systemMetrics.responseTime}ms`}
            icon={Zap}
            description="Average API response"
            trend={{
              value: 8.2,
              label: 'vs last hour',
              isPositive: false
            }}
            color={systemMetrics.responseTime > 500 ? 'red' : systemMetrics.responseTime > 300 ? 'yellow' : 'green'}
            loading={loading}
          />
        </div>

        {/* System Health and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SystemHealthIndicator health={systemHealth} />
          <RecentAdminActivity activities={adminActivities} />
        </div>

        {/* System Resources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AdminMetricCard
            title="Memory Usage"
            value={`${systemMetrics.memoryUsage}%`}
            icon={Database}
            description="RAM utilization"
            color={systemMetrics.memoryUsage > 85 ? 'red' : systemMetrics.memoryUsage > 70 ? 'yellow' : 'green'}
            loading={loading}
          />
          
          <AdminMetricCard
            title="Disk Usage"
            value={`${systemMetrics.diskUsage}%`}
            icon={HardDrive}
            description="Storage utilization"
            color={systemMetrics.diskUsage > 85 ? 'red' : systemMetrics.diskUsage > 70 ? 'yellow' : 'green'}
            loading={loading}
          />
          
          <AdminMetricCard
            title="Network Traffic"
            value={`${systemMetrics.networkTraffic.incoming + systemMetrics.networkTraffic.outgoing} MB/s`}
            icon={Network}
            description={`↓${systemMetrics.networkTraffic.incoming} ↑${systemMetrics.networkTraffic.outgoing} MB/s`}
            color="indigo"
            loading={loading}
          />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Users className="h-6 w-6 mb-2" />
                <span className="text-sm">Manage Admins</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Activity className="h-6 w-6 mb-2" />
                <span className="text-sm">System Health</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Settings className="h-6 w-6 mb-2" />
                <span className="text-sm">Configuration</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Download className="h-6 w-6 mb-2" />
                <span className="text-sm">Export Logs</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default SuperAdminDashboard;