// Training Session Types
import type { BaseEntity, Status } from '../common';
import type { TrainingHyperparameters } from './hyperparameters';

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

