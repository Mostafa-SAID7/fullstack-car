import { ApiService } from '../api/ApiService';
import type { ApiResult } from '../api';
import type { PaginatedResult } from '../../types/api';
import type {
  CampaignContent,
  CreateCampaignContentRequest,
  UpdateCampaignContentRequest
} from './types';

export class ContentService extends ApiService {
  private readonly baseUrl = '/marketing/content';

  async getContents(params?: {
    pageNumber?: number;
    pageSize?: number;
    campaignId?: string;
    status?: string;
    type?: string;
    searchTerm?: string;
  }): Promise<ApiResult<PaginatedResult<CampaignContent>>> {
    return this.get<PaginatedResult<CampaignContent>>(this.baseUrl, { params });
  }

  async getContent(id: string): Promise<ApiResult<CampaignContent>> {
    return this.get<CampaignContent>(`${this.baseUrl}/${id}`);
  }

  async createContent(request: CreateCampaignContentRequest): Promise<ApiResult<CampaignContent>> {
    return this.post<CampaignContent>(this.baseUrl, request);
  }

  async updateContent(id: string, request: UpdateCampaignContentRequest): Promise<ApiResult<CampaignContent>> {
    return this.put<CampaignContent>(`${this.baseUrl}/${id}`, request);
  }

  async deleteContent(id: string): Promise<ApiResult<boolean>> {
    return this.delete<boolean>(`${this.baseUrl}/${id}`);
  }

  async publishContent(id: string): Promise<ApiResult<CampaignContent>> {
    return this.patch<CampaignContent>(`${this.baseUrl}/${id}/publish`);
  }

  async scheduleContent(id: string, scheduledDate: string): Promise<ApiResult<CampaignContent>> {
    return this.patch<CampaignContent>(`${this.baseUrl}/${id}/schedule`, { scheduledDate });
  }

  async archiveContent(id: string): Promise<ApiResult<CampaignContent>> {
    return this.patch<CampaignContent>(`${this.baseUrl}/${id}/archive`);
  }
}