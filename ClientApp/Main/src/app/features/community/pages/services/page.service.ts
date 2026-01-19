import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, finalize, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../../core/services/toast.service';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { environment } from '../../../../../environments/environment';
import {
  PageDto,
  PageContentDto,
  CreatePageRequest,
  UpdatePageRequest,
  PageRevisionDto,
  PageStatus,
  PageType
} from '../../../../shared/models/community/page.model';
import { PagedResult } from '../../../../shared/models/community/common.model';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  private pagesSubject = new BehaviorSubject<PageDto[]>([]);
  public pages$ = this.pagesSubject.asObservable();

  private currentPageSubject = new BehaviorSubject<PageDto | null>(null);
  public currentPage$ = this.currentPageSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toastService: ToastService,
    private loadingService: LoadingService
  ) { }

  /**
   * Get paginated list of pages
   */
  getPages(params: {
    pageNumber?: number;
    pageSize?: number;
    type?: PageType;
    status?: PageStatus;
  } = {}): Observable<PagedResult<PageDto>> {
    this.loadingService.show('pages-list', 'Loading pages...');

    const queryParams: any = {
      pageNumber: params.pageNumber || 1,
      pageSize: params.pageSize || 20
    };
    if (params.type !== undefined) queryParams.type = params.type;
    if (params.status !== undefined) queryParams.status = params.status;

    return this.http.get<PagedResult<PageDto>>(`${environment.apiUrl}/v1/pages`, { params: queryParams }).pipe(
      tap(result => {
        if (result.items) {
          this.pagesSubject.next(result.items);
        }
      }),
      catchError(error => {
        this.toastService.error('Failed to load pages', error.message);
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide('pages-list'))
    );
  }

  /**
   * Get a single page by ID
   */
  getPage(id: string): Observable<PageDto> {
    this.loadingService.show('page-detail', 'Loading page...');

    return this.http.get<PageDto>(`${environment.apiUrl}/v1/pages/${id}`).pipe(
      tap(page => {
        this.currentPageSubject.next(page);
      }),
      catchError(error => {
        this.toastService.error('Failed to load page', error.message);
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide('page-detail'))
    );
  }

  /**
   * Get a page by slug
   */
  getPageBySlug(slug: string): Observable<PageDto> {
    this.loadingService.show('page-detail', 'Loading page...');

    return this.http.get<PageDto>(`${environment.apiUrl}/v1/pages/slug/${slug}`).pipe(
      tap(page => {
        this.currentPageSubject.next(page);
      }),
      catchError(error => {
        this.toastService.error('Failed to load page', error.message);
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide('page-detail'))
    );
  }

  /**
   * Get page content
   */
  getPageContent(pageId: string): Observable<PageContentDto> {
    return this.http.get<PageContentDto>(`${environment.apiUrl}/v1/pages/${pageId}/content`).pipe(
      catchError(error => {
        this.toastService.error('Failed to load page content', error.message);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get page revisions
   */
  getPageRevisions(pageId: string, pageNumber: number = 1): Observable<PagedResult<PageRevisionDto>> {
    return this.http.get<PagedResult<PageRevisionDto>>(`${environment.apiUrl}/v1/pages/${pageId}/revisions`, {
      params: { pageNumber: pageNumber.toString() }
    }).pipe(
      catchError(error => {
        this.toastService.error('Failed to load page revisions', error.message);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new page (admin only)
   */
  createPage(request: CreatePageRequest): Observable<PageDto> {
    this.loadingService.show('create-page', 'Creating page...');

    return this.http.post<PageDto>(`${environment.apiUrl}/v1/pages`, request).pipe(
      tap(page => {
        // Add new page to the beginning of the list
        const currentPages = this.pagesSubject.value;
        this.pagesSubject.next([page, ...currentPages]);
        this.toastService.success('Page created successfully');
      }),
      catchError(error => {
        this.toastService.error('Failed to create page', error.message);
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide('create-page'))
    );
  }

  /**
   * Update an existing page (admin only)
   */
  updatePage(id: string, request: UpdatePageRequest): Observable<PageDto> {
    this.loadingService.show('update-page', 'Updating page...');

    return this.http.put<PageDto>(`${environment.apiUrl}/v1/pages/${id}`, request).pipe(
      tap(page => {
        // Update page in the list
        const pages = this.pagesSubject.value.map(p =>
          p.id === id ? page : p
        );
        this.pagesSubject.next(pages);

        // Update current page if it's the one being edited
        if (this.currentPageSubject.value?.id === id) {
          this.currentPageSubject.next(page);
        }

        this.toastService.success('Page updated successfully');
      }),
      catchError(error => {
        this.toastService.error('Failed to update page', error.message);
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide('update-page'))
    );
  }

  /**
   * Delete a page (admin only)
   */
  deletePage(id: string): Observable<void> {
    this.loadingService.show('delete-page', 'Deleting page...');

    return this.http.delete<void>(`${environment.apiUrl}/v1/pages/${id}`).pipe(
      tap(() => {
        // Remove page from the list
        const pages = this.pagesSubject.value.filter(page => page.id !== id);
        this.pagesSubject.next(pages);

        // Clear current page if it's the one being deleted
        if (this.currentPageSubject.value?.id === id) {
          this.currentPageSubject.next(null);
        }

        this.toastService.success('Page deleted successfully');
      }),
      catchError(error => {
        this.toastService.error('Failed to delete page', error.message);
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide('delete-page'))
    );
  }

  /**
   * Publish a page (admin only)
   */
  publishPage(id: string): Observable<void> {
    this.loadingService.show('publish-page', 'Publishing page...');

    return this.http.post<void>(`${environment.apiUrl}/v1/pages/${id}/publish`, {}).pipe(
      tap(() => {
        // Update page status in the list
        const pages = this.pagesSubject.value.map(page =>
          page.id === id ? { ...page, status: PageStatus.Published, publishedAt: new Date() } : page
        );
        this.pagesSubject.next(pages);

        // Update current page if it's the one being published
        if (this.currentPageSubject.value?.id === id) {
          this.currentPageSubject.next({
            ...this.currentPageSubject.value,
            status: PageStatus.Published,
            publishedAt: new Date()
          });
        }

        this.toastService.success('Page published successfully');
      }),
      catchError(error => {
        this.toastService.error('Failed to publish page', error.message);
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide('publish-page'))
    );
  }

  /**
   * Unpublish a page (admin only)
   */
  unpublishPage(id: string): Observable<void> {
    this.loadingService.show('unpublish-page', 'Unpublishing page...');

    return this.http.post<void>(`${environment.apiUrl}/v1/pages/${id}/unpublish`, {}).pipe(
      tap(() => {
        // Update page status in the list
        const pages = this.pagesSubject.value.map(page =>
          page.id === id ? { ...page, status: PageStatus.Draft } : page
        );
        this.pagesSubject.next(pages);

        // Update current page if it's the one being unpublished
        if (this.currentPageSubject.value?.id === id) {
          this.currentPageSubject.next({
            ...this.currentPageSubject.value,
            status: PageStatus.Draft
          });
        }

        this.toastService.success('Page unpublished successfully');
      }),
      catchError(error => {
        this.toastService.error('Failed to unpublish page', error.message);
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide('unpublish-page'))
    );
  }

  /**
   * Clear current page
   */
  clearCurrentPage(): void {
    this.currentPageSubject.next(null);
  }

  /**
   * Get page type label
   */
  getPageTypeLabel(type: PageType): string {
    switch (type) {
      case PageType.Article: return 'Article';
      case PageType.Guide: return 'Guide';
      case PageType.FAQ: return 'FAQ';
      case PageType.Policy: return 'Policy';
      case PageType.About: return 'About';
      case PageType.Help: return 'Help';
      default: return 'Unknown';
    }
  }

  /**
   * Get page status label
   */
  getPageStatusLabel(status: PageStatus): string {
    switch (status) {
      case PageStatus.Draft: return 'Draft';
      case PageStatus.Published: return 'Published';
      case PageStatus.Archived: return 'Archived';
      default: return 'Unknown';
    }
  }
}
