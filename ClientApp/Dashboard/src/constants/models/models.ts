// Available Models Constants

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



