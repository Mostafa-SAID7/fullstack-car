import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { SystemHeader } from './components/SystemHeader';
import { SystemOverview } from './components/SystemOverview';
import { SystemServices } from './components/SystemServices';
import { SystemMetrics } from './components/SystemMetrics';
import { SystemResources } from './components/SystemResources';
import { SystemChart } from './components/SystemChart';

export const System: React.FC = () => {
  const { t } = useTranslation();
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  // Mock data - in real app, this would come from API
  const [systemInfo] = useState({
    hostname: 'community-car-server',
    os: 'Ubuntu 22.04 LTS',
    uptime: '15 days, 3 hours',
    version: '1.0.0',
    services: [
      { name: 'Web Server', status: 'running', port: 80 },
      { name: 'Database', status: 'running', port: 5432 },
      { name: 'Redis Cache', status: 'running', port: 6379 },
      { name: 'Background Jobs', status: 'running', port: null }
    ]
  });

  const [performanceMetrics] = useState({
    cpu: { usage: 45, cores: 8 },
    memory: { used: 6.2, total: 16, percentage: 39 },
    disk: { used: 120, total: 500, percentage: 24 },
    network: { in: 1.2, out: 0.8 }
  });

  const loadSystemData = () => {
    console.log('Loading system data...');
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getServiceStatus = (status: string) => {
    return status === 'running' ? 'success' : 'error';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="ml-2 text-muted-foreground">{t('loading_system', 'Loading system information...')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-destructive">{error}</span>
        </div>
        <button 
          onClick={loadSystemData}
          className="mt-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
        >
          {t('retry', 'Retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SystemHeader onRefresh={loadSystemData} />
      {systemInfo && <SystemOverview systemInfo={systemInfo} />}
      {systemInfo && <SystemServices systemInfo={systemInfo} getServiceStatus={getServiceStatus} />}
      {performanceMetrics && <SystemMetrics performanceMetrics={performanceMetrics} />}
      {systemInfo && <SystemResources systemInfo={systemInfo} formatBytes={formatBytes} />}
      {performanceMetrics && <SystemChart />}
    </div>
  );
};