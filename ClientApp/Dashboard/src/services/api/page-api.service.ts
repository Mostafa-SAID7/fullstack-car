import { BaseApiService } from './base-api.service';
import { PageDto, CreatePageRequest, UpdatePageRequest, PageContentDto, PageRevisionDto } from '../../types/community/page';
import { PagedResult } from '../../types/community/common';

export class PageApiService extends BaseApiService {
  private readonly endpoint = '/v7/community/pages';

  async getPages(params: { pageNumber?: number; pageSize?: number; type?: number; status?: number }): Promise<PagedResult<PageDto>> {
    return this.get<PagedResult<PageDto>>(this.endpoint, {
      cache: true, cacheTTL: 300000,
      params: { pageNumber: params.pageNumber || 1, pageSize: params.pageSize || 20, ...(params.type && { type: params.type }), ...(params.status && { status: params.status }) }
    });
  }

  async getPage(id: string): Promise<PageDto> {
    return this.get<PageDto>(`${this.endpoint}/${id}`, { cache: true, cacheTTL: 300000 });
  }

  async getPageBySlug(slug: string): Promise<PageDto> {
    return this.get<PageDto>(`${this.endpoint}/slug/${slug}`, { cache: true, cacheTTL: 300000 });
  }

  async createPage(request: CreatePageRequest): Promise<PageDto> {
    return this.post<PageDto>(this.endpoint, request);
  }

  async updatePage(id: string, request: UpdatePageRequest): Promise<PageDto> {
    return this.put<PageDto>(`${this.endpoint}/${id}`, request);
  }

  async deletePage(id: string): Promise<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  async publishPage(id: string): Promise<void> {
    return this.post<void>(`${this.endpoint}/${id}/publish`, {});
  }

  async unpublishPage(id: string): Promise<void> {
    return this.post<void>(`${this.endpoint}/${id}/unpublish`, {});
  }

  async getContent(pageId: string): Promise<PageContentDto> {
    return this.get<PageContentDto>(`${this.endpoint}/${pageId}/content`, { cache: true, cacheTTL: 300000 });
  }

  async getRevisions(pageId: string, pageNumber: number = 1): Promise<PagedResult<PageRevisionDto>> {
    return this.get<PagedResult<PageRevisionDto>>(`${this.endpoint}/${pageId}/revisions`, {
      cache: true, cacheTTL: 120000, params: { pageNumber, pageSize: 20 }
    });
  }
}

export const pageApiService = new PageApiService();
