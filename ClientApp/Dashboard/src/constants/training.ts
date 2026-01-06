// Training Constants

export const TRAINING_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  running: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  failed: 'bg-red-100 text-red-800 border-red-200',
  cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
  paused: 'bg-orange-100 text-orange-800 border-orange-200'
} as const;

export const TRAINING_STATUSES = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  PAUSED: 'paused'
} as const;

export const TRAINING_TYPES = {
  FINE_TUNING: 'fine_tuning',
  TRANSFER_LEARNING: 'transfer_learning',
  REINFORCEMENT_LEARNING: 'reinforcement_learning',
  SUPERVISED_LEARNING: 'supervised_learning',
  UNSUPERVISED_LEARNING: 'unsupervised_learning'
} as const;

export const MODEL_TYPES = {
  CLASSIFICATION: 'classification',
  REGRESSION: 'regression',
  DETECTION: 'detection',
  SEGMENTATION: 'segmentation',
  GENERATION: 'generation',
  CHAT: 'chat'
} as const;

export const TRAINING_METRICS = {
  ACCURACY: 'accuracy',
  LOSS: 'loss',
  PRECISION: 'precision',
  RECALL: 'recall',
  F1_SCORE: 'f1_score',
  AUC: 'auc',
  MAE: 'mae',
  MSE: 'mse',
  RMSE: 'rmse'
} as const;