// QA API types for React Dashboard application
// These types match the backend API response format exactly

// Base API Response Types
export interface ApiResponse<T = unknown> {
  succeeded: boolean;
  data?: T;
  message?: string;
  errors: string[];
  statusCode?: number;
  timestamp: string;
}

export interface PaginatedResponse<T = unknown> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export interface PaginatedApiResponse<T = unknown> extends ApiResponse<PaginatedResponse<T>> {}

// Filtering and Query Types
export interface BaseFilter {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  searchTerm?: string;
}

export interface QuestionFilter extends BaseFilter {
  category?: string;
  tags?: string[];
  status?: 'open' | 'closed' | 'answered' | 'unanswered';
  userId?: string;
  hasAcceptedAnswer?: boolean;
  minVoteScore?: number;
  maxVoteScore?: number;
  dateFrom?: string;
  dateTo?: string;
  includeScheduled?: boolean;
}

export interface AnswerFilter extends BaseFilter {
  questionId?: string;
  userId?: string;
  isAccepted?: boolean;
  minVoteScore?: number;
  maxVoteScore?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface VoteFilter extends BaseFilter {
  userId?: string;
  contentType?: 'Question' | 'Answer';
  voteType?: 'Up' | 'Down';
  dateFrom?: string;
  dateTo?: string;
}

export interface SearchFilter extends BaseFilter {
  categories?: string[];
  tags?: string[];
  contentTypes?: ('Question' | 'Answer')[];
  minVoteScore?: number;
  hasAcceptedAnswer?: boolean;
  dateFrom?: string;
  dateTo?: string;
  includeContent?: boolean;
  includeTags?: boolean;
  includeUserInfo?: boolean;
}

// Error Response Types
export interface ErrorDetail {
  code: string;
  message: string;
  field?: string;
  attemptedValue?: string;
  severity: 'Error' | 'Warning' | 'Info';
}

export interface ErrorResponse {
  succeeded: false;
  message: string;
  errors: ErrorDetail[];
  statusCode: number;
  timestamp: string;
  traceId?: string;
  path?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  attemptedValue?: unknown;
  code?: string;
}

export interface BusinessRuleError {
  rule: string;
  message: string;
  context: Record<string, unknown>;
}

export interface RateLimitError {
  message: string;
  retryAfterSeconds: number;
  limit: number;
  remaining: number;
  resetTime: string;
}

// QA Entity Types
export interface Question {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  viewCount: number;
  voteScore: number;
  upvotesCount: number;
  downvotesCount: number;
  answerCount: number;
  acceptedAnswerId?: string;
  isClosed: boolean;
  closedReason?: string;
  isScheduled: boolean;
  scheduledAt?: string;
  userId: string;
  userName: string;
  userReputation: number;
  createdAt: string;
  updatedAt?: string;
  userVote?: 'Up' | 'Down';
}

export interface QuestionList {
  id: string;
  title: string;
  category: string;
  tags: string[];
  viewCount: number;
  voteScore: number;
  answerCount: number;
  hasAcceptedAnswer: boolean;
  isClosed: boolean;
  userId: string;
  userName: string;
  userReputation: number;
  createdAt: string;
  lastActivityAt?: string;
}

export interface QuestionDetail extends Question {
  answers: Answer[];
  similarQuestions: QuestionSimilarity[];
}

export interface QuestionSimilarity {
  id: string;
  title: string;
  category: string;
  voteScore: number;
  similarityScore: number;
  answerCount: number;
  hasAcceptedAnswer: boolean;
  createdAt: string;
}

export interface Answer {
  id: string;
  questionId: string;
  content: string;
  voteScore: number;
  upvotesCount: number;
  downvotesCount: number;
  isAccepted: boolean;
  acceptedAt?: string;
  userId: string;
  userName: string;
  userReputation: number;
  createdAt: string;
  updatedAt?: string;
  userVote?: 'Up' | 'Down';
  isEdited: boolean;
  versionHistory: AnswerVersion[];
}

export interface AnswerVersion {
  version: number;
  content: string;
  createdAt: string;
  editReason: string;
}

export interface Vote {
  id: string;
  userId: string;
  contentId: string;
  contentType: 'Question' | 'Answer';
  voteType: 'Up' | 'Down';
  createdAt: string;
  updatedAt?: string;
  contentTitle: string;
  contentUrl: string;
  contentVoteScore: number;
  questionId?: string;
}

export interface UserReputation {
  userId: string;
  userName: string;
  reputationScore: number;
  questionsAsked: number;
  answersGiven: number;
  acceptedAnswers: number;
  upvotesReceived: number;
  downvotesReceived: number;
  badgesEarned: string[];
  expertiseAreas: string[];
  lastUpdated: string;
}

export interface ReputationHistory {
  id: string;
  userId: string;
  activityType: string;
  reputationChange: number;
  description: string;
  contentId?: string;
  contentTitle?: string;
  createdAt: string;
}

export interface Expert {
  userId: string;
  userName: string;
  category: string;
  expertiseLevel: 'Beginner' | 'Intermediate' | 'Expert' | 'Master';
  answerCount: number;
  acceptedAnswerCount: number;
  averageRating: number;
  responseRate: number;
  reputationScore: number;
  badgesEarned: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  color?: string;
  questionCount: number;
  expertCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  description?: string;
  usageCount: number;
  categoryId?: string;
  createdAt: string;
}

export interface PopularTag {
  name: string;
  usageCount: number;
  trendingScore: number;
}

// Command/Request Types
export interface CreateQuestionRequest {
  title: string;
  content: string;
  category: string;
  tags: string[];
  isScheduled?: boolean;
  scheduledAt?: string;
}

export interface UpdateQuestionRequest {
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
  isScheduled?: boolean;
  scheduledAt?: string;
}

export interface CreateAnswerRequest {
  questionId: string;
  content: string;
}

export interface UpdateAnswerRequest {
  content: string;
  editReason?: string;
}

export interface CreateVoteRequest {
  contentId: string;
  contentType: 'Question' | 'Answer';
  voteType: 'Up' | 'Down';
}

export interface CloseQuestionRequest {
  reason: string;
}

// Response Type Helpers
export type QuestionsResponse = PaginatedApiResponse<QuestionList>;
export type QuestionResponse = ApiResponse<Question>;
export type QuestionDetailResponse = ApiResponse<QuestionDetail>;
export type AnswersResponse = PaginatedApiResponse<Answer>;
export type AnswerResponse = ApiResponse<Answer>;
export type VotesResponse = PaginatedApiResponse<Vote>;
export type VoteResponse = ApiResponse<Vote>;
export type UserReputationResponse = ApiResponse<UserReputation>;
export type ReputationHistoryResponse = PaginatedApiResponse<ReputationHistory>;
export type ExpertsResponse = ApiResponse<Expert[]>;
export type CategoriesResponse = ApiResponse<Category[]>;
export type TagsResponse = ApiResponse<Tag[]>;
export type PopularTagsResponse = ApiResponse<PopularTag[]>;
export type SimilarQuestionsResponse = ApiResponse<QuestionSimilarity[]>;

// Utility Types
export type QAApiResponse<T> = ApiResponse<T>;
export type QAPaginatedResponse<T> = PaginatedApiResponse<T>;
export type QAErrorResponse = ErrorResponse;

// Type Guards
export function isApiResponse<T>(obj: unknown): obj is ApiResponse<T> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'succeeded' in obj &&
    typeof (obj as any).succeeded === 'boolean'
  );
}

export function isErrorResponse(obj: unknown): obj is ErrorResponse {
  return (
    isApiResponse(obj) &&
    !obj.succeeded &&
    'errors' in obj &&
    Array.isArray((obj as any).errors)
  );
}

export function isPaginatedResponse<T>(obj: unknown): obj is PaginatedResponse<T> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'items' in obj &&
    Array.isArray((obj as any).items) &&
    'pageNumber' in obj &&
    'totalCount' in obj
  );
}

// API Endpoint Constants
export const QA_API_ENDPOINTS = {
  QUESTIONS: {
    BASE: '/api/v7/qa/questions',
    SEARCH: '/api/v7/qa/questions/search',
    SIMILAR: (id: string) => `/api/v7/qa/questions/similar/${id}`,
    CLOSE: (id: string) => `/api/v7/qa/questions/${id}/close`,
    MY_QUESTIONS: '/api/v7/qa/questions/my-questions'
  },
  ANSWERS: {
    BASE: '/api/v7/qa/answers',
    BY_QUESTION: (questionId: string) => `/api/v7/qa/answers/question/${questionId}`,
    ACCEPT: (id: string) => `/api/v7/qa/answers/${id}/accept`,
    MY_ANSWERS: '/api/v7/qa/answers/my-answers'
  },
  VOTES: {
    BASE: '/api/v7/qa/votes',
    MY_VOTES: '/api/v7/qa/votes/my-votes'
  },
  REPUTATION: {
    BASE: '/api/v7/qa/reputation',
    LEADERBOARD: '/api/v7/qa/reputation/leaderboard',
    HISTORY: (userId: string) => `/api/v7/qa/reputation/${userId}/history`,
    EXPERTS: '/api/v7/qa/reputation/experts'
  },
  CATEGORIES: {
    BASE: '/api/v7/qa/categories',
    EXPERTS: (categoryId: string) => `/api/v7/qa/categories/${categoryId}/experts`
  },
  TAGS: {
    BASE: '/api/v7/qa/tags',
    POPULAR: '/api/v7/qa/tags/popular'
  }
} as const;

// Dashboard-specific Analytics Types
export interface QAAnalytics {
  totalQuestions: number;
  totalAnswers: number;
  totalVotes: number;
  totalUsers: number;
  averageResponseTime: number;
  topCategories: { name: string; count: number }[];
  topTags: { name: string; count: number }[];
  topExperts: Expert[];
  recentActivity: QAActivity[];
  trendingQuestions: QuestionList[];
  unansweredQuestions: QuestionList[];
  flaggedContent: FlaggedContent[];
}

export interface QAActivity {
  id: string;
  type: 'question_created' | 'answer_created' | 'vote_cast' | 'answer_accepted';
  userId: string;
  userName: string;
  contentId: string;
  contentTitle: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface FlaggedContent {
  id: string;
  contentId: string;
  contentType: 'Question' | 'Answer';
  contentTitle: string;
  flagReason: string;
  flaggedBy: string;
  flaggedAt: string;
  status: 'pending' | 'reviewed' | 'resolved';
  moderatorNotes?: string;
}

// Dashboard-specific Moderation Types
export interface ModerationAction {
  id: string;
  action: 'delete' | 'close' | 'flag' | 'unflag' | 'ban' | 'unban';
  contentId?: string;
  userId?: string;
  reason: string;
  moderatorId: string;
  moderatorName: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface BulkModerationRequest {
  action: 'delete' | 'close' | 'flag';
  contentIds: string[];
  reason: string;
  contentType: 'Question' | 'Answer';
}

export interface UserModerationInfo {
  userId: string;
  userName: string;
  reputationScore: number;
  questionsAsked: number;
  answersGiven: number;
  flaggedContentCount: number;
  moderationActions: ModerationAction[];
  isBanned: boolean;
  banReason?: string;
  banExpiresAt?: string;
}