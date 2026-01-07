import { ApiService } from '../api/ApiService';
import type { ApiResult } from '../api';
import type { PaginatedResult } from '../../types/api';
import type {
  Campaign,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  CampaignQueryParams
} from './types';

export class CampaignService extends ApiService {
  private readonly baseUrl = '/marketing/campaigns';

  async getCampaigns(params?: CampaignQueryParams): Promise<ApiResult<PaginatedResult<Campaign>>> {
    return this.get<PaginatedResult<Campaign>>(this.baseUrl, { params });
  }

  async getCampaign(id: string): Promise<ApiResult<Campaign>> {
    return this.get<Campaign>(`${this.baseUrl}/${id}`);
  }

  async createCampaign(request: CreateCampaignRequest): Promise<ApiResult<Campaign>> {
    return this.post<Campaign>(this.baseUrl, request);
  }

  async updateCampaign(id: string, request: UpdateCampaignRequest): Promise<ApiResult<Campaign>> {
    return this.put<Campaign>(`${this.baseUrl}/${id}`, request);
  }

  async deleteCampaign(id: string): Promise<ApiResult<boolean>> {
    return this.delete<boolean>(`${this.baseUrl}/${id}`);
  }

  async pauseCampaign(id: string): Promise<ApiResult<Campaign>> {
    return this.patch<Campaign>(`${this.baseUrl}/${id}/pause`);
  }

  async resumeCampaign(id: string): Promise<ApiResult<Campaign>> {
    return this.patch<Campaign>(`${this.baseUrl}/${id}/resume`);
  }

  async duplicateCampaign(id: string): Promise<ApiResult<Campaign>> {
    return this.post<Campaign>(`${this.baseUrl}/${id}/duplicate`);
  }
}