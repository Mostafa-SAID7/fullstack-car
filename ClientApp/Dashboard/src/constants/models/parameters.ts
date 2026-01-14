// Model Parameters Constants

export const DEFAULT_MODEL_PARAMETERS = {
  temperature: 0.7,
  maxTokens: 150,
  topP: 0.9,
  topK: 50,
  frequencyPenalty: 0,
  presencePenalty: 0,
  stopSequences: []
};

export const PARAMETER_RANGES = {
  temperature: { min: 0, max: 2, step: 0.1 },
  topP: { min: 0, max: 1, step: 0.1 },
  topK: { min: 1, max: 100, step: 1 },
  maxTokens: { min: 1, max: 4096, step: 1 },
  frequencyPenalty: { min: -2, max: 2, step: 0.1 },
  presencePenalty: { min: -2, max: 2, step: 0.1 }
} as const;





