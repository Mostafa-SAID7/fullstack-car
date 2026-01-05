// Training Optimizers and Schedulers Constants

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



