import React, { useState, useRef } from 'react';
import {
  Brain,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import {
  TrainingProgress,
  ControlPanel,
  ParametersTab,
  MonitoringTab,
  ConsoleTab
} from './components';
import { useTraining } from './hooks/useTraining';
import type { ModelConfig } from './types';

// Simple UI components
const Badge: React.FC<{ 
  children: React.ReactNode; 
  variant?: 'default' | 'outline';
  className?: string;
}> = ({ children, variant = 'default', className }) => {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  const variantClasses = variant === 'outline' 
    ? "border border-gray-300 text-gray-900 dark:border-gray-600 dark:text-gray-100"
    : "bg-blue-600 text-white";
  
  return (
    <div className={`${baseClasses} ${variantClasses} ${className || ''}`}>
      {children}
    </div>
  );
};

const Tabs: React.FC<{ 
  value: string; 
  onValueChange: (value: string) => void; 
  children: React.ReactNode; 
  className?: string;
}> = ({ children, className }) => (
  <div className={className}>
    {children}
  </div>
);

const TabsList: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 dark:bg-gray-800 dark:text-gray-400 ${className || ''}`}>
    {children}
  </div>
);

const TabsTrigger: React.FC<{ 
  value: string; 
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (value: string) => void;
}> = ({ value, children, activeTab, onTabChange }) => (
  <button
    onClick={() => onTabChange(value)}
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
      activeTab === value
        ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-gray-100'
        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
    }`}
  >
    {children}
  </button>
);

const TabsContent: React.FC<{ 
  value: string; 
  children: React.ReactNode; 
  className?: string;
  activeTab: string;
}> = ({ value, children, className, activeTab }) => {
  if (activeTab !== value) return null;
  
  return (
    <div className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:ring-offset-gray-950 dark:focus-visible:ring-blue-300 ${className || ''}`}>
      {children}
    </div>
  );
};

export const ModelTraining: React.FC = () => {
  const [activeTab, setActiveTab] = useState('training');
  const trainingIntervalRef = useRef<number | null>(null);
  
  const {
    trainingProgress,
    systemMetrics,
    logs,
    startTraining,
    pauseTraining,
    stopTraining
  } = useTraining();

  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    baseModel: 'gpt-2-lightweight',
    epochs: 3,
    learningRate: 0.001,
    batchSize: 32,
    dataset: 'car_knowledge.json',
    validationSplit: 0.2
  });

  const baseModels = [
    { value: 'gpt-2-lightweight', label: 'GPT-2 (Lightweight)', description: 'Fast training, good for prototyping' },
    { value: 'distilbert', label: 'DistilBERT', description: 'Balanced performance and speed' },
    { value: 'custom-carbert', label: 'Custom CarBERT', description: 'Specialized for automotive domain' }
  ];

  const datasets = [
    { value: 'car_knowledge.json', label: 'Car Knowledge Dataset', size: '2.3 MB', records: '15,420' },
    { value: 'automotive_qa.json', label: 'Automotive Q&A Dataset', size: '5.1 MB', records: '32,150' },
    { value: 'vehicle_specs.json', label: 'Vehicle Specifications', size: '1.8 MB', records: '8,900' }
  ];

  const handleStartTraining = () => {
    if (trainingIntervalRef.current) {
      clearInterval(trainingIntervalRef.current);
    }
    trainingIntervalRef.current = startTraining(modelConfig);
  };

  const handlePauseTraining = () => {
    if (trainingIntervalRef.current) {
      clearInterval(trainingIntervalRef.current);
      trainingIntervalRef.current = null;
    }
    pauseTraining();
  };

  const handleStopTraining = () => {
    if (trainingIntervalRef.current) {
      clearInterval(trainingIntervalRef.current);
      trainingIntervalRef.current = null;
    }
    stopTraining();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'training': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'training': return <Activity className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'paused': return <Activity className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Brain className="h-8 w-8 text-blue-600" />
            AI Model Training
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Fine-tune automotive models for specialized assistance
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`${getStatusColor(trainingProgress.status)} text-white`}>
            {getStatusIcon(trainingProgress.status)}
            <span className="ml-1 capitalize">{trainingProgress.status}</span>
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="training" activeTab={activeTab} onTabChange={setActiveTab}>
            Training
          </TabsTrigger>
          <TabsTrigger value="parameters" activeTab={activeTab} onTabChange={setActiveTab}>
            Parameters
          </TabsTrigger>
          <TabsTrigger value="monitoring" activeTab={activeTab} onTabChange={setActiveTab}>
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="console" activeTab={activeTab} onTabChange={setActiveTab}>
            Console
          </TabsTrigger>
        </TabsList>

        {/* Training Tab */}
        <TabsContent value="training" className="space-y-6" activeTab={activeTab}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TrainingProgress progress={trainingProgress} />
            <ControlPanel
              trainingStatus={trainingProgress.status}
              modelConfig={modelConfig}
              baseModels={baseModels}
              onStartTraining={handleStartTraining}
              onPauseTraining={handlePauseTraining}
              onStopTraining={handleStopTraining}
            />
          </div>
        </TabsContent>

        {/* Parameters Tab */}
        <TabsContent value="parameters" className="space-y-6" activeTab={activeTab}>
          <ParametersTab
            modelConfig={modelConfig}
            baseModels={baseModels}
            datasets={datasets}
            onConfigChange={setModelConfig}
          />
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6" activeTab={activeTab}>
          <MonitoringTab systemMetrics={systemMetrics} />
        </TabsContent>

        {/* Console Tab */}
        <TabsContent value="console" className="space-y-6" activeTab={activeTab}>
          <ConsoleTab logs={logs} trainingStatus={trainingProgress.status} />
        </TabsContent>
      </Tabs>
    </div>
  );
};