import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Article, NewsComment } from '../../../core/models/news.model';
import { Result, PaginatedResult } from '../../../core/models/result.model';

@Injectable({
    providedIn: 'root'
})
export class NewsService {
    private apiUrl = `${environment.apiUrl}/v2.0/community/news`;

    constructor(private http: HttpClient) { }

    getArticles(pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<Article>> {
        return this.http.get<PaginatedResult<Article>>(`${this.apiUrl}/articles?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    }

    getArticle(id: string): Observable<Result<Article>> {
        return this.http.get<Result<Article>>(`${this.apiUrl}/articles/${id}`);
    }

    likeArticle(id: string): Observable<Result<any>> {
        return this.http.post<Result<any>>(`${this.apiUrl}/articles/${id}/like`, {});
    }

    addComment(id: string, content: string): Observable<Result<NewsComment>> {
        return this.http.post<Result<NewsComment>>(`${this.apiUrl}/articles/${id}/comments`, { content });
    }

    getFeaturedArticles(): Observable<Result<Article[]>> {
        return this.http.get<Result<Article[]>>(`${this.apiUrl}/articles/featured`);
    }
}
