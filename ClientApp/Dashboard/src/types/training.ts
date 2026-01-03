// Training Related Types
import type { BaseEntity, Status } from './common';

export interface TrainingSession extends BaseEntity {
  name: string;
  status: Extract<Status, 'running' | 'completed' | 'failed' | 'paused'>;
  progress: number;
  startTime: string;
  duration: string;
  accuracy: number;
  loss: number;
  datasetSize: number;
  modelName?: string;
  hyperparameters?: TrainingHyperparameters;
}

export interface TrainingHyperparameters {
  learningRate: number;
  batchSize: number;
  maxEpochs: number;
  validationSplit: number;
  optimizer: 'adam' | 'sgd' | 'rmsprop';
  scheduler?: 'cosine' | 'step' | 'exponential';
}

export interface TrainingConfig {
  dataset: string;
  mode: 'fine-tuning' | 'full-training' | 'transfer-learning' | 'incremental-learning';
  hyperparameters: TrainingHyperparameters;
}

export interface TrainingMetrics {
  epoch: number;
  loss: number;
  accuracy: number;
  validationLoss: number;
  validationAccuracy: number;
  learningRate: number;
  timestamp: string;
}

export interface TrainingProgress {
  sessionId: string;
  currentEpoch: number;
  totalEpochs: number;
  progress: number;
  estimatedTimeRemaining: string;
  metrics: TrainingMetrics[];
}