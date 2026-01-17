import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { BaseApiService } from './base-api.service';
import {
  PageDto,
  CreatePageRequest,
  UpdatePageRequest,
  PageContentDto,
  PageRevisionDto
} from '../../models/community/page.model';
import { PagedResult } from '../../models/community/common.model';

@Injectable({
  providedIn: 'root'
})
export class PageApiService extends BaseApiService {
  private readonly endpoint = '/v2.0/pages';

  getPages(params: {
    pageNumber?: number;
    pageSize?: number;
    type?: number;
    status?: number;
  }): Observable<PagedResult<PageDto>> {
    let httpParams = new HttpParams()
      .set('pageNumber', (params.pageNumber || 1).toString())
      .set('pageSize', (params.pageSize || 20).toString());

    if (params.type) {
      httpParams = httpParams.set('type', params.type.toString());
    }
    if (params.status) {
      httpParams = httpParams.set('status', params.status.toString());
    }

    return this.get<PagedResult<PageDto>>(this.endpoint, {
      cache: true,
      cacheTTL: 300000, // 5 minutes
      params: httpParams
    });
  }

  getPage(id: string): Observable<PageDto> {
    return this.get<PageDto>(`${this.endpoint}/${id}`, {
      cache: true,
      cacheTTL: 300000 // 5 minutes
    });
  }

  getPageBySlug(slug: string): Observable<PageDto> {
    return this.get<PageDto>(`${this.endpoint}/slug/${slug}`, {
      cache: true,
      cacheTTL: 300000 // 5 minutes
    });
  }

  createPage(request: CreatePageRequest): Observable<PageDto> {
    return this.post<PageDto>(this.endpoint, request);
  }

  updatePage(id: string, request: UpdatePageRequest): Observable<PageDto> {
    return this.put<PageDto>(`${this.endpoint}/${id}`, request);
  }

  deletePage(id: string): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  publishPage(id: string): Observable<void> {
    return this.post<void>(`${this.endpoint}/${id}/publish`, {});
  }

  unpublishPage(id: string): Observable<void> {
    return this.post<void>(`${this.endpoint}/${id}/unpublish`, {});
  }

  getContent(pageId: string): Observable<PageContentDto> {
    return this.get<PageContentDto>(`${this.endpoint}/${pageId}/content`, {
      cache: true,
      cacheTTL: 300000 // 5 minutes
    });
  }

  getRevisions(pageId: string, pageNumber: number = 1): Observable<PagedResult<PageRevisionDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', '20');

    return this.get<PagedResult<PageRevisionDto>>(`${this.endpoint}/${pageId}/revisions`, {
      cache: true,
      cacheTTL: 120000, // 2 minutes
      params
    });
  }
}
