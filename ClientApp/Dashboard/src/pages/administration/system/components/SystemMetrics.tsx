import React from 'react';
import { Cpu, HardDrive, MemoryStick, Network } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../../../components/layout/cards/Card';

interface PerformanceMetrics {
  cpu: { usage: number; cores: number };
  memory: { used: number; total: number; percentage: number };
  disk: { used: number; total: number; percentage: number };
  network: { in: number; out: number };
}

interface SystemMetricsProps {
  performanceMetrics: PerformanceMetrics;
}

export const SystemMetrics: React.FC<SystemMetricsProps> = ({ performanceMetrics }) => {
  const { t } = useTranslation();

  const getUsageColor = (percentage: number) => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const metrics = [
    {
      title: t('cpu_usage', 'CPU Usage'),
      value: `${performanceMetrics.cpu.usage}%`,
      subtitle: `${performanceMetrics.cpu.cores} cores`,
      percentage: performanceMetrics.cpu.usage,
      icon: <Cpu className="w-5 h-5 text-blue-500" />
    },
    {
      title: t('memory_usage', 'Memory Usage'),
      value: `${performanceMetrics.memory.used}GB / ${performanceMetrics.memory.total}GB`,
      subtitle: `${performanceMetrics.memory.percentage}% used`,
      percentage: performanceMetrics.memory.percentage,
      icon: <MemoryStick className="w-5 h-5 text-green-500" />
    },
    {
      title: t('disk_usage', 'Disk Usage'),
      value: `${performanceMetrics.disk.used}GB / ${performanceMetrics.disk.total}GB`,
      subtitle: `${performanceMetrics.disk.percentage}% used`,
      percentage: performanceMetrics.disk.percentage,
      icon: <HardDrive className="w-5 h-5 text-purple-500" />
    },
    {
      title: t('network_traffic', 'Network Traffic'),
      value: `↓ ${performanceMetrics.network.in} MB/s`,
      subtitle: `↑ ${performanceMetrics.network.out} MB/s`,
      percentage: 0, // Network doesn't have a percentage
      icon: <Network className="w-5 h-5 text-orange-500" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {metric.icon}
              <h4 className="text-sm font-medium text-muted-foreground">{metric.title}</h4>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-lg font-semibold text-foreground">{metric.value}</p>
            <p className="text-sm text-muted-foreground">{metric.subtitle}</p>
            
            {metric.percentage > 0 && (
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(metric.percentage)}`}
                  style={{ width: `${metric.percentage}%` }}
                />
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};