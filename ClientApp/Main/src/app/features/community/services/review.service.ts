import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Review, CreateReviewRequest } from '../../../core/models/review.model';
import { Result, PaginatedResult } from '../../../core/models/result.model';

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private apiUrl = `${environment.apiUrl}/v2.0/community/reviews`;

    constructor(private http: HttpClient) { }

    getReviews(pageNumber: number = 1, pageSize: number = 10, carBrand?: string, carModel?: string): Observable<PaginatedResult<Review>> {
        let url = `${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
        if (carBrand) url += `&carBrand=${carBrand}`;
        if (carModel) url += `&carModel=${carModel}`;
        return this.http.get<PaginatedResult<Review>>(url);
    }

    getReview(id: string): Observable<Result<Review>> {
        return this.http.get<Result<Review>>(`${this.apiUrl}/${id}`);
    }

    createReview(request: CreateReviewRequest): Observable<Result<Review>> {
        return this.http.post<Result<Review>>(this.apiUrl, request);
    }

    markHelpful(id: string): Observable<Result<any>> {
        return this.http.post<Result<any>>(`${this.apiUrl}/${id}/helpful`, {});
    }

    getCarReviews(brand: string, model: string, pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<Review>> {
        return this.http.get<PaginatedResult<Review>>(`${this.apiUrl}/car/${brand}/${model}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    }

    getUserReviews(userId: string, pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<Review>> {
        return this.http.get<PaginatedResult<Review>>(`${this.apiUrl}/user/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    }
}
