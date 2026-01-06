import React from 'react';
import { Server, Clock, Package, Monitor } from 'lucide-react';
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

interface SystemOverviewProps {
  systemInfo: SystemInfo;
}

export const SystemOverview: React.FC<SystemOverviewProps> = ({ systemInfo }) => {
  const { t } = useTranslation();

  const overviewCards = [
    {
      title: t('hostname', 'Hostname'),
      value: systemInfo.hostname,
      icon: <Server className="w-5 h-5 text-blue-500" />
    },
    {
      title: t('operating_system', 'Operating System'),
      value: systemInfo.os,
      icon: <Monitor className="w-5 h-5 text-green-500" />
    },
    {
      title: t('uptime', 'Uptime'),
      value: systemInfo.uptime,
      icon: <Clock className="w-5 h-5 text-orange-500" />
    },
    {
      title: t('version', 'Version'),
      value: systemInfo.version,
      icon: <Package className="w-5 h-5 text-purple-500" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {overviewCards.map((card, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {card.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground truncate">
                {card.title}
              </p>
              <p className="text-lg font-semibold text-foreground truncate">
                {card.value}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};