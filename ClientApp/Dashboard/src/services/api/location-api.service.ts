import { BaseApiService } from './base-api.service';
import { LocationDto, CreateLocationRequest, CheckInDto, CreateCheckInRequest, PlaceReviewDto, CreatePlaceReviewRequest, LocationHourDto } from '../../types/community/location';
import { PagedResult } from '../../types/community/common';

export class LocationApiService extends BaseApiService {
  private readonly endpoint = '/v7/community/locations';

  async getLocations(params: { pageNumber?: number; pageSize?: number; category?: number; city?: string; country?: string }): Promise<PagedResult<LocationDto>> {
    return this.get<PagedResult<LocationDto>>(this.endpoint, {
      cache: true, cacheTTL: 300000,
      params: { pageNumber: params.pageNumber || 1, pageSize: params.pageSize || 20, ...(params.category && { category: params.category }), ...(params.city && { city: params.city }), ...(params.country && { country: params.country }) }
    });
  }

  async getLocation(id: string): Promise<LocationDto> {
    return this.get<LocationDto>(`${this.endpoint}/${id}`, { cache: true, cacheTTL: 300000 });
  }

  async createLocation(request: CreateLocationRequest): Promise<LocationDto> {
    return this.post<LocationDto>(this.endpoint, request);
  }

  async updateLocation(id: string, request: Partial<CreateLocationRequest>): Promise<LocationDto> {
    return this.put<LocationDto>(`${this.endpoint}/${id}`, request);
  }

  async deleteLocation(id: string): Promise<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  async getHours(locationId: string): Promise<LocationHourDto[]> {
    return this.get<LocationHourDto[]>(`${this.endpoint}/${locationId}/hours`, { cache: true, cacheTTL: 3600000 });
  }

  async checkIn(request: CreateCheckInRequest): Promise<CheckInDto> {
    return this.post<CheckInDto>(`${this.endpoint}/${request.locationId}/check-in`, request);
  }

  async getCheckIns(locationId: string, pageNumber: number = 1): Promise<PagedResult<CheckInDto>> {
    return this.get<PagedResult<CheckInDto>>(`${this.endpoint}/${locationId}/check-ins`, {
      cache: true, cacheTTL: 60000, params: { pageNumber, pageSize: 20 }
    });
  }

  async createReview(request: CreatePlaceReviewRequest): Promise<PlaceReviewDto> {
    return this.post<PlaceReviewDto>(`${this.endpoint}/${request.locationId}/reviews`, request);
  }

  async getReviews(locationId: string, pageNumber: number = 1): Promise<PagedResult<PlaceReviewDto>> {
    return this.get<PagedResult<PlaceReviewDto>>(`${this.endpoint}/${locationId}/reviews`, {
      cache: true, cacheTTL: 120000, params: { pageNumber, pageSize: 20 }
    });
  }
}

export const locationApiService = new LocationApiService();
