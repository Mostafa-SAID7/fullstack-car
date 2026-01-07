import React from 'react';
import { BarChart3 } from 'lucide-react';

interface TrainingProgressProps {
  progress: {
    epoch: number;
    totalEpochs: number;
    loss: number;
    accuracy: number;
    timeElapsed: string;
    estimatedTimeRemaining: string;
    status: 'idle' | 'training' | 'paused' | 'completed' | 'error';
  };
}

// Simple UI components
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 ${className || ''}`}>
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

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`p-6 pt-0 ${className || ''}`}>
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

const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ''}`}>
    {children}
  </label>
);

export const TrainingProgress: React.FC<TrainingProgressProps> = ({ progress }) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Live Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{((progress.epoch / progress.totalEpochs) * 100).toFixed(1)}%</span>
          </div>
          <Progress 
            value={(progress.epoch / progress.totalEpochs) * 100} 
            className="h-3"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Current Epoch</Label>
            <div className="text-2xl font-bold text-blue-600">
              {progress.epoch} / {progress.totalEpochs}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Loss</Label>
            <div className="text-2xl font-bold text-red-600">
              {progress.loss || 'N/A'}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Accuracy</Label>
            <div className="text-2xl font-bold text-green-600">
              {progress.accuracy ? `${(progress.accuracy * 100).toFixed(2)}%` : 'N/A'}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Time Elapsed</Label>
            <div className="text-2xl font-bold text-purple-600">
              {progress.timeElapsed}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Estimated Time Remaining: <span className="font-medium">{progress.estimatedTimeRemaining}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};