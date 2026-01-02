import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Cpu, 
  HardDrive, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Wifi,
  Shield
} from 'lucide-react';
import { adminService, type SystemInfo, type PerformanceMetrics } from '../services/adminService';

const SystemStatusCard = ({ title, status, icon: Icon, details }: {
  title: string;
  status: 'healthy' | 'warning' | 'error';
  icon: React.ElementType;
  details?: string;
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return Clock;
      case 'error': return AlertTriangle;
    }
  };

  const StatusIcon = getStatusIcon();

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getStatusColor()}`}>
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <StatusIcon className={`w-5 h-5 ${status === 'healthy' ? 'text-green-600' : status === 'warning' ? 'text-yellow-600' : 'text-red-600'}`} />
      </div>
      {details && (
        <p className="text-sm text-gray-600">{details}</p>
      )}
    </div>
  );
};

const MetricCard = ({ title, value, unit, threshold, icon: Icon }: {
  title: string;
  value: number;
  unit: string;
  threshold?: { warning: number; error: number };
  icon: React.ElementType;
}) => {
  const getStatus = () => {
    if (!threshold) return 'healthy';
    if (value >= threshold.error) return 'error';
    if (value >= threshold.warning) return 'warning';
    return 'healthy';
  };

  const status = getStatus();
  const statusColor = status === 'healthy' ? 'text-green-600' : status === 'warning' ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-600">{title}</span>
        </div>
        <div className={`w-3 h-3 rounded-full ${
          status === 'healthy' ? 'bg-green-500' : status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
        }`} />
      </div>
      <div className="flex items-baseline space-x-1">
        <span className={`text-2xl font-bold ${statusColor}`}>{value.toFixed(1)}</span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>
    </div>
  );
};

export const System: React.FC = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSystemData();
    const interval = setInterval(loadSystemData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSystemData = async () => {
    try {
      const [systemResponse, performanceResponse] = await Promise.all([
        adminService.getSystemInfo(),
        adminService.getPerformanceMetrics()
      ]);

      if (systemResponse.succeeded && systemResponse.data) {
        setSystemInfo(systemResponse.data);
      }

      if (performanceResponse.succeeded && performanceResponse.data) {
        setPerformanceMetrics(performanceResponse.data);
      }
    } catch (err) {
      console.error('Error loading system data:', err);
      setError('Failed to load system data');
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getServiceStatus = (status: string): 'healthy' | 'warning' | 'error' => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'online':
      case 'connected':
        return 'healthy';
      case 'degraded':
      case 'slow':
        return 'warning';
      case 'offline':
      case 'error':
      case 'failed':
        return 'error';
      default:
        return 'warning';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading system information...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-800">{error}</span>
        </div>
        <button 
          onClick={loadSystemData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Management</h1>
          <p className="text-gray-600 mt-1">Monitor system health and performance</p>
        </div>
        <button
          onClick={loadSystemData}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Activity className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* System Overview */}
      {systemInfo && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-600">Version</span>
              <p className="text-lg font-semibold">{systemInfo.version}</p>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-600">Environment</span>
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                systemInfo.environment === 'Production' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {systemInfo.environment}
              </span>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-600">Uptime</span>
              <p className="text-lg font-semibold">{systemInfo.uptime}</p>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-600">Server Time</span>
              <p className="text-lg font-semibold">{new Date(systemInfo.serverTime).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Service Status */}
      {systemInfo && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SystemStatusCard
            title="Database"
            status={getServiceStatus(systemInfo.databaseStatus)}
            icon={Database}
            details={`${systemInfo.databaseMetrics.totalTables} tables, ${systemInfo.databaseMetrics.totalRecords} records`}
          />
          <SystemStatusCard
            title="AI Service"
            status={getServiceStatus(systemInfo.aiServiceStatus)}
            icon={Shield}
            details="Natural language processing"
          />
          <SystemStatusCard
            title="Cache Service"
            status={getServiceStatus(systemInfo.cacheStatus)}
            icon={Wifi}
            details="Redis cache layer"
          />
        </div>
      )}

      {/* Performance Metrics */}
      {performanceMetrics && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="CPU Usage"
              value={performanceMetrics.cpuUsage}
              unit="%"
              threshold={{ warning: 70, error: 90 }}
              icon={Cpu}
            />
            <MetricCard
              title="Memory Usage"
              value={(performanceMetrics.memoryUsage.workingSet / 1024 / 1024 / 1024)}
              unit="GB"
              threshold={{ warning: 8, error: 12 }}
              icon={HardDrive}
            />
            <MetricCard
              title="Error Rate"
              value={performanceMetrics.errorRate}
              unit="%"
              threshold={{ warning: 1, error: 5 }}
              icon={AlertTriangle}
            />
            <MetricCard
              title="Cache Hit Rate"
              value={performanceMetrics.cacheMetrics.hitRate}
              unit="%"
              icon={Activity}
            />
          </div>
        </div>
      )}

      {/* System Resources */}
      {systemInfo && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Memory Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <HardDrive className="w-5 h-5 mr-2" />
              Memory Usage
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Working Set</span>
                <span className="font-medium">{formatBytes(systemInfo.systemMetrics.workingSet)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Private Memory</span>
                <span className="font-medium">{formatBytes(systemInfo.systemMetrics.privateMemory)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Thread Count</span>
                <span className="font-medium">{systemInfo.systemMetrics.threadCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Handle Count</span>
                <span className="font-medium">{systemInfo.systemMetrics.handleCount}</span>
              </div>
            </div>
          </div>

          {/* Database Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Database Information
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Tables</span>
                <span className="font-medium">{systemInfo.databaseMetrics.totalTables}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Records</span>
                <span className="font-medium">{systemInfo.databaseMetrics.totalRecords.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Database Size</span>
                <span className="font-medium">{systemInfo.databaseMetrics.databaseSize}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Connections</span>
                <span className="font-medium">{systemInfo.databaseMetrics.connectionCount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Chart */}
      {performanceMetrics && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Performance trends chart will be implemented here</p>
          </div>
        </div>
      )}
    </div>
  );
};