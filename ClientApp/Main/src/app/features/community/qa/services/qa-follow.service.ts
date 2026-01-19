import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

export interface FollowResponse {
  succeeded: boolean;
  message?: string;
  data?: {
    questionId: string;
    isFollowing: boolean;
    followCount: number;
  };
}

export interface FollowStatus {
  questionId: string;
  isFollowing: boolean;
  followCount: number;
  lastUpdated: Date;
}

@Injectable({
  providedIn: 'root'
})
export class QAFollowService {
  private readonly apiUrl = `${environment.apiUrl}/v7/qa/follows`;

  // Cache for follow status
  private followCache = new Map<string, FollowStatus>();

  constructor(private http: HttpClient) {}

  /**
   * Toggle follow status for a question
   */
  toggleFollow(questionId: string): Observable<FollowResponse> {
    return this.http.post<FollowResponse>(`${this.apiUrl}/toggle`, { questionId }).pipe(
      tap(response => {
        if (response.succeeded && response.data) {
          // Update cache
          this.followCache.set(questionId, {
            questionId,
            isFollowing: response.data.isFollowing,
            followCount: response.data.followCount,
            lastUpdated: new Date()
          });
        }
      })
    );
  }

  /**
   * Get follow status for a question
   */
  getFollowStatus(questionId: string): Observable<FollowStatus | null> {
    // Check cache first
    const cached = this.followCache.get(questionId);
    if (cached && (Date.now() - cached.lastUpdated.getTime()) < 300000) { // 5 minutes cache
      return new BehaviorSubject(cached).asObservable();
    }

    // Fetch from API
    return this.http.get<FollowResponse>(`${this.apiUrl}/status/${questionId}`).pipe(
      map(response => {
        if (response.succeeded && response.data) {
          const status: FollowStatus = {
            questionId,
            isFollowing: response.data.isFollowing,
            followCount: response.data.followCount,
            lastUpdated: new Date()
          };
          this.followCache.set(questionId, status);
          return status;
        }
        return null;
      })
    );
  }

  /**
   * Get questions the user is following
   */
  getUserFollowing(page = 1, pageSize = 20): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    });
  }

  /**
   * Get users following a question
   */
  getQuestionFollowers(questionId: string, page = 1, pageSize = 20): Observable<any> {
    return this.http.get(`${this.apiUrl}/question/${questionId}/followers`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    });
  }

  /**
   * Clear cache for a specific question
   */
  clearCache(questionId: string): void {
    this.followCache.delete(questionId);
  }

  /**
   * Clear all cache
   */
  clearAllCache(): void {
    this.followCache.clear();
  }
}
