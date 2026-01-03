// Training Constants

export const TRAINING_MODES = [
  { value: 'fine-tuning', label: 'Fine-tuning' },
  { value: 'full-training', label: 'Full Training' },
  { value: 'transfer-learning', label: 'Transfer Learning' },
  { value: 'incremental-learning', label: 'Incremental Learning' }
] as const;

export const BATCH_SIZES = [16, 32, 64, 128, 256] as const;

export const OPTIMIZERS = [
  { value: 'adam', label: 'Adam' },
  { value: 'sgd', label: 'SGD' },
  { value: 'rmsprop', label: 'RMSprop' }
] as const;

export const SCHEDULERS = [
  { value: 'cosine', label: 'Cosine Annealing' },
  { value: 'step', label: 'Step LR' },
  { value: 'exponential', label: 'Exponential LR' }
] as const;

export const DEFAULT_HYPERPARAMETERS = {
  learningRate: 0.0001,
  batchSize: 32,
  maxEpochs: 10,
  validationSplit: 0.2,
  optimizer: 'adam' as const,
  scheduler: 'cosine' as const
};

export const TRAINING_STATUS_COLORS = {
  running: 'text-blue-500 bg-blue-500/10',
  completed: 'text-green-500 bg-green-500/10',
  failed: 'text-red-500 bg-red-500/10',
  paused: 'text-yellow-500 bg-yellow-500/10'
} as const;