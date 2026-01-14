// AI Agent Feedback Service - Feedback Management

import { apiClient } from '../api';
import type { Feedback, FeedbackType } from '../../types/ai-agent';

interface FeedbackListParams {
  limit?: number;
  offset?: number;
  type?: FeedbackType;
  agentType?: string;
  startDate?: string;
  endDate?: string;
}

interface FeedbackListResponse {
  feedback: Feedback[];
  total: number;
}

interface FeedbackAnalytics {
  totalFeedback: number;
  positiveCount: number;
  negativeCount: number;
  correctionCount: number;
  byAgent: Array<{
    agentType: string;
    count: number;
    positiveRate: number;
  }>;
  trends: {
    dates: string[];
    counts: number[];
  };
}

export class AIAgentFeedbackService {
  // List all feedback
  async listFeedback(params?: FeedbackListParams): Promise<FeedbackListResponse> {
    const response = await apiClient.get('/ai/feedback', { params });
    return response as any as FeedbackListResponse;
  }

  // Get specific feedback
  async getFeedback(feedbackId: string): Promise<Feedback> {
    const response = await apiClient.get(`/ai/feedback/${feedbackId}`);
    return response as any as Feedback;
  }

  // Approve correction (adds to knowledge base)
  async approveCorrection(feedbackId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post(`/ai/feedback/${feedbackId}/approve`);
    return response as any as { success: boolean; message: string };
  }

  // Reject feedback
  async rejectFeedback(feedbackId: string, reason?: string): Promise<{ success: boolean }> {
    const response = await apiClient.post(`/ai/feedback/${feedbackId}/reject`, { reason });
    return response as any as { success: boolean };
  }

  // Categorize feedback
  async categorizeFeedback(feedbackId: string, category: string): Promise<{ success: boolean }> {
    const response = await apiClient.put(`/ai/feedback/${feedbackId}/category`, { category });
    return response as any as { success: boolean };
  }

  // Bulk approve corrections
  async bulkApprove(feedbackIds: string[]): Promise<{ success: boolean; approved: number }> {
    const response = await apiClient.post('/ai/feedback/bulk-approve', { feedbackIds });
    return response as any as { success: boolean; approved: number };
  }

  // Bulk reject feedback
  async bulkReject(feedbackIds: string[], reason?: string): Promise<{ success: boolean; rejected: number }> {
    const response = await apiClient.post('/ai/feedback/bulk-reject', { feedbackIds, reason });
    return response as any as { success: boolean; rejected: number };
  }

  // Delete feedback
  async deleteFeedback(feedbackId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete(`/ai/feedback/${feedbackId}`);
    return response as any as { success: boolean };
  }

  // Get feedback analytics
  async getAnalytics(params?: { startDate?: string; endDate?: string }): Promise<FeedbackAnalytics> {
    const response = await apiClient.get('/ai/feedback/analytics', { params });
    return response as any as FeedbackAnalytics;
  }

  // Export feedback
  async exportFeedback(format: 'csv' | 'pdf', params?: FeedbackListParams): Promise<Blob> {
    const response = await apiClient.get('/ai/feedback/export', {
      params: { ...params, format },
      responseType: 'blob'
    });
    return response as any as Blob;
  }
}

export const feedbackService = new AIAgentFeedbackService();
