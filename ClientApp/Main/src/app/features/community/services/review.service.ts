import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Review, CreateReviewRequest } from '../../../core/models/review.model';
import { Result, PaginatedResult } from '../../../core/models/result.model';
import { TranslationService } from '../../../core/services/translation.service';

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private apiUrl = `${environment.apiUrl}/v2.0/community/reviews`;

    constructor(
        private http: HttpClient,
        private translationService: TranslationService
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

    getReviews(pageNumber: number = 1, pageSize: number = 10, carBrand?: string, carModel?: string): Observable<PaginatedResult<Review>> {
        let url = `${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
        if (carBrand) url += `&carBrand=${carBrand}`;
        if (carModel) url += `&carModel=${carModel}`;
        return this.http.get<PaginatedResult<Review>>(url);
    }

    getReview(id: string): Observable<Result<Review>> {
        return this.http.get<Result<Review>>(`${this.apiUrl}/${id}`);
    }

    createReview(request: CreateReviewRequest): Observable<Result<Review>> {
        return this.http.post<Result<Review>>(this.apiUrl, request);
    }

    markHelpful(id: string): Observable<Result<any>> {
        return this.http.post<Result<any>>(`${this.apiUrl}/${id}/helpful`, {});
    }

    getCarReviews(brand: string, model: string, pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<Review>> {
        return this.http.get<PaginatedResult<Review>>(`${this.apiUrl}/car/${brand}/${model}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    }

    getUserReviews(userId: string, pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<Review>> {
        return this.http.get<PaginatedResult<Review>>(`${this.apiUrl}/user/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    }
}
