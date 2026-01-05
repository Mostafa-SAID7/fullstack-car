// AI Agent Types

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  response: string;
  context?: any;
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface AIConversation {
  id: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
  title?: string;
}

export interface AIResponse {
  response: string;
  confidence?: number;
  sources?: string[];
  metadata?: Record<string, any>;
}
