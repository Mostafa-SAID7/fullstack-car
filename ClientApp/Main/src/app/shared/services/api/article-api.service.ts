import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { BaseApiService } from './base-api.service';
import {
  ArticleDto,
  CreateArticleRequest,
  UpdateArticleRequest,
  NewsCommentDto,
  CreateNewsCommentRequest,
  ArticleTagDto
} from '../../models/community/article.model';
import { PagedResult } from '../../models/community/common.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleApiService extends BaseApiService {
  private readonly endpoint = '/v2.0/articles';

  getArticles(params: {
    pageNumber?: number;
    pageSize?: number;
    category?: number;
    status?: number;
    tag?: string;
  }): Observable<PagedResult<ArticleDto>> {
    let httpParams = new HttpParams()
      .set('pageNumber', (params.pageNumber || 1).toString())
      .set('pageSize', (params.pageSize || 20).toString());

    if (params.category) {
      httpParams = httpParams.set('category', params.category.toString());
    }
    if (params.status) {
      httpParams = httpParams.set('status', params.status.toString());
    }
    if (params.tag) {
      httpParams = httpParams.set('tag', params.tag);
    }

    return this.get<PagedResult<ArticleDto>>(this.endpoint, {
      cache: true,
      cacheTTL: 120000, // 2 minutes
      params: httpParams
    });
  }

  getArticle(id: string): Observable<ArticleDto> {
    return this.get<ArticleDto>(`${this.endpoint}/${id}`, {
      cache: true,
      cacheTTL: 300000 // 5 minutes
    });
  }

  getArticleBySlug(slug: string): Observable<ArticleDto> {
    return this.get<ArticleDto>(`${this.endpoint}/slug/${slug}`, {
      cache: true,
      cacheTTL: 300000 // 5 minutes
    });
  }

  createArticle(request: CreateArticleRequest): Observable<ArticleDto> {
    return this.post<ArticleDto>(this.endpoint, request);
  }

  updateArticle(id: string, request: UpdateArticleRequest): Observable<ArticleDto> {
    return this.put<ArticleDto>(`${this.endpoint}/${id}`, request);
  }

  deleteArticle(id: string): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  likeArticle(id: string): Observable<void> {
    return this.post<void>(`${this.endpoint}/${id}/like`, {});
  }

  unlikeArticle(id: string): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}/like`);
  }

  shareArticle(id: string): Observable<void> {
    return this.post<void>(`${this.endpoint}/${id}/share`, {});
  }

  getComments(articleId: string, pageNumber: number = 1): Observable<PagedResult<NewsCommentDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', '20');

    return this.get<PagedResult<NewsCommentDto>>(`${this.endpoint}/${articleId}/comments`, {
      cache: true,
      cacheTTL: 30000, // 30 seconds
      params
    });
  }

  addComment(request: CreateNewsCommentRequest): Observable<NewsCommentDto> {
    return this.post<NewsCommentDto>(`${this.endpoint}/${request.articleId}/comments`, request);
  }

  getTags(): Observable<ArticleTagDto[]> {
    return this.get<ArticleTagDto[]>(`${this.endpoint}/tags`, {
      cache: true,
      cacheTTL: 3600000 // 1 hour
    });
  }
}
