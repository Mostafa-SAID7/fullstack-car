import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, finalize, map } from 'rxjs/operators';
import { ArticleApiService } from '../../../shared/services/api/article-api.service';
import { NotificationService } from '../../../shared/services/notification/notification.service';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import {
    ArticleDto,
    CreateArticleRequest,
    UpdateArticleRequest,
    NewsCommentDto,
    CreateNewsCommentRequest,
    ArticleCategory,
    ArticleStatus
} from '../../../shared/models/community/article.model';
import { PagedResult } from '../../../shared/models/community/common.model';
import { Article, NewsComment, ArticleStatus as LegacyArticleStatus } from '../../../core/models/news.model';
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
    private articlesSubject = new BehaviorSubject<Article[]>([]);
    public articles$ = this.articlesSubject.asObservable();

    private currentArticleSubject = new BehaviorSubject<Article | null>(null);
    public currentArticle$ = this.currentArticleSubject.asObservable();

    constructor(
        private articleApi: ArticleApiService,
        private notificationService: NotificationService,
        private loadingService: LoadingService
    ) { }

    /**
     * Get paginated list of articles
     */
    getArticles(pageNumber: number = 1, pageSize: number = 10, filters?: NewsFilters): Observable<PaginatedResult<Article>> {
        this.loadingService.show('articles-list', 'Loading articles...');

        return this.articleApi.getArticles({
            pageNumber,
            pageSize,
            category: filters?.category ? parseInt(filters.category) : undefined
        }).pipe(
            map(result => this.mapToLegacyPaginatedFormat(result)),
            tap(result => {
                if (result.items) {
                    this.articlesSubject.next(result.items);
                }
            }),
            catchError(error => {
                this.notificationService.error('Failed to load articles', error.message);
                return throwError(() => error);
            }),
            finalize(() => this.loadingService.hide('articles-list'))
        );
    }

    /**
     * Get a single article by ID
     */
    getArticle(id: string): Observable<Result<Article>> {
        this.loadingService.show('article-detail', 'Loading article...');

        return this.articleApi.getArticle(id).pipe(
            map(dto => {
                const article = this.mapDtoToArticle(dto);
                this.currentArticleSubject.next(article);
                return { succeeded: true, data: article, errors: [] } as Result<Article>;
            }),
            catchError(error => {
                this.notificationService.error('Failed to load article', error.message);
                return throwError(() => error);
            }),
            finalize(() => this.loadingService.hide('article-detail'))
        );
    }

    /**
     * Like an article
     */
    likeArticle(id: string): Observable<Result<any>> {
        return this.articleApi.likeArticle(id).pipe(
            tap(() => {
                // Update article in the list
                const articles = this.articlesSubject.value.map(article =>
                    article.id === id ? { ...article, likesCount: article.likesCount + 1 } : article
                );
                this.articlesSubject.next(articles);

                // Update current article if it's the one being liked
                if (this.currentArticleSubject.value?.id === id) {
                    this.currentArticleSubject.next({
                        ...this.currentArticleSubject.value,
                        likesCount: this.currentArticleSubject.value.likesCount + 1
                    });
                }
            }),
            map(() => ({ succeeded: true, data: null, errors: [] } as Result<any>)),
            catchError(error => {
                this.notificationService.error('Failed to like article', error.message);
                return throwError(() => error);
            })
        );
    }

    /**
     * Save an article (bookmark)
     */
    saveArticle(id: string): Observable<Result<any>> {
        this.notificationService.success('Article saved successfully');
        return new Observable(observer => {
            observer.next({ succeeded: true, data: null, errors: [] } as Result<any>);
            observer.complete();
        });
    }

    /**
     * Unsave an article (remove bookmark)
     */
    unsaveArticle(id: string): Observable<Result<any>> {
        this.notificationService.success('Article removed from saved');
        return new Observable(observer => {
            observer.next({ succeeded: true, data: null, errors: [] } as Result<any>);
            observer.complete();
        });
    }

    /**
     * Add a comment to an article
     */
    addComment(id: string, content: string): Observable<Result<NewsComment>> {
        const request: CreateNewsCommentRequest = {
            articleId: id,
            content
        };

        return this.articleApi.addComment(request).pipe(
            map(dto => {
                // Update article comment count in the list
                const articles = this.articlesSubject.value.map(article =>
                    article.id === id ? { ...article, commentsCount: article.commentsCount + 1 } : article
                );
                this.articlesSubject.next(articles);

                // Update current article if it's the one being commented on
                if (this.currentArticleSubject.value?.id === id) {
                    this.currentArticleSubject.next({
                        ...this.currentArticleSubject.value,
                        commentsCount: this.currentArticleSubject.value.commentsCount + 1
                    });
                }

                const comment = this.mapDtoToNewsComment(dto);
                this.notificationService.success('Comment added successfully');
                return { succeeded: true, data: comment, errors: [] } as Result<NewsComment>;
            }),
            catchError(error => {
                this.notificationService.error('Failed to add comment', error.message);
                return throwError(() => error);
            })
        );
    }

    /**
     * Get featured articles
     */
    getFeaturedArticles(): Observable<Result<Article[]>> {
        return this.articleApi.getArticles({
            pageNumber: 1,
            pageSize: 5,
            status: ArticleStatus.Featured
        }).pipe(
            map(result => ({
                succeeded: true,
                data: result.items.map(dto => this.mapDtoToArticle(dto)),
                errors: []
            } as Result<Article[]>)),
            catchError(error => {
                this.notificationService.error('Failed to load featured articles', error.message);
                return throwError(() => error);
            })
        );
    }

    /**
     * Get articles by category
     */
    getArticlesByCategory(category: string, pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<Article>> {
        return this.articleApi.getArticles({
            pageNumber,
            pageSize,
            category: parseInt(category)
        }).pipe(
            map(result => this.mapToLegacyPaginatedFormat(result)),
            catchError(error => {
                this.notificationService.error('Failed to load articles', error.message);
                return throwError(() => error);
            })
        );
    }

    /**
     * Search articles
     */
    searchArticles(query: string, pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<Article>> {
        // TODO: Implement search when backend supports it
        this.notificationService.info('Search functionality coming soon');
        return new Observable(observer => {
            observer.next({
                items: [],
                pageNumber: 1,
                pageSize: 10,
                totalCount: 0,
                totalPages: 0,
                hasPreviousPage: false,
                hasNextPage: false
            } as any);
            observer.complete();
        });
    }

    /**
     * Save user preferences
     */
    savePreferences(preferences: NewsPreferences): Observable<Result<any>> {
        // TODO: Implement when backend supports preferences
        this.notificationService.success('Preferences saved successfully');
        return new Observable(observer => {
            observer.next({ succeeded: true, data: null, errors: [] } as Result<any>);
            observer.complete();
        });
    }

    /**
     * Get user preferences
     */
    getPreferences(): Observable<Result<NewsPreferences>> {
        // TODO: Implement when backend supports preferences
        return new Observable(observer => {
            observer.next({
                succeeded: true,
                data: {
                    categories: [],
                    enableNotifications: false,
                    notificationFrequency: 'daily',
                    emailDigest: 'weekly',
                    preferredLanguage: 'en',
                    regionalFocus: 'global'
                },
                errors: []
            } as Result<NewsPreferences>);
            observer.complete();
        });
    }

    /**
     * Report an article
     */
    reportArticle(id: string, reason: string): Observable<Result<any>> {
        // TODO: Implement when backend supports reporting
        this.notificationService.success('Article reported successfully');
        return new Observable(observer => {
            observer.next({ succeeded: true, data: null, errors: [] } as Result<any>);
            observer.complete();
        });
    }

    /**
     * Share an article
     */
    shareArticle(id: string): Observable<void> {
        return this.articleApi.shareArticle(id).pipe(
            tap(() => {
                // Update article share count in the list
                const articles = this.articlesSubject.value.map(article =>
                    article.id === id ? { ...article, sharesCount: article.sharesCount + 1 } : article
                );
                this.articlesSubject.next(articles);

                this.notificationService.success('Article shared successfully');
            }),
            catchError(error => {
                this.notificationService.error('Failed to share article', error.message);
                return throwError(() => error);
            })
        );
    }

    /**
     * Clear current article
     */
    clearCurrentArticle(): void {
        this.currentArticleSubject.next(null);
    }

    // Mapping methods
    private mapDtoToArticle(dto: ArticleDto): Article {
        return {
            id: dto.id,
            title: dto.title,
            slug: dto.slug,
            summary: dto.summary,
            content: dto.content,
            featuredImageUrl: dto.imageUrl,
            status: this.mapStatusToLegacy(dto.status),
            priority: 1, // Normal priority
            publishedAt: dto.publishedAt ? (typeof dto.publishedAt === 'string' ? new Date(dto.publishedAt) : dto.publishedAt) : undefined,
            viewsCount: dto.viewsCount,
            likesCount: dto.likesCount,
            commentsCount: dto.commentsCount,
            sharesCount: dto.sharesCount,
            tags: dto.tags?.join(','),
            isFeatured: dto.status === ArticleStatus.Featured,
            authorId: dto.authorId,
            categoryId: dto.category.toString(),
            author: {
                firstName: dto.authorFirstName,
                lastName: dto.authorLastName,
                profileImageUrl: dto.authorProfileImageUrl
            },
            category: {
                id: dto.category,
                name: this.getCategoryName(dto.category)
            },
            createdAt: typeof dto.createdAt === 'string' ? new Date(dto.createdAt) : dto.createdAt
        };
    }

    private mapDtoToNewsComment(dto: NewsCommentDto): NewsComment {
        return {
            id: dto.id,
            content: dto.content,
            articleId: dto.articleId,
            userId: dto.userId,
            user: {
                firstName: dto.userFirstName,
                lastName: dto.userLastName,
                profileImageUrl: dto.userProfileImageUrl
            },
            createdAt: typeof dto.createdAt === 'string' ? new Date(dto.createdAt) : dto.createdAt
        };
    }

    private mapStatusToLegacy(status: ArticleStatus): LegacyArticleStatus {
        switch (status) {
            case ArticleStatus.Draft: return LegacyArticleStatus.Draft;
            case ArticleStatus.Published: return LegacyArticleStatus.Published;
            case ArticleStatus.Archived: return LegacyArticleStatus.Archived;
            case ArticleStatus.Featured: return LegacyArticleStatus.Published;
            default: return LegacyArticleStatus.Draft;
        }
    }

    private getCategoryName(category: ArticleCategory): string {
        switch (category) {
            case ArticleCategory.Industry: return 'Industry';
            case ArticleCategory.Technology: return 'Technology';
            case ArticleCategory.Reviews: return 'Reviews';
            case ArticleCategory.Events: return 'Events';
            case ArticleCategory.Tips: return 'Tips';
            case ArticleCategory.Maintenance: return 'Maintenance';
            case ArticleCategory.Lifestyle: return 'Lifestyle';
            case ArticleCategory.Racing: return 'Racing';
            default: return 'Unknown';
        }
    }

    private mapToLegacyPaginatedFormat(result: PagedResult<ArticleDto>): PaginatedResult<Article> {
        return {
            items: result.items?.map(dto => this.mapDtoToArticle(dto)) || [],
            pageNumber: result.pageNumber,
            pageSize: result.pageSize,
            totalPages: result.totalPages,
            totalCount: result.totalCount,
            hasPreviousPage: result.hasPreviousPage,
            hasNextPage: result.hasNextPage
        } as any;
    }
}
