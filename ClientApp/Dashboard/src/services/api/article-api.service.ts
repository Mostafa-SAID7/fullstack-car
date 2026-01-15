import { BaseApiService } from './base-api.service';
import { ArticleDto, CreateArticleRequest, UpdateArticleRequest, NewsCommentDto, CreateNewsCommentRequest, ArticleTagDto } from '../../types/community/article';
import { PagedResult } from '../../types/community/common';

export class ArticleApiService extends BaseApiService {
  private readonly endpoint = '/v7/community/articles';

  async getArticles(params: { pageNumber?: number; pageSize?: number; category?: number; status?: number; tag?: string }): Promise<PagedResult<ArticleDto>> {
    return this.get<PagedResult<ArticleDto>>(this.endpoint, {
      cache: true, cacheTTL: 120000,
      params: { pageNumber: params.pageNumber || 1, pageSize: params.pageSize || 20, ...(params.category && { category: params.category }), ...(params.status && { status: params.status }), ...(params.tag && { tag: params.tag }) }
    });
  }

  async getArticle(id: string): Promise<ArticleDto> {
    return this.get<ArticleDto>(`${this.endpoint}/${id}`, { cache: true, cacheTTL: 300000 });
  }

  async getArticleBySlug(slug: string): Promise<ArticleDto> {
    return this.get<ArticleDto>(`${this.endpoint}/slug/${slug}`, { cache: true, cacheTTL: 300000 });
  }

  async createArticle(request: CreateArticleRequest): Promise<ArticleDto> {
    return this.post<ArticleDto>(this.endpoint, request);
  }

  async updateArticle(id: string, request: UpdateArticleRequest): Promise<ArticleDto> {
    return this.put<ArticleDto>(`${this.endpoint}/${id}`, request);
  }

  async deleteArticle(id: string): Promise<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  async likeArticle(id: string): Promise<void> {
    return this.post<void>(`${this.endpoint}/${id}/like`, {});
  }

  async unlikeArticle(id: string): Promise<void> {
    return this.delete<void>(`${this.endpoint}/${id}/like`);
  }

  async shareArticle(id: string): Promise<void> {
    return this.post<void>(`${this.endpoint}/${id}/share`, {});
  }

  async getComments(articleId: string, pageNumber: number = 1): Promise<PagedResult<NewsCommentDto>> {
    return this.get<PagedResult<NewsCommentDto>>(`${this.endpoint}/${articleId}/comments`, {
      cache: true, cacheTTL: 30000, params: { pageNumber, pageSize: 20 }
    });
  }

  async addComment(request: CreateNewsCommentRequest): Promise<NewsCommentDto> {
    return this.post<NewsCommentDto>(`${this.endpoint}/${request.articleId}/comments`, request);
  }

  async getTags(): Promise<ArticleTagDto[]> {
    return this.get<ArticleTagDto[]>(`${this.endpoint}/tags`, { cache: true, cacheTTL: 3600000 });
  }
}

export const articleApiService = new ArticleApiService();
