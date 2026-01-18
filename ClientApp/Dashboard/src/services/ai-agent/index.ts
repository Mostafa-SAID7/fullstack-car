// AI Agent Service - Main Export (composed from sub-services)

import { AIAgentTrainingService, trainingService } from './training';
import { AIAgentModelsService } from './models';
import { KnowledgeService, knowledgeService } from './knowledge';
import { AIAgentManagementService, agentManagementService } from './agents';
import { AIConversationsService, conversationsService } from './conversations';
import { AIAgentAnalyticsService, analyticsService } from './analytics';
import { AIAgentFeedbackService, feedbackService } from './feedback';

// Re-export sub-services
export { AIAgentTrainingService, trainingService } from './training';
export { AIAgentModelsService } from './models';
export { KnowledgeService, knowledgeService } from './knowledge';
export { AIAgentManagementService, agentManagementService } from './agents';
export { AIConversationsService, conversationsService } from './conversations';
export { AIAgentAnalyticsService, analyticsService } from './analytics';
export { AIAgentFeedbackService, feedbackService } from './feedback';

// Type definitions are now imported from '../../types/ai-agent'
import type { AIMessage, AIConversation, ChatResponse } from '../../types/ai-agent';

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class AIAgentService {
  private static instance: AIAgentService;

  // Sub-service instances
  public chat: AIConversationsService; // Renamed for better UX
  public training: AIAgentTrainingService;
  public models: AIAgentModelsService;
  public knowledge: KnowledgeService;
  public management: AIAgentManagementService;
  public analytics: AIAgentAnalyticsService;
  public feedback: AIAgentFeedbackService;

  private constructor() {
    this.chat = conversationsService;
    this.training = trainingService;
    this.models = new AIAgentModelsService();
    this.knowledge = knowledgeService;
    this.management = agentManagementService;
    this.analytics = analyticsService;
    this.feedback = feedbackService;
  }

  static getInstance(): AIAgentService {
    if (!AIAgentService.instance) {
      AIAgentService.instance = new AIAgentService();
    }
    return AIAgentService.instance;
  }

  /**
   * Legacy method for backward compatibility
   * @deprecated Use aiAgentService.chat.sendMessage
   */
  async sendMessage(message: string, conversationId?: string): Promise<any> {
    return this.chat.sendMessage({ message, conversationId });
  }

  // Utility Methods
  generateMockChatResponse(message: string): ChatResponse {
    return {
      message: `This is a mock response to: "${message}". The AI agent is currently not available.`,
      timestamp: new Date().toISOString(),
      metadata: {
        mock: true,
        timestamp: new Date().toISOString()
      }
    };
  }
}

// Export singleton instance
export const aiAgentService = AIAgentService.getInstance();