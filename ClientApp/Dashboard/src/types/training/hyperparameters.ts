// Training Hyperparameters Types

export interface TrainingHyperparameters {
  learningRate: number;
  batchSize: number;
  maxEpochs: number;
  validationSplit: number;
  optimizer: 'adam' | 'sgd' | 'rmsprop';
  scheduler?: 'cosine' | 'step' | 'exponential';
}

