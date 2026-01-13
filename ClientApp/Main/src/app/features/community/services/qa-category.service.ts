import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
    CategoriesResponse,
    Category,
    QA_API_ENDPOINTS
} from '../../../shared/types/qa-api.types';

@Injectable({
    providedIn: 'root'
})
export class QACategoryService {
    private readonly baseUrl = `${environment.apiUrl.replace(/\/api\/?$/, '')}${QA_API_ENDPOINTS.CATEGORIES.BASE}`;
    private readonly expertsUrl = (categoryId: string) =>
        `${environment.apiUrl.replace(/\/api\/?$/, '')}${QA_API_ENDPOINTS.CATEGORIES.EXPERTS(categoryId)}`;

    constructor(private http: HttpClient) { }

    getCategories(): Observable<CategoriesResponse> {
        return this.http.get<CategoriesResponse>(this.baseUrl);
    }

    // Future use: fetch experts for a category
    // getCategoryExperts(categoryId: string): Observable<any> {
    //   return this.http.get(this.expertsUrl(categoryId));
    // }
}
