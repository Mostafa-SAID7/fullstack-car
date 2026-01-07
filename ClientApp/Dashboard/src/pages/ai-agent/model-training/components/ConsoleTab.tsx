import React from 'react';
import { Activity } from 'lucide-react';

interface ConsoleTabProps {
  logs: string[];
  trainingStatus: 'idle' | 'training' | 'paused' | 'completed' | 'error';
}

// Simple UI components
const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
    {children}
  </div>
);

const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col space-y-1.5 p-6">
    {children}
  </div>
);

const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className || ''}`}>
    {children}
  </h3>
);

const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-6 pt-0">
    {children}
  </div>
);

export const ConsoleTab: React.FC<ConsoleTabProps> = ({ logs, trainingStatus }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          System Console
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="mb-1">
              {log}
            </div>
          ))}
          {trainingStatus === 'idle' && (
            <div className="text-yellow-400 animate-pulse">
              Waiting to start...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};