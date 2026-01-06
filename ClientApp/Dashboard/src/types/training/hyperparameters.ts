// Training Hyperparameters Types

export interface TrainingHyperparameters {
  learningRate: number;
  batchSize: number;
  epochs: number;
  optimizer: OptimizerType;
  lossFunction: LossFunctionType;
  regularization?: RegularizationConfig;
  scheduler?: SchedulerConfig;
  earlyStopping?: EarlyStoppingConfig;
  dataAugmentation?: DataAugmentationConfig;
}

export type OptimizerType = 
  | 'adam' 
  | 'sgd' 
  | 'rmsprop' 
  | 'adagrad' 
  | 'adadelta' 
  | 'adamw';

export type LossFunctionType = 
  | 'categorical_crossentropy' 
  | 'binary_crossentropy' 
  | 'sparse_categorical_crossentropy'
  | 'mean_squared_error'
  | 'mean_absolute_error'
  | 'huber_loss'
  | 'focal_loss';

export interface RegularizationConfig {
  type: 'l1' | 'l2' | 'l1_l2' | 'dropout';
  l1?: number;
  l2?: number;
  dropout?: number;
}

export interface SchedulerConfig {
  type: 'step' | 'exponential' | 'cosine' | 'plateau';
  stepSize?: number;
  gamma?: number;
  patience?: number;
  factor?: number;
  minLr?: number;
}

export interface EarlyStoppingConfig {
  monitor: string;
  patience: number;
  minDelta: number;
  mode: 'min' | 'max';
  restoreBestWeights: boolean;
}

export interface DataAugmentationConfig {
  rotation?: number;
  width_shift?: number;
  height_shift?: number;
  shear?: number;
  zoom?: number;
  horizontal_flip?: boolean;
  vertical_flip?: boolean;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  hue?: number;
}

export interface HyperparameterTuningConfig {
  method: 'grid_search' | 'random_search' | 'bayesian_optimization';
  searchSpace: Record<string, HyperparameterRange>;
  maxTrials: number;
  objective: string;
  direction: 'minimize' | 'maximize';
}

export interface HyperparameterRange {
  type: 'choice' | 'uniform' | 'loguniform' | 'int_uniform';
  values?: any[];
  min?: number;
  max?: number;
  step?: number;
}