import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../../../components/layout/cards/Card';

export const SystemChart: React.FC = () => {
  const { t } = useTranslation();

  // Mock chart data - in a real app, you'd use a charting library like Chart.js or Recharts
  const chartData = [
    { time: '00:00', cpu: 25, memory: 45, disk: 20 },
    { time: '04:00', cpu: 30, memory: 48, disk: 22 },
    { time: '08:00', cpu: 45, memory: 52, disk: 25 },
    { time: '12:00', cpu: 60, memory: 58, disk: 28 },
    { time: '16:00', cpu: 55, memory: 55, disk: 26 },
    { time: '20:00', cpu: 40, memory: 50, disk: 24 },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">{t('performance_trends', 'Performance Trends')}</h3>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-muted-foreground">CPU</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-muted-foreground">Memory</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-muted-foreground">Disk</span>
          </div>
        </div>
      </div>

      {/* Simple chart representation - in real app, use a proper charting library */}
      <div className="h-64 flex items-end justify-between space-x-2">
        {chartData.map((data, index) => (
          <div key={index} className="flex-1 flex flex-col items-center space-y-1">
            <div className="w-full flex flex-col items-center space-y-1">
              <div 
                className="w-full bg-blue-500 rounded-t"
                style={{ height: `${(data.cpu / 100) * 150}px` }}
                title={`CPU: ${data.cpu}%`}
              />
              <div 
                className="w-full bg-green-500"
                style={{ height: `${(data.memory / 100) * 150}px` }}
                title={`Memory: ${data.memory}%`}
              />
              <div 
                className="w-full bg-purple-500 rounded-b"
                style={{ height: `${(data.disk / 100) * 150}px` }}
                title={`Disk: ${data.disk}%`}
              />
            </div>
            <span className="text-xs text-muted-foreground">{data.time}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        {t('chart_placeholder', 'Performance chart - integrate with a charting library for interactive charts')}
      </div>
    </Card>
  );
};