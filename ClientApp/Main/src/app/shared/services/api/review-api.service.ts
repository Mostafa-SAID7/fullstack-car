import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { BaseApiService } from './base-api.service';
import { ReviewDto, CreateReviewRequest, UpdateReviewRequest, ReviewCommentDto } from '../../models/community/review.model';
import { PagedResult } from '../../models/community/common.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewApiService extends BaseApiService {
  private readonly endpoint = '/v7/community/reviews';

  getReviews(params: {
    pageNumber?: number;
    pageSize?: number;
    type?: number;
    rating?: number;
  }): Observable<PagedResult<ReviewDto>> {
    let httpParams = new HttpParams()
      .set('pageNumber', (params.pageNumber || 1).toString())
      .set('pageSize', (params.pageSize || 20).toString());
    
    if (params.type) {
      httpParams = httpParams.set('type', params.type.toString());
    }
    if (params.rating) {
      httpParams = httpParams.set('rating', params.rating.toString());
    }
    
    return this.get<PagedResult<ReviewDto>>(this.endpoint, {
      cache: true,
      cacheTTL: 120000, // 2 minutes
      params: httpParams
    });
  }

  getReview(id: string): Observable<ReviewDto> {
    return this.get<ReviewDto>(`${this.endpoint}/${id}`, {
      cache: true,
      cacheTTL: 300000 // 5 minutes
    });
  }

  createReview(request: CreateReviewRequest): Observable<ReviewDto> {
    return this.post<ReviewDto>(this.endpoint, request);
  }

  updateReview(id: string, request: UpdateReviewRequest): Observable<ReviewDto> {
    return this.put<ReviewDto>(`${this.endpoint}/${id}`, request);
  }

  deleteReview(id: string): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  markHelpful(id: string): Observable<void> {
    return this.post<void>(`${this.endpoint}/${id}/helpful`, {});
  }

  markNotHelpful(id: string): Observable<void> {
    return this.post<void>(`${this.endpoint}/${id}/not-helpful`, {});
  }

  getComments(reviewId: string, pageNumber: number = 1): Observable<PagedResult<ReviewCommentDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', '20');
    
    return this.get<PagedResult<ReviewCommentDto>>(`${this.endpoint}/${reviewId}/comments`, {
      cache: true,
      cacheTTL: 30000, // 30 seconds
      params
    });
  }

  addComment(reviewId: string, content: string): Observable<ReviewCommentDto> {
    return this.post<ReviewCommentDto>(`${this.endpoint}/${reviewId}/comments`, { content });
  }
}
