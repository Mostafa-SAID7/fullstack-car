import React from 'react';
import { Activity, Database, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../../../components/layout/cards/Card';

interface SystemResourcesProps {
  formatBytes: (bytes: number) => string;
}

export const SystemResources: React.FC<SystemResourcesProps> = ({ formatBytes }) => {
  const { t } = useTranslation();

  // Mock resource data - in real app, this would come from props or API
  const resources = [
    {
      title: t('active_connections', 'Active Connections'),
      value: '1,247',
      change: '+12%',
      changeType: 'positive' as const,
      icon: <Activity className="w-5 h-5 text-blue-500" />
    },
    {
      title: t('database_size', 'Database Size'),
      value: formatBytes(2.4 * 1024 * 1024 * 1024), // 2.4 GB
      change: '+5.2%',
      changeType: 'positive' as const,
      icon: <Database className="w-5 h-5 text-green-500" />
    },
    {
      title: t('cache_hit_rate', 'Cache Hit Rate'),
      value: '94.7%',
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: <Zap className="w-5 h-5 text-yellow-500" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {resources.map((resource, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {resource.icon}
              <h4 className="text-sm font-medium text-muted-foreground">{resource.title}</h4>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              resource.changeType === 'positive' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {resource.change}
            </span>
          </div>
          
          <p className="text-2xl font-bold text-foreground">{resource.value}</p>
        </Card>
      ))}
    </div>
  );
};