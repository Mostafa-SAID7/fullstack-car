import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { BaseApiService } from './base-api.service';
import { 
  LocationDto, 
  CreateLocationRequest, 
  CheckInDto, 
  CreateCheckInRequest,
  PlaceReviewDto,
  CreatePlaceReviewRequest,
  LocationHourDto
} from '../../models/community/location.model';
import { PagedResult } from '../../models/community/common.model';

@Injectable({
  providedIn: 'root'
})
export class LocationApiService extends BaseApiService {
  private readonly endpoint = '/v7/community/locations';

  getLocations(params: {
    pageNumber?: number;
    pageSize?: number;
    category?: number;
    city?: string;
    country?: string;
  }): Observable<PagedResult<LocationDto>> {
    let httpParams = new HttpParams()
      .set('pageNumber', (params.pageNumber || 1).toString())
      .set('pageSize', (params.pageSize || 20).toString());
    
    if (params.category) {
      httpParams = httpParams.set('category', params.category.toString());
    }
    if (params.city) {
      httpParams = httpParams.set('city', params.city);
    }
    if (params.country) {
      httpParams = httpParams.set('country', params.country);
    }
    
    return this.get<PagedResult<LocationDto>>(this.endpoint, {
      cache: true,
      cacheTTL: 300000, // 5 minutes
      params: httpParams
    });
  }

  getLocation(id: string): Observable<LocationDto> {
    return this.get<LocationDto>(`${this.endpoint}/${id}`, {
      cache: true,
      cacheTTL: 300000 // 5 minutes
    });
  }

  createLocation(request: CreateLocationRequest): Observable<LocationDto> {
    return this.post<LocationDto>(this.endpoint, request);
  }

  updateLocation(id: string, request: Partial<CreateLocationRequest>): Observable<LocationDto> {
    return this.put<LocationDto>(`${this.endpoint}/${id}`, request);
  }

  deleteLocation(id: string): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  getHours(locationId: string): Observable<LocationHourDto[]> {
    return this.get<LocationHourDto[]>(`${this.endpoint}/${locationId}/hours`, {
      cache: true,
      cacheTTL: 3600000 // 1 hour
    });
  }

  checkIn(request: CreateCheckInRequest): Observable<CheckInDto> {
    return this.post<CheckInDto>(`${this.endpoint}/${request.locationId}/check-in`, request);
  }

  getCheckIns(locationId: string, pageNumber: number = 1): Observable<PagedResult<CheckInDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', '20');
    
    return this.get<PagedResult<CheckInDto>>(`${this.endpoint}/${locationId}/check-ins`, {
      cache: true,
      cacheTTL: 60000, // 1 minute
      params
    });
  }

  createReview(request: CreatePlaceReviewRequest): Observable<PlaceReviewDto> {
    return this.post<PlaceReviewDto>(`${this.endpoint}/${request.locationId}/reviews`, request);
  }

  getReviews(locationId: string, pageNumber: number = 1): Observable<PagedResult<PlaceReviewDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', '20');
    
    return this.get<PagedResult<PlaceReviewDto>>(`${this.endpoint}/${locationId}/reviews`, {
      cache: true,
      cacheTTL: 120000, // 2 minutes
      params
    });
  }
}
