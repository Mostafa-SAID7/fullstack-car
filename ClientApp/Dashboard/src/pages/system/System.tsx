import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Loader2, BarChart3, Server, Database, FileText } from 'lucide-react';
import { SystemHeader } from './components/SystemHeader';
import { SystemOverview } from './components/SystemOverview';
import { SystemServices } from './components/SystemServices';
import { SystemMetrics } from './components/SystemMetrics';
import { SystemResources } from './components/SystemResources';
import { SystemChart } from './components/SystemChart';
import { TabNavigation, TabContent } from '../../components/layout/tabs/TabNavigation';

export const System: React.FC = () => {
  const { t } = useTranslation();
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'services', label: 'Services', icon: <Server className="w-4 h-4" /> },
    { id: 'resources', label: 'Resources', icon: <Database className="w-4 h-4" /> },
    { id: 'logs', label: 'Logs', icon: <FileText className="w-4 h-4" /> }
  ];

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {systemInfo && <SystemOverview systemInfo={systemInfo} />}
            {performanceMetrics && <SystemMetrics performanceMetrics={performanceMetrics} />}
          </div>
        );
      case 'services':
        return (
          <div className="space-y-6">
            {systemInfo && <SystemServices systemInfo={systemInfo} getServiceStatus={getServiceStatus} />}
          </div>
        );
      case 'resources':
        return (
          <div className="space-y-6">
            {systemInfo && <SystemResources formatBytes={formatBytes} />}
            {performanceMetrics && <SystemChart />}
          </div>
        );
      case 'logs':
        return (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">System Logs</h3>
            <p className="text-muted-foreground">System activity logs and audit trails coming soon.</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <SystemHeader onRefresh={loadSystemData} />

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <TabContent activeTab={activeTab}>
        {renderTabContent()}
      </TabContent>
    </motion.div>
  );
};