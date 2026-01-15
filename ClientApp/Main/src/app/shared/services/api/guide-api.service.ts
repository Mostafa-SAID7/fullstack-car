import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { BaseApiService } from './base-api.service';
import { 
  GuideDto, 
  CreateGuideRequest, 
  UpdateGuideRequest, 
  GuideStepDto,
  GuideRatingDto
} from '../../models/community/guide.model';
import { PagedResult } from '../../models/community/common.model';

@Injectable({
  providedIn: 'root'
})
export class GuideApiService extends BaseApiService {
  private readonly endpoint = '/v7/community/guides';

  getGuides(params: {
    pageNumber?: number;
    pageSize?: number;
    category?: number;
    difficulty?: number;
  }): Observable<PagedResult<GuideDto>> {
    let httpParams = new HttpParams()
      .set('pageNumber', (params.pageNumber || 1).toString())
      .set('pageSize', (params.pageSize || 20).toString());
    
    if (params.category) {
      httpParams = httpParams.set('category', params.category.toString());
    }
    if (params.difficulty) {
      httpParams = httpParams.set('difficulty', params.difficulty.toString());
    }
    
    return this.get<PagedResult<GuideDto>>(this.endpoint, {
      cache: true,
      cacheTTL: 120000, // 2 minutes
      params: httpParams
    });
  }

  getGuide(id: string): Observable<GuideDto> {
    return this.get<GuideDto>(`${this.endpoint}/${id}`, {
      cache: true,
      cacheTTL: 300000 // 5 minutes
    });
  }

  createGuide(request: CreateGuideRequest): Observable<GuideDto> {
    return this.post<GuideDto>(this.endpoint, request);
  }

  updateGuide(id: string, request: UpdateGuideRequest): Observable<GuideDto> {
    return this.put<GuideDto>(`${this.endpoint}/${id}`, request);
  }

  deleteGuide(id: string): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  getSteps(guideId: string): Observable<GuideStepDto[]> {
    return this.get<GuideStepDto[]>(`${this.endpoint}/${guideId}/steps`, {
      cache: true,
      cacheTTL: 300000 // 5 minutes
    });
  }

  bookmarkGuide(id: string): Observable<void> {
    return this.post<void>(`${this.endpoint}/${id}/bookmark`, {});
  }

  unbookmarkGuide(id: string): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}/bookmark`);
  }

  rateGuide(id: string, rating: number, comment?: string): Observable<GuideRatingDto> {
    return this.post<GuideRatingDto>(`${this.endpoint}/${id}/rate`, { rating, comment });
  }

  getRatings(guideId: string, pageNumber: number = 1): Observable<PagedResult<GuideRatingDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', '20');
    
    return this.get<PagedResult<GuideRatingDto>>(`${this.endpoint}/${guideId}/ratings`, {
      cache: true,
      cacheTTL: 60000, // 1 minute
      params
    });
  }
}
