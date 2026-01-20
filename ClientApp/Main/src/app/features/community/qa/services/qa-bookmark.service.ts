import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

export interface BookmarkResponse {
  succeeded: boolean;
  message?: string;
  data?: {
    questionId: string;
    isBookmarked: boolean;
    bookmarkCount: number;
  };
}

export interface BookmarkStatus {
  questionId: string;
  isBookmarked: boolean;
  bookmarkCount: number;
  lastUpdated: Date;
}

@Injectable({
  providedIn: 'root'
})
export class QABookmarkService {
  private readonly apiUrl = `${environment.apiUrl}/v2/common/bookmarks`;

  // Cache for bookmark status
  private bookmarkCache = new Map<string, BookmarkStatus>();

  constructor(private http: HttpClient) {}

  /**
   * Toggle bookmark status for a question
   */
  toggleBookmark(questionId: string): Observable<BookmarkResponse> {
    const request = {
      contentId: questionId,
      contentType: 'Question'
    };
    
    return this.http.post<BookmarkResponse>(`${this.apiUrl}`, request).pipe(
      tap(response => {
        if (response.succeeded && response.data) {
          // Update cache
          this.bookmarkCache.set(questionId, {
            questionId,
            isBookmarked: response.data.isBookmarked,
            bookmarkCount: response.data.bookmarkCount,
            lastUpdated: new Date()
          });
        }
      })
    );
  }

  /**
   * Get bookmark status for a question
   */
  getBookmarkStatus(questionId: string): Observable<BookmarkStatus | null> {
    // Check cache first
    const cached = this.bookmarkCache.get(questionId);
    if (cached && (Date.now() - cached.lastUpdated.getTime()) < 300000) { // 5 minutes cache
      return new BehaviorSubject(cached).asObservable();
    }

    // Fetch from API
    return this.http.get<BookmarkResponse>(`${this.apiUrl}/Question/${questionId}/status`).pipe(
      map(response => {
        if (response.succeeded && response.data) {
          const status: BookmarkStatus = {
            questionId,
            isBookmarked: response.data.isBookmarked,
            bookmarkCount: response.data.bookmarkCount,
            lastUpdated: new Date()
          };
          this.bookmarkCache.set(questionId, status);
          return status;
        }
        return null;
      })
    );
  }

  /**
   * Get user's bookmarked questions
   */
  getUserBookmarks(page = 1, pageSize = 20): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`, {
      params: { 
        page: page.toString(), 
        pageSize: pageSize.toString(),
        contentType: 'Question'
      }
    });
  }

  /**
   * Clear cache for a specific question
   */
  clearCache(questionId: string): void {
    this.bookmarkCache.delete(questionId);
  }

  /**
   * Clear all cache
   */
  clearAllCache(): void {
    this.bookmarkCache.clear();
  }
}
