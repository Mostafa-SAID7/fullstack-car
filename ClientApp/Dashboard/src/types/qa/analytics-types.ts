// QA Analytics Types for React Dashboard
// Extends existing analytics patterns with QA-specific metrics

import type { Expert, Question, Answer } from './api-types';

// ============================================================================
// CORE ANALYTICS TYPES
// ============================================================================

export interface QAAnalytics {
  // Overview metrics
  totalQuestions: number;
  totalAnswers: number;
  totalVotes: number;
  totalUsers: number;
  averageResponseTime: number; // in hours
  questionResponseRate: number; // percentage
  expertParticipationRate: number; // percentage
  userSatisfactionScore: number; // 1-5 scale

  // Category and tag analytics
  topCategories: CategoryMetrics[];
  topTags: TagMetrics[];

  // Content analytics
  trendingQuestions: TrendingQuestion[];
  expertPerformance: ExpertPerformance[];
  recentActivity: QAActivity[];

  // System health
  systemHealth: QAHealthMetrics;
}

export interface QAMetrics {
  // Real-time metrics
  activeUsers: number;
  questionsToday: number;
  answersToday: number;
  votesToday: number;
  
  // Performance metrics
  averageResponseTime: number;
  responseTimeToday: number;
  expertResponseRate: number;
  
  // Quality metrics
  acceptanceRate: number;
  averageVoteScore: number;
  flaggedContentCount: number;
}

export interface QATimeSeriesData {
  date: string;
  questions: number;
  answers: number;
  votes: number;
  users: number;
  responseTime: number;
}

// ============================================================================
// TRENDING AND PERFORMANCE TYPES
// ============================================================================

export interface TrendingQuestion {
  id: string;
  title: string;
  category: string;
  tags: string[];
  viewCount: number;
  voteScore: number;
  answerCount: number;
  hasAcceptedAnswer: boolean;
  trendingScore: number;
  growthRate: number; // percentage increase
  userId: string;
  userName: string;
  userReputation: number;
  createdAt: string;
  
  // Analytics-specific fields
  viewsToday: number;
  votesToday: number;
  answersToday: number;
  engagementRate: number;
  timeToFirstAnswer?: number; // in minutes
}

export interface CategoryMetrics {
  id: string;
  name: string;
  description?: string;
  count: number;
  percentage: number;
  
  // Performance metrics
  averageResponseTime: number;
  responseRate: number;
  expertCount: number;
  averageVoteScore: number;
  
  // Trend data
  growthRate: number;
  trending: boolean;
  
  // Time series data for charts
  dailyQuestions: number[];
  dailyAnswers: number[];
  dates: string[];
}

export interface TagMetrics {
  name: string;
  count: number;
  trending: boolean;
  growthRate: number;
  category?: string;
  
  // Usage analytics
  questionsCount: number;
  answersCount: number;
  averageVoteScore: number;
  
  // Expert association
  topExperts: string[]; // expert usernames
}

// ============================================================================
// EXPERT PERFORMANCE TYPES
// ============================================================================

export interface ExpertPerformance {
  // Basic info
  userId: string;
  userName: string;
  category: string;
  expertiseLevel: 'Beginner' | 'Intermediate' | 'Expert' | 'Master';
  
  // Core metrics
  answerCount: number;
  acceptedAnswerCount: number;
  averageRating: number;
  responseRate: number;
  reputationScore: number;
  badgesEarned: string[];
  
  // Performance analytics
  averageResponseTime: number; // in hours
  responseTimeImprovement: number; // percentage change
  qualityScore: number; // 1-5 scale
  helpfulnessRating: number; // 1-5 scale
  
  // Engagement metrics
  questionsAnsweredToday: number;
  questionsAnsweredThisWeek: number;
  questionsAnsweredThisMonth: number;
  streakDays: number; // consecutive days active
  
  // Trend data
  performanceTrend: 'improving' | 'stable' | 'declining';
  reputationGrowth: number; // points gained in period
  
  // Time series for charts
  dailyAnswers: number[];
  dailyAcceptedAnswers: number[];
  dailyReputation: number[];
  dates: string[];
}

export interface ExpertResponseMetrics {
  expertId: string;
  expertName: string;
  category: string;
  
  // Response time analytics
  averageResponseTime: number;
  medianResponseTime: number;
  fastestResponse: number;
  slowestResponse: number;
  
  // Response patterns
  responsesByHour: number[]; // 24 hours
  responsesByDay: number[]; // 7 days
  peakResponseHours: number[];
  
  // Quality metrics
  firstResponseAcceptanceRate: number;
  overallAcceptanceRate: number;
  averageAnswerLength: number;
  codeExamplesProvided: number;
}

// ============================================================================
// SYSTEM HEALTH AND MONITORING
// ============================================================================

export interface QAHealthMetrics {
  // Overall system health
  overallScore: number; // 0-100
  status: 'healthy' | 'warning' | 'critical';
  
  // Performance metrics
  responseTime: number; // average API response time in ms
  uptime: number; // percentage
  errorRate: number; // percentage
  activeConnections: number;
  
  // Content health
  unansweredQuestionRate: number; // percentage
  flaggedContentRate: number; // percentage
  duplicateQuestionRate: number; // percentage
  spamDetectionRate: number; // percentage
  
  // User engagement health
  expertParticipationRate: number;
  userRetentionRate: number;
  averageSessionDuration: number; // in minutes
  
  // Alerts and issues
  activeAlerts: HealthAlert[];
  recentIssues: HealthIssue[];
}

export interface HealthAlert {
  id: string;
  type: 'performance' | 'content' | 'user' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  createdAt: string;
  resolvedAt?: string;
  metadata?: Record<string, any>;
}

export interface HealthIssue {
  id: string;
  type: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  status: 'open' | 'investigating' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
}

// ============================================================================
// REPORTING TYPES
// ============================================================================

export interface QAReport {
  id: string;
  name: string;
  type: 'overview' | 'expert-performance' | 'category-analysis' | 'trending' | 'custom';
  description: string;
  
  // Report data
  generatedAt: string;
  timeRange: {
    start: string;
    end: string;
  };
  
  // Report sections
  summary: QAReportSummary;
  metrics: QAReportMetrics;
  charts: QAReportChart[];
  recommendations: QAReportRecommendation[];
  
  // Export options
  formats: ('pdf' | 'excel' | 'csv')[];
  downloadUrl?: string;
}

export interface QAReportConfig {
  name: string;
  type: 'overview' | 'expert-performance' | 'category-analysis' | 'trending' | 'custom';
  timeRange: {
    start: string;
    end: string;
  };
  
  // Filters
  categories?: string[];
  experts?: string[];
  tags?: string[];
  
  // Sections to include
  includeSummary: boolean;
  includeMetrics: boolean;
  includeCharts: boolean;
  includeRecommendations: boolean;
  
  // Format options
  format: 'pdf' | 'excel' | 'csv';
  includeRawData: boolean;
  
  // Scheduling (optional)
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    enabled: boolean;
  };
}

export interface QAReportSummary {
  totalQuestions: number;
  totalAnswers: number;
  totalVotes: number;
  averageResponseTime: number;
  topCategory: string;
  topExpert: string;
  keyInsights: string[];
}

export interface QAReportMetrics {
  questionMetrics: {
    total: number;
    answered: number;
    unanswered: number;
    closed: number;
    averageVotes: number;
  };
  answerMetrics: {
    total: number;
    accepted: number;
    averageVotes: number;
    averageLength: number;
  };
  userMetrics: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    expertUsers: number;
  };
  performanceMetrics: {
    averageResponseTime: number;
    responseRate: number;
    satisfactionScore: number;
    systemUptime: number;
  };
}

export interface QAReportChart {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'area';
  data: any[];
  config: {
    xAxis?: string;
    yAxis?: string;
    colors?: string[];
    showLegend?: boolean;
  };
}

export interface QAReportRecommendation {
  id: string;
  type: 'performance' | 'content' | 'user-engagement' | 'expert-growth';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  actionItems: string[];
  expectedImpact: string;
  timeframe: string;
}

// ============================================================================
// ACTIVITY AND AUDIT TYPES
// ============================================================================

export interface QAActivity {
  id: string;
  type: 'question_created' | 'answer_created' | 'vote_cast' | 'answer_accepted' | 'expert_assigned' | 'content_flagged';
  userId: string;
  userName: string;
  userReputation: number;
  contentId: string;
  contentTitle: string;
  contentType: 'Question' | 'Answer' | 'Vote';
  category?: string;
  timestamp: string;
  
  // Analytics metadata
  impactScore: number; // 1-10 scale
  engagementGenerated: number;
  reputationChange: number;
  
  // Context data
  metadata?: {
    voteType?: 'Up' | 'Down';
    flagReason?: string;
    expertiseArea?: string;
    responseTime?: number;
  };
}

// ============================================================================
// FILTER AND QUERY TYPES
// ============================================================================

export interface QAAnalyticsFilter {
  timeRange: '7d' | '30d' | '90d' | '1y' | 'custom';
  customDateRange?: {
    start: string;
    end: string;
  };
  
  categories?: string[];
  tags?: string[];
  experts?: string[];
  
  metrics?: ('questions' | 'answers' | 'votes' | 'users' | 'response-time')[];
  
  // Aggregation options
  groupBy?: 'day' | 'week' | 'month';
  includeInactive?: boolean;
  minThreshold?: number;
}

export interface QAAnalyticsQuery {
  filter: QAAnalyticsFilter;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// ============================================================================
// CHART DATA TYPES (extending existing chart patterns)
// ============================================================================

export interface QAChartData {
  // Line chart data for trends
  timeSeriesData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      color: string;
      type?: 'line' | 'bar';
    }[];
  };
  
  // Bar chart data for categories
  categoryData: {
    labels: string[];
    values: number[];
    colors: string[];
  };
  
  // Pie chart data for distributions
  distributionData: {
    labels: string[];
    values: number[];
    colors: string[];
  };
  
  // Heatmap data for activity patterns
  heatmapData: {
    hours: number[];
    days: string[];
    values: number[][];
  };
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

export interface QAAnalyticsExport {
  format: 'csv' | 'excel' | 'pdf' | 'json';
  data: QAAnalytics | QAReport;
  filename: string;
  generatedAt: string;
  filters: QAAnalyticsFilter;
  
  // Export metadata
  totalRecords: number;
  fileSize: number;
  downloadUrl: string;
  expiresAt: string;
}

// ============================================================================
// TYPE GUARDS AND UTILITIES
// ============================================================================

export function isQAAnalytics(obj: unknown): obj is QAAnalytics {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'totalQuestions' in obj &&
    'totalAnswers' in obj &&
    'systemHealth' in obj
  );
}

export function isTrendingQuestion(obj: unknown): obj is TrendingQuestion {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'trendingScore' in obj &&
    'growthRate' in obj &&
    'engagementRate' in obj
  );
}

export function isExpertPerformance(obj: unknown): obj is ExpertPerformance {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'expertiseLevel' in obj &&
    'performanceTrend' in obj &&
    'qualityScore' in obj
  );
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const QA_ANALYTICS_CONSTANTS = {
  // Time ranges
  TIME_RANGES: {
    '7d': { label: 'Last 7 days', days: 7 },
    '30d': { label: 'Last 30 days', days: 30 },
    '90d': { label: 'Last 90 days', days: 90 },
    '1y': { label: 'Last year', days: 365 }
  },
  
  // Metric thresholds
  THRESHOLDS: {
    RESPONSE_TIME: {
      EXCELLENT: 2, // hours
      GOOD: 6,
      POOR: 24
    },
    RESPONSE_RATE: {
      EXCELLENT: 0.9,
      GOOD: 0.7,
      POOR: 0.5
    },
    SATISFACTION: {
      EXCELLENT: 4.5,
      GOOD: 3.5,
      POOR: 2.5
    }
  },
  
  // Chart colors (consistent with existing theme)
  CHART_COLORS: {
    PRIMARY: '#3b82f6',
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    DANGER: '#ef4444',
    INFO: '#8b5cf6',
    MUTED: '#6b7280'
  }
} as const;