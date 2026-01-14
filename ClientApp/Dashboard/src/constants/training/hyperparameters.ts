// Training Hyperparameters Constants

export const BATCH_SIZES = [16, 32, 64, 128, 256] as const;

export const DEFAULT_HYPERPARAMETERS = {
  learningRate: 0.0001,
  batchSize: 32,
  maxEpochs: 10,
  validationSplit: 0.2,
  optimizer: 'adam' as const,
  scheduler: 'cosine' as const
};





