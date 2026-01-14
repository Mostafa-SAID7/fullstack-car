// Training Config Form Component - Form for configuring new training sessions

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Play } from 'lucide-react';

interface TrainingConfigFormProps {
  onSubmit: (config: any) => void;
  onClose: () => void;
}

export const TrainingConfigForm: React.FC<TrainingConfigFormProps> = ({
  onSubmit,
  onClose
}) => {
  const [config, setConfig] = useState({
    name: '',
    datasetId: 'default',
    epochs: 10,
    batchSize: 32,
    learningRate: 0.001,
    validationSplit: 0.2,
    earlyStopping: true,
    checkpointInterval: 5
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(config);
  };

  const handleChange = (field: string, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-border/50 flex items-center justify-between sticky top-0 bg-card z-10">
          <h2 className="text-xl font-bold">New Training Session</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Session Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Session Name
            </label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Fine-tune on user feedback"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              required
            />
          </div>

          {/* Dataset */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Dataset
            </label>
            <select
              value={config.datasetId}
              onChange={(e) => handleChange('datasetId', e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
            >
              <option value="default">Default Dataset</option>
              <option value="user-feedback">User Feedback Dataset</option>
              <option value="corrections">Corrections Dataset</option>
              <option value="automotive-knowledge">Automotive Knowledge</option>
            </select>
          </div>

          {/* Epochs */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Epochs: {config.epochs}
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={config.epochs}
              onChange={(e) => handleChange('epochs', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1</span>
              <span>100</span>
            </div>
          </div>

          {/* Batch Size */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Batch Size: {config.batchSize}
            </label>
            <input
              type="range"
              min="8"
              max="128"
              step="8"
              value={config.batchSize}
              onChange={(e) => handleChange('batchSize', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>8</span>
              <span>128</span>
            </div>
          </div>

          {/* Learning Rate */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Learning Rate: {config.learningRate}
            </label>
            <input
              type="range"
              min="0.0001"
              max="0.01"
              step="0.0001"
              value={config.learningRate}
              onChange={(e) => handleChange('learningRate', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0.0001</span>
              <span>0.01</span>
            </div>
          </div>

          {/* Validation Split */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Validation Split: {(config.validationSplit * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="0.5"
              step="0.05"
              value={config.validationSplit}
              onChange={(e) => handleChange('validationSplit', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>10%</span>
              <span>50%</span>
            </div>
          </div>

          {/* Early Stopping */}
          <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
            <div>
              <p className="font-medium">Early Stopping</p>
              <p className="text-sm text-muted-foreground">
                Stop training when validation loss stops improving
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.earlyStopping}
                onChange={(e) => handleChange('earlyStopping', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Checkpoint Interval */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Checkpoint Interval: Every {config.checkpointInterval} epochs
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={config.checkpointInterval}
              onChange={(e) => handleChange('checkpointInterval', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1</span>
              <span>20</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              <Play className="w-5 h-5" />
              Start Training
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-muted text-foreground rounded-lg font-semibold hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
