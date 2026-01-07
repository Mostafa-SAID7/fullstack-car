import React from 'react';
import { Cpu, HardDrive, Activity } from 'lucide-react';

interface MonitoringTabProps {
  systemMetrics: {
    cpuUsage: number;
    memoryUsage: number;
    gpuUsage: number;
    diskUsage: number;
  };
}

// Simple UI components
const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
    {children}
  </div>
);

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`p-6 ${className || ''}`}>
    {children}
  </div>
);

const Progress: React.FC<{ value: number; className?: string }> = ({ value, className }) => (
  <div className={`relative h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800 ${className || ''}`}>
    <div 
      className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

export const MonitoringTab: React.FC<MonitoringTabProps> = ({ systemMetrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">CPU Usage</p>
              <p className="text-2xl font-bold">{systemMetrics.cpuUsage}%</p>
            </div>
            <Cpu className="h-8 w-8 text-blue-600" />
          </div>
          <Progress value={systemMetrics.cpuUsage} className="mt-3" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Memory Usage</p>
              <p className="text-2xl font-bold">{systemMetrics.memoryUsage}%</p>
            </div>
            <HardDrive className="h-8 w-8 text-green-600" />
          </div>
          <Progress value={systemMetrics.memoryUsage} className="mt-3" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">GPU Usage</p>
              <p className="text-2xl font-bold">{systemMetrics.gpuUsage}%</p>
            </div>
            <Activity className="h-8 w-8 text-purple-600" />
          </div>
          <Progress value={systemMetrics.gpuUsage} className="mt-3" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Disk Usage</p>
              <p className="text-2xl font-bold">{systemMetrics.diskUsage}%</p>
            </div>
            <HardDrive className="h-8 w-8 text-orange-600" />
          </div>
          <Progress value={systemMetrics.diskUsage} className="mt-3" />
        </CardContent>
      </Card>
    </div>
  );
};