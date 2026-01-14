import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';

// Import internal types
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
  CloseQuestionRequest,
  Answer
} from '../models/qa-api.types';
import { QA_API_ENDPOINTS } from '../models/qa-api.types';

// Removed unused interface import
// import type { IQAQuestionService } from '../models/qa-api.interface';

@Injectable({
  providedIn: 'root'
})
export class QAQuestionService {
  private readonly apiBase = environment.apiUrl.replace(/\/api\/?$/, '');
  private readonly baseUrl = `${this.apiBase}${QA_API_ENDPOINTS.QUESTIONS.BASE}`;

  constructor(private http: HttpClient) { }

  getQuestions(filter?: QuestionFilter): Observable<PaginatedApiResponse<QuestionList>> {
    let params = new HttpParams();

    if (filter) {
      if (filter.pageNumber) params = params.set('pageNumber', filter.pageNumber.toString());
      if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
      if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
      if (filter.sortDirection) params = params.set('sortDirection', filter.sortDirection);
      if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
      if (filter.category) params = params.set('category', filter.category);
      if (filter.status) params = params.set('status', filter.status);
      if (filter.hasAcceptedAnswer !== undefined) params = params.set('hasAcceptedAnswer', filter.hasAcceptedAnswer.toString());
      if (filter.minVoteScore !== undefined) params = params.set('minVoteScore', filter.minVoteScore.toString());
      if (filter.maxVoteScore !== undefined) params = params.set('maxVoteScore', filter.maxVoteScore.toString());
      if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
      if (filter.dateTo) params = params.set('dateTo', filter.dateTo);
      if (filter.includeScheduled !== undefined) params = params.set('includeScheduled', filter.includeScheduled.toString());

      if (filter.tags && filter.tags.length > 0) {
        filter.tags.forEach((tag: string) => {
          params = params.append('tags', tag);
        });
      }
    }

    return this.http.get<PaginatedApiResponse<QuestionList>>(this.baseUrl, { params });
  }


  getQuestion(id: string): Observable<ApiResponse<Question>> {
    return this.http.get<ApiResponse<Question>>(`${this.baseUrl}/${id}`);
  }

  getQuestionDetail(id: string): Observable<ApiResponse<QuestionDetail>> {
    return this.http.get<ApiResponse<QuestionDetail>>(`${this.baseUrl}/${id}`);
  }




  createQuestion(request: CreateQuestionRequest): Observable<ApiResponse<Question>> {
    return this.http.post<ApiResponse<Question>>(this.baseUrl, request)
      .pipe(
        catchError(this.handleError<ApiResponse<Question>>())
      );
  }

  updateQuestion(id: string, request: UpdateQuestionRequest): Observable<ApiResponse<Question>> {
    return this.http.put<ApiResponse<Question>>(`${this.baseUrl}/${id}`, request)
      .pipe(
        catchError(this.handleError<ApiResponse<Question>>())
      );
  }

  deleteQuestion(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError(this.handleError<ApiResponse<void>>())
      );
  }

  closeQuestion(id: string, request: CloseQuestionRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiBase}${QA_API_ENDPOINTS.QUESTIONS.CLOSE(id)}`, request)
      .pipe(
        catchError(this.handleError<ApiResponse<void>>())
      );
  }

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
      filter.categories.forEach((category: string) => {
        params = params.append('categories', category);
      });
    }

    if (filter.tags && filter.tags.length > 0) {
      filter.tags.forEach((tag: string) => {
        params = params.append('tags', tag);
      });
    }

    if (filter.contentTypes && filter.contentTypes.length > 0) {
      filter.contentTypes.forEach((contentType: string) => {
        params = params.append('contentTypes', contentType);
      });
    }

    return this.http.get<PaginatedApiResponse<QuestionList>>(`${this.apiBase}${QA_API_ENDPOINTS.QUESTIONS.SEARCH}`, { params })
      .pipe(
        catchError(this.handleError<PaginatedApiResponse<QuestionList>>())
      );
  }

  getSimilarQuestions(id: string): Observable<ApiResponse<QuestionSimilarity[]>> {
    return this.http.get<ApiResponse<QuestionSimilarity[]>>(`${this.apiBase}${QA_API_ENDPOINTS.QUESTIONS.SIMILAR(id)}`)
      .pipe(
        catchError(this.handleError<ApiResponse<QuestionSimilarity[]>>())
      );
  }

  getMyQuestions(filter?: QuestionFilter): Observable<PaginatedApiResponse<QuestionList>> {
    let params = new HttpParams();

    if (filter) {
      if (filter.pageNumber) params = params.set('pageNumber', filter.pageNumber.toString());
      if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
      if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
      if (filter.sortDirection) params = params.set('sortDirection', filter.sortDirection);
      if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
      if (filter.category) params = params.set('category', filter.category);
      if (filter.status) params = params.set('status', filter.status);
      if (filter.hasAcceptedAnswer !== undefined) params = params.set('hasAcceptedAnswer', filter.hasAcceptedAnswer.toString());
      if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
      if (filter.dateTo) params = params.set('dateTo', filter.dateTo);

      if (filter.tags && filter.tags.length > 0) {
        filter.tags.forEach((tag: string) => {
          params = params.append('tags', tag);
        });
      }
    }

    return this.http.get<PaginatedApiResponse<QuestionList>>(`${this.apiBase}${QA_API_ENDPOINTS.QUESTIONS.MY_QUESTIONS}`, { params })
      .pipe(
        catchError(this.handleError<PaginatedApiResponse<QuestionList>>())
      );
  }

  viewQuestion(id: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/${id}/view`, {})
      .pipe(
        catchError(this.handleError<ApiResponse<void>>())
      );
  }

  private handleError<T>() {
    return (error: any): Observable<T> => {
      console.error('QA Question Service Error:', error);

      // Create a standardized error response that matches our API format
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