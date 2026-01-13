import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

// QA Types
import type {
  ApiResponse,
  PaginatedApiResponse,
  Answer,
  AnswerFilter,
  CreateAnswerRequest,
  UpdateAnswerRequest
} from '../../../shared/types/qa-api.types';
import { QA_API_ENDPOINTS } from '../../../shared/types/qa-api.types';

@Injectable({
  providedIn: 'root'
})
export class QAAnswerService {
  private readonly apiBase = environment.apiUrl.replace(/\/api\/?$/, '');

  constructor(private http: HttpClient) { }

  getAnswersByQuestion(questionId: string, filter?: AnswerFilter): Observable<PaginatedApiResponse<Answer>> {
    let params = new HttpParams();

    if (filter) {
      if (filter.pageNumber) params = params.set('pageNumber', filter.pageNumber.toString());
      if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
      if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
      if (filter.sortDirection) params = params.set('sortDirection', filter.sortDirection);
      if (filter.isAccepted !== undefined) params = params.set('isAccepted', filter.isAccepted.toString());
      if (filter.minVoteScore !== undefined) params = params.set('minVoteScore', filter.minVoteScore.toString());
      if (filter.maxVoteScore !== undefined) params = params.set('maxVoteScore', filter.maxVoteScore.toString());
      if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
      if (filter.dateTo) params = params.set('dateTo', filter.dateTo);
    }

    return this.http.get<PaginatedApiResponse<Answer>>(
      `${this.apiBase}${QA_API_ENDPOINTS.ANSWERS.BY_QUESTION(questionId)}`,
      { params }
    ).pipe(
      catchError(this.handleError<PaginatedApiResponse<Answer>>())
    );
  }

  getAnswer(id: string): Observable<ApiResponse<Answer>> {
    return this.http.get<ApiResponse<Answer>>(`${this.apiBase}${QA_API_ENDPOINTS.ANSWERS.BASE}/${id}`)
      .pipe(
        catchError(this.handleError<ApiResponse<Answer>>())
      );
  }

  createAnswer(request: CreateAnswerRequest): Observable<ApiResponse<Answer>> {
    return this.http.post<ApiResponse<Answer>>(`${this.apiBase}${QA_API_ENDPOINTS.ANSWERS.BASE}`, request)
      .pipe(
        catchError(this.handleError<ApiResponse<Answer>>())
      );
  }

  updateAnswer(id: string, request: UpdateAnswerRequest): Observable<ApiResponse<Answer>> {
    return this.http.put<ApiResponse<Answer>>(`${this.apiBase}${QA_API_ENDPOINTS.ANSWERS.BASE}/${id}`, request)
      .pipe(
        catchError(this.handleError<ApiResponse<Answer>>())
      );
  }

  deleteAnswer(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiBase}${QA_API_ENDPOINTS.ANSWERS.BASE}/${id}`)
      .pipe(
        catchError(this.handleError<ApiResponse<void>>())
      );
  }

  acceptAnswer(id: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiBase}${QA_API_ENDPOINTS.ANSWERS.ACCEPT(id)}`, {})
      .pipe(
        catchError(this.handleError<ApiResponse<void>>())
      );
  }

  getMyAnswers(filter?: AnswerFilter): Observable<PaginatedApiResponse<Answer>> {
    let params = new HttpParams();

    if (filter) {
      if (filter.pageNumber) params = params.set('pageNumber', filter.pageNumber.toString());
      if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
      if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
      if (filter.sortDirection) params = params.set('sortDirection', filter.sortDirection);
      if (filter.isAccepted !== undefined) params = params.set('isAccepted', filter.isAccepted.toString());
      if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
      if (filter.dateTo) params = params.set('dateTo', filter.dateTo);
    }

    return this.http.get<PaginatedApiResponse<Answer>>(`${this.apiBase}${QA_API_ENDPOINTS.ANSWERS.MY_ANSWERS}`, { params })
      .pipe(
        catchError(this.handleError<PaginatedApiResponse<Answer>>())
      );
  }

  private handleError<T>() {
    return (error: any): Observable<T> => {
      console.error('QA Answer Service Error:', error);

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
