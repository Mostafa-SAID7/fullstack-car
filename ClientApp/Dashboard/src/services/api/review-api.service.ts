import { BaseApiService } from './base-api.service';
import { ReviewDto, CreateReviewRequest, UpdateReviewRequest, ReviewCommentDto } from '../../types/community/review';
import { PagedResult } from '../../types/community/common';

export class ReviewApiService extends BaseApiService {
  private readonly endpoint = '/v7/community/reviews';

  async getReviews(params: { pageNumber?: number; pageSize?: number; type?: number; rating?: number }): Promise<PagedResult<ReviewDto>> {
    return this.get<PagedResult<ReviewDto>>(this.endpoint, {
      cache: true, cacheTTL: 120000,
      params: { pageNumber: params.pageNumber || 1, pageSize: params.pageSize || 20, ...(params.type && { type: params.type }), ...(params.rating && { rating: params.rating }) }
    });
  }

  async getReview(id: string): Promise<ReviewDto> {
    return this.get<ReviewDto>(`${this.endpoint}/${id}`, { cache: true, cacheTTL: 300000 });
  }

  async createReview(request: CreateReviewRequest): Promise<ReviewDto> {
    return this.post<ReviewDto>(this.endpoint, request);
  }

  async updateReview(id: string, request: UpdateReviewRequest): Promise<ReviewDto> {
    return this.put<ReviewDto>(`${this.endpoint}/${id}`, request);
  }

  async deleteReview(id: string): Promise<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  async markHelpful(id: string): Promise<void> {
    return this.post<void>(`${this.endpoint}/${id}/helpful`, {});
  }

  async markNotHelpful(id: string): Promise<void> {
    return this.post<void>(`${this.endpoint}/${id}/not-helpful`, {});
  }

  async getComments(reviewId: string, pageNumber: number = 1): Promise<PagedResult<ReviewCommentDto>> {
    return this.get<PagedResult<ReviewCommentDto>>(`${this.endpoint}/${reviewId}/comments`, {
      cache: true, cacheTTL: 30000, params: { pageNumber, pageSize: 20 }
    });
  }

  async addComment(reviewId: string, content: string): Promise<ReviewCommentDto> {
    return this.post<ReviewCommentDto>(`${this.endpoint}/${reviewId}/comments`, { content });
  }
}

export const reviewApiService = new ReviewApiService();
