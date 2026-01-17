import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, finalize, map } from 'rxjs/operators';
import { GuideApiService } from '../../../shared/services/api/guide-api.service';
import { ToastService } from '../../../core/services/toast.service';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { 
  GuideDto,
  CreateGuideRequest as NewCreateGuideRequest,
  UpdateGuideRequest,
  GuideStepDto,
  GuideDifficulty as NewGuideDifficulty,
  GuideCategory as NewGuideCategory
} from '../../../shared/models/community/guide.model';
import { PagedResult } from '../../../shared/models/community/common.model';
import { 
  Guide, 
  GuideListItem, 
  CreateGuideRequest, 
  RateGuideRequest, 
  GuideFilters,
  GuideCategory,
  GuideDifficulty,
  GuideStep
} from '../models/guide.model';
import { PaginatedResult } from '../../../core/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class GuidesService {
  private guidesSubject = new BehaviorSubject<GuideListItem[]>([]);
  public guides$ = this.guidesSubject.asObservable();

  private currentGuideSubject = new BehaviorSubject<Guide | null>(null);
  public currentGuide$ = this.currentGuideSubject.asObservable();

  constructor(
    private guideApi: GuideApiService,
    private toastService: ToastService,
    private loadingService: LoadingService
  ) {}

  getGuides(filters?: GuideFilters): Observable<PaginatedResult<GuideListItem>> {
    this.loadingService.show('guides-list', 'Loading guides...');
    
    return this.guideApi.getGuides({
      pageNumber: filters?.page || 1,
      pageSize: filters?.pageSize || 10,
      category: filters?.category,
      difficulty: filters?.difficulty
    }).pipe(
      map(result => this.mapToLegacyPaginatedFormat(result)),
      tap(result => {
        if (result.items) {
          this.guidesSubject.next(result.items);
        }
      }),
      catchError(error => {
        this.toastService.error('Failed to load guides', error.message);
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide('guides-list'))
    );
  }

  getGuideById(id: number): Observable<Guide> {
    this.loadingService.show('guide-detail', 'Loading guide...');
    
    return this.guideApi.getGuide(id.toString()).pipe(
      map(dto => {
        const guide = this.mapDtoToGuide(dto);
        this.currentGuideSubject.next(guide);
        return guide;
      }),
      catchError(error => {
        this.toastService.error('Failed to load guide', error.message);
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide('guide-detail'))
    );
  }

  createGuide(request: CreateGuideRequest): Observable<Guide> {
    this.loadingService.show('create-guide', 'Creating guide...');
    
    const newRequest: NewCreateGuideRequest = {
      title: request.title,
      description: request.summary,
      category: request.category as unknown as NewGuideCategory,
      difficulty: request.difficulty as unknown as NewGuideDifficulty,
      estimatedTime: request.estimatedReadTime,
      imageUrl: request.thumbnailUrl,
      steps: request.steps.map(step => ({
        stepNumber: step.stepNumber,
        title: step.title,
        description: step.content,
        imageUrl: step.imageUrl,
        videoUrl: step.videoUrl,
        tips: step.tips ? [step.tips] : undefined,
        warnings: step.warningNotes ? [step.warningNotes] : undefined
      }))
    };
    
    return this.guideApi.createGuide(newRequest).pipe(
      map(dto => {
        const guide = this.mapDtoToGuide(dto);
        this.toastService.success('Guide created successfully');
        return guide;
      }),
      catchError(error => {
        this.toastService.error('Failed to create guide', error.message);
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide('create-guide'))
    );
  }

  updateGuide(id: number, request: CreateGuideRequest): Observable<Guide> {
    this.loadingService.show('update-guide', 'Updating guide...');
    
    const updateRequest: UpdateGuideRequest = {
      title: request.title,
      description: request.summary,
      category: request.category as unknown as NewGuideCategory,
      difficulty: request.difficulty as unknown as NewGuideDifficulty,
      estimatedTime: request.estimatedReadTime,
      imageUrl: request.thumbnailUrl
    };
    
    return this.guideApi.updateGuide(id.toString(), updateRequest).pipe(
      map(dto => {
        const guide = this.mapDtoToGuide(dto);
        this.toastService.success('Guide updated successfully');
        return guide;
      }),
      catchError(error => {
        this.toastService.error('Failed to update guide', error.message);
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide('update-guide'))
    );
  }

  rateGuide(request: RateGuideRequest): Observable<void> {
    this.loadingService.show('rate-guide', 'Submitting rating...');
    
    return this.guideApi.rateGuide(request.guideId.toString(), request.rating, request.comment).pipe(
      map(() => {
        this.toastService.success('Rating submitted successfully');
      }),
      catchError(error => {
        this.toastService.error('Failed to submit rating', error.message);
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide('rate-guide'))
    );
  }

  bookmarkGuide(id: number, notes?: string): Observable<void> {
    return this.guideApi.bookmarkGuide(id.toString()).pipe(
      tap(() => {
        this.toastService.success('Guide bookmarked successfully');
      }),
      catchError(error => {
        this.toastService.error('Failed to bookmark guide', error.message);
        return throwError(() => error);
      })
    );
  }

  getBookmarkedGuides(page: number = 1, pageSize: number = 10): Observable<PaginatedResult<GuideListItem>> {
    this.toastService.info('Bookmarked guides feature coming soon');
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

  getCategories(): Observable<{ value: number; name: string }[]> {
    return new Observable(observer => {
      const categories = Object.keys(GuideCategory)
        .filter(key => !isNaN(Number(key)))
        .map(key => ({
          value: parseInt(key),
          name: GuideCategory[parseInt(key)]
        }));
      observer.next(categories);
      observer.complete();
    });
  }

  getDifficulties(): Observable<{ value: number; name: string }[]> {
    return new Observable(observer => {
      const difficulties = Object.keys(GuideDifficulty)
        .filter(key => !isNaN(Number(key)))
        .map(key => ({
          value: parseInt(key),
          name: GuideDifficulty[parseInt(key)]
        }));
      observer.next(difficulties);
      observer.complete();
    });
  }

  clearCurrentGuide(): void {
    this.currentGuideSubject.next(null);
  }

  getCategoryName(category: GuideCategory): string {
    return GuideCategory[category] || 'Unknown';
  }

  getDifficultyName(difficulty: GuideDifficulty): string {
    return GuideDifficulty[difficulty] || 'Unknown';
  }

  getDifficultyColor(difficulty: GuideDifficulty): string {
    switch (difficulty) {
      case GuideDifficulty.Beginner:
        return 'text-green-600';
      case GuideDifficulty.Intermediate:
        return 'text-yellow-600';
      case GuideDifficulty.Advanced:
        return 'text-orange-600';
      case GuideDifficulty.Expert:
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }

  private mapDtoToGuide(dto: GuideDto): Guide {
    return {
      id: parseInt(dto.id),
      title: dto.title,
      content: dto.description,
      summary: dto.description,
      category: dto.category as unknown as GuideCategory,
      categoryName: this.getCategoryName(dto.category as unknown as GuideCategory),
      difficulty: dto.difficulty as unknown as GuideDifficulty,
      difficultyName: this.getDifficultyName(dto.difficulty as unknown as GuideDifficulty),
      estimatedReadTime: dto.estimatedTime,
      isFeatured: false,
      isPublished: true,
      tags: [],
      thumbnailUrl: dto.imageUrl,
      userRating: undefined,
      averageRating: dto.rating,
      ratingCount: dto.ratingsCount,
      authorId: dto.userId,
      authorName: `${dto.userFirstName} ${dto.userLastName}`,
      authorAvatar: dto.userProfileImageUrl,
      createdAt: typeof dto.createdAt === 'string' ? new Date(dto.createdAt) : dto.createdAt,
      updatedAt: dto.updatedAt ? (typeof dto.updatedAt === 'string' ? new Date(dto.updatedAt) : dto.updatedAt) : undefined,
      viewCount: dto.viewsCount,
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      bookmarkCount: dto.bookmarksCount,
      isLiked: false,
      isBookmarked: false
    };
  }

  private mapDtoToGuideListItem(dto: GuideDto): GuideListItem {
    return {
      id: parseInt(dto.id),
      title: dto.title,
      summary: dto.description,
      category: dto.category as unknown as GuideCategory,
      categoryName: this.getCategoryName(dto.category as unknown as GuideCategory),
      difficulty: dto.difficulty as unknown as GuideDifficulty,
      difficultyName: this.getDifficultyName(dto.difficulty as unknown as GuideDifficulty),
      estimatedReadTime: dto.estimatedTime,
      isFeatured: false,
      viewCount: dto.viewsCount,
      likeCount: 0,
      bookmarkCount: dto.bookmarksCount,
      tags: [],
      thumbnailUrl: dto.imageUrl,
      createdAt: typeof dto.createdAt === 'string' ? new Date(dto.createdAt) : dto.createdAt,
      authorName: `${dto.userFirstName} ${dto.userLastName}`,
      authorAvatar: dto.userProfileImageUrl,
      isBookmarked: false,
      averageRating: dto.rating,
      ratingCount: dto.ratingsCount
    };
  }

  private mapToLegacyPaginatedFormat(result: PagedResult<GuideDto>): PaginatedResult<GuideListItem> {
    return {
      items: result.items?.map(dto => this.mapDtoToGuideListItem(dto)) || [],
      pageNumber: result.pageNumber,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
      totalCount: result.totalCount,
      hasPreviousPage: result.hasPreviousPage,
      hasNextPage: result.hasNextPage
    } as any;
  }
}
