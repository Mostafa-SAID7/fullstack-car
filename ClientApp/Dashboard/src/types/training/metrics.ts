// Training Metrics Types

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

