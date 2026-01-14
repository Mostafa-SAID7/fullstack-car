import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';

// QA Types
import type {
  ApiResponse,
  PaginatedApiResponse,
  Vote,
  VoteFilter,
  CreateVoteRequest
} from '../models/qa-api.types';
import { QA_API_ENDPOINTS } from '../models/qa-api.types';

@Injectable({
  providedIn: 'root'
})
export class QAVotingService {
  private readonly apiBase = environment.apiUrl.replace(/\/api\/?$/, '');

  constructor(private http: HttpClient) { }

  createVote(request: CreateVoteRequest): Observable<ApiResponse<Vote>> {
    return this.http.post<ApiResponse<Vote>>(`${this.apiBase}${QA_API_ENDPOINTS.VOTES.BASE}`, request)
      .pipe(
        catchError(this.handleError<ApiResponse<Vote>>())
      );
  }

  removeVote(contentId: string, contentType: 'Question' | 'Answer'): Observable<ApiResponse<void>> {
    const params = new HttpParams()
      .set('contentId', contentId)
      .set('contentType', contentType);

    return this.http.delete<ApiResponse<void>>(`${this.apiBase}${QA_API_ENDPOINTS.VOTES.BASE}`, { params })
      .pipe(
        catchError(this.handleError<ApiResponse<void>>())
      );
  }

  getUserVotes(filter?: VoteFilter): Observable<PaginatedApiResponse<Vote>> {
    let params = new HttpParams();

    if (filter) {
      if (filter.pageNumber) params = params.set('pageNumber', filter.pageNumber.toString());
      if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
      if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
      if (filter.sortDirection) params = params.set('sortDirection', filter.sortDirection);
      if (filter.contentType) params = params.set('contentType', filter.contentType);
      if (filter.voteType) params = params.set('voteType', filter.voteType);
      if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
      if (filter.dateTo) params = params.set('dateTo', filter.dateTo);
    }

    return this.http.get<PaginatedApiResponse<Vote>>(`${this.apiBase}${QA_API_ENDPOINTS.VOTES.MY_VOTES}`, { params })
      .pipe(
        catchError(this.handleError<PaginatedApiResponse<Vote>>())
      );
  }

  // Convenience method for voting (handles create/update/remove logic)
  vote(contentId: string, contentType: 'Question' | 'Answer', voteType: 'Up' | 'Down' | null): Observable<ApiResponse<Vote | void>> {
    if (voteType === null) {
      // Remove vote
      return this.removeVote(contentId, contentType);
    } else {
      // Create or update vote
      const request: CreateVoteRequest = {
        contentId,
        contentType,
        voteType
      };
      return this.createVote(request);
    }
  }

  private handleError<T>() {
    return (error: any): Observable<T> => {
      console.error('QA Voting Service Error:', error);

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
