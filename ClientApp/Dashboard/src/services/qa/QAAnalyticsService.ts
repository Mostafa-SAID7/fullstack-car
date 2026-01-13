import { ApiService } from '../api/ApiService';
import type { ApiResult } from '../../types/api';
import type {
  QAAnalytics,
  QAMetrics,
  TrendingQuestion,
  ExpertPerformance,
  CategoryMetrics,
  QAReport,
  QAReportConfig,
  QATimeSeriesData,
  QAHealthMetrics
} from '../../types/qa/analytics-types';

/**
 * QA Analytics Service extending existing analytics patterns
 * Provides comprehensive QA metrics and reporting for React Dashboard
 * Follows existing AnalyticsService architecture and patterns
 */
export class QAAnalyticsService extends ApiService {
  private readonly baseUrl = '/api/v7/qa/analytics';
  private static instance: QAAnalyticsService;

  static getInstance(): QAAnalyticsService {
    if (!QAAnalyticsService.instance) {
      QAAnalyticsService.instance = new QAAnalyticsService();
    }
    return QAAnalyticsService.instance;
  }

  // ============================================================================
  // COMPREHENSIVE QA METRICS
  // ============================================================================

  /**
   * Get comprehensive QA analytics dashboard data
   * Extends existing analytics patterns with QA-specific metrics
   */
  async getQAAnalytics(timeRange: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<ApiResult<QAAnalytics>> {
    try {
      const result = await this.get<QAAnalytics>(`/api/v7/qa/analytics/dashboard?timeRange=${timeRange}`);
      return result;
    } catch (error) {
      this.handleApiError(error);
      return this.createErrorResult('Failed to fetch QA analytics');
    }
  }

  /**
   * Get real-time QA metrics
   * Similar to existing real-time analytics
   */
  async getRealtimeQAMetrics(): Promise<ApiResult<QAMetrics>> {
    try {
      const result = await this.get<QAMetrics>('/api/v7/qa/analytics/realtime');
      return result;
    } catch (error) {
      this.handleApiError(error);
      return this.createErrorResult('Failed to fetch real-time QA metrics');
    }
  }

  /**
   * Get QA time series data for charts
   * Follows existing chart data patterns
   */
  async getQATimeSeriesData(
    metric: 'questions' | 'answers' | 'votes' | 'users',
    timeRange: '7d' | '30d' | '90d' | '1y' = '30d'
  ): Promise<ApiResult<QATimeSeriesData[]>> {
    try {
      const result = await this.get<QATimeSeriesData[]>(
        `/api/v7/qa/analytics/timeseries?metric=${metric}&timeRange=${timeRange}`
      );
      return result;
    } catch (error) {
      this.handleApiError(error);
      return this.createErrorResult('Failed to fetch time series data');
    }
  }

  // ============================================================================
  // TRENDING QUESTIONS ANALYTICS
  // ============================================================================

  /**
   * Get trending questions with analytics data
   * Extends existing trending content patterns
   */
  async getTrendingQuestions(
    timeRange: '24h' | '7d' | '30d' = '7d',
    limit: number = 10
  ): Promise<ApiResult<TrendingQuestion[]>> {
    try {
      const result = await this.get<TrendingQuestion[]>(
        `/api/v7/qa/analytics/trending/questions?timeRange=${timeRange}&limit=${limit}`
      );
      return result;
    } catch (error) {
      this.handleApiError(error);
      return this.createErrorResult('Failed to fetch trending questions');
    }
  }

  /**
   * Get trending topics and categories
   * Similar to existing trending analytics
   */
  async getTrendingTopics(timeRange: '7d' | '30d' = '7d'): Promise<ApiResult<CategoryMetrics[]>> {
    try {
      const result = await this.get<CategoryMetrics[]>(
        `/api/v7/qa/analytics/trending/topics?timeRange=${timeRange}`
      );
      return result;
    } catch (error) {
      this.handleApiError(error);
      return this.createErrorResult('Failed to fetch trending topics');
    }
  }

  /**
   * Get question performance metrics
   * Tracks views, engagement, and conversion rates
   */
  async getQuestionPerformanceMetrics(
    questionIds?: string[],
    timeRange: '7d' | '30d' | '90d' = '30d'
  ): Promise<ApiResult<any[]>> {
    try {
      const params: Record<string, any> = { timeRange };
      if (questionIds && questionIds.length > 0) {
        params.questionIds = questionIds.join(',');
      }

      const queryString = this.buildQueryString(params);
      const result = await this.get<any[]>(`/api/v7/qa/analytics/questions/performance?${queryString}`);
      return result;
    } catch (error) {
      this.handleApiError(error);
      return this.createErrorResult('Failed to fetch question performance metrics');
    }
  }

  // ============================================================================
  // EXPERT PERFORMANCE MONITORING
  // ============================================================================

  /**
   * Get expert performance analytics
   * Extends existing user analytics patterns
   */
  async getExpertPerformance(
    expertId?: string,
    timeRange: '30d' | '90d' | '1y' = '30d'
  ): Promise<ApiResult<ExpertPerformance[]>> {
    try {
      const params: Record<string, any> = { timeRange };
      if (expertId) {
        params.expertId = expertId;
      }

      const queryString = this.buildQueryString(params);
      const result = await this.get<ExpertPerformance[]>(`/api/v7/qa/analytics/experts/performance?${queryString}`);
      return result;
    } catch (error) {
      this.handleApiError(error);
      return this.createErrorResult('Failed to fetch expert performance');
    }
  }

  /**
   * Get expert leaderboard with performance metrics
   * Similar to existing leaderboard analytics
   */
  async getExpertLeaderboard(
    category?: string,
    timeRange: '30d' | '90d' | '1y' = '30d',
    limit: number = 20
  ): Promise<ApiResult<ExpertPerformance[]>> {
    try {
      const params: Record<string, any> = { timeRange, limit };
      if (category) {
        params.category = category;
      }

      const queryString = this.buildQueryString(params);
      const result = await this.get<ExpertPerformance[]>(`/api/v7/qa/analytics/experts/leaderboard?${queryString}`);
      return result;
    } catch (error) {
      this.handleApiError(error);
      return this.createErrorResult('Failed to fetch expert leaderboard');
    }
  }

  /**
   * Get expert response time analytics
   * Tracks expert responsiveness and engagement
   */
  async getExpertResponseMetrics(
    expertId?: string,
    timeRange: '30d' | '90d' | '1y' = '30d'
  ): Promise<ApiResult<any>> {
    try {
      const params: Record<string, any> = { timeRange };
      if (expertId) {
        params.expertId = expertId;
      }

      const queryString = this.buildQueryString(params);
      const result = await this.get<any>(`/api/v7/qa/analytics/experts/response-times?${queryString}`);
      return result;
    } catch (error) {
      this.handleApiError(error);
      return this.createErrorResult('Failed to fetch expert response metrics');
    }
  }

  // ============================================================================
  // CATEGORY AND TAG ANALYTICS
  // ============================================================================

  /**
   * Get category performance metrics
   * Extends existing content analytics patterns
   */
  async getCategoryMetrics(timeRange: '30d' | '90d' | '1y' = '30d'): Promise<ApiResult<CategoryMetrics[]>> {
    try {
      const result = await this.get<CategoryMetrics[]>(`/api/v7/qa/analytics/categories?timeRange=${timeRange}`);
      return result;
    } catch (error) {
      this.handleApiError(error);
      return this.createErrorResult('Failed to fetch category metrics');
    }
  }

  /**
   * Get tag usage analytics
   * Similar to existing keyword analytics
   */
  async getTagAnalytics(
    timeRange: '30d' | '90d' | '1y' = '30d',
    limit: number = 50
  ): Promise<ApiResult<any[]>> {
    try {
      const result = await this.get<any[]>(`/api/v7/qa/analytics/tags?timeRange=${timeRange}&limit=${limit}`);
      return result;
    } catch (error) {
      this.handleApiError(error);
      return this.createErrorResult('Failed to fetch tag analytics');
    }
  }

  // ============================================================================
  // AUTOMATED REPORT GENERATION
  // ============================================================================

  /**
   * Generate automated QA report
   * Extends existing report generation patterns
   */
  async generateQAReport(config: QAReportConfig): Promise<ApiResult<QAReport>> {
    try {
      const result = await this.post<QAReport>('/api/v7/qa/analytics/reports/generate', config);
      return result;
    } catch (error) {
      this.handleApiError(error);
      return this.createErrorResult('Failed to generate QA report');
    }
  }

  /**
   * Get available report templates
   * Similar to existing report templates
   */
  async getReportTemplates(): Promise<ApiResult<any[]>> {
    try {
      const result = await this.get<any[]>('/api/v7/qa/analytics/reports/templates');
      return result;
    } catch (error) {
      this.handleApiError(error);
      return this.createErrorResult('Failed to fetch report templates');
    }
  }

  /**
   * Schedule automated report
   * Extends existing scheduled reporting
   */
  async scheduleReport(config: QAReportConfig & { schedule: any }): Promise<ApiResult<any>> {
    try {
      const result = await this.post<any>('/api/v7/qa/analytics/reports/schedule', config);
      return result;
    } catch (error) {
      this.handleApiError(error);
      return this.createErrorResult('Failed to schedule report');
    }
  }

  /**
   * Export QA analytics data
   * Follows existing export patterns
   */
  async exportQAAnalytics(
    format: 'csv' | 'excel' | 'pdf',
    config: {
      timeRange: string;
      metrics: string[];
      includeCharts?: boolean;
    }
  ): Promise<ApiResult<Blob>> {
    try {
      const response = await fetch(`${this.baseUrl}/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify({ format, ...config })
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      return { succeeded: true, data: blob };
    } catch (error) {
      this.handleApiError(error);
      return this.createErrorResult('Failed to export analytics data');
    }
  }

  // ============================================================================
  // SYSTEM HEALTH MONITORING
  // ============================================================================

  /**
   * Get QA system health metrics
   * Extends existing system monitoring patterns
   */
  async getQAHealthMetrics(): Promise<ApiResult<QAHealthMetrics>> {
    try {
      const result = await this.get<QAHealthMetrics>('/api/v7/qa/analytics/health');
      return result;
    } catch (error) {
      this.handleApiError(error);
      return this.createErrorResult('Failed to fetch QA health metrics');
    }
  }

  /**
   * Get performance benchmarks
   * Similar to existing performance monitoring
   */
  async getPerformanceBenchmarks(timeRange: '7d' | '30d' = '7d'): Promise<ApiResult<any>> {
    try {
      const result = await this.get<any>(`/api/v7/qa/analytics/performance?timeRange=${timeRange}`);
      return result;
    } catch (error) {
      this.handleApiError(error);
      return this.createErrorResult('Failed to fetch performance benchmarks');
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Generate mock QA analytics data for development
   * Similar to existing mock data generators
   */
  generateMockQAAnalytics(): QAAnalytics {
    return {
      totalQuestions: Math.floor(Math.random() * 5000) + 1000,
      totalAnswers: Math.floor(Math.random() * 15000) + 3000,
      totalVotes: Math.floor(Math.random() * 50000) + 10000,
      totalUsers: Math.floor(Math.random() * 2000) + 500,
      averageResponseTime: Math.random() * 10 + 2, // 2-12 hours
      questionResponseRate: Math.random() * 0.3 + 0.7, // 70-100%
      expertParticipationRate: Math.random() * 0.4 + 0.6, // 60-100%
      userSatisfactionScore: Math.random() * 1.5 + 3.5, // 3.5-5.0
      topCategories: [
        { 
          id: '1',
          name: 'Technical Support', 
          count: Math.floor(Math.random() * 500) + 200, 
          percentage: 35,
          averageResponseTime: 2.5,
          responseRate: 0.85,
          expertCount: 12,
          averageVoteScore: 4.2,
          growthRate: 0.15,
          trending: true,
          dailyQuestions: Array.from({length: 7}, () => Math.floor(Math.random() * 50) + 10),
          dailyAnswers: Array.from({length: 7}, () => Math.floor(Math.random() * 40) + 8),
          dates: Array.from({length: 7}, (_, i) => new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        },
        { 
          id: '2',
          name: 'Product Features', 
          count: Math.floor(Math.random() * 400) + 150, 
          percentage: 25,
          averageResponseTime: 3.1,
          responseRate: 0.78,
          expertCount: 8,
          averageVoteScore: 3.9,
          growthRate: 0.08,
          trending: false,
          dailyQuestions: Array.from({length: 7}, () => Math.floor(Math.random() * 40) + 8),
          dailyAnswers: Array.from({length: 7}, () => Math.floor(Math.random() * 35) + 6),
          dates: Array.from({length: 7}, (_, i) => new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        },
        { 
          id: '3',
          name: 'Troubleshooting', 
          count: Math.floor(Math.random() * 300) + 100, 
          percentage: 20,
          averageResponseTime: 1.8,
          responseRate: 0.92,
          expertCount: 15,
          averageVoteScore: 4.5,
          growthRate: 0.22,
          trending: true,
          dailyQuestions: Array.from({length: 7}, () => Math.floor(Math.random() * 30) + 5),
          dailyAnswers: Array.from({length: 7}, () => Math.floor(Math.random() * 28) + 5),
          dates: Array.from({length: 7}, (_, i) => new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        },
        { 
          id: '4',
          name: 'General Questions', 
          count: Math.floor(Math.random() * 200) + 80, 
          percentage: 15,
          averageResponseTime: 4.2,
          responseRate: 0.65,
          expertCount: 5,
          averageVoteScore: 3.4,
          growthRate: -0.05,
          trending: false,
          dailyQuestions: Array.from({length: 7}, () => Math.floor(Math.random() * 20) + 3),
          dailyAnswers: Array.from({length: 7}, () => Math.floor(Math.random() * 15) + 2),
          dates: Array.from({length: 7}, (_, i) => new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        },
        { 
          id: '5',
          name: 'Bug Reports', 
          count: Math.floor(Math.random() * 100) + 50, 
          percentage: 5,
          averageResponseTime: 6.1,
          responseRate: 0.45,
          expertCount: 3,
          averageVoteScore: 2.8,
          growthRate: 0.35,
          trending: true,
          dailyQuestions: Array.from({length: 7}, () => Math.floor(Math.random() * 10) + 1),
          dailyAnswers: Array.from({length: 7}, () => Math.floor(Math.random() * 8) + 1),
          dates: Array.from({length: 7}, (_, i) => new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        }
      ],
      topTags: [
        { 
          name: 'javascript', 
          count: Math.floor(Math.random() * 200) + 100, 
          trending: true,
          growthRate: 0.25,
          questionsCount: Math.floor(Math.random() * 150) + 80,
          answersCount: Math.floor(Math.random() * 300) + 150,
          averageVoteScore: 4.1,
          topExperts: ['john_doe', 'jane_smith', 'dev_expert']
        },
        { 
          name: 'react', 
          count: Math.floor(Math.random() * 180) + 90, 
          trending: true,
          growthRate: 0.18,
          questionsCount: Math.floor(Math.random() * 120) + 70,
          answersCount: Math.floor(Math.random() * 250) + 120,
          averageVoteScore: 4.3,
          topExperts: ['react_guru', 'frontend_dev', 'ui_expert']
        },
        { 
          name: 'api', 
          count: Math.floor(Math.random() * 150) + 70, 
          trending: false,
          growthRate: -0.05,
          questionsCount: Math.floor(Math.random() * 100) + 50,
          answersCount: Math.floor(Math.random() * 200) + 100,
          averageVoteScore: 3.8,
          topExperts: ['api_master', 'backend_dev']
        },
        { 
          name: 'database', 
          count: Math.floor(Math.random() * 120) + 60, 
          trending: false,
          growthRate: 0.02,
          questionsCount: Math.floor(Math.random() * 80) + 40,
          answersCount: Math.floor(Math.random() * 160) + 80,
          averageVoteScore: 3.9,
          topExperts: ['db_admin', 'sql_expert']
        },
        { 
          name: 'authentication', 
          count: Math.floor(Math.random() * 100) + 50, 
          trending: true,
          growthRate: 0.32,
          questionsCount: Math.floor(Math.random() * 70) + 30,
          answersCount: Math.floor(Math.random() * 140) + 70,
          averageVoteScore: 4.0,
          topExperts: ['security_pro', 'auth_specialist']
        }
      ],
      trendingQuestions: [],
      expertPerformance: [],
      recentActivity: [],
      systemHealth: {
        overallScore: Math.random() * 20 + 80, // 80-100%
        status: 'healthy' as const,
        responseTime: Math.random() * 500 + 200, // 200-700ms
        uptime: Math.random() * 2 + 98, // 98-100%
        errorRate: Math.random() * 2, // 0-2%
        activeConnections: Math.floor(Math.random() * 500) + 100,
        unansweredQuestionRate: Math.random() * 15 + 5, // 5-20%
        flaggedContentRate: Math.random() * 3, // 0-3%
        duplicateQuestionRate: Math.random() * 5, // 0-5%
        spamDetectionRate: Math.random() * 2, // 0-2%
        expertParticipationRate: Math.random() * 20 + 70, // 70-90%
        userRetentionRate: Math.random() * 15 + 80, // 80-95%
        averageSessionDuration: Math.random() * 30 + 15, // 15-45 minutes
        activeAlerts: [],
        recentIssues: []
      }
    };
  }

  /**
   * Create error result helper
   */
  private createErrorResult<T>(message: string): ApiResult<T> {
    return {
      succeeded: false,
      message,
      errors: [message],
      statusCode: 500
    };
  }

  /**
   * Get auth headers for authenticated requests
   */
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

// Export singleton instance
export const qaAnalyticsService = QAAnalyticsService.getInstance();