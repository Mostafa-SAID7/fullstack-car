import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

// QA Types
import type {
  ApiResponse,
  PaginatedApiResponse,
  UserReputation,
  ReputationHistory,
  Expert
} from '../models/qa-api.types';
import { QA_API_ENDPOINTS } from '../models/qa-api.types';

@Injectable({
  providedIn: 'root'
})
export class QAReputationService {
  constructor(private http: HttpClient) { }

  getUserReputation(userId?: string): Observable<ApiResponse<UserReputation>> {
    const endpoint = userId
      ? `${QA_API_ENDPOINTS.REPUTATION.BASE}/${userId}`
      : QA_API_ENDPOINTS.REPUTATION.BASE;

    return this.http.get<ApiResponse<UserReputation>>(endpoint)
      .pipe(
        catchError(this.handleError<ApiResponse<UserReputation>>())
      );
  }

  getReputationLeaderboard(pageNumber = 1, pageSize = 20): Observable<PaginatedApiResponse<UserReputation>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedApiResponse<UserReputation>>(
      QA_API_ENDPOINTS.REPUTATION.LEADERBOARD,
      { params }
    ).pipe(
      catchError(this.handleError<PaginatedApiResponse<UserReputation>>())
    );
  }

  getReputationHistory(userId: string, pageNumber = 1, pageSize = 20): Observable<PaginatedApiResponse<ReputationHistory>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedApiResponse<ReputationHistory>>(
      QA_API_ENDPOINTS.REPUTATION.HISTORY(userId),
      { params }
    ).pipe(
      catchError(this.handleError<PaginatedApiResponse<ReputationHistory>>())
    );
  }

  getExperts(category?: string): Observable<ApiResponse<Expert[]>> {
    let params = new HttpParams();
    if (category) {
      params = params.set('category', category);
    }

    return this.http.get<ApiResponse<Expert[]>>(QA_API_ENDPOINTS.REPUTATION.EXPERTS, { params })
      .pipe(
        catchError(this.handleError<ApiResponse<Expert[]>>())
      );
  }

  // Utility methods for reputation calculations
  getReputationLevel(reputation: number): string {
    if (reputation >= 10000) return 'Master';
    if (reputation >= 5000) return 'Expert';
    if (reputation >= 2000) return 'Advanced';
    if (reputation >= 500) return 'Intermediate';
    return 'Beginner';
  }

  getReputationColor(reputation: number): string {
    const level = this.getReputationLevel(reputation);
    const colors = {
      'Master': '#f59e0b',
      'Expert': '#8b5cf6',
      'Advanced': '#10b981',
      'Intermediate': '#3b82f6',
      'Beginner': '#6b7280'
    };
    return colors[level as keyof typeof colors];
  }

  getBadgesByReputation(reputation: number): string[] {
    const badges: string[] = [];

    if (reputation >= 100) badges.push('Contributor');
    if (reputation >= 500) badges.push('Regular');
    if (reputation >= 1000) badges.push('Established');
    if (reputation >= 2000) badges.push('Trusted');
    if (reputation >= 5000) badges.push('Expert');
    if (reputation >= 10000) badges.push('Master');

    return badges;
  }

  private handleError<T>() {
    return (error: any): Observable<T> => {
      console.error('QA Reputation Service Error:', error);

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