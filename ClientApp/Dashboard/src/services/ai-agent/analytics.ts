// AI Agent Analytics Service - Analytics and Metrics

import { apiClient } from '../api';
import type { AnalyticsOverview, AgentPerformanceMetrics, ConversationMetrics } from '../../types/ai-agent';

interface AnalyticsParams {
  startDate?: string;
  endDate?: string;
  agentType?: string;
}

interface ConversationTrendsResponse {
  dates: string[];
  counts: number[];
  averageResponseTime: number[];
}

interface TopicAnalysisResponse {
  topics: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
}

interface SatisfactionTrendsResponse {
  dates: string[];
  scores: number[];
  average: number;
}

interface CostBreakdownResponse {
  byAgent: Array<{
    agentType: string;
    totalCost: number;
    tokensUsed: number;
    conversationCount: number;
  }>;
  totalCost: number;
  totalTokens: number;
}

interface UserEngagementResponse {
  totalUsers: number;
  activeUsers: number;
  averageSessionDuration: number;
  averageMessagesPerConversation: number;
  returnRate: number;
}

export class AIAgentAnalyticsService {
  // Get analytics overview
  async getOverview(params?: AnalyticsParams): Promise<AnalyticsOverview> {
    const response = await apiClient.get('/ai/analytics/overview', { params });
    return response as any as AnalyticsOverview;
  }

  // Get agent performance metrics
  async getAgentPerformance(params?: AnalyticsParams): Promise<AgentPerformanceMetrics[]> {
    const response = await apiClient.get('/ai/analytics/agent-performance', { params });
    return response as any as AgentPerformanceMetrics[];
  }

  // Get conversation trends
  async getConversationTrends(params?: AnalyticsParams): Promise<ConversationTrendsResponse> {
    const response = await apiClient.get('/ai/analytics/conversation-trends', { params });
    return response as any as ConversationTrendsResponse;
  }

  // Get topic analysis
  async getTopicAnalysis(params?: AnalyticsParams): Promise<TopicAnalysisResponse> {
    const response = await apiClient.get('/ai/analytics/topics', { params });
    return response as any as TopicAnalysisResponse;
  }

  // Get satisfaction trends
  async getSatisfactionTrends(params?: AnalyticsParams): Promise<SatisfactionTrendsResponse> {
    const response = await apiClient.get('/ai/analytics/satisfaction', { params });
    return response as any as SatisfactionTrendsResponse;
  }

  // Get cost breakdown
  async getCostBreakdown(params?: AnalyticsParams): Promise<CostBreakdownResponse> {
    const response = await apiClient.get('/ai/analytics/costs', { params });
    return response as any as CostBreakdownResponse;
  }

  // Get user engagement metrics
  async getUserEngagement(params?: AnalyticsParams): Promise<UserEngagementResponse> {
    const response = await apiClient.get('/ai/analytics/engagement', { params });
    return response as any as UserEngagementResponse;
  }

  // Get conversation metrics
  async getConversationMetrics(conversationId: string): Promise<ConversationMetrics> {
    const response = await apiClient.get(`/ai/analytics/conversations/${conversationId}`);
    return response as any as ConversationMetrics;
  }

  // Export analytics data
  async exportAnalytics(format: 'csv' | 'pdf', params?: AnalyticsParams): Promise<Blob> {
    const response = await apiClient.get('/ai/analytics/export', {
      params: { ...params, format },
      responseType: 'blob'
    });
    return response as any as Blob;
  }
}

export const analyticsService = new AIAgentAnalyticsService();
