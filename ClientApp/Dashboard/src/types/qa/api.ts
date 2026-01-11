// React-specific QA API interfaces for the Dashboard application
// This file imports internal types and adds React-specific patterns

import type {
  ApiResponse,
  PaginatedApiResponse,
  Question,
  QuestionList,
  QuestionDetail,
  Answer,
  Vote,
  UserReputation,
  ReputationHistory,
  Expert,
  Category,
  Tag,
  PopularTag,
  QuestionSimilarity,
  QuestionFilter,
  AnswerFilter,
  VoteFilter,
  SearchFilter,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  CreateAnswerRequest,
  UpdateAnswerRequest,
  CreateVoteRequest,
  CloseQuestionRequest
} from './api-types';

// React-specific service interfaces using Promises
export interface QAQuestionService {
  // Question CRUD operations
  getQuestions(filter?: QuestionFilter): Promise<PaginatedApiResponse<QuestionList>>;
  getQuestion(id: string): Promise<ApiResponse<Question>>;
  getQuestionDetail(id: string): Promise<ApiResponse<QuestionDetail>>;
  createQuestion(request: CreateQuestionRequest): Promise<ApiResponse<Question>>;
  updateQuestion(id: string, request: UpdateQuestionRequest): Promise<ApiResponse<Question>>;
  deleteQuestion(id: string): Promise<ApiResponse<void>>;
  closeQuestion(id: string, request: CloseQuestionRequest): Promise<ApiResponse<void>>;
  
  // Question search and discovery
  searchQuestions(filter: SearchFilter): Promise<PaginatedApiResponse<QuestionList>>;
  getSimilarQuestions(id: string): Promise<ApiResponse<QuestionSimilarity[]>>;
  getMyQuestions(filter?: QuestionFilter): Promise<PaginatedApiResponse<QuestionList>>;
  
  // Question interactions
  viewQuestion(id: string): Promise<ApiResponse<void>>;
}

export interface QAAnswerService {
  // Answer CRUD operations
  getAnswersByQuestion(questionId: string, filter?: AnswerFilter): Promise<PaginatedApiResponse<Answer>>;
  getAnswer(id: string): Promise<ApiResponse<Answer>>;
  createAnswer(request: CreateAnswerRequest): Promise<ApiResponse<Answer>>;
  updateAnswer(id: string, request: UpdateAnswerRequest): Promise<ApiResponse<Answer>>;
  deleteAnswer(id: string): Promise<ApiResponse<void>>;
  acceptAnswer(id: string): Promise<ApiResponse<void>>;
  
  // Answer queries
  getMyAnswers(filter?: AnswerFilter): Promise<PaginatedApiResponse<Answer>>;
  getAnswerVersionHistory(id: string): Promise<ApiResponse<Answer>>;
}

export interface QAVotingService {
  // Voting operations
  createVote(request: CreateVoteRequest): Promise<ApiResponse<Vote>>;
  removeVote(contentId: string, contentType: 'Question' | 'Answer'): Promise<ApiResponse<void>>;
  changeVote(contentId: string, contentType: 'Question' | 'Answer', voteType: 'Up' | 'Down'): Promise<ApiResponse<Vote>>;
  
  // Vote queries
  getUserVotes(filter?: VoteFilter): Promise<PaginatedApiResponse<Vote>>;
  getContentVotes(contentId: string, contentType: 'Question' | 'Answer'): Promise<ApiResponse<Vote[]>>;
}

export interface QAReputationService {
  // Reputation queries
  getUserReputation(userId?: string): Promise<ApiResponse<UserReputation>>;
  getReputationLeaderboard(count?: number): Promise<ApiResponse<UserReputation[]>>;
  getReputationHistory(userId?: string, pageNumber?: number, pageSize?: number): Promise<PaginatedApiResponse<ReputationHistory>>;
  
  // Expert system
  getExpertsByCategory(category: string): Promise<ApiResponse<Expert[]>>;
  getTopExperts(count?: number): Promise<ApiResponse<Expert[]>>;
  updateExpertiseAreas(areas: string[]): Promise<ApiResponse<UserReputation>>;
}

export interface QACategoryService {
  // Category operations
  getCategories(): Promise<ApiResponse<Category[]>>;
  getCategory(id: string): Promise<ApiResponse<Category>>;
  getCategoryExperts(categoryId: string): Promise<ApiResponse<Expert[]>>;
  getCategoryStats(categoryId: string): Promise<ApiResponse<any>>;
}

export interface QATagService {
  // Tag operations
  getTags(search?: string): Promise<ApiResponse<Tag[]>>;
  getPopularTags(count?: number): Promise<ApiResponse<PopularTag[]>>;
  getTagsByCategory(categoryId: string): Promise<ApiResponse<Tag[]>>;
  searchTags(query: string): Promise<ApiResponse<Tag[]>>;
}

export interface QASearchService {
  // Search operations
  searchContent(filter: SearchFilter): Promise<PaginatedApiResponse<QuestionList | Answer>>;
  searchQuestions(filter: SearchFilter): Promise<PaginatedApiResponse<QuestionList>>;
  searchAnswers(filter: SearchFilter): Promise<PaginatedApiResponse<Answer>>;
  
  // Search suggestions
  getSearchSuggestions(query: string): Promise<ApiResponse<string[]>>;
  getRelatedContent(contentId: string, contentType: 'Question' | 'Answer'): Promise<ApiResponse<any[]>>;
}

// React-specific state management interfaces (for Context/Hooks)
export interface QAState {
  questions: {
    items: QuestionList[];
    currentQuestion: QuestionDetail | null;
    loading: boolean;
    error: string | null;
    pagination: {
      pageNumber: number;
      pageSize: number;
      totalCount: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    filters: QuestionFilter;
  };
  answers: {
    items: Answer[];
    loading: boolean;
    error: string | null;
  };
  votes: {
    userVotes: { [contentId: string]: 'Up' | 'Down' };
    loading: boolean;
    error: string | null;
  };
  reputation: {
    currentUser: UserReputation | null;
    leaderboard: UserReputation[];
    history: ReputationHistory[];
    loading: boolean;
    error: string | null;
  };
  categories: Category[];
  tags: Tag[];
  experts: Expert[];
  search: {
    results: (QuestionList | Answer)[];
    suggestions: string[];
    loading: boolean;
    error: string | null;
    lastQuery: string;
  };
}

export interface QAActions {
  // Question actions
  loadQuestions: (filter?: QuestionFilter) => Promise<void>;
  loadQuestion: (id: string) => Promise<void>;
  createQuestion: (request: CreateQuestionRequest) => Promise<void>;
  updateQuestion: (id: string, request: UpdateQuestionRequest) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  closeQuestion: (id: string, request: CloseQuestionRequest) => Promise<void>;
  
  // Answer actions
  loadAnswers: (questionId: string, filter?: AnswerFilter) => Promise<void>;
  createAnswer: (request: CreateAnswerRequest) => Promise<void>;
  updateAnswer: (id: string, request: UpdateAnswerRequest) => Promise<void>;
  deleteAnswer: (id: string) => Promise<void>;
  acceptAnswer: (id: string) => Promise<void>;
  
  // Voting actions
  vote: (request: CreateVoteRequest) => Promise<void>;
  removeVote: (contentId: string, contentType: 'Question' | 'Answer') => Promise<void>;
  changeVote: (contentId: string, contentType: 'Question' | 'Answer', voteType: 'Up' | 'Down') => Promise<void>;
  
  // Search actions
  search: (filter: SearchFilter) => Promise<void>;
  clearSearch: () => void;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// React-specific hook interfaces
export interface UseQAQuestions {
  questions: QuestionList[];
  currentQuestion: QuestionDetail | null;
  loading: boolean;
  error: string | null;
  pagination: any;
  filters: QuestionFilter;
  
  loadQuestions: (filter?: QuestionFilter) => Promise<void>;
  loadQuestion: (id: string) => Promise<void>;
  createQuestion: (request: CreateQuestionRequest) => Promise<void>;
  updateQuestion: (id: string, request: UpdateQuestionRequest) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  closeQuestion: (id: string, request: CloseQuestionRequest) => Promise<void>;
  setFilters: (filters: QuestionFilter) => void;
  clearError: () => void;
}

export interface UseQAAnswers {
  answers: Answer[];
  loading: boolean;
  error: string | null;
  
  loadAnswers: (questionId: string, filter?: AnswerFilter) => Promise<void>;
  createAnswer: (request: CreateAnswerRequest) => Promise<void>;
  updateAnswer: (id: string, request: UpdateAnswerRequest) => Promise<void>;
  deleteAnswer: (id: string) => Promise<void>;
  acceptAnswer: (id: string) => Promise<void>;
  clearError: () => void;
}

export interface UseQAVoting {
  userVotes: { [contentId: string]: 'Up' | 'Down' };
  loading: boolean;
  error: string | null;
  
  vote: (request: CreateVoteRequest) => Promise<void>;
  removeVote: (contentId: string, contentType: 'Question' | 'Answer') => Promise<void>;
  changeVote: (contentId: string, contentType: 'Question' | 'Answer', voteType: 'Up' | 'Down') => Promise<void>;
  getUserVotes: (filter?: VoteFilter) => Promise<void>;
  clearError: () => void;
}

export interface UseQAReputation {
  currentUser: UserReputation | null;
  leaderboard: UserReputation[];
  history: ReputationHistory[];
  loading: boolean;
  error: string | null;
  
  loadUserReputation: (userId?: string) => Promise<void>;
  loadLeaderboard: (count?: number) => Promise<void>;
  loadHistory: (userId?: string, pageNumber?: number, pageSize?: number) => Promise<void>;
  updateExpertiseAreas: (areas: string[]) => Promise<void>;
  clearError: () => void;
}

export interface UseQASearch {
  results: (QuestionList | Answer)[];
  suggestions: string[];
  loading: boolean;
  error: string | null;
  lastQuery: string;
  
  search: (filter: SearchFilter) => Promise<void>;
  searchQuestions: (filter: SearchFilter) => Promise<void>;
  searchAnswers: (filter: SearchFilter) => Promise<void>;
  getSuggestions: (query: string) => Promise<void>;
  clearSearch: () => void;
  clearError: () => void;
}

// React-specific component prop interfaces
export interface QAComponentProps {
  className?: string;
  loading?: boolean;
  error?: string | null;
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
}

export interface QuestionListProps extends QAComponentProps {
  questions: QuestionList[];
  pagination: any;
  filters: QuestionFilter;
  onFilterChange: (filters: QuestionFilter) => void;
  onPageChange: (page: number) => void;
  onQuestionClick: (question: QuestionList) => void;
  onQuestionCreate?: () => void;
}

export interface QuestionDetailProps extends QAComponentProps {
  question: QuestionDetail;
  answers: Answer[];
  userVote?: 'Up' | 'Down';
  canEdit: boolean;
  canClose: boolean;
  onVote: (voteType: 'Up' | 'Down') => void;
  onEdit: () => void;
  onClose: () => void;
  onAnswerSubmit: (content: string) => void;
}

export interface AnswerProps extends QAComponentProps {
  answer: Answer;
  userVote?: 'Up' | 'Down';
  canEdit: boolean;
  canAccept: boolean;
  onVote: (voteType: 'Up' | 'Down') => void;
  onEdit: () => void;
  onAccept: () => void;
  onDelete: () => void;
}

export interface VotingProps extends QAComponentProps {
  contentId: string;
  contentType: 'Question' | 'Answer';
  voteScore: number;
  upvotesCount: number;
  downvotesCount: number;
  userVote?: 'Up' | 'Down';
  onVote: (voteType: 'Up' | 'Down') => void;
  disabled?: boolean;
}

// React-specific form interfaces
export interface QuestionFormProps extends QAComponentProps {
  initialData?: Partial<QuestionFormData>;
  categories: Category[];
  tags: Tag[];
  onSubmit: (data: QuestionFormData) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export interface AnswerFormProps extends QAComponentProps {
  initialData?: Partial<AnswerFormData>;
  onSubmit: (data: AnswerFormData) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export interface SearchFormProps extends QAComponentProps {
  initialData?: Partial<SearchFormData>;
  categories: Category[];
  tags: Tag[];
  onSubmit: (data: SearchFormData) => void;
  onReset: () => void;
}

export interface QuestionFormData {
  title: string;
  content: string;
  category: string;
  tags: string[];
  isScheduled: boolean;
  scheduledAt?: Date;
}

export interface AnswerFormData {
  content: string;
  editReason?: string;
}

export interface SearchFormData {
  searchTerm: string;
  categories: string[];
  tags: string[];
  contentTypes: ('Question' | 'Answer')[];
  dateFrom?: Date;
  dateTo?: Date;
  minVoteScore?: number;
  hasAcceptedAnswer?: boolean;
}

// React-specific validation interfaces
export interface QAValidationSchema {
  question: {
    title: {
      required: boolean;
      minLength: number;
      maxLength: number;
      pattern?: RegExp;
    };
    content: {
      required: boolean;
      minLength: number;
      maxLength: number;
    };
    category: {
      required: boolean;
    };
    tags: {
      minCount: number;
      maxCount: number;
      maxLength: number;
    };
  };
  answer: {
    content: {
      required: boolean;
      minLength: number;
      maxLength: number;
    };
  };
}

// React-specific configuration interfaces
export interface QADashboardConfig {
  apiBaseUrl: string;
  pageSize: number;
  maxTagsPerQuestion: number;
  maxQuestionTitleLength: number;
  maxContentLength: number;
  minContentLength: number;
  voteRateLimit: number;
  searchDebounceTime: number;
  autoSaveInterval: number;
  enableRealTimeUpdates: boolean;
  enableNotifications: boolean;
  moderationFeatures: {
    enableBulkActions: boolean;
    enableContentModeration: boolean;
    enableUserManagement: boolean;
    enableAnalytics: boolean;
  };
}

// React-specific admin/moderation interfaces
export interface QAModerationActions {
  bulkDeleteQuestions: (questionIds: string[]) => Promise<void>;
  bulkCloseQuestions: (questionIds: string[], reason: string) => Promise<void>;
  bulkDeleteAnswers: (answerIds: string[]) => Promise<void>;
  flagContent: (contentId: string, contentType: 'Question' | 'Answer', reason: string) => Promise<void>;
  unflagContent: (contentId: string, contentType: 'Question' | 'Answer') => Promise<void>;
  adjustUserReputation: (userId: string, adjustment: number, reason: string) => Promise<void>;
  awardBadge: (userId: string, badgeType: string) => Promise<void>;
  banUser: (userId: string, duration: number, reason: string) => Promise<void>;
  unbanUser: (userId: string) => Promise<void>;
}