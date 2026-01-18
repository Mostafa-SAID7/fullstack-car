// Conversations Service - For managing AI conversations

import { apiClient } from '../api';
import type { AIConversation, AIMessage, ChatResponse, ChatRequest } from '../../types/ai-agent';

const BASE_URL = '/api/conversations';
const AGENT_URL = '/api/agents';

export interface ConversationListResponse {
  conversations: AIConversation[];
  total: number;
  page: number;
  pageSize: number;
}

export class AIConversationsService {
  /**
   * List conversations for a user
   */
  async listConversations(
    userId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<ConversationListResponse> {
    const response = await apiClient.get(BASE_URL, {
      params: { user_id: userId, page, page_size: pageSize }
    });
    return response.data as any;
  }

  /**
   * Get a specific conversation with full message history
   */
  async getConversation(conversationId: string): Promise<AIConversation> {
    const response = await apiClient.get(`${BASE_URL}/${conversationId}`);
    return response.data as any;
  }

  /**
   * Create a new conversation
   */
  async createConversation(userId: string, title?: string): Promise<AIConversation> {
    const response = await apiClient.post(BASE_URL, {
      user_id: userId,
      title: title || 'New Conversation'
    });
    return response.data as any;
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string): Promise<any> {
    const response = await apiClient.delete(`${BASE_URL}/${conversationId}`);
    return response.data;
  }

  /**
   * Archive a conversation
   */
  async archiveConversation(conversationId: string): Promise<any> {
    const response = await apiClient.post(`${BASE_URL}/${conversationId}/archive`);
    return response.data;
  }

  /**
   * Get messages from a conversation with pagination
   */
  async getMessages(
    conversationId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{ conversation_id: string; messages: AIMessage[]; count: number }> {
    const response = await apiClient.get(`${BASE_URL}/${conversationId}/messages`, {
      params: { limit, offset }
    });
    return response.data as any;
  }

  /**
   * Send a message to an agent
   */
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await apiClient.post(`${AGENT_URL}/chat`, request);
    return response.data as any;
  }
}

export const conversationsService = new AIConversationsService();
