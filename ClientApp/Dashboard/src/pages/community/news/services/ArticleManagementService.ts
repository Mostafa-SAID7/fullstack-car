import { articleApiService } from '@/services/api/article-api.service';
import { ArticleDto, CreateArticleRequest, UpdateArticleRequest, NewsCommentDto, ArticleTagDto } from '@/types/community/article';
import { PagedResult } from '@/types/community/common';

export class ArticleManagementService {
  async getArticles(params: {
    pageNumber?: number;
    pageSize?: number;
    category?: number;
    status?: number;
    tag?: string;
  }): Promise<PagedResult<ArticleDto>> {
    return articleApiService.getArticles(params);
  }

  async getArticle(id: string): Promise<ArticleDto> {
    return articleApiService.getArticle(id);
  }

  async getArticleBySlug(slug: string): Promise<ArticleDto> {
    return articleApiService.getArticleBySlug(slug);
  }

  async createArticle(request: CreateArticleRequest): Promise<ArticleDto> {
    return articleApiService.createArticle(request);
  }

  async updateArticle(id: string, request: UpdateArticleRequest): Promise<ArticleDto> {
    return articleApiService.updateArticle(id, request);
  }

  async deleteArticle(id: string): Promise<void> {
    return articleApiService.deleteArticle(id);
  }

  async getComments(articleId: string, pageNumber: number = 1): Promise<PagedResult<NewsCommentDto>> {
    return articleApiService.getComments(articleId, pageNumber);
  }

  async getTags(): Promise<ArticleTagDto[]> {
    return articleApiService.getTags();
  }

  async bulkDelete(ids: string[]): Promise<void> {
    await Promise.all(ids.map(id => this.deleteArticle(id)));
  }
}

export const articleManagementService = new ArticleManagementService();
