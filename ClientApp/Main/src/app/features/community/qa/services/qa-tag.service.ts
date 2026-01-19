import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
    TagsResponse,
    PopularTagsResponse,
    QA_API_ENDPOINTS
} from '../models/qa-api.types';

@Injectable({
    providedIn: 'root'
})
export class QATagService {
    private readonly baseUrl = `${environment.apiUrl.replace(/\/api\/?$/, '')}${QA_API_ENDPOINTS.TAGS.BASE}`;
    private readonly popularUrl = `${environment.apiUrl.replace(/\/api\/?$/, '')}${QA_API_ENDPOINTS.TAGS.POPULAR}`;

    constructor(private http: HttpClient) { }

    getAllTags(): Observable<TagsResponse> {
        return this.http.get<TagsResponse>(this.baseUrl);
    }

    getPopularTags(): Observable<PopularTagsResponse> {
        return this.http.get<PopularTagsResponse>(this.popularUrl);
    }
}
