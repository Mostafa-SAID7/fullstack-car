import { ApiService } from '../api/ApiService';
import type { ApiResult } from '../../types/api';
import type {
  ApiResponse,
  PaginatedApiResponse,
  Question,
  QuestionList,
  QuestionDetail,
  QuestionSimilarity,
  QuestionFilter,
  SearchFilter,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  CloseQuestionRequest
} from '../../types/qa/api-types';
import { QA_API_ENDPOINTS } from '../../types/qa/api-types';
import type { QAQuestionService as IQAQuestionService } from '../../types/qa/api';

export class QAQuestionService extends ApiService implements IQAQuestionService {
  private readonly baseUrl = QA_API_ENDPOINTS.QUESTIONS.BASE;

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
    const endpoint = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    
    const result = await this.get<any>(endpoint);
    return this.convertToPaginatedApiResponse<QuestionList>(result);
  }

  async getQuestion(id: string): Promise<ApiResponse<Question>> {
    const result = await this.get<Question>(`${this.baseUrl}/${id}`);
    return this.convertToApiResponse(result);
  }

  async getQuestionDetail(id: string): Promise<ApiResponse<QuestionDetail>> {
    const result = await this.get<QuestionDetail>(`${this.baseUrl}/${id}`);
    return this.convertToApiResponse(result);
  }

  async createQuestion(request: CreateQuestionRequest): Promise<ApiResponse<Question>> {
    const result = await this.post<Question>(this.baseUrl, request);
    return this.convertToApiResponse(result);
  }

  async updateQuestion(id: string, request: UpdateQuestionRequest): Promise<ApiResponse<Question>> {
    const result = await this.put<Question>(`${this.baseUrl}/${id}`, request);
    return this.convertToApiResponse(result);
  }

  async deleteQuestion(id: string): Promise<ApiResponse<void>> {
    const result = await this.delete<void>(`${this.baseUrl}/${id}`);
    return this.convertToApiResponse(result);
  }

  async closeQuestion(id: string, request: CloseQuestionRequest): Promise<ApiResponse<void>> {
    const result = await this.post<void>(`${this.baseUrl}/${id}/close`, request);
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
    const result = await this.post<void>(`${this.baseUrl}/${id}/view`, {});
    return this.convertToApiResponse(result);
  }

  // Utility methods for React-specific functionality
  async getQuestionsWithErrorHandling(filter?: QuestionFilter): Promise<QuestionList[]> {
    try {
      const response = await this.getQuestions(filter);
      if (response.succeeded && response.data) {
        return response.data.items;
      }
      throw new Error(response.message || 'Failed to retrieve questions');
    } catch (error) {
      this.handleApiError(error);
      return [];
    }
  }

  async createQuestionWithErrorHandling(request: CreateQuestionRequest): Promise<Question | null> {
    try {
      const response = await this.createQuestion(request);
      if (response.succeeded && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to create question');
    } catch (error) {
      this.handleApiError(error);
      return null;
    }
  }

  async searchQuestionsWithErrorHandling(filter: SearchFilter): Promise<QuestionList[]> {
    try {
      const response = await this.searchQuestions(filter);
      if (response.succeeded && response.data) {
        return response.data.items;
      }
      throw new Error(response.message || 'Search failed');
    } catch (error) {
      this.handleApiError(error);
      return [];
    }
  }

  // React-specific helper methods
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

  validateUpdateRequest(request: UpdateQuestionRequest): string[] {
    const errors: string[] = [];
    
    if (request.title && request.title.trim().length < 10) {
      errors.push('Title must be at least 10 characters long');
    }
    
    if (request.content && request.content.trim().length < 30) {
      errors.push('Content must be at least 30 characters long');
    }
    
    if (request.tags && request.tags.length > 5) {
      errors.push('Maximum 5 tags allowed');
    }
    
    return errors;
  }
}