import React from 'react';
import { CheckCircle, XCircle, Server } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../../../components/layout/cards/Card';

interface SystemInfo {
  hostname: string;
  os: string;
  uptime: string;
  version: string;
  services: Array<{
    name: string;
    status: string;
    port: number | null;
  }>;
}

interface SystemServicesProps {
  systemInfo: SystemInfo;
}

export const SystemServices: React.FC<SystemServicesProps> = ({ systemInfo }) => {
  const { t } = useTranslation();

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Server className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">{t('system_services', 'System Services')}</h3>
      </div>
      
      <div className="space-y-3">
        {systemInfo.services.map((service, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {service.status === 'running' ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
              <div>
                <p className="font-medium text-foreground">{service.name}</p>
                {service.port && (
                  <p className="text-sm text-muted-foreground">Port: {service.port}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                service.status === 'running' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {service.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};