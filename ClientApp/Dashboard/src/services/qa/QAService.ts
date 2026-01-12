import { ApiService } from '../api/ApiService';
import type { ApiResult } from '../../types/api';
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
  CloseQuestionRequest,
  QAAnalytics,
  FlaggedContent,
  ModerationAction,
  BulkModerationRequest,
  UserModerationInfo
} from '../../types/qa/api-types';
import { QA_API_ENDPOINTS } from '../../types/qa/api-types';
import type {
  QAQuestionService,
  QAAnswerService,
  QAVotingService,
  QAReputationService,
  QACategoryService,
  QATagService,
  QASearchService,
  QAModerationActions
} from '../../types/qa/api';

/**
 * Unified QA Service extending existing ApiService patterns
 * Provides comprehensive QA functionality for React Dashboard
 * Follows existing service architecture and error handling patterns
 */
export class QAService extends ApiService implements 
  QAQuestionService, 
  QAAnswerService, 
  QAVotingService, 
  QAReputationService, 
  QACategoryService, 
  QATagService, 
  QASearchService, 
  QAModerationActions {

  // Convert ApiResult to ApiResponse by adding timestamp
  private convertToApiResponse<T>(result: ApiResult<T>): ApiResponse<T> {
    return {
      succeeded: result.succeeded,
      data: result.data,
      message: result.message,
      errors: result.errors || [],
      statusCode: result.statusCode,
      timestamp: new Date().toISOString()
    };
  }

  // Convert ApiResult with pagination to PaginatedApiResponse
  private convertToPaginatedApiResponse<T>(result: ApiResult<any>): PaginatedApiResponse<T> {
    return {
      succeeded: result.succeeded,
      data: result.data,
      message: result.message,
      errors: result.errors || [],
      statusCode: result.statusCode,
      timestamp: new Date().toISOString()
    };
  }

  // ============================================================================
  // QUESTION SERVICE IMPLEMENTATION
  // ============================================================================

  async getQuestions(filter?: QuestionFilter): Promise<PaginatedApiResponse<QuestionList>> {
    const params: Record<string, any> = {};
    
    if (filter) {
      if (filter.pageNumber) params.pageNumber = filter.pageNumber;
      if (filter.pageSize) params.pageSize = filter.pageSize;
      if (filter.sortBy) params.sortBy = filter.sortBy;
      if (filter.sortDirection) params.sortDirection = filter.sortDirection;
      if (filter.searchTerm) params.searchTerm = filter.searchTerm;
      if (filter.category) params.category = filter.category;
      if (filter.status) params.status = filter.status;
      if (filter.hasAcceptedAnswer !== undefined) params.hasAcceptedAnswer = filter.hasAcceptedAnswer;
      if (filter.minVoteScore !== undefined) params.minVoteScore = filter.minVoteScore;
      if (filter.maxVoteScore !== undefined) params.maxVoteScore = filter.maxVoteScore;
      if (filter.dateFrom) params.dateFrom = filter.dateFrom;
      if (filter.dateTo) params.dateTo = filter.dateTo;
      if (filter.includeScheduled !== undefined) params.includeScheduled = filter.includeScheduled;
      if (filter.tags && filter.tags.length > 0) params.tags = filter.tags;
    }

    const queryString = this.buildQueryString(params);
    const endpoint = queryString ? `${QA_API_ENDPOINTS.QUESTIONS.BASE}?${queryString}` : QA_API_ENDPOINTS.QUESTIONS.BASE;
    
    const result = await this.get<any>(endpoint);
    return this.convertToPaginatedApiResponse<QuestionList>(result);
  }

  async getQuestion(id: string): Promise<ApiResponse<Question>> {
    const result = await this.get<Question>(`${QA_API_ENDPOINTS.QUESTIONS.BASE}/${id}`);
    return this.convertToApiResponse(result);
  }

  async getQuestionDetail(id: string): Promise<ApiResponse<QuestionDetail>> {
    const result = await this.get<QuestionDetail>(`${QA_API_ENDPOINTS.QUESTIONS.BASE}/${id}`);
    return this.convertToApiResponse(result);
  }

  async createQuestion(request: CreateQuestionRequest): Promise<ApiResponse<Question>> {
    const result = await this.post<Question>(QA_API_ENDPOINTS.QUESTIONS.BASE, request);
    return this.convertToApiResponse(result);
  }

  async updateQuestion(id: string, request: UpdateQuestionRequest): Promise<ApiResponse<Question>> {
    const result = await this.put<Question>(`${QA_API_ENDPOINTS.QUESTIONS.BASE}/${id}`, request);
    return this.convertToApiResponse(result);
  }

  async deleteQuestion(id: string): Promise<ApiResponse<void>> {
    const result = await this.delete<void>(`${QA_API_ENDPOINTS.QUESTIONS.BASE}/${id}`);
    return this.convertToApiResponse(result);
  }

  async closeQuestion(id: string, request: CloseQuestionRequest): Promise<ApiResponse<void>> {
    const result = await this.post<void>(QA_API_ENDPOINTS.QUESTIONS.CLOSE(id), request);
    return this.convertToApiResponse(result);
  }

  async searchQuestions(filter: SearchFilter): Promise<PaginatedApiResponse<QuestionList>> {
    const params: Record<string, any> = {};
    
    if (filter.pageNumber) params.pageNumber = filter.pageNumber;
    if (filter.pageSize) params.pageSize = filter.pageSize;
    if (filter.sortBy) params.sortBy = filter.sortBy;
    if (filter.sortDirection) params.sortDirection = filter.sortDirection;
    if (filter.searchTerm) params.searchTerm = filter.searchTerm;
    if (filter.minVoteScore !== undefined) params.minVoteScore = filter.minVoteScore;
    if (filter.hasAcceptedAnswer !== undefined) params.hasAcceptedAnswer = filter.hasAcceptedAnswer;
    if (filter.dateFrom) params.dateFrom = filter.dateFrom;
    if (filter.dateTo) params.dateTo = filter.dateTo;
    if (filter.includeContent !== undefined) params.includeContent = filter.includeContent;
    if (filter.includeTags !== undefined) params.includeTags = filter.includeTags;
    if (filter.includeUserInfo !== undefined) params.includeUserInfo = filter.includeUserInfo;
    if (filter.categories && filter.categories.length > 0) params.categories = filter.categories;
    if (filter.tags && filter.tags.length > 0) params.tags = filter.tags;
    if (filter.contentTypes && filter.contentTypes.length > 0) params.contentTypes = filter.contentTypes;

    const queryString = this.buildQueryString(params);
    const endpoint = queryString ? `${QA_API_ENDPOINTS.QUESTIONS.SEARCH}?${queryString}` : QA_API_ENDPOINTS.QUESTIONS.SEARCH;
    
    const result = await this.get<any>(endpoint);
    return this.convertToPaginatedApiResponse<QuestionList>(result);
  }

  async getSimilarQuestions(id: string): Promise<ApiResponse<QuestionSimilarity[]>> {
    const result = await this.get<QuestionSimilarity[]>(QA_API_ENDPOINTS.QUESTIONS.SIMILAR(id));
    return this.convertToApiResponse(result);
  }

  async getMyQuestions(filter?: QuestionFilter): Promise<PaginatedApiResponse<QuestionList>> {
    const params: Record<string, any> = {};
    
    if (filter) {
      if (filter.pageNumber) params.pageNumber = filter.pageNumber;
      if (filter.pageSize) params.pageSize = filter.pageSize;
      if (filter.sortBy) params.sortBy = filter.sortBy;
      if (filter.sortDirection) params.sortDirection = filter.sortDirection;
      if (filter.searchTerm) params.searchTerm = filter.searchTerm;
      if (filter.category) params.category = filter.category;
      if (filter.status) params.status = filter.status;
      if (filter.hasAcceptedAnswer !== undefined) params.hasAcceptedAnswer = filter.hasAcceptedAnswer;
      if (filter.dateFrom) params.dateFrom = filter.dateFrom;
      if (filter.dateTo) params.dateTo = filter.dateTo;
      if (filter.tags && filter.tags.length > 0) params.tags = filter.tags;
    }

    const queryString = this.buildQueryString(params);
    const endpoint = queryString ? `${QA_API_ENDPOINTS.QUESTIONS.MY_QUESTIONS}?${queryString}` : QA_API_ENDPOINTS.QUESTIONS.MY_QUESTIONS;
    
    const result = await this.get<any>(endpoint);
    return this.convertToPaginatedApiResponse<QuestionList>(result);
  }

  async viewQuestion(id: string): Promise<ApiResponse<void>> {
    const result = await this.post<void>(`${QA_API_ENDPOINTS.QUESTIONS.BASE}/${id}/view`, {});
    return this.convertToApiResponse(result);
  }

  // ============================================================================
  // ANSWER SERVICE IMPLEMENTATION
  // ============================================================================

  async getAnswersByQuestion(questionId: string, filter?: AnswerFilter): Promise<PaginatedApiResponse<Answer>> {
    const params: Record<string, any> = {};
    
    if (filter) {
      if (filter.pageNumber) params.pageNumber = filter.pageNumber;
      if (filter.pageSize) params.pageSize = filter.pageSize;
      if (filter.sortBy) params.sortBy = filter.sortBy;
      if (filter.sortDirection) params.sortDirection = filter.sortDirection;
      if (filter.isAccepted !== undefined) params.isAccepted = filter.isAccepted;
      if (filter.minVoteScore !== undefined) params.minVoteScore = filter.minVoteScore;
      if (filter.maxVoteScore !== undefined) params.maxVoteScore = filter.maxVoteScore;
      if (filter.dateFrom) params.dateFrom = filter.dateFrom;
      if (filter.dateTo) params.dateTo = filter.dateTo;
    }

    const queryString = this.buildQueryString(params);
    const endpoint = queryString ? `${QA_API_ENDPOINTS.ANSWERS.BY_QUESTION(questionId)}?${queryString}` : QA_API_ENDPOINTS.ANSWERS.BY_QUESTION(questionId);
    
    const result = await this.get<any>(endpoint);
    return this.convertToPaginatedApiResponse<Answer>(result);
  }

  async getAnswer(id: string): Promise<ApiResponse<Answer>> {
    const result = await this.get<Answer>(`${QA_API_ENDPOINTS.ANSWERS.BASE}/${id}`);
    return this.convertToApiResponse(result);
  }

  async createAnswer(request: CreateAnswerRequest): Promise<ApiResponse<Answer>> {
    const result = await this.post<Answer>(QA_API_ENDPOINTS.ANSWERS.BASE, request);
    return this.convertToApiResponse(result);
  }

  async updateAnswer(id: string, request: UpdateAnswerRequest): Promise<ApiResponse<Answer>> {
    const result = await this.put<Answer>(`${QA_API_ENDPOINTS.ANSWERS.BASE}/${id}`, request);
    return this.convertToApiResponse(result);
  }

  async deleteAnswer(id: string): Promise<ApiResponse<void>> {
    const result = await this.delete<void>(`${QA_API_ENDPOINTS.ANSWERS.BASE}/${id}`);
    return this.convertToApiResponse(result);
  }

  async acceptAnswer(id: string): Promise<ApiResponse<void>> {
    const result = await this.post<void>(QA_API_ENDPOINTS.ANSWERS.ACCEPT(id), {});
    return this.convertToApiResponse(result);
  }

  async getMyAnswers(filter?: AnswerFilter): Promise<PaginatedApiResponse<Answer>> {
    const params: Record<string, any> = {};
    
    if (filter) {
      if (filter.pageNumber) params.pageNumber = filter.pageNumber;
      if (filter.pageSize) params.pageSize = filter.pageSize;
      if (filter.sortBy) params.sortBy = filter.sortBy;
      if (filter.sortDirection) params.sortDirection = filter.sortDirection;
      if (filter.isAccepted !== undefined) params.isAccepted = filter.isAccepted;
      if (filter.minVoteScore !== undefined) params.minVoteScore = filter.minVoteScore;
      if (filter.dateFrom) params.dateFrom = filter.dateFrom;
      if (filter.dateTo) params.dateTo = filter.dateTo;
    }

    const queryString = this.buildQueryString(params);
    const endpoint = queryString ? `${QA_API_ENDPOINTS.ANSWERS.MY_ANSWERS}?${queryString}` : QA_API_ENDPOINTS.ANSWERS.MY_ANSWERS;
    
    const result = await this.get<any>(endpoint);
    return this.convertToPaginatedApiResponse<Answer>(result);
  }

  async getAnswerVersionHistory(id: string): Promise<ApiResponse<Answer>> {
    const result = await this.get<Answer>(`${QA_API_ENDPOINTS.ANSWERS.BASE}/${id}/history`);
    return this.convertToApiResponse(result);
  }

  // ============================================================================
  // VOTING SERVICE IMPLEMENTATION
  // ============================================================================

  async createVote(request: CreateVoteRequest): Promise<ApiResponse<Vote>> {
    const result = await this.post<Vote>(QA_API_ENDPOINTS.VOTES.BASE, request);
    return this.convertToApiResponse(result);
  }

  async removeVote(contentId: string, contentType: 'Question' | 'Answer'): Promise<ApiResponse<void>> {
    const result = await this.delete<void>(`${QA_API_ENDPOINTS.VOTES.BASE}/${contentId}/${contentType}`);
    return this.convertToApiResponse(result);
  }

  async changeVote(contentId: string, contentType: 'Question' | 'Answer', voteType: 'Up' | 'Down'): Promise<ApiResponse<Vote>> {
    const request: CreateVoteRequest = { contentId, contentType, voteType };
    const result = await this.put<Vote>(`${QA_API_ENDPOINTS.VOTES.BASE}/${contentId}/${contentType}`, request);
    return this.convertToApiResponse(result);
  }

  async getUserVotes(filter?: VoteFilter): Promise<PaginatedApiResponse<Vote>> {
    const params: Record<string, any> = {};
    
    if (filter) {
      if (filter.pageNumber) params.pageNumber = filter.pageNumber;
      if (filter.pageSize) params.pageSize = filter.pageSize;
      if (filter.sortBy) params.sortBy = filter.sortBy;
      if (filter.sortDirection) params.sortDirection = filter.sortDirection;
      if (filter.contentType) params.contentType = filter.contentType;
      if (filter.voteType) params.voteType = filter.voteType;
      if (filter.dateFrom) params.dateFrom = filter.dateFrom;
      if (filter.dateTo) params.dateTo = filter.dateTo;
    }

    const queryString = this.buildQueryString(params);
    const endpoint = queryString ? `${QA_API_ENDPOINTS.VOTES.MY_VOTES}?${queryString}` : QA_API_ENDPOINTS.VOTES.MY_VOTES;
    
    const result = await this.get<any>(endpoint);
    return this.convertToPaginatedApiResponse<Vote>(result);
  }

  async getContentVotes(contentId: string, contentType: 'Question' | 'Answer'): Promise<ApiResponse<Vote[]>> {
    const result = await this.get<Vote[]>(`${QA_API_ENDPOINTS.VOTES.BASE}/${contentId}/${contentType}`);
    return this.convertToApiResponse(result);
  }

  // ============================================================================
  // REPUTATION SERVICE IMPLEMENTATION
  // ============================================================================

  async getUserReputation(userId?: string): Promise<ApiResponse<UserReputation>> {
    const endpoint = userId ? `${QA_API_ENDPOINTS.REPUTATION.BASE}/${userId}` : QA_API_ENDPOINTS.REPUTATION.BASE;
    const result = await this.get<UserReputation>(endpoint);
    return this.convertToApiResponse(result);
  }

  async getReputationLeaderboard(count?: number): Promise<ApiResponse<UserReputation[]>> {
    const params: Record<string, any> = {};
    if (count) params.count = count;
    
    const queryString = this.buildQueryString(params);
    const endpoint = queryString ? `${QA_API_ENDPOINTS.REPUTATION.LEADERBOARD}?${queryString}` : QA_API_ENDPOINTS.REPUTATION.LEADERBOARD;
    
    const result = await this.get<UserReputation[]>(endpoint);
    return this.convertToApiResponse(result);
  }

  async getReputationHistory(userId?: string, pageNumber?: number, pageSize?: number): Promise<PaginatedApiResponse<ReputationHistory>> {
    const params: Record<string, any> = {};
    if (pageNumber) params.pageNumber = pageNumber;
    if (pageSize) params.pageSize = pageSize;
    
    const queryString = this.buildQueryString(params);
    const endpoint = userId ? QA_API_ENDPOINTS.REPUTATION.HISTORY(userId) : `${QA_API_ENDPOINTS.REPUTATION.BASE}/history`;
    const finalEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    const result = await this.get<any>(finalEndpoint);
    return this.convertToPaginatedApiResponse<ReputationHistory>(result);
  }

  async getExpertsByCategory(category: string): Promise<ApiResponse<Expert[]>> {
    const result = await this.get<Expert[]>(`${QA_API_ENDPOINTS.REPUTATION.EXPERTS}?category=${encodeURIComponent(category)}`);
    return this.convertToApiResponse(result);
  }

  async getTopExperts(count?: number): Promise<ApiResponse<Expert[]>> {
    const params: Record<string, any> = {};
    if (count) params.count = count;
    
    const queryString = this.buildQueryString(params);
    const endpoint = queryString ? `${QA_API_ENDPOINTS.REPUTATION.EXPERTS}?${queryString}` : QA_API_ENDPOINTS.REPUTATION.EXPERTS;
    
    const result = await this.get<Expert[]>(endpoint);
    return this.convertToApiResponse(result);
  }

  async updateExpertiseAreas(areas: string[]): Promise<ApiResponse<UserReputation>> {
    const result = await this.put<UserReputation>(`${QA_API_ENDPOINTS.REPUTATION.BASE}/expertise`, { areas });
    return this.convertToApiResponse(result);
  }

  // ============================================================================
  // CATEGORY SERVICE IMPLEMENTATION
  // ============================================================================

  async getCategories(): Promise<ApiResponse<Category[]>> {
    const result = await this.get<Category[]>(QA_API_ENDPOINTS.CATEGORIES.BASE);
    return this.convertToApiResponse(result);
  }

  async getCategory(id: string): Promise<ApiResponse<Category>> {
    const result = await this.get<Category>(`${QA_API_ENDPOINTS.CATEGORIES.BASE}/${id}`);
    return this.convertToApiResponse(result);
  }

  async getCategoryExperts(categoryId: string): Promise<ApiResponse<Expert[]>> {
    const result = await this.get<Expert[]>(QA_API_ENDPOINTS.CATEGORIES.EXPERTS(categoryId));
    return this.convertToApiResponse(result);
  }

  async getCategoryStats(categoryId: string): Promise<ApiResponse<any>> {
    const result = await this.get<any>(`${QA_API_ENDPOINTS.CATEGORIES.BASE}/${categoryId}/stats`);
    return this.convertToApiResponse(result);
  }

  // ============================================================================
  // TAG SERVICE IMPLEMENTATION
  // ============================================================================

  async getTags(search?: string): Promise<ApiResponse<Tag[]>> {
    const params: Record<string, any> = {};
    if (search) params.search = search;
    
    const queryString = this.buildQueryString(params);
    const endpoint = queryString ? `${QA_API_ENDPOINTS.TAGS.BASE}?${queryString}` : QA_API_ENDPOINTS.TAGS.BASE;
    
    const result = await this.get<Tag[]>(endpoint);
    return this.convertToApiResponse(result);
  }

  async getPopularTags(count?: number): Promise<ApiResponse<PopularTag[]>> {
    const params: Record<string, any> = {};
    if (count) params.count = count;
    
    const queryString = this.buildQueryString(params);
    const endpoint = queryString ? `${QA_API_ENDPOINTS.TAGS.POPULAR}?${queryString}` : QA_API_ENDPOINTS.TAGS.POPULAR;
    
    const result = await this.get<PopularTag[]>(endpoint);
    return this.convertToApiResponse(result);
  }

  async getTagsByCategory(categoryId: string): Promise<ApiResponse<Tag[]>> {
    const result = await this.get<Tag[]>(`${QA_API_ENDPOINTS.TAGS.BASE}/category/${categoryId}`);
    return this.convertToApiResponse(result);
  }

  async searchTags(query: string): Promise<ApiResponse<Tag[]>> {
    const result = await this.get<Tag[]>(`${QA_API_ENDPOINTS.TAGS.BASE}/search?q=${encodeURIComponent(query)}`);
    return this.convertToApiResponse(result);
  }

  // ============================================================================
  // SEARCH SERVICE IMPLEMENTATION
  // ============================================================================

  async searchContent(filter: SearchFilter): Promise<PaginatedApiResponse<QuestionList | Answer>> {
    return this.searchQuestions(filter) as Promise<PaginatedApiResponse<QuestionList | Answer>>;
  }

  async searchAnswers(filter: SearchFilter): Promise<PaginatedApiResponse<Answer>> {
    const params: Record<string, any> = {};
    
    if (filter.pageNumber) params.pageNumber = filter.pageNumber;
    if (filter.pageSize) params.pageSize = filter.pageSize;
    if (filter.sortBy) params.sortBy = filter.sortBy;
    if (filter.sortDirection) params.sortDirection = filter.sortDirection;
    if (filter.searchTerm) params.searchTerm = filter.searchTerm;
    if (filter.minVoteScore !== undefined) params.minVoteScore = filter.minVoteScore;
    if (filter.hasAcceptedAnswer !== undefined) params.hasAcceptedAnswer = filter.hasAcceptedAnswer;
    if (filter.dateFrom) params.dateFrom = filter.dateFrom;
    if (filter.dateTo) params.dateTo = filter.dateTo;
    if (filter.categories && filter.categories.length > 0) params.categories = filter.categories;
    if (filter.tags && filter.tags.length > 0) params.tags = filter.tags;

    const queryString = this.buildQueryString(params);
    const endpoint = queryString ? `${QA_API_ENDPOINTS.ANSWERS.BASE}/search?${queryString}` : `${QA_API_ENDPOINTS.ANSWERS.BASE}/search`;
    
    const result = await this.get<any>(endpoint);
    return this.convertToPaginatedApiResponse<Answer>(result);
  }

  async getSearchSuggestions(query: string): Promise<ApiResponse<string[]>> {
    const result = await this.get<string[]>(`/api/v7/qa/search/suggestions?q=${encodeURIComponent(query)}`);
    return this.convertToApiResponse(result);
  }

  async getRelatedContent(contentId: string, contentType: 'Question' | 'Answer'): Promise<ApiResponse<any[]>> {
    const result = await this.get<any[]>(`/api/v7/qa/search/related/${contentType}/${contentId}`);
    return this.convertToApiResponse(result);
  }

  // ============================================================================
  // MODERATION SERVICE IMPLEMENTATION (Dashboard-specific)
  // ============================================================================

  async bulkDeleteQuestions(questionIds: string[]): Promise<void> {
    const request: BulkModerationRequest = {
      action: 'delete',
      contentIds: questionIds,
      reason: 'Bulk deletion',
      contentType: 'Question'
    };
    await this.post<void>('/api/v7/qa/moderation/bulk', request);
  }

  async bulkCloseQuestions(questionIds: string[], reason: string): Promise<void> {
    const request: BulkModerationRequest = {
      action: 'close',
      contentIds: questionIds,
      reason,
      contentType: 'Question'
    };
    await this.post<void>('/api/v7/qa/moderation/bulk', request);
  }

  async bulkDeleteAnswers(answerIds: string[]): Promise<void> {
    const request: BulkModerationRequest = {
      action: 'delete',
      contentIds: answerIds,
      reason: 'Bulk deletion',
      contentType: 'Answer'
    };
    await this.post<void>('/api/v7/qa/moderation/bulk', request);
  }

  async flagContent(contentId: string, contentType: 'Question' | 'Answer', reason: string): Promise<void> {
    await this.post<void>('/api/v7/qa/moderation/flag', {
      contentId,
      contentType,
      reason
    });
  }

  async unflagContent(contentId: string, contentType: 'Question' | 'Answer'): Promise<void> {
    await this.post<void>('/api/v7/qa/moderation/unflag', {
      contentId,
      contentType
    });
  }

  async adjustUserReputation(userId: string, adjustment: number, reason: string): Promise<void> {
    await this.post<void>('/api/v7/qa/moderation/reputation', {
      userId,
      adjustment,
      reason
    });
  }

  async awardBadge(userId: string, badgeType: string): Promise<void> {
    await this.post<void>('/api/v7/qa/moderation/badge', {
      userId,
      badgeType
    });
  }

  async banUser(userId: string, duration: number, reason: string): Promise<void> {
    await this.post<void>('/api/v7/qa/moderation/ban', {
      userId,
      duration,
      reason
    });
  }

  async unbanUser(userId: string): Promise<void> {
    await this.post<void>('/api/v7/qa/moderation/unban', {
      userId
    });
  }

  // ============================================================================
  // DASHBOARD ANALYTICS (Dashboard-specific)
  // ============================================================================

  async getQAAnalytics(): Promise<ApiResponse<QAAnalytics>> {
    const result = await this.get<QAAnalytics>('/api/v7/qa/analytics');
    return this.convertToApiResponse(result);
  }

  async getFlaggedContent(): Promise<ApiResponse<FlaggedContent[]>> {
    const result = await this.get<FlaggedContent[]>('/api/v7/qa/moderation/flagged');
    return this.convertToApiResponse(result);
  }

  async getModerationActions(pageNumber?: number, pageSize?: number): Promise<PaginatedApiResponse<ModerationAction>> {
    const params: Record<string, any> = {};
    if (pageNumber) params.pageNumber = pageNumber;
    if (pageSize) params.pageSize = pageSize;
    
    const queryString = this.buildQueryString(params);
    const endpoint = queryString ? `/api/v7/qa/moderation/actions?${queryString}` : '/api/v7/qa/moderation/actions';
    
    const result = await this.get<any>(endpoint);
    return this.convertToPaginatedApiResponse<ModerationAction>(result);
  }

  async getUserModerationInfo(userId: string): Promise<ApiResponse<UserModerationInfo>> {
    const result = await this.get<UserModerationInfo>(`/api/v7/qa/moderation/users/${userId}`);
    return this.convertToApiResponse(result);
  }

  // ============================================================================
  // UTILITY METHODS (React-specific helpers)
  // ============================================================================

  // Error handling helpers following existing patterns
  async withErrorHandling<T>(operation: () => Promise<ApiResponse<T>>): Promise<T> {
    try {
      const result = await operation();
      if (result.succeeded && result.data !== undefined) {
        return result.data;
      }
      throw new Error(result.message || result.errors?.[0] || 'Operation failed');
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  // Validation helpers
  validateQuestionRequest(request: CreateQuestionRequest): string[] {
    const errors: string[] = [];
    
    if (!request.title || request.title.trim().length < 10) {
      errors.push('Title must be at least 10 characters long');
    }
    
    if (!request.content || request.content.trim().length < 30) {
      errors.push('Content must be at least 30 characters long');
    }
    
    if (!request.category || request.category.trim().length === 0) {
      errors.push('Category is required');
    }
    
    if (!request.tags || request.tags.length === 0) {
      errors.push('At least one tag is required');
    }
    
    if (request.tags && request.tags.length > 5) {
      errors.push('Maximum 5 tags allowed');
    }
    
    return errors;
  }

  validateAnswerRequest(request: CreateAnswerRequest): string[] {
    const errors: string[] = [];
    
    if (!request.content || request.content.trim().length < 30) {
      errors.push('Answer must be at least 30 characters long');
    }
    
    if (!request.questionId || request.questionId.trim().length === 0) {
      errors.push('Question ID is required');
    }
    
    return errors;
  }

  // Filter builders following existing patterns
  buildQuestionFilter(
    searchTerm?: string,
    category?: string,
    tags?: string[],
    status?: 'open' | 'closed' | 'answered' | 'unanswered',
    pageNumber: number = 1,
    pageSize: number = 10,
    sortBy: string = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc'
  ): QuestionFilter {
    return {
      searchTerm,
      category,
      tags: tags || [],
      status,
      pageNumber,
      pageSize,
      sortBy,
      sortDirection
    };
  }

  buildSearchFilter(
    searchTerm: string,
    categories?: string[],
    tags?: string[],
    contentTypes?: ('Question' | 'Answer')[],
    pageNumber: number = 1,
    pageSize: number = 10
  ): SearchFilter {
    return {
      searchTerm,
      categories: categories || [],
      tags: tags || [],
      contentTypes: contentTypes || ['Question', 'Answer'],
      pageNumber,
      pageSize,
      sortBy: 'createdAt',
      sortDirection: 'desc',
      includeContent: true,
      includeTags: true,
      includeUserInfo: true
    };
  }
}

// Export singleton instance following existing patterns
export const qaService = new QAService();