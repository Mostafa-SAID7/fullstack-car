import { guideApiService } from '@/services/api/guide-api.service';
import { GuideDto, CreateGuideRequest, UpdateGuideRequest, GuideStepDto, GuideRatingDto } from '@/types/community/guide';
import { PagedResult } from '@/types/community/common';

export class GuideManagementService {
  async getGuides(params: {
    pageNumber?: number;
    pageSize?: number;
    category?: number;
    difficulty?: number;
  }): Promise<PagedResult<GuideDto>> {
    return guideApiService.getGuides(params);
  }

  async getGuide(id: string): Promise<GuideDto> {
    return guideApiService.getGuide(id);
  }

  async createGuide(request: CreateGuideRequest): Promise<GuideDto> {
    return guideApiService.createGuide(request);
  }

  async updateGuide(id: string, request: UpdateGuideRequest): Promise<GuideDto> {
    return guideApiService.updateGuide(id, request);
  }

  async deleteGuide(id: string): Promise<void> {
    return guideApiService.deleteGuide(id);
  }

  async getSteps(guideId: string): Promise<GuideStepDto[]> {
    return guideApiService.getSteps(guideId);
  }

  async getRatings(guideId: string, pageNumber: number = 1): Promise<PagedResult<GuideRatingDto>> {
    return guideApiService.getRatings(guideId, pageNumber);
  }

  async bulkDelete(ids: string[]): Promise<void> {
    await Promise.all(ids.map(id => this.deleteGuide(id)));
  }
}

export const guideManagementService = new GuideManagementService();
