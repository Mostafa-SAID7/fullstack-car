import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Guide, GuideListItem, GuideFilters, CreateGuideRequest } from '../models/guide.model';
import { Result, PaginatedResult } from '../../../../core/models/result.model';

@Injectable({
  providedIn: 'root'
})
export class GuideService {
  private readonly apiUrl = `${environment.apiUrl}/api/v2.0/community/guides`;
  private guidesSubject = new BehaviorSubject<GuideListItem[]>([]);
  
  public guides$ = this.guidesSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get paginated list of guides
   */
  getGuides(filters?: GuideFilters): Observable<PaginatedResult<GuideListItem>> {
    const params = this.buildQueryParams(filters);
    
    return this.http.get<PaginatedResult<GuideListItem>>(`${this.apiUrl}`, { params })
      .pipe(
        map(result => {
          this.guidesSubject.next(result.items || []);
          return result;
        }),
        catchError(error => {
          console.error('Error loading guides:', error);
          // Return mock data for development
          const mockResult: PaginatedResult<GuideListItem> = {
            items: this.getMockGuides(),
            totalCount: 10,
            pageNumber: 1,
            pageSize: 10,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false
          };
          this.guidesSubject.next(mockResult.items);
          return [mockResult];
        })
      );
  }

  /**
   * Get guide by ID
   */
  getGuide(id: number): Observable<Result<Guide>> {
    return this.http.get<Result<Guide>>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error loading guide:', error);
          // Return mock data for development
          return [{
            succeeded: true,
            data: this.getMockGuide(id),
            message: 'Guide loaded successfully'
          }];
        })
      );
  }

  /**
   * Create new guide
   */
  createGuide(request: CreateGuideRequest): Observable<Result<Guide>> {
    return this.http.post<Result<Guide>>(`${this.apiUrl}`, request)
      .pipe(
        catchError(error => {
          console.error('Error creating guide:', error);
          return [{
            succeeded: false,
            message: 'Failed to create guide',
            errors: [error.message]
          }];
        })
      );
  }

  /**
   * Update guide
   */
  updateGuide(id: number, request: Partial<CreateGuideRequest>): Observable<Result<Guide>> {
    return this.http.put<Result<Guide>>(`${this.apiUrl}/${id}`, request)
      .pipe(
        catchError(error => {
          console.error('Error updating guide:', error);
          return [{
            succeeded: false,
            message: 'Failed to update guide',
            errors: [error.message]
          }];
        })
      );
  }

  /**
   * Delete guide
   */
  deleteGuide(id: number): Observable<Result<boolean>> {
    return this.http.delete<Result<boolean>>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error deleting guide:', error);
          return [{
            succeeded: false,
            message: 'Failed to delete guide',
            errors: [error.message]
          }];
        })
      );
  }

  /**
   * Like/Unlike guide
   */
  toggleLike(id: number): Observable<Result<boolean>> {
    return this.http.post<Result<boolean>>(`${this.apiUrl}/${id}/like`, {})
      .pipe(
        catchError(error => {
          console.error('Error toggling guide like:', error);
          return [{
            succeeded: false,
            message: 'Failed to toggle like',
            errors: [error.message]
          }];
        })
      );
  }

  /**
   * Bookmark/Unbookmark guide
   */
  toggleBookmark(id: number): Observable<Result<boolean>> {
    return this.http.post<Result<boolean>>(`${this.apiUrl}/${id}/bookmark`, {})
      .pipe(
        catchError(error => {
          console.error('Error toggling guide bookmark:', error);
          return [{
            succeeded: false,
            message: 'Failed to toggle bookmark',
            errors: [error.message]
          }];
        })
      );
  }

  private buildQueryParams(filters?: GuideFilters): any {
    if (!filters) return {};
    
    const params: any = {};
    
    if (filters.page) params.page = filters.page.toString();
    if (filters.pageSize) params.pageSize = filters.pageSize.toString();
    if (filters.category) params.category = filters.category.toString();
    if (filters.difficulty) params.difficulty = filters.difficulty.toString();
    if (filters.searchTerm) params.searchTerm = filters.searchTerm;
    if (filters.isFeatured !== undefined) params.isFeatured = filters.isFeatured.toString();
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortDescending !== undefined) params.sortDescending = filters.sortDescending.toString();
    
    return params;
  }

  private getMockGuides(): GuideListItem[] {
    return [
      {
        id: 1,
        title: 'Complete Car Maintenance Guide',
        summary: 'Learn how to maintain your car properly with this comprehensive guide.',
        category: 1, // Maintenance
        categoryName: 'Maintenance',
        difficulty: 2, // Intermediate
        difficultyName: 'Intermediate',
        estimatedReadTime: 15,
        isFeatured: true,
        viewCount: 1250,
        likeCount: 89,
        bookmarkCount: 156,
        tags: ['maintenance', 'oil-change', 'filters'],
        thumbnailUrl: '/assets/images/guides/maintenance-guide.jpg',
        createdAt: new Date('2024-01-15'),
        authorName: 'Ahmed Al-Rashid',
        authorAvatar: '/assets/images/avatars/ahmed.jpg',
        isBookmarked: false,
        averageRating: 4.5,
        ratingCount: 67
      },
      {
        id: 2,
        title: 'Engine Troubleshooting 101',
        summary: 'Diagnose and fix common engine problems with step-by-step instructions.',
        category: 2, // Repair
        categoryName: 'Repair',
        difficulty: 3, // Advanced
        difficultyName: 'Advanced',
        estimatedReadTime: 25,
        isFeatured: false,
        viewCount: 890,
        likeCount: 67,
        bookmarkCount: 123,
        tags: ['engine', 'troubleshooting', 'repair'],
        thumbnailUrl: '/assets/images/guides/engine-guide.jpg',
        createdAt: new Date('2024-01-10'),
        authorName: 'Sara Hassan',
        authorAvatar: '/assets/images/avatars/sara.jpg',
        isBookmarked: true,
        averageRating: 4.2,
        ratingCount: 45
      }
    ];
  }

  private getMockGuide(id: number): Guide {
    return {
      id: id,
      title: 'Complete Car Maintenance Guide',
      content: 'This is a comprehensive guide on car maintenance...',
      summary: 'Learn how to maintain your car properly with this comprehensive guide.',
      category: 1,
      categoryName: 'Maintenance',
      difficulty: 2,
      difficultyName: 'Intermediate',
      estimatedReadTime: 15,
      isFeatured: true,
      isPublished: true,
      tags: ['maintenance', 'oil-change', 'filters'],
      thumbnailUrl: '/assets/images/guides/maintenance-guide.jpg',
      userRating: 5,
      averageRating: 4.5,
      ratingCount: 67,
      viewCount: 1250,
      likeCount: 89,
      bookmarkCount: 156,
      isLiked: false,
      isBookmarked: false,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      authorId: 1,
      authorName: 'Ahmed Al-Rashid',
      authorAvatar: '/assets/images/avatars/ahmed.jpg'
    };
  }
}