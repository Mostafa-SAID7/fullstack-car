// AI Agent Types

export interface AIMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: string;
  metadata?: {
    model?: string;
    tokens?: number;
    confidence?: number;
    processingTime?: number;
  };
}

export interface AIConversation {
  id: string;
  title: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  metadata?: {
    model: string;
    totalTokens: number;
    totalMessages: number;
  };
}

export interface ChatResponse {
  message: AIMessage;
  conversation: AIConversation;
  suggestions?: string[];
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  type: ModelType;
  version: string;
  status: ModelStatus;
  capabilities: ModelCapability[];
  parameters: ModelParameters;
  metrics?: ModelMetrics;
  createdAt: string;
  updatedAt: string;
}

export type ModelType = 
  | 'chat' 
  | 'completion' 
  | 'classification' 
  | 'detection' 
  | 'generation' 
  | 'translation';

export type ModelStatus = 
  | 'training' 
  | 'ready' 
  | 'deployed' 
  | 'failed' 
  | 'deprecated';

export type ModelCapability = 
  | 'text_generation' 
  | 'image_analysis' 
  | 'code_generation' 
  | 'translation' 
  | 'summarization' 
  | 'question_answering';

export interface ModelParameters {
  maxTokens: number;
  temperature: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  stopSequences?: string[];
}

export interface ModelMetrics {
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1Score?: number;
  latency: number;
  throughput: number;
  errorRate: number;
  uptime: number;
}

export interface TrainingJob {
  id: string;
  name: string;
  modelId: string;
  status: TrainingStatus;
  progress: number;
  startedAt: string;
  completedAt?: string;
  duration?: number;
  config: TrainingConfig;
  metrics?: TrainingMetrics;
  logs?: TrainingLog[];
}

export type TrainingStatus = 
  | 'pending' 
  | 'running' 
  | 'completed' 
  | 'failed' 
  | 'cancelled';

export interface TrainingConfig {
  datasetId: string;
  epochs: number;
  batchSize: number;
  learningRate: number;
  validationSplit: number;
  earlyStopping: boolean;
  checkpointInterval: number;
}

export interface TrainingMetrics {
  loss: number[];
  accuracy: number[];
  validationLoss: number[];
  validationAccuracy: number[];
  learningRate: number[];
}

export interface TrainingLog {
  id: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  type: KnowledgeType;
  status: KnowledgeStatus;
  documents: KnowledgeDocument[];
  createdAt: string;
  updatedAt: string;
  metadata?: {
    totalDocuments: number;
    totalTokens: number;
    lastIndexed: string;
  };
}

export type KnowledgeType = 'faq' | 'documentation' | 'policies' | 'general';
export type KnowledgeStatus = 'indexing' | 'ready' | 'error';

export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  type: DocumentType;
  source: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export type DocumentType = 'text' | 'pdf' | 'html' | 'markdown' | 'json';

export interface AIAgentSettings {
  defaultModel: string;
  maxConversationLength: number;
  responseTimeout: number;
  enableLogging: boolean;
  enableAnalytics: boolean;
  customInstructions?: string;
  knowledgeBases: string[];
  capabilities: ModelCapability[];
}