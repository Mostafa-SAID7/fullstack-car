// Angular-specific QA API interfaces for the Main application
// This file imports internal types and adds Angular-specific patterns

import { Observable } from 'rxjs';
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
} from '../types/qa-api.types';

// Angular-specific service interfaces using RxJS Observables
export interface IQAQuestionService {
  // Question CRUD operations
  getQuestions(filter?: QuestionFilter): Observable<PaginatedApiResponse<QuestionList>>;
  getQuestion(id: string): Observable<ApiResponse<Question>>;
  getQuestionDetail(id: string): Observable<ApiResponse<QuestionDetail>>;
  createQuestion(request: CreateQuestionRequest): Observable<ApiResponse<Question>>;
  updateQuestion(id: string, request: UpdateQuestionRequest): Observable<ApiResponse<Question>>;
  deleteQuestion(id: string): Observable<ApiResponse<void>>;
  closeQuestion(id: string, request: CloseQuestionRequest): Observable<ApiResponse<void>>;
  
  // Question search and discovery
  searchQuestions(filter: SearchFilter): Observable<PaginatedApiResponse<QuestionList>>;
  getSimilarQuestions(id: string): Observable<ApiResponse<QuestionSimilarity[]>>;
  getMyQuestions(filter?: QuestionFilter): Observable<PaginatedApiResponse<QuestionList>>;
  
  // Question interactions
  viewQuestion(id: string): Observable<ApiResponse<void>>;
}

export interface IQAAnswerService {
  // Answer CRUD operations
  getAnswersByQuestion(questionId: string, filter?: AnswerFilter): Observable<PaginatedApiResponse<Answer>>;
  getAnswer(id: string): Observable<ApiResponse<Answer>>;
  createAnswer(request: CreateAnswerRequest): Observable<ApiResponse<Answer>>;
  updateAnswer(id: string, request: UpdateAnswerRequest): Observable<ApiResponse<Answer>>;
  deleteAnswer(id: string): Observable<ApiResponse<void>>;
  acceptAnswer(id: string): Observable<ApiResponse<void>>;
  
  // Answer queries
  getMyAnswers(filter?: AnswerFilter): Observable<PaginatedApiResponse<Answer>>;
  getAnswerVersionHistory(id: string): Observable<ApiResponse<Answer>>;
}

export interface IQAVotingService {
  // Voting operations
  createVote(request: CreateVoteRequest): Observable<ApiResponse<Vote>>;
  removeVote(contentId: string, contentType: 'Question' | 'Answer'): Observable<ApiResponse<void>>;
  changeVote(contentId: string, contentType: 'Question' | 'Answer', voteType: 'Up' | 'Down'): Observable<ApiResponse<Vote>>;
  
  // Vote queries
  getUserVotes(filter?: VoteFilter): Observable<PaginatedApiResponse<Vote>>;
  getContentVotes(contentId: string, contentType: 'Question' | 'Answer'): Observable<ApiResponse<Vote[]>>;
}

export interface IQAReputationService {
  // Reputation queries
  getUserReputation(userId?: string): Observable<ApiResponse<UserReputation>>;
  getReputationLeaderboard(count?: number): Observable<ApiResponse<UserReputation[]>>;
  getReputationHistory(userId?: string, pageNumber?: number, pageSize?: number): Observable<PaginatedApiResponse<ReputationHistory>>;
  
  // Expert system
  getExpertsByCategory(category: string): Observable<ApiResponse<Expert[]>>;
  getTopExperts(count?: number): Observable<ApiResponse<Expert[]>>;
  updateExpertiseAreas(areas: string[]): Observable<ApiResponse<UserReputation>>;
}

export interface IQACategoryService {
  // Category operations
  getCategories(): Observable<ApiResponse<Category[]>>;
  getCategory(id: string): Observable<ApiResponse<Category>>;
  getCategoryExperts(categoryId: string): Observable<ApiResponse<Expert[]>>;
  getCategoryStats(categoryId: string): Observable<ApiResponse<any>>;
}

export interface IQATagService {
  // Tag operations
  getTags(search?: string): Observable<ApiResponse<Tag[]>>;
  getPopularTags(count?: number): Observable<ApiResponse<PopularTag[]>>;
  getTagsByCategory(categoryId: string): Observable<ApiResponse<Tag[]>>;
  searchTags(query: string): Observable<ApiResponse<Tag[]>>;
}

export interface IQASearchService {
  // Search operations
  searchContent(filter: SearchFilter): Observable<PaginatedApiResponse<QuestionList | Answer>>;
  searchQuestions(filter: SearchFilter): Observable<PaginatedApiResponse<QuestionList>>;
  searchAnswers(filter: SearchFilter): Observable<PaginatedApiResponse<Answer>>;
  
  // Search suggestions
  getSearchSuggestions(query: string): Observable<ApiResponse<string[]>>;
  getRelatedContent(contentId: string, contentType: 'Question' | 'Answer'): Observable<ApiResponse<any[]>>;
}

// Angular-specific state management interfaces
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

// Angular-specific action interfaces
export interface QAActions {
  // Question actions
  loadQuestions: (filter?: QuestionFilter) => void;
  loadQuestion: (id: string) => void;
  createQuestion: (request: CreateQuestionRequest) => void;
  updateQuestion: (id: string, request: UpdateQuestionRequest) => void;
  deleteQuestion: (id: string) => void;
  closeQuestion: (id: string, request: CloseQuestionRequest) => void;
  
  // Answer actions
  loadAnswers: (questionId: string, filter?: AnswerFilter) => void;
  createAnswer: (request: CreateAnswerRequest) => void;
  updateAnswer: (id: string, request: UpdateAnswerRequest) => void;
  deleteAnswer: (id: string) => void;
  acceptAnswer: (id: string) => void;
  
  // Voting actions
  vote: (request: CreateVoteRequest) => void;
  removeVote: (contentId: string, contentType: 'Question' | 'Answer') => void;
  changeVote: (contentId: string, contentType: 'Question' | 'Answer', voteType: 'Up' | 'Down') => void;
  
  // Search actions
  search: (filter: SearchFilter) => void;
  clearSearch: () => void;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Angular-specific component interfaces
export interface QAComponentBase {
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  handleError(error: any): void;
  showSuccess(message: string): void;
  showError(message: string): void;
}

export interface QuestionListComponent extends QAComponentBase {
  questions$: Observable<QuestionList[]>;
  pagination$: Observable<any>;
  filters$: Observable<QuestionFilter>;
  
  onFilterChange(filters: QuestionFilter): void;
  onPageChange(page: number): void;
  onQuestionClick(question: QuestionList): void;
}

export interface QuestionDetailComponent extends QAComponentBase {
  question$: Observable<QuestionDetail | null>;
  answers$: Observable<Answer[]>;
  userVote$: Observable<string | null>;
  canEdit$: Observable<boolean>;
  canClose$: Observable<boolean>;
  
  onVote(voteType: 'Up' | 'Down'): void;
  onEdit(): void;
  onClose(): void;
  onAnswerSubmit(content: string): void;
}

export interface AnswerComponent extends QAComponentBase {
  answer: Answer;
  userVote$: Observable<string | null>;
  canEdit$: Observable<boolean>;
  canAccept$: Observable<boolean>;
  
  onVote(voteType: 'Up' | 'Down'): void;
  onEdit(): void;
  onAccept(): void;
  onDelete(): void;
}

// Angular-specific form interfaces
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

// Angular-specific validation interfaces
export interface QAValidationRules {
  question: {
    title: {
      required: boolean;
      minLength: number;
      maxLength: number;
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

// Angular-specific configuration interfaces
export interface QAConfig {
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
}