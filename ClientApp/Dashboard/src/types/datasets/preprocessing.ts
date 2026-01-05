// Dataset Preprocessing Types

export interface DatasetSplit {
  train: number;
  validation: number;
  test: number;
}

export interface DatasetPreprocessing {
  tokenization: boolean;
  normalization: boolean;
  filtering: {
    minLength?: number;
    maxLength?: number;
    removeEmpty: boolean;
    removeDuplicates: boolean;
  };
  augmentation?: {
    enabled: boolean;
    techniques: string[];
    multiplier: number;
  };
}
