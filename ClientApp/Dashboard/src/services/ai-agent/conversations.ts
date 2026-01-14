// Conversations Service - For managing AI conversations

import { apiClient } from '../api/client';
import type { AIConversation, AIMessage } from '../../types/ai-agent';

const BASE_URL = '/api/conversations';

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
    return response.data;
  }

  /**
   * Get a specific conversation with full message history
   */
  async getConversation(conversationId: string): Promise<AIConversation> {
    const response = await apiClient.get(`${BASE_URL}/${conversationId}`);
    return response.data;
  }

  /**
   * Create a new conversation
   */
  async createConversation(userId: string, title?: string): Promise<AIConversation> {
    const response = await apiClient.post(BASE_URL, {
      user_id: userId,
      title: title || 'New Conversation'
    });
    return response.data;
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
    return response.data;
  }
}

export const conversationsService = new AIConversationsService();
