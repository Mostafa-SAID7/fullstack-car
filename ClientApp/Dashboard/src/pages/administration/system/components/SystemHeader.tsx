import React from 'react';
import { RefreshCw, Server } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SystemHeaderProps {
  onRefresh: () => void;
}

export const SystemHeader: React.FC<SystemHeaderProps> = ({ onRefresh }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
          <Server className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('system_management', 'System Management')}
          </h1>
          <p className="text-muted-foreground">
            {t('system_management_desc', 'Monitor and manage system resources, services, and performance')}
          </p>
        </div>
      </div>
      
      <button
        onClick={onRefresh}
        className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        {t('refresh', 'Refresh')}
      </button>
    </div>
  );
};