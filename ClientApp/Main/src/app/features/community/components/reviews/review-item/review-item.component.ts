import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Review } from '../../../../../core/models/review.model';
import { ReviewService } from '../../../services/review.service';
import { TranslationService } from '../../../../../core/services/translation.service';

@Component({
    selector: 'app-review-item',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './review-item.component.html',
    host: { 'class': 'block' }
})
export class ReviewItemComponent implements OnInit, OnDestroy {
    @Input() review!: Review;
    
    private destroy$ = new Subject<void>();
    isMarkingHelpful = false;

    constructor(
        private reviewService: ReviewService,
        private translationService: TranslationService,
        private translateService: TranslateService
    ) { }

    async ngOnInit(): Promise<void> {
        // Initialize review translations from backend API
        await this.reviewService.initializeReviewTranslations();
        
        // Subscribe to language changes and reload translations
        this.translationService.currentLanguage$
            .pipe(takeUntil(this.destroy$))
            .subscribe(async (language) => {
                console.log(`Language changed to ${language}, reloading review translations`);
                await this.reviewService.initializeReviewTranslations();
                
                // Force update of localized content
                this.updateLocalizedContent();
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Update localized content when language changes
     */
    private updateLocalizedContent(): void {
        // This will trigger change detection and update the template
        // The template will automatically use the new translations
    }

    /**
     * Mark review as helpful with enhanced localization
     */
    async markHelpful(): Promise<void> {
        if (this.isMarkingHelpful) return;
        
        this.isMarkingHelpful = true;
        
        try {
            const result = await this.reviewService.markHelpful(this.review.id).toPromise();
            if (result?.succeeded) {
                this.review.helpfulCount++;
                
                // Show localized success message (optional)
                console.log(this.translateService.instant('helpfulness.markedHelpful'));
            }
        } catch (error) {
            console.error('Error marking review as helpful:', error);
            
            // Show localized error message (optional)
            console.error(this.translateService.instant('helpfulness.markHelpfulError'));
        } finally {
            this.isMarkingHelpful = false;
        }
    }

    /**
     * Get star array for filled stars
     */
    getStars(): number[] {
        return Array(this.review.rating).fill(0);
    }

    /**
     * Get star array for empty stars
     */
    getEmptyStars(): number[] {
        return Array(5 - this.review.rating).fill(0);
    }

    /**
     * Get localized rating description from backend translations
     */
    getRatingDescription(): string {
        const ratingKey = this.getRatingDescriptionKey(this.review.rating);
        const description = this.translateService.instant(ratingKey);
        
        // Fallback to generic description if specific key not found
        if (description === ratingKey) {
            return this.translateService.instant('stars.threeStarsDesc');
        }
        
        return description;
    }

    /**
     * Get the translation key for rating description
     */
    private getRatingDescriptionKey(rating: number): string {
        switch (rating) {
            case 1: return 'stars.oneStarDesc';
            case 2: return 'stars.twoStarsDesc';
            case 3: return 'stars.threeStarsDesc';
            case 4: return 'stars.fourStarsDesc';
            case 5: return 'stars.fiveStarsDesc';
            default: return 'stars.threeStarsDesc';
        }
    }

    /**
     * Get localized helpfulness text with proper pluralization
     */
    getHelpfulText(): string {
        const count = this.review.helpfulCount || 0;
        
        if (count === 0) {
            return this.translateService.instant('helpfulness.wasHelpful');
        } else if (count === 1) {
            return this.translateService.instant('helpfulness.helpfulCountSingle');
        } else {
            return this.translateService.instant('helpfulness.helpfulCount', { 0: count });
        }
    }

    /**
     * Get localized helpful button text
     */
    getHelpfulButtonText(): string {
        return this.translateService.instant('helpfulness.helpful');
    }

    /**
     * Get localized verification status text
     */
    getVerificationText(): string {
        return this.translateService.instant('verification.verified');
    }

    /**
     * Check if current language is RTL
     */
    isRTL(): boolean {
        return this.translationService.isCurrentLanguageRTL();
    }
}
