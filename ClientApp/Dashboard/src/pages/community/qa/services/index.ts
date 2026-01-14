// QA Services - Comprehensive Question and Answer system services
// Follows existing dashboard service patterns and architecture

// Core QA Services
export { QAService, qaService } from './QAService';
export { QAAnalyticsService, qaAnalyticsService } from './QAAnalyticsService';
export { ReputationService, reputationService } from './ReputationService';
export { QASignalRService, createQASignalRService } from './QASignalRService';
export { BulkOperationsService, bulkOperationsService } from './BulkOperationsService';

// Question-specific services
export { QAQuestionService } from './QAQuestionService';

// Re-export types for convenience
export type {
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

export type {
  Question,
  Answer,
  Vote as QAVote,
  UserReputation,
  Category as QACategory,
  Tag as QATag,
  Expert as ExpertProfile
} from '../../types/qa/api-types';