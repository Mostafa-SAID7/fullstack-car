import React from 'react';
import { Brain, Database, Info } from 'lucide-react';

interface ParametersTabProps {
  modelConfig: {
    baseModel: string;
    epochs: number;
    learningRate: number;
    batchSize: number;
    dataset: string;
    validationSplit: number;
  };
  baseModels: Array<{ value: string; label: string; description: string }>;
  datasets: Array<{ value: string; label: string; size: string; records: string }>;
  onConfigChange: (config: any) => void;
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

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`p-6 pt-0 ${className || ''}`}>
    {children}
  </div>
);

const Label: React.FC<{ children: React.ReactNode; htmlFor?: string }> = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
    {children}
  </label>
);

const Input: React.FC<{
  id?: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: string;
  max?: string;
  step?: string;
}> = ({ id, type = 'text', value, onChange, min, max, step }) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    min={min}
    max={max}
    step={step}
    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:ring-offset-gray-900 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
  />
);

const Select: React.FC<{
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}> = ({ value, onValueChange, children }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:ring-offset-gray-900 dark:placeholder:text-gray-400 dark:focus:ring-blue-400"
      >
        {children}
      </select>
    </div>
  );
};

const Button: React.FC<{ 
  children: React.ReactNode; 
  variant?: 'default' | 'outline';
  className?: string;
}> = ({ children, variant = 'default', className }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";
  const variantClasses = variant === 'outline' 
    ? "border border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
    : "bg-blue-600 text-white hover:bg-blue-700";
  
  return (
    <button className={`${baseClasses} ${variantClasses} ${className || ''}`}>
      {children}
    </button>
  );
};

export const ParametersTab: React.FC<ParametersTabProps> = ({
  modelConfig,
  baseModels,
  datasets,
  onConfigChange
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Base Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Base Model
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="baseModel">Select Base Model</Label>
            <Select 
              value={modelConfig.baseModel} 
              onValueChange={(value: string) => onConfigChange({ ...modelConfig, baseModel: value })}
            >
              {baseModels.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label} - {model.description}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="epochs">Epochs</Label>
              <Input
                id="epochs"
                type="number"
                value={modelConfig.epochs}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onConfigChange({ ...modelConfig, epochs: parseInt(e.target.value) })}
                min="1"
                max="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batchSize">Batch Size</Label>
              <Input
                id="batchSize"
                type="number"
                value={modelConfig.batchSize}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onConfigChange({ ...modelConfig, batchSize: parseInt(e.target.value) })}
                min="1"
                max="128"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="learningRate">Learning Rate</Label>
              <Input
                id="learningRate"
                type="number"
                step="0.0001"
                value={modelConfig.learningRate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onConfigChange({ ...modelConfig, learningRate: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="validationSplit">Validation Split</Label>
              <Input
                id="validationSplit"
                type="number"
                step="0.1"
                value={modelConfig.validationSplit}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onConfigChange({ ...modelConfig, validationSplit: parseFloat(e.target.value) })}
                min="0.1"
                max="0.5"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dataset Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Dataset
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dataset">Select Dataset</Label>
            <Select 
              value={modelConfig.dataset} 
              onValueChange={(value: string) => onConfigChange({ ...modelConfig, dataset: value })}
            >
              {datasets.map((dataset) => (
                <option key={dataset.value} value={dataset.value}>
                  {dataset.label} - {dataset.size} • {dataset.records} records
                </option>
              ))}
            </Select>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-blue-900 dark:text-blue-100">Dataset Information</div>
                <div className="text-blue-700 dark:text-blue-300 mt-1">
                  The selected dataset contains automotive knowledge and Q&A pairs specifically curated for training conversational AI models.
                </div>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            <Database className="h-4 w-4 mr-2" />
            Upload Custom Dataset
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};