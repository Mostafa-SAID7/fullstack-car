import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Article, NewsComment } from '../../../core/models/news.model';
import { Result, PaginatedResult } from '../../../core/models/result.model';

export interface NewsFilters {
    searchTerm?: string;
    category?: string;
    sortBy?: string;
    dateRange?: string;
}

export interface NewsPreferences {
    categories: boolean[];
    enableNotifications: boolean;
    notificationFrequency: string;
    emailDigest: string;
    preferredLanguage: string;
    regionalFocus: string;
}

@Injectable({
    providedIn: 'root'
})
export class NewsService {
    private apiUrl = `${environment.apiUrl}/v2.0/community/news`;

    constructor(private http: HttpClient) { }

    getArticles(pageNumber: number = 1, pageSize: number = 10, filters?: NewsFilters): Observable<PaginatedResult<Article>> {
        let params = new HttpParams()
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString());

        if (filters) {
            if (filters.searchTerm) {
                params = params.set('searchTerm', filters.searchTerm);
            }
            if (filters.category) {
                params = params.set('category', filters.category);
            }
            if (filters.sortBy) {
                params = params.set('sortBy', filters.sortBy);
            }
            if (filters.dateRange) {
                params = params.set('dateRange', filters.dateRange);
            }
        }

        return this.http.get<PaginatedResult<Article>>(`${this.apiUrl}/articles`, { params });
    }

    getArticle(id: string): Observable<Result<Article>> {
        return this.http.get<Result<Article>>(`${this.apiUrl}/articles/${id}`);
    }

    likeArticle(id: string): Observable<Result<any>> {
        return this.http.post<Result<any>>(`${this.apiUrl}/articles/${id}/like`, {});
    }

    saveArticle(id: string): Observable<Result<any>> {
        return this.http.post<Result<any>>(`${this.apiUrl}/articles/${id}/save`, {});
    }

    unsaveArticle(id: string): Observable<Result<any>> {
        return this.http.delete<Result<any>>(`${this.apiUrl}/articles/${id}/save`);
    }

    addComment(id: string, content: string): Observable<Result<NewsComment>> {
        return this.http.post<Result<NewsComment>>(`${this.apiUrl}/articles/${id}/comments`, { content });
    }

    getFeaturedArticles(): Observable<Result<Article[]>> {
        return this.http.get<Result<Article[]>>(`${this.apiUrl}/articles/featured`);
    }

    getArticlesByCategory(category: string, pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<Article>> {
        const params = new HttpParams()
            .set('category', category)
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString());

        return this.http.get<PaginatedResult<Article>>(`${this.apiUrl}/articles`, { params });
    }

    searchArticles(query: string, pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<Article>> {
        const params = new HttpParams()
            .set('searchTerm', query)
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString());

        return this.http.get<PaginatedResult<Article>>(`${this.apiUrl}/articles/search`, { params });
    }

    savePreferences(preferences: NewsPreferences): Observable<Result<any>> {
        return this.http.post<Result<any>>(`${this.apiUrl}/preferences`, preferences);
    }

    getPreferences(): Observable<Result<NewsPreferences>> {
        return this.http.get<Result<NewsPreferences>>(`${this.apiUrl}/preferences`);
    }

    reportArticle(id: string, reason: string): Observable<Result<any>> {
        return this.http.post<Result<any>>(`${this.apiUrl}/articles/${id}/report`, { reason });
    }
}
