import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map, tap, catchError, of } from 'rxjs';
import { Review, CreateReviewRequest } from '../models/review.model';
import { Result, PaginatedResult } from '../../../../core/models/result.model';
import { TranslationService } from '../../../../core/services/translation.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { ReviewDto } from '../../../../shared/models/community/review.model';
import { ToastService } from '../../../../core/services/toast.service';
import { LoadingService } from '../../../../shared/services/loading/loading.service';

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private reviewsSubject = new BehaviorSubject<Review[]>([]);
    public reviews$ = this.reviewsSubject.asObservable();
    private readonly apiUrl = `${environment.apiUrl}/v1/reviews`;

    constructor(
        private http: HttpClient,
        private translationService: TranslationService,
        private toastService: ToastService,
        private loadingService: LoadingService
    ) { }

    /**
     * Initialize review translations for the current language
     * Connects to backend v7 API for translation loading
     */
    async initializeReviewTranslations(): Promise<void> {
        const currentLanguage = this.translationService.getCurrentLanguage().code;

        try {
            // Load review translations from backend API
            const translations = await this.translationService.loadSingleFeatureTranslations(currentLanguage, 'reviews');
            console.log(`Loaded review translations for ${currentLanguage}:`, Object.keys(translations).length, 'keys');

            // Verify critical translation keys are loaded
            const criticalKeys = [
                'reviews.title', 'reviews.writeReview', 'reviews.noReviews',
                'stars.oneStarDesc', 'stars.twoStarsDesc', 'stars.threeStarsDesc', 'stars.fourStarsDesc', 'stars.fiveStarsDesc',
                'helpfulness.helpful', 'helpfulness.wasHelpful', 'helpfulness.helpfulCount', 'helpfulness.helpfulCountSingle',
                'verification.verified', 'filters.filterReviews', 'filters.mostRecent', 'filters.highestRated', 'filters.mostHelpful'
            ];

            const missingKeys = criticalKeys.filter(key => !translations[key]);
            if (missingKeys.length > 0) {
                console.warn(`Missing critical review translation keys for ${currentLanguage}:`, missingKeys);
            }

        } catch (error) {
            console.error(`Failed to initialize review translations for ${currentLanguage}:`, error);

            // Fallback to English if current language fails
            if (currentLanguage !== 'en-US') {
                console.log('Attempting fallback to en-US for review translations');
                await this.translationService.loadSingleFeatureTranslations('en-US', 'reviews');
            }
        }
    }

    /**
     * Map ReviewDto to legacy Review model for backward compatibility
     */
    private mapToReview(dto: ReviewDto): Review {
        return {
            id: dto.id,
            title: dto.title,
            content: dto.content,
            rating: dto.rating,
            type: dto.type,
            imageUrl: dto.imageUrl,
            isVerified: dto.isVerified,
            helpfulCount: dto.helpfulCount,
            createdAt: dto.createdAt.toString(),
            updatedAt: dto.updatedAt?.toString(),
            userId: dto.userId,
            userFirstName: dto.userFirstName,
            userLastName: dto.userLastName,
            userProfileImageUrl: dto.userProfileImageUrl,
            carBrand: dto.carBrand,
            carModel: dto.carModel,
            carYear: dto.carYear
        };
    }

    getReviews(pageNumber: number = 1, pageSize: number = 10, carBrand?: string, carModel?: string): Observable<PaginatedResult<Review>> {
        this.loadingService.show('reviews-list');

        const params: any = { pageNumber, pageSize };
        if (carBrand) params.carBrand = carBrand;
        if (carModel) params.carModel = carModel;

        return this.http.get<PaginatedResult<ReviewDto>>(`${this.apiUrl}`, { params }).pipe(
            map((result: PaginatedResult<ReviewDto>) => {
                const reviews = result.items.map((dto: ReviewDto) => this.mapToReview(dto));
                this.reviewsSubject.next(reviews);

                return {
                    items: reviews,
                    pageNumber: result.pageNumber,
                    pageSize: result.pageSize,
                    totalCount: result.totalCount,
                    totalPages: result.totalPages,
                    hasPreviousPage: result.hasPreviousPage,
                    hasNextPage: result.hasNextPage
                } as PaginatedResult<Review>;
            }),
            tap(() => {
                this.loadingService.hide('reviews-list');
            }),
            catchError(error => {
                this.loadingService.hide('reviews-list');
                this.toastService.error('Failed to load reviews');
                console.error('Error loading reviews:', error);
                return of({
                    items: [],
                    pageNumber: 1,
                    pageSize: pageSize,
                    totalCount: 0,
                    totalPages: 0,
                    hasPreviousPage: false,
                    hasNextPage: false
                } as PaginatedResult<Review>);
            })
        );
    }

    getReview(id: string): Observable<Result<Review>> {
        this.loadingService.show('review-detail');

        return this.http.get<ReviewDto>(`${this.apiUrl}/${id}`).pipe(
            map((dto: ReviewDto) => ({
                succeeded: true,
                data: this.mapToReview(dto),
                errors: []
            } as Result<Review>)),
            tap(() => {
                this.loadingService.hide('review-detail');
            }),
            catchError(error => {
                this.loadingService.hide('review-detail');
                this.toastService.error('Failed to load review');
                console.error('Error loading review:', error);
                return of({
                    succeeded: false,
                    data: null,
                    errors: [error.message || 'Failed to load review']
                } as Result<Review>);
            })
        );
    }

    createReview(request: CreateReviewRequest): Observable<Result<Review>> {
        this.loadingService.show('create-review');

        return this.http.post<ReviewDto>(`${this.apiUrl}`, request).pipe(
            map((dto: ReviewDto) => {
                const review = this.mapToReview(dto);

                // Update local state
                const currentReviews = this.reviewsSubject.value;
                this.reviewsSubject.next([review, ...currentReviews]);

                return {
                    succeeded: true,
                    data: review,
                    errors: []
                } as Result<Review>;
            }),
            tap(() => {
                this.loadingService.hide('create-review');
                this.toastService.success('Review created successfully');
            }),
            catchError(error => {
                this.loadingService.hide('create-review');
                this.toastService.error('Failed to create review');
                console.error('Error creating review:', error);
                return of({
                    succeeded: false,
                    data: null,
                    errors: [error.message || 'Failed to create review']
                } as Result<Review>);
            })
        );
    }

    markHelpful(id: string): Observable<Result<any>> {
        return this.http.post<any>(`${this.apiUrl}/${id}/helpful`, {}).pipe(
            map(() => {
                // Update local state
                const currentReviews = this.reviewsSubject.value;
                const updatedReviews = currentReviews.map(review =>
                    review.id === id
                        ? { ...review, helpfulCount: review.helpfulCount + 1 }
                        : review
                );
                this.reviewsSubject.next(updatedReviews);

                return {
                    succeeded: true,
                    data: null,
                    errors: []
                } as Result<any>;
            }),
            tap(() => {
                this.toastService.success('Marked as helpful');
            }),
            catchError(error => {
                this.toastService.error('Failed to mark as helpful');
                console.error('Error marking review as helpful:', error);
                return of({
                    succeeded: false,
                    data: null,
                    errors: [error.message || 'Failed to mark as helpful']
                } as Result<any>);
            })
        );
    }

    getCarReviews(brand: string, model: string, pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<Review>> {
        // Use the main getReviews method with filtering
        // Note: The new API doesn't have separate car reviews endpoint, so we filter client-side
        return this.getReviews(pageNumber, pageSize).pipe(
            map((result: PaginatedResult<Review>) => ({
                ...result,
                items: result.items.filter((review: Review) =>
                    review.carBrand?.toLowerCase() === brand.toLowerCase() &&
                    review.carModel?.toLowerCase() === model.toLowerCase()
                )
            }))
        );
    }

    getUserReviews(userId: string, pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<Review>> {
        // Use the main getReviews method with filtering
        // Note: The new API doesn't have separate user reviews endpoint, so we filter client-side
        return this.getReviews(pageNumber, pageSize).pipe(
            map((result: PaginatedResult<Review>) => ({
                ...result,
                items: result.items.filter((review: Review) => review.userId === userId)
            }))
        );
    }
}
