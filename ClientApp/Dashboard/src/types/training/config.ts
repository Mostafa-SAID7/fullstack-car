// Training Configuration Types
import type { TrainingHyperparameters } from './hyperparameters';

export interface TrainingConfig {
  dataset: string;
  mode: 'fine-tuning' | 'full-training' | 'transfer-learning' | 'incremental-learning';
  hyperparameters: TrainingHyperparameters;
}

