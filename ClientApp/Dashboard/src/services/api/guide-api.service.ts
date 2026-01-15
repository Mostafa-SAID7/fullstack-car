import { BaseApiService } from './base-api.service';
import { GuideDto, CreateGuideRequest, UpdateGuideRequest, GuideStepDto, GuideRatingDto } from '../../types/community/guide';
import { PagedResult } from '../../types/community/common';

export class GuideApiService extends BaseApiService {
  private readonly endpoint = '/v7/community/guides';

  async getGuides(params: { pageNumber?: number; pageSize?: number; category?: number; difficulty?: number }): Promise<PagedResult<GuideDto>> {
    return this.get<PagedResult<GuideDto>>(this.endpoint, {
      cache: true, cacheTTL: 120000,
      params: { pageNumber: params.pageNumber || 1, pageSize: params.pageSize || 20, ...(params.category && { category: params.category }), ...(params.difficulty && { difficulty: params.difficulty }) }
    });
  }

  async getGuide(id: string): Promise<GuideDto> {
    return this.get<GuideDto>(`${this.endpoint}/${id}`, { cache: true, cacheTTL: 300000 });
  }

  async createGuide(request: CreateGuideRequest): Promise<GuideDto> {
    return this.post<GuideDto>(this.endpoint, request);
  }

  async updateGuide(id: string, request: UpdateGuideRequest): Promise<GuideDto> {
    return this.put<GuideDto>(`${this.endpoint}/${id}`, request);
  }

  async deleteGuide(id: string): Promise<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  async getSteps(guideId: string): Promise<GuideStepDto[]> {
    return this.get<GuideStepDto[]>(`${this.endpoint}/${guideId}/steps`, { cache: true, cacheTTL: 300000 });
  }

  async bookmarkGuide(id: string): Promise<void> {
    return this.post<void>(`${this.endpoint}/${id}/bookmark`, {});
  }

  async unbookmarkGuide(id: string): Promise<void> {
    return this.delete<void>(`${this.endpoint}/${id}/bookmark`);
  }

  async rateGuide(id: string, rating: number, comment?: string): Promise<GuideRatingDto> {
    return this.post<GuideRatingDto>(`${this.endpoint}/${id}/rate`, { rating, comment });
  }

  async getRatings(guideId: string, pageNumber: number = 1): Promise<PagedResult<GuideRatingDto>> {
    return this.get<PagedResult<GuideRatingDto>>(`${this.endpoint}/${guideId}/ratings`, {
      cache: true, cacheTTL: 60000, params: { pageNumber, pageSize: 20 }
    });
  }
}

export const guideApiService = new GuideApiService();
