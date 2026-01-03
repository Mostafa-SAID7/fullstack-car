// Model Related Types
import type { BaseEntity } from './common';

export interface AIModel extends BaseEntity {
  name: string;
  provider: 'microsoft' | 'openai' | 'google' | 'huggingface' | 'custom';
  size: string;
  accuracy: number;
  active: boolean;
  description: string;
  version: string;
  parameters: ModelParameters;
  capabilities: ModelCapabilities;
  performance: ModelPerformance;
}

export interface ModelParameters {
  temperature: number;
  maxTokens: number;
  topP: number;
  topK: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string[];
}

export interface ModelCapabilities {
  textGeneration: boolean;
  textCompletion: boolean;
  conversation: boolean;
  codeGeneration: boolean;
  translation: boolean;
  summarization: boolean;
  questionAnswering: boolean;
}

export interface ModelPerformance {
  averageResponseTime: number;
  throughput: number;
  memoryUsage: number;
  cpuUsage: number;
  accuracy: number;
  errorRate: number;
}

export interface ModelComparison {
  models: AIModel[];
  metrics: string[];
  comparisonData: Record<string, any>[];
}

export interface ModelDeployment {
  modelId: string;
  environment: 'development' | 'staging' | 'production';
  endpoint: string;
  status: 'deploying' | 'deployed' | 'failed' | 'stopped';
  replicas: number;
  resources: {
    cpu: string;
    memory: string;
    gpu?: string;
  };
}