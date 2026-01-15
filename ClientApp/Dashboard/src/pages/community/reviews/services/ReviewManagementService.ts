import { reviewApiService } from '@/services/api/review-api.service';
import { ReviewDto, CreateReviewRequest, UpdateReviewRequest } from '@/types/community/review';
import { PagedResult } from '@/types/community/common';

export class ReviewManagementService {
  async getReviews(params: {
    pageNumber?: number;
    pageSize?: number;
    type?: number;
    rating?: number;
  }): Promise<PagedResult<ReviewDto>> {
    return reviewApiService.getReviews(params);
  }

  async getReview(id: string): Promise<ReviewDto> {
    return reviewApiService.getReview(id);
  }

  async createReview(request: CreateReviewRequest): Promise<ReviewDto> {
    return reviewApiService.createReview(request);
  }

  async updateReview(id: string, request: UpdateReviewRequest): Promise<ReviewDto> {
    return reviewApiService.updateReview(id, request);
  }

  async deleteReview(id: string): Promise<void> {
    return reviewApiService.deleteReview(id);
  }

  async markHelpful(id: string): Promise<void> {
    return reviewApiService.markHelpful(id);
  }

  async bulkDelete(reviewIds: string[]): Promise<void> {
    await Promise.all(reviewIds.map(id => this.deleteReview(id)));
  }
}

export const reviewManagementService = new ReviewManagementService();
