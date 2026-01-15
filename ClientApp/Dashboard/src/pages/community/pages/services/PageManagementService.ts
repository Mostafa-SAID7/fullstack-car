import { pageApiService } from '@/services/api/page-api.service';
import { PageDto, CreatePageRequest, UpdatePageRequest, PageContentDto, PageRevisionDto } from '@/types/community/page';
import { PagedResult } from '@/types/community/common';

export class PageManagementService {
  async getPages(params: {
    pageNumber?: number;
    pageSize?: number;
    type?: number;
    status?: number;
  }): Promise<PagedResult<PageDto>> {
    return pageApiService.getPages(params);
  }

  async getPage(id: string): Promise<PageDto> {
    return pageApiService.getPage(id);
  }

  async getPageBySlug(slug: string): Promise<PageDto> {
    return pageApiService.getPageBySlug(slug);
  }

  async createPage(request: CreatePageRequest): Promise<PageDto> {
    return pageApiService.createPage(request);
  }

  async updatePage(id: string, request: UpdatePageRequest): Promise<PageDto> {
    return pageApiService.updatePage(id, request);
  }

  async deletePage(id: string): Promise<void> {
    return pageApiService.deletePage(id);
  }

  async publishPage(id: string): Promise<void> {
    return pageApiService.publishPage(id);
  }

  async unpublishPage(id: string): Promise<void> {
    return pageApiService.unpublishPage(id);
  }

  async getContent(pageId: string): Promise<PageContentDto> {
    return pageApiService.getContent(pageId);
  }

  async getRevisions(pageId: string, pageNumber: number = 1): Promise<PagedResult<PageRevisionDto>> {
    return pageApiService.getRevisions(pageId, pageNumber);
  }

  async bulkDelete(ids: string[]): Promise<void> {
    await Promise.all(ids.map(id => this.deletePage(id)));
  }

  async bulkPublish(ids: string[]): Promise<void> {
    await Promise.all(ids.map(id => this.publishPage(id)));
  }

  async bulkUnpublish(ids: string[]): Promise<void> {
    await Promise.all(ids.map(id => this.unpublishPage(id)));
  }
}

export const pageManagementService = new PageManagementService();
