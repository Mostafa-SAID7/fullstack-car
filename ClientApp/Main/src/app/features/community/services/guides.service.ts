import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
  Guide, 
  GuideListItem, 
  CreateGuideRequest, 
  RateGuideRequest, 
  GuideFilters,
  GuideCategory,
  GuideDifficulty
} from '../models/guide.model';
import { PaginatedResult } from '../../../core/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class GuidesService {
  private readonly apiUrl = `${environment.apiUrl}/community/guides`;

  constructor(private http: HttpClient) {}

  getGuides(filters?: GuideFilters): Observable<PaginatedResult<GuideListItem>> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.pageSize) params = params.set('pageSize', filters.pageSize.toString());
      if (filters.category !== undefined) params = params.set('category', filters.category.toString());
      if (filters.difficulty !== undefined) params = params.set('difficulty', filters.difficulty.toString());
      if (filters.searchTerm) params = params.set('searchTerm', filters.searchTerm);
      if (filters.isFeatured !== undefined) params = params.set('isFeatured', filters.isFeatured.toString());
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
      if (filters.sortDescending !== undefined) params = params.set('sortDescending', filters.sortDescending.toString());
    }

    return this.http.get<PaginatedResult<GuideListItem>>(this.apiUrl, { params });
  }

  getGuideById(id: number): Observable<Guide> {
    return this.http.get<Guide>(`${this.apiUrl}/${id}`);
  }

  createGuide(request: CreateGuideRequest): Observable<Guide> {
    return this.http.post<Guide>(this.apiUrl, request);
  }

  updateGuide(id: number, request: CreateGuideRequest): Observable<Guide> {
    return this.http.put<Guide>(`${this.apiUrl}/${id}`, request);
  }

  rateGuide(request: RateGuideRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${request.guideId}/rate`, request);
  }

  bookmarkGuide(id: number, notes?: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/bookmark`, { notes });
  }

  getBookmarkedGuides(page: number = 1, pageSize: number = 10): Observable<PaginatedResult<GuideListItem>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedResult<GuideListItem>>(`${this.apiUrl}/bookmarks`, { params });
  }

  getCategories(): Observable<{ value: number; name: string }[]> {
    return this.http.get<{ value: number; name: string }[]>(`${this.apiUrl}/categories`);
  }

  getDifficulties(): Observable<{ value: number; name: string }[]> {
    return this.http.get<{ value: number; name: string }[]>(`${this.apiUrl}/difficulties`);
  }

  // Helper methods
  getCategoryName(category: GuideCategory): string {
    return GuideCategory[category] || 'Unknown';
  }

  getDifficultyName(difficulty: GuideDifficulty): string {
    return GuideDifficulty[difficulty] || 'Unknown';
  }

  getDifficultyColor(difficulty: GuideDifficulty): string {
    switch (difficulty) {
      case GuideDifficulty.Beginner:
        return 'text-green-600';
      case GuideDifficulty.Intermediate:
        return 'text-yellow-600';
      case GuideDifficulty.Advanced:
        return 'text-orange-600';
      case GuideDifficulty.Expert:
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }
}