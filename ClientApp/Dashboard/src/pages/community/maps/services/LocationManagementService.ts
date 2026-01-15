import { locationApiService } from '@/services/api/location-api.service';
import { LocationDto, CreateLocationRequest, CheckInDto, PlaceReviewDto, LocationHourDto } from '@/types/community/location';
import { PagedResult } from '@/types/community/common';

export class LocationManagementService {
  async getLocations(params: {
    pageNumber?: number;
    pageSize?: number;
    category?: number;
    city?: string;
    country?: string;
  }): Promise<PagedResult<LocationDto>> {
    return locationApiService.getLocations(params);
  }

  async getLocation(id: string): Promise<LocationDto> {
    return locationApiService.getLocation(id);
  }

  async createLocation(request: CreateLocationRequest): Promise<LocationDto> {
    return locationApiService.createLocation(request);
  }

  async updateLocation(id: string, request: Partial<CreateLocationRequest>): Promise<LocationDto> {
    return locationApiService.updateLocation(id, request);
  }

  async deleteLocation(id: string): Promise<void> {
    return locationApiService.deleteLocation(id);
  }

  async getHours(locationId: string): Promise<LocationHourDto[]> {
    return locationApiService.getHours(locationId);
  }

  async getCheckIns(locationId: string, pageNumber: number = 1): Promise<PagedResult<CheckInDto>> {
    return locationApiService.getCheckIns(locationId, pageNumber);
  }

  async getReviews(locationId: string, pageNumber: number = 1): Promise<PagedResult<PlaceReviewDto>> {
    return locationApiService.getReviews(locationId, pageNumber);
  }

  async bulkDelete(ids: string[]): Promise<void> {
    await Promise.all(ids.map(id => this.deleteLocation(id)));
  }
}

export const locationManagementService = new LocationManagementService();
