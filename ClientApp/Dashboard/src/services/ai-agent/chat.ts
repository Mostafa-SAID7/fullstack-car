// AI Agent Service - Chat and Conversation Management

import { apiClient } from '../api';
import type { ChatResponse, AIMessage, AIConversation } from '../../types/ai-agent';

export class AIAgentChatService {
  async sendMessage(message: string, conversationId?: string): Promise<ChatResponse> {
    const response = await apiClient.post<ChatResponse>('/ai/chat', {
      message,
      conversationId
    });
    return response.data as ChatResponse;
  }

  async getConversationHistory(conversationId: string): Promise<AIMessage[]> {
    const response = await apiClient.get<AIMessage[]>(`/ai/conversations/${conversationId}/messages`);
    return response.data || [];
  }

  async getConversations(limit?: number): Promise<AIConversation[]> {
    const params = limit ? `?limit=${limit}` : '';
    const response = await apiClient.get<AIConversation[]>(`/ai/conversations${params}`);
    return response.data || [];
  }

  async createConversation(title?: string): Promise<AIConversation> {
    const response = await apiClient.post<AIConversation>('/ai/conversations', { title });
    return response.data as AIConversation;
  }

  async updateConversationTitle(conversationId: string, title: string) {
    const response = await apiClient.put(`/ai/conversations/${conversationId}`, { title });
    return response as any;
  }

  async deleteConversation(conversationId: string) {
    const response = await apiClient.delete(`/ai/conversations/${conversationId}`);
    return response as any;
  }
}






