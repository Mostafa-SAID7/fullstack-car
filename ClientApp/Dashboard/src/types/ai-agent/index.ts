// AI Agent Types

export interface AIMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: string;
  agentType?: AgentType;
  metadata?: {
    model?: string;
    tokens?: number;
    confidence?: number;
    processingTime?: number;
    cost?: number;
  };
}

export interface AIConversation {
  id: string;
  title: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  isActive: boolean;
  metadata?: {
    model: string;
    totalTokens: number;
    totalMessages: number;
  };
}

export interface ChatResponse {
  message: string;
  messageId: string;
  conversationId: string;
  agent: string;
  metadata?: Record<string, any>;
  quickActions?: QuickAction[];
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  userId?: string;
  mode?: AgentType;
  context?: Record<string, any>;
}

// Multi-Agent System Types

export const AgentType = {
  GENERAL: 'general',
  MECHANIC: 'mechanic',
  BUYER_GUIDE: 'buyer_guide',
  SELLER_ASSISTANT: 'seller_assistant',
  MODIFICATION_EXPERT: 'modification_expert',
  COMMUNITY_HELPER: 'community_helper'
} as const;

export type AgentType = typeof AgentType[keyof typeof AgentType];

export const KnowledgeCategory = {
  MAINTENANCE: 'maintenance',
  DIAGNOSTICS: 'diagnostics',
  BUYING_GUIDE: 'buying_guide',
  SELLING_TIPS: 'selling_tips',
  MODIFICATIONS: 'modifications',
  CAR_SPECS: 'car_specs',
  COMMUNITY_HELP: 'community_help'
} as const;

export type KnowledgeCategory = typeof KnowledgeCategory[keyof typeof KnowledgeCategory];

export const FeedbackType = {
  POSITIVE: 'positive',
  NEGATIVE: 'negative',
  CORRECTION: 'correction'
} as const;

export type FeedbackType = typeof FeedbackType[keyof typeof FeedbackType];

export interface QuickAction {
  label: string;
  action: string;
  icon?: string;
  data?: Record<string, any>;
}

export interface AgentResponse {
  text: string;
  agent: string;
  confidence: number;
  metadata: Record<string, any>;
  quickActions: QuickAction[];
}

export interface AgentStatus {
  agentType: AgentType;
  isActive: boolean;
  totalConversations: number;
  averageSatisfaction: number;
  lastUsed?: string;
}

export interface AgentConfig {
  agentType: AgentType;
  config: Record<string, any>;
}

export interface ConversationContext {
  conversationId: string;
  userId: string;
  messages: AIMessage[];
  metadata: Record<string, any>;
}

export interface KnowledgeEntry {
  id: string;
  content: string;
  category: KnowledgeCategory;
  metadata: Record<string, any>;
  embedding?: number[];
  source: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  score?: number;
}

export interface Feedback {
  id: string;
  conversationId: string;
  messageId: string;
  type: FeedbackType;
  data?: Record<string, any>;
  timestamp: string;
}

export interface ConversationMetrics {
  conversationId: string;
  userId: string;
  agentType: AgentType;
  messageCount: number;
  durationSeconds: number;
  satisfactionScore?: number;
  resolved: boolean;
  tokensUsed: number;
  cost: number;
  createdAt: string;
}

export interface AgentPerformanceMetrics {
  agentType: AgentType;
  totalConversations: number;
  averageSatisfaction: number;
  averageResponseTime: number;
  successRate: number;
  commonTopics: string[];
  periodStart: string;
  periodEnd: string;
}

export interface AnalyticsOverview {
  totalConversations: number;
  activeConversations: number;
  averageResponseTime: number;
  satisfactionScore: number;
  tokensUsed: number;
  errorRate: number;
  uptime: number;
  periodStart: string;
  periodEnd: string;
}

// Legacy Types (kept for backward compatibility)

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