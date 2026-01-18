/**
 * SystemHealthDashboard Component
 * System monitoring and health dashboard for Super Administrators
 */

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { AdminRole } from '../../types/admin';
import { 
  Activity,
  Server,
  Database,
  Cpu,
  HardDrive,
  Network,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Settings,
  Shield,
  Globe,
  Wifi,
  Monitor,
  MemoryStick,
  Thermometer
} from 'lucide-react';
import { AdminMetricCard, LoadingSpinner, ErrorBoundary } from '../ui';
import { Card, CardContent, CardHeader, CardTitle } from '../ui';
import { Button } from '../ui';

// System metrics interface
interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
    temperature: number;
    load1m: number;
    load5m: number;
    load15m: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    cached: number;
    usage: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    usage: number;
    iops: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
    connections: number;
  };
  services: {
    [key: string]: {
      status: 'online' | 'offline' | 'degraded';
      uptime: number;
      responseTime: number;
      errorRate: number;
    };
  };
}

// Performance metrics interface
interface PerformanceMetrics {
  responseTime: {
    avg: number;
    p95: number;
    p99: number;
  };
  throughput: {
    requestsPerSecond: number;
    requestsPerMinute: number;
  };
  errors: {
    rate: number;
    count: number;
    types: { [key: string]: number };
  };
  database: {
    connections: number;
    queryTime: number;
    slowQueries: number;
  };
}

// Security metrics interface
interface SecurityMetrics {
  failedLogins: number;
  blockedIPs: number;
  suspiciousActivity: number;
  lastSecurityScan: Date;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

// Mock data
const MOCK_SYSTEM_METRICS: SystemMetrics = {
  cpu: {
    usage: 67,
    cores: 8,
    temperature: 58,
    load1m: 2.1,
    load5m: 1.8,
    load15m: 1.5
  },
  memory: {
    total: 32768,
    used: 25600,
    free: 7168,
    cached: 4096,
    usage: 78
  },
  disk: {
    total: 1024,
    used: 460,
    free: 564,
    usage: 45,
    iops: 1250
  },
  network: {
    bytesIn: 1250000,
    bytesOut: 890000,
    packetsIn: 15000,
    packetsOut: 12000,
    connections: 450
  },
  services: {
    'Web Server': {
      status: 'online',
      uptime: 99.9,
      responseTime: 120,
      errorRate: 0.01
    },
    'Database': {
      status: 'online',
      uptime: 99.8,
      responseTime: 45,
      errorRate: 0.02
    },
    'Cache': {
      status: 'degraded',
      uptime: 98.5,
      responseTime: 200,
      errorRate: 0.15
    },
    'File Storage': {
      status: 'online',
      uptime: 99.9,
      responseTime: 80,
      errorRate: 0.01
    }
  }
};

const MOCK_PERFORMANCE_METRICS: PerformanceMetrics = {
  responseTime: {
    avg: 245,
    p95: 450,
    p99: 800
  },
  throughput: {
    requestsPerSecond: 125,
    requestsPerMinute: 7500
  },
  errors: {
    rate: 0.02,
    count: 15,
    types: {
      '4xx': 8,
      '5xx': 7
    }
  },
  database: {
    connections: 45,
    queryTime: 35,
    slowQueries: 3
  }
};

const MOCK_SECURITY_METRICS: SecurityMetrics = {
  failedLogins: 23,
  blockedIPs: 5,
  suspiciousActivity: 2,
  lastSecurityScan: new Date(Date.now() - 2 * 60 * 60 * 1000),
  vulnerabilities: {
    critical: 0,
    high: 1,
    medium: 3,
    low: 8
  }
};

// Service status component
const ServiceStatus: React.FC<{ services: SystemMetrics['services'] }> = ({ services }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 dark:text-green-400';
      case 'degraded': return 'text-yellow-600 dark:text-yellow-400';
      case 'offline': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return CheckCircle;
      case 'degraded': return AlertTriangle;
      case 'offline': return XCircle;
      default: return Activity;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Server className="h-5 w-5 mr-2" />
          Service Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(services).map(([serviceName, service]) => {
            const StatusIcon = getStatusIcon(service.status);
            const statusColor = getStatusColor(service.status);
            
            return (
              <div key={serviceName} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center">
                  <StatusIcon className={`h-5 w-5 mr-3 ${statusColor}`} />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {serviceName}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Uptime: {service.uptime}% | Response: {service.responseTime}ms
                    </p>
                  </div>
                </div>
                <span className={`text-sm font-medium capitalize ${statusColor}`}>
                  {service.status}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// Security overview component
const SecurityOverview: React.FC<{ security: SecurityMetrics }> = ({ security }) => {
  const totalVulnerabilities = Object.values(security.vulnerabilities).reduce((a, b) => a + b, 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Security Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Security metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {security.failedLogins}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Failed Logins (24h)
              </div>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {security.blockedIPs}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Blocked IPs
              </div>
            </div>
          </div>

          {/* Vulnerabilities */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Vulnerabilities ({totalVulnerabilities})
            </h4>
            <div className="space-y-2">
              {Object.entries(security.vulnerabilities).map(([severity, count]) => (
                <div key={severity} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {severity}
                  </span>
                  <span className={`
                    text-sm font-medium
                    ${severity === 'critical' ? 'text-red-600 dark:text-red-400' :
                      severity === 'high' ? 'text-orange-600 dark:text-orange-400' :
                      severity === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-green-600 dark:text-green-400'}
                  `}>
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Last scan */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Last Security Scan</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {security.lastSecurityScan.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * SystemHealthDashboard Component
 * 
 * Provides comprehensive system monitoring including:
 * - System resource utilization
 * - Service status monitoring
 * - Performance metrics
 * - Security overview
 * - Real-time updates
 */
export const SystemHealthDashboard: React.FC = () => {
  const { adminUser, hasRole } = useAdminAuth();
  
  // Component state
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>(MOCK_SYSTEM_METRICS);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>(MOCK_PERFORMANCE_METRICS);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>(MOCK_SECURITY_METRICS);
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
            Super Administrator access required to view system health.
          </p>
        </Card>
      </div>
    );
  }

  // Refresh system metrics
  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, fetch fresh data from monitoring APIs
      setLastRefresh(new Date());
      
      // Simulate some metric changes
      setSystemMetrics(prev => ({
        ...prev,
        cpu: {
          ...prev.cpu,
          usage: Math.max(30, Math.min(90, prev.cpu.usage + (Math.random() - 0.5) * 10))
        },
        memory: {
          ...prev.memory,
          usage: Math.max(50, Math.min(95, prev.memory.usage + (Math.random() - 0.5) * 5))
        }
      }));
    } catch (error) {
      console.error('Failed to refresh system metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              System Health Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Real-time system monitoring and performance metrics
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

        {/* System Resource Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminMetricCard
            title="CPU Usage"
            value={`${systemMetrics.cpu.usage}%`}
            icon={Cpu}
            description={`${systemMetrics.cpu.cores} cores | ${systemMetrics.cpu.temperature}°C`}
            trend={{
              value: 2.3,
              label: 'vs last hour',
              isPositive: false
            }}
            color={systemMetrics.cpu.usage > 80 ? 'red' : systemMetrics.cpu.usage > 60 ? 'yellow' : 'green'}
            loading={loading}
          />
          
          <AdminMetricCard
            title="Memory Usage"
            value={`${systemMetrics.memory.usage}%`}
            icon={MemoryStick}
            description={`${(systemMetrics.memory.used / 1024).toFixed(1)}GB / ${(systemMetrics.memory.total / 1024).toFixed(1)}GB`}
            trend={{
              value: 1.2,
              label: 'vs last hour',
              isPositive: true
            }}
            color={systemMetrics.memory.usage > 85 ? 'red' : systemMetrics.memory.usage > 70 ? 'yellow' : 'green'}
            loading={loading}
          />
          
          <AdminMetricCard
            title="Disk Usage"
            value={`${systemMetrics.disk.usage}%`}
            icon={HardDrive}
            description={`${systemMetrics.disk.free}GB free | ${systemMetrics.disk.iops} IOPS`}
            color={systemMetrics.disk.usage > 85 ? 'red' : systemMetrics.disk.usage > 70 ? 'yellow' : 'green'}
            loading={loading}
          />
          
          <AdminMetricCard
            title="Network Traffic"
            value={`${((systemMetrics.network.bytesIn + systemMetrics.network.bytesOut) / 1000000).toFixed(1)} MB/s`}
            icon={Network}
            description={`${systemMetrics.network.connections} connections`}
            color="indigo"
            loading={loading}
          />
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AdminMetricCard
            title="Response Time"
            value={`${performanceMetrics.responseTime.avg}ms`}
            icon={Zap}
            description={`P95: ${performanceMetrics.responseTime.p95}ms | P99: ${performanceMetrics.responseTime.p99}ms`}
            trend={{
              value: 5.2,
              label: 'vs last hour',
              isPositive: false
            }}
            color={performanceMetrics.responseTime.avg > 500 ? 'red' : performanceMetrics.responseTime.avg > 300 ? 'yellow' : 'green'}
            loading={loading}
          />
          
          <AdminMetricCard
            title="Throughput"
            value={`${performanceMetrics.throughput.requestsPerSecond}/s`}
            icon={TrendingUp}
            description={`${performanceMetrics.throughput.requestsPerMinute}/min`}
            trend={{
              value: 8.7,
              label: 'vs last hour',
              isPositive: true
            }}
            color="blue"
            loading={loading}
          />
          
          <AdminMetricCard
            title="Error Rate"
            value={`${(performanceMetrics.errors.rate * 100).toFixed(2)}%`}
            icon={AlertTriangle}
            description={`${performanceMetrics.errors.count} errors`}
            trend={{
              value: 12.3,
              label: 'vs last hour',
              isPositive: false
            }}
            color={performanceMetrics.errors.rate > 0.05 ? 'red' : performanceMetrics.errors.rate > 0.02 ? 'yellow' : 'green'}
            loading={loading}
          />
        </div>

        {/* Service Status and Security */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ServiceStatus services={systemMetrics.services} />
          <SecurityOverview security={securityMetrics} />
        </div>

        {/* System Load Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Monitor className="h-5 w-5 mr-2" />
              System Load Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {systemMetrics.cpu.load1m}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  1 Minute Load
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {systemMetrics.cpu.load5m}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  5 Minute Load
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {systemMetrics.cpu.load15m}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  15 Minute Load
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              System Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Download className="h-6 w-6 mb-2" />
                <span className="text-sm">Export Logs</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Shield className="h-6 w-6 mb-2" />
                <span className="text-sm">Security Scan</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Database className="h-6 w-6 mb-2" />
                <span className="text-sm">Database Health</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Settings className="h-6 w-6 mb-2" />
                <span className="text-sm">System Config</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default SystemHealthDashboard;