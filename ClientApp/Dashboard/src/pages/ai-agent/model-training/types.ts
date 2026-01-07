// Model Training Types

export interface TrainingProgress {
  epoch: number;
  totalEpochs: number;
  loss: number;
  accuracy: number;
  timeElapsed: string;
  estimatedTimeRemaining: string;
  status: 'idle' | 'training' | 'paused' | 'completed' | 'error';
}

export interface ModelConfig {
  baseModel: string;
  epochs: number;
  learningRate: number;
  batchSize: number;
  dataset: string;
  validationSplit: number;
}

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  gpuUsage: number;
  diskUsage: number;
}

export interface BaseModel {
  value: string;
  label: string;
  description: string;
}

export interface Dataset {
  value: string;
  label: string;
  size: string;
  records: string;
}

export type TrainingStatus = 'idle' | 'training' | 'paused' | 'completed' | 'error';