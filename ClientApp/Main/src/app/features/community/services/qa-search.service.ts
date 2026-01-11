import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

// QA Types
import type {
  ApiResponse,
  PaginatedApiResponse,
  QuestionList,
  QuestionSimilarity,
  SearchFilter,
  Category,
  Tag,
  PopularTag
} from '../../../shared/types/qa-api.types';
import { QA_API_ENDPOINTS } from '../../../shared/types/qa-api.types';

@Injectable({
  providedIn: 'root'
})
export class QASearchService {
  constructor(private http: HttpClient) {}

  searchQuestions(filter: SearchFilter): Observable<PaginatedApiResponse<QuestionList>> {
    let params = new HttpParams();
    
    if (filter.pageNumber) params = params.set('pageNumber', filter.pageNumber.toString());
    if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
    if (filter.sortDirection) params = params.set('sortDirection', filter.sortDirection);
    if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
    if (filter.minVoteScore !== undefined) params = params.set('minVoteScore', filter.minVoteScore.toString());
    if (filter.hasAcceptedAnswer !== undefined) params = params.set('hasAcceptedAnswer', filter.hasAcceptedAnswer.toString());
    if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
    if (filter.dateTo) params = params.set('dateTo', filter.dateTo);
    if (filter.includeContent !== undefined) params = params.set('includeContent', filter.includeContent.toString());
    if (filter.includeTags !== undefined) params = params.set('includeTags', filter.includeTags.toString());
    if (filter.includeUserInfo !== undefined) params = params.set('includeUserInfo', filter.includeUserInfo.toString());
    
    if (filter.categories && filter.categories.length > 0) {
      filter.categories.forEach(category => {
        params = params.append('categories', category);
      });
    }
    
    if (filter.tags && filter.tags.length > 0) {
      filter.tags.forEach(tag => {
        params = params.append('tags', tag);
      });
    }
    
    if (filter.contentTypes && filter.contentTypes.length > 0) {
      filter.contentTypes.forEach(contentType => {
        params = params.append('contentTypes', contentType);
      });
    }

    return this.http.get<PaginatedApiResponse<QuestionList>>(QA_API_ENDPOINTS.QUESTIONS.SEARCH, { params })
      .pipe(
        catchError(this.handleError<PaginatedApiResponse<QuestionList>>())
      );
  }

  getSimilarQuestions(questionId: string): Observable<ApiResponse<QuestionSimilarity[]>> {
    return this.http.get<ApiResponse<QuestionSimilarity[]>>(QA_API_ENDPOINTS.QUESTIONS.SIMILAR(questionId))
      .pipe(
        catchError(this.handleError<ApiResponse<QuestionSimilarity[]>>())
      );
  }

  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(QA_API_ENDPOINTS.CATEGORIES.BASE)
      .pipe(
        catchError(this.handleError<ApiResponse<Category[]>>())
      );
  }

  getCategoryExperts(categoryId: string): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(QA_API_ENDPOINTS.CATEGORIES.EXPERTS(categoryId))
      .pipe(
        catchError(this.handleError<ApiResponse<any[]>>())
      );
  }

  getTags(): Observable<ApiResponse<Tag[]>> {
    return this.http.get<ApiResponse<Tag[]>>(QA_API_ENDPOINTS.TAGS.BASE)
      .pipe(
        catchError(this.handleError<ApiResponse<Tag[]>>())
      );
  }

  getPopularTags(): Observable<ApiResponse<PopularTag[]>> {
    return this.http.get<ApiResponse<PopularTag[]>>(QA_API_ENDPOINTS.TAGS.POPULAR)
      .pipe(
        catchError(this.handleError<ApiResponse<PopularTag[]>>())
      );
  }

  // Advanced search methods
  searchByContent(searchTerm: string, options?: {
    includeQuestions?: boolean;
    includeAnswers?: boolean;
    categories?: string[];
    tags?: string[];
  }): Observable<PaginatedApiResponse<any>> {
    const filter: SearchFilter = {
      searchTerm,
      includeContent: true,
      contentTypes: [],
      categories: options?.categories,
      tags: options?.tags
    };

    if (options?.includeQuestions !== false) {
      filter.contentTypes?.push('Question');
    }
    if (options?.includeAnswers !== false) {
      filter.contentTypes?.push('Answer');
    }

    return this.searchQuestions(filter);
  }

  searchByTags(tags: string[], options?: {
    sortBy?: string;
    categories?: string[];
  }): Observable<PaginatedApiResponse<QuestionList>> {
    const filter: SearchFilter = {
      tags,
      categories: options?.categories,
      sortBy: options?.sortBy || 'relevance',
      includeTags: true
    };

    return this.searchQuestions(filter);
  }

  searchByCategory(category: string, options?: {
    sortBy?: string;
    hasAcceptedAnswer?: boolean;
  }): Observable<PaginatedApiResponse<QuestionList>> {
    const filter: SearchFilter = {
      categories: [category],
      sortBy: options?.sortBy || 'newest',
      hasAcceptedAnswer: options?.hasAcceptedAnswer
    };

    return this.searchQuestions(filter);
  }

  // Utility methods for search suggestions
  getSearchSuggestions(query: string): Observable<string[]> {
    // This would typically call a dedicated suggestions endpoint
    // For now, return mock suggestions
    const mockSuggestions = [
      `${query} tutorial`,
      `${query} example`,
      `${query} best practices`,
      `${query} error`,
      `${query} vs`
    ];

    return new Observable(observer => {
      observer.next(mockSuggestions);
      observer.complete();
    });
  }

  private handleError<T>() {
    return (error: any): Observable<T> => {
      console.error('QA Search Service Error:', error);
      
      const errorResponse = {
        succeeded: false,
        data: undefined,
        message: error.error?.message || error.message || 'An error occurred',
        errors: error.error?.errors || [error.message || 'Unknown error'],
        statusCode: error.status || 500,
        timestamp: new Date().toISOString()
      } as T;

      return new Observable<T>(observer => {
        observer.next(errorResponse);
        observer.complete();
      });
    };
  }
}