import React from 'react';
import { Play, Pause, Square, Settings } from 'lucide-react';

interface ControlPanelProps {
  trainingStatus: 'idle' | 'training' | 'paused' | 'completed' | 'error';
  modelConfig: {
    baseModel: string;
    epochs: number;
    batchSize: number;
    dataset: string;
  };
  baseModels: Array<{ value: string; label: string }>;
  onStartTraining: () => void;
  onPauseTraining: () => void;
  onStopTraining: () => void;
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

const Button: React.FC<{ 
  children: React.ReactNode; 
  onClick?: () => void; 
  disabled?: boolean; 
  className?: string;
  variant?: 'default' | 'outline';
  size?: 'default' | 'lg';
}> = ({ children, onClick, disabled, className, variant = 'default', size = 'default' }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variantClasses = variant === 'outline' 
    ? "border border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
    : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700";
  const sizeClasses = size === 'lg' ? "h-11 px-8" : "h-10 px-4 py-2";
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className || ''}`}
    >
      {children}
    </button>
  );
};

export const ControlPanel: React.FC<ControlPanelProps> = ({
  trainingStatus,
  modelConfig,
  baseModels,
  onStartTraining,
  onPauseTraining,
  onStopTraining
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Control Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Button 
            onClick={onStartTraining}
            disabled={trainingStatus === 'training'}
            className="w-full"
            size="lg"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Training
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline"
              onClick={onPauseTraining}
              disabled={trainingStatus !== 'training'}
            >
              <Pause className="h-4 w-4 mr-1" />
              Pause
            </Button>
            <Button 
              variant="outline"
              onClick={onStopTraining}
              disabled={trainingStatus === 'idle'}
            >
              <Square className="h-4 w-4 mr-1" />
              Stop
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t space-y-3">
          <div className="text-sm">
            <div className="font-medium mb-2">Current Configuration:</div>
            <div className="space-y-1 text-gray-600 dark:text-gray-400">
              <div>Model: {baseModels.find(m => m.value === modelConfig.baseModel)?.label}</div>
              <div>Dataset: {modelConfig.dataset}</div>
              <div>Epochs: {modelConfig.epochs}</div>
              <div>Batch Size: {modelConfig.batchSize}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};