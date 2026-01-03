// Model Constants

export const MODEL_PROVIDERS = [
  { value: 'microsoft', label: 'Microsoft' },
  { value: 'openai', label: 'OpenAI' },
  { value: 'google', label: 'Google' },
  { value: 'huggingface', label: 'Hugging Face' },
  { value: 'custom', label: 'Custom' }
] as const;

export const AVAILABLE_MODELS = [
  {
    name: 'DialoGPT-medium',
    provider: 'microsoft',
    size: '345M',
    accuracy: 89.2,
    active: true,
    description: 'Conversational AI model optimized for dialogue',
    version: '1.0.0',
    capabilities: {
      textGeneration: true,
      textCompletion: true,
      conversation: true,
      codeGeneration: false,
      translation: false,
      summarization: false,
      questionAnswering: true
    }
  },
  {
    name: 'GPT-3.5-turbo',
    provider: 'openai',
    size: '175B',
    accuracy: 94.1,
    active: false,
    description: 'Advanced language model with high accuracy',
    version: '0613',
    capabilities: {
      textGeneration: true,
      textCompletion: true,
      conversation: true,
      codeGeneration: true,
      translation: true,
      summarization: true,
      questionAnswering: true
    }
  },
  {
    name: 'BERT-base',
    provider: 'google',
    size: '110M',
    accuracy: 87.5,
    active: false,
    description: 'Bidirectional encoder for understanding context',
    version: '1.0.0',
    capabilities: {
      textGeneration: false,
      textCompletion: false,
      conversation: false,
      codeGeneration: false,
      translation: false,
      summarization: false,
      questionAnswering: true
    }
  }
] as const;

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