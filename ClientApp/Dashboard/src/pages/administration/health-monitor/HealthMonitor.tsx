import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Server, Database, Wifi, AlertTriangle, CheckCircle, Clock, Cpu, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../../components/layout/cards/Card';

interface ServiceHealth {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  responseTime: string;
  uptime: string;
  lastCheck: string;
}

interface HealthData {
  overall: 'healthy' | 'warning' | 'critical';
  lastUpdated: string;
  services: ServiceHealth[];
  metrics: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
}

export const HealthMonitor: React.FC = () => {
  const { t } = useTranslation();
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock health data
  const [healthData, setHealthData] = useState<HealthData>({
    overall: 'healthy',
    lastUpdated: new Date().toLocaleTimeString(),
    services: [
      {
        name: 'Web Server',
        status: 'healthy',
        responseTime: '45ms',
        uptime: '99.9%',
        lastCheck: '2024-01-06 14:30:00'
      },
      {
        name: 'Database',
        status: 'healthy',
        responseTime: '12ms',
        uptime: '99.8%',
        lastCheck: '2024-01-06 14:30:00'
      },
      {
        name: 'Cache Server',
        status: 'warning',
        responseTime: '89ms',
        uptime: '98.5%',
        lastCheck: '2024-01-06 14:29:45'
      },
      {
        name: 'File Storage',
        status: 'healthy',
        responseTime: '23ms',
        uptime: '99.7%',
        lastCheck: '2024-01-06 14:30:00'
      }
    ],
    metrics: {
      cpu: 45,
      memory: 67,
      disk: 34,
      network: 23
    }
  });

  const refreshHealthData = async () => {
    setIsRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      setHealthData(prev => ({
        ...prev,
        lastUpdated: new Date().toLocaleTimeString(),
        metrics: {
          cpu: Math.floor(Math.random() * 100),
          memory: Math.floor(Math.random() * 100),
          disk: Math.floor(Math.random() * 100),
          network: Math.floor(Math.random() * 100)
        }
      }));
      setIsRefreshing(false);
    }, 1000);
  };

  // Auto-refresh functionality
  useEffect(() => {
    const interval = setInterval(() => {
      refreshHealthData();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval, refreshHealthData]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getMetricColor = (value: number) => {
    if (value < 50) return 'text-green-600';
    if (value < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {t('health_monitor', 'Health Monitor')}
            </h1>
            <p className="text-muted-foreground">
              {t('health_monitor_desc', 'Real-time system health monitoring and alerts')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="px-3 py-2 border border-border rounded-lg bg-background"
          >
            <option value={10}>10s</option>
            <option value={30}>30s</option>
            <option value={60}>1m</option>
            <option value={300}>5m</option>
          </select>
          
          <button
            onClick={refreshHealthData}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {t('refresh', 'Refresh')}
          </button>
        </div>
      </div>

      {/* Overall Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{t('overall_status', 'Overall Status')}</h2>
          <span className="text-sm text-muted-foreground">
            {t('last_updated', 'Last updated')}: {healthData.lastUpdated}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {getStatusIcon(healthData.overall)}
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(healthData.overall)}`}>
            {healthData.overall.charAt(0).toUpperCase() + healthData.overall.slice(1)}
          </span>
        </div>
      </Card>

      {/* System Metrics */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">{t('system_metrics', 'System Metrics')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Cpu className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">CPU Usage</p>
              <p className={`text-lg font-semibold ${getMetricColor(healthData.metrics.cpu)}`}>
                {healthData.metrics.cpu}%
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Database className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Memory Usage</p>
              <p className={`text-lg font-semibold ${getMetricColor(healthData.metrics.memory)}`}>
                {healthData.metrics.memory}%
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Server className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Disk Usage</p>
              <p className={`text-lg font-semibold ${getMetricColor(healthData.metrics.disk)}`}>
                {healthData.metrics.disk}%
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Wifi className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">Network Usage</p>
              <p className={`text-lg font-semibold ${getMetricColor(healthData.metrics.network)}`}>
                {healthData.metrics.network}%
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Services Status */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">{t('services_status', 'Services Status')}</h2>
        
        <div className="space-y-3">
          {healthData.services.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(service.status)}
                <div>
                  <p className="font-medium">{service.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('last_check', 'Last check')}: {service.lastCheck}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <p className="text-muted-foreground">Response Time</p>
                  <p className="font-medium">{service.responseTime}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Uptime</p>
                  <p className="font-medium">{service.uptime}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                  {service.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};