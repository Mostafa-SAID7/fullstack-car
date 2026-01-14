// AI Agent Service - Main Export (composed from sub-services)

import { AIAgentChatService } from './chat';
import { AIAgentTrainingService } from './training';
import { AIAgentModelsService } from './models';
import { AIAgentKnowledgeService } from './knowledge';
import { AIAgentManagementService } from './agents';
import { AIConversationsService } from './conversations';

// Re-export sub-services
export { AIAgentChatService } from './chat';
export { AIAgentTrainingService } from './training';
export { AIAgentModelsService } from './models';
export { AIAgentKnowledgeService } from './knowledge';
export { AIAgentManagementService, agentManagementService } from './agents';
export { AIConversationsService, conversationsService } from './conversations';

// Type definitions
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface ChatResponse {
  response: string;
  context?: any;
}

export interface AIMessage extends ChatMessage {
  id: string;
}

export interface AIConversation {
  id: string;
  title: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class AIAgentService {
  private static instance: AIAgentService;

  // Sub-service instances
  private chatService: AIAgentChatService;
  private trainingService: AIAgentTrainingService;
  private modelsService: AIAgentModelsService;
  private knowledgeService: AIAgentKnowledgeService;
  public agentManagement: AIAgentManagementService;
  public conversations: AIConversationsService;

  private constructor() {
    this.chatService = new AIAgentChatService();
    this.trainingService = new AIAgentTrainingService();
    this.modelsService = new AIAgentModelsService();
    this.knowledgeService = new AIAgentKnowledgeService();
    this.agentManagement = new AIAgentManagementService();
    this.conversations = new AIConversationsService();
  }

  static getInstance(): AIAgentService {
    if (!AIAgentService.instance) {
      AIAgentService.instance = new AIAgentService();
    }
    return AIAgentService.instance;
  }

  // Chat Methods
  async chat(message: string, _history?: any[], conversationId?: string): Promise<any> {
    return this.chatService.sendMessage(message, conversationId);
  }

  async sendMessage(message: string, conversationId?: string): Promise<any> {
    return this.chatService.sendMessage(message, conversationId);
  }

  async getConversationHistory(conversationId: string): Promise<any> {
    return this.chatService.getConversationHistory(conversationId);
  }

  async getConversations(limit?: number): Promise<any> {
    return this.chatService.getConversations(limit);
  }

  async createConversation(title?: string): Promise<any> {
    return this.chatService.createConversation(title);
  }

  async deleteConversation(conversationId: string): Promise<any> {
    return this.chatService.deleteConversation(conversationId);
  }

  async updateConversationTitle(conversationId: string, title: string): Promise<any> {
    return this.chatService.updateConversationTitle(conversationId, title);
  }

  // Training Methods
  async getAgentStatus(): Promise<any> {
    return this.trainingService.getAgentStatus();
  }

  async trainAgent(data: any): Promise<any> {
    return this.trainingService.trainAgent(data);
  }

  async startTraining(config: any): Promise<any> {
    return this.trainingService.trainAgent(config);
  }

  async getTrainingStatus(trainingId?: string): Promise<any> {
    return this.trainingService.getTrainingStatus(trainingId || 'current');
  }

  async stopTraining(trainingId?: string): Promise<any> {
    return this.trainingService.stopTraining(trainingId || 'current');
  }

  // Model Methods
  async getAvailableModels(): Promise<any> {
    return this.modelsService.getAvailableModels();
  }

  async switchModel(modelId: string): Promise<any> {
    return this.modelsService.switchModel(modelId);
  }

  async getModelMetrics(modelId?: string): Promise<any> {
    return this.modelsService.getModelMetrics(modelId);
  }

  // Knowledge Base Methods
  async uploadKnowledge(file: File, metadata?: any): Promise<any> {
    return this.knowledgeService.uploadKnowledge(file, metadata);
  }

  async getKnowledgeBase(): Promise<any> {
    return this.knowledgeService.getKnowledgeBase();
  }

  async deleteKnowledge(knowledgeId: string): Promise<any> {
    return this.knowledgeService.deleteKnowledge(knowledgeId);
  }

  // Utility Methods
  generateMockChatResponse(message: string): ChatResponse {
    return {
      response: `This is a mock response to: "${message}". The AI agent is currently not available.`,
      context: {
        mock: true,
        timestamp: new Date().toISOString()
      }
    };
  }
}

// Export singleton instance
export const aiAgentService = AIAgentService.getInstance();