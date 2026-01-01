import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Location, CheckIn, PlaceReview } from '../../../core/models/maps.model';
import { Result, PaginatedResult } from '../../../core/models/result.model';

@Injectable({
    providedIn: 'root'
})
export class MapsService {
    private apiUrl = `${environment.apiUrl}/v2.0/community/maps`;

    constructor(private http: HttpClient) { }

    getLocations(type?: number, pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<Location>> {
        let url = `${this.apiUrl}/locations?pageNumber=${pageNumber}&pageSize=${pageSize}`;
        if (type !== undefined) {
            url += `&type=${type}`;
        }
        return this.http.get<PaginatedResult<Location>>(url);
    }

    getLocation(id: string): Observable<Result<Location>> {
        return this.http.get<Result<Location>>(`${this.apiUrl}/locations/${id}`);
    }

    checkIn(locationId: string, comment?: string): Observable<Result<CheckIn>> {
        return this.http.post<Result<CheckIn>>(`${this.apiUrl}/locations/${locationId}/check-in`, { comment });
    }

    addReview(locationId: string, rating: number, title: string, content: string): Observable<Result<PlaceReview>> {
        return this.http.post<Result<PlaceReview>>(`${this.apiUrl}/locations/${locationId}/reviews`, { rating, title, content });
    }

    getNearbyLocations(lat: number, lng: number, radiusInKm: number = 10): Observable<Result<Location[]>> {
        return this.http.get<Result<Location[]>>(`${this.apiUrl}/locations/nearby?lat=${lat}&lng=${lng}&radius=${radiusInKm}`);
    }
}
