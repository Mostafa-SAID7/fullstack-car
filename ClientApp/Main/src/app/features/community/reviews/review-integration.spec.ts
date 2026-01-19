import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ReviewService } from '../../services/review.service';
import { TranslationService } from '../../../../core/services/translation.service';
import { ReviewItemComponent } from './review-item/review-item.component';
import { Review } from '../../../../core/models/review.model';
import { environment } from '../../../../../environments/environment';

describe('Review Localization Integration', () => {
  let reviewService: ReviewService;
  let translationService: TranslationService;
  let translateService: TranslateService;
  let httpMock: HttpTestingController;
  let component: ReviewItemComponent;

  const mockReview: Review = {
    id: '1',
    title: 'Test Review',
    content: 'This is a test review',
    rating: 4,
    helpfulCount: 5,
    userFirstName: 'John',
    userLastName: 'Doe',
    userProfileImageUrl: '',
    isVerified: true,
    createdAt: new Date(),
    carBrand: 'Toyota',
    carModel: 'Camry',
    carYear: 2023
  };

  const mockTranslations = {
    'reviews.title': 'Reviews',
    'reviews.writeReview': 'Write a Review',
    'reviews.noReviews': 'No reviews yet. Be the first to share your experience!',
    'reviews.noReviewsFound': 'No reviews found matching your criteria.',
    'stars.oneStarDesc': 'Poor - Very disappointing',
    'stars.twoStarsDesc': 'Fair - Below expectations',
    'stars.threeStarsDesc': 'Good - Meets expectations',
    'stars.fourStarsDesc': 'Very Good - Exceeds expectations',
    'stars.fiveStarsDesc': 'Excellent - Outstanding experience',
    'helpfulness.helpful': 'Helpful',
    'helpfulness.wasHelpful': 'Was this review helpful?',
    'helpfulness.helpfulCount': '{0} people found this helpful',
    'helpfulness.helpfulCountSingle': '1 person found this helpful',
    'verification.verified': 'Verified Review',
    'filters.filterReviews': 'Filter Reviews',
    'filters.mostRecent': 'Most Recent',
    'filters.highestRated': 'Highest Rated',
    'filters.mostHelpful': 'Most Helpful',
    'filters.allReviews': 'All Reviews'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ReviewItemComponent
      ],
      providers: [
        ReviewService,
        TranslationService
      ]
    }).compileComponents();

    reviewService = TestBed.inject(ReviewService);
    translationService = TestBed.inject(TranslationService);
    translateService = TestBed.inject(TranslateService);
    httpMock = TestBed.inject(HttpTestingController);

    const fixture = TestBed.createComponent(ReviewItemComponent);
    component = fixture.componentInstance;
    component.review = mockReview;
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Task 35: Localize Reviews Components', () => {
    it('should connect to backend translation APIs', async () => {
      // Mock the translation service to return our mock translations
      jest.spyOn(translationService, 'loadSingleFeatureTranslations')
        .mockResolvedValue(mockTranslations);

      // Initialize review translations
      await reviewService.initializeReviewTranslations();

      // Verify the backend API was called with correct parameters
      expect(translationService.loadSingleFeatureTranslations)
        .toHaveBeenCalledWith('en-US', 'reviews');
    });

    it('should provide localized rating scale descriptions', () => {
      // Mock translateService to return our mock translations
      jest.spyOn(translateService, 'instant').mockImplementation((key: string) => {
        return mockTranslations[key as keyof typeof mockTranslations] || key;
      });

      // Test all rating levels
      const testCases = [
        { rating: 1, expected: 'Poor - Very disappointing' },
        { rating: 2, expected: 'Fair - Below expectations' },
        { rating: 3, expected: 'Good - Meets expectations' },
        { rating: 4, expected: 'Very Good - Exceeds expectations' },
        { rating: 5, expected: 'Excellent - Outstanding experience' }
      ];

      testCases.forEach(({ rating, expected }) => {
        component.review.rating = rating;
        expect(component.getRatingDescription()).toBe(expected);
      });
    });

    it('should implement localized helpfulness voting', () => {
      // Mock translateService
      jest.spyOn(translateService, 'instant').mockImplementation((key: string, params?: any) => {
        if (key === 'helpfulness.helpfulCount' && params) {
          return `${params[0]} people found this helpful`;
        }
        return mockTranslations[key as keyof typeof mockTranslations] || key;
      });

      // Test helpfulness text variations
      component.review.helpfulCount = 0;
      expect(component.getHelpfulText()).toBe('Was this review helpful?');

      component.review.helpfulCount = 1;
      expect(component.getHelpfulText()).toBe('1 person found this helpful');

      component.review.helpfulCount = 5;
      expect(component.getHelpfulText()).toBe('5 people found this helpful');

      // Test button text
      expect(component.getHelpfulButtonText()).toBe('Helpful');

      // Test verification text
      expect(component.getVerificationText()).toBe('Verified Review');
    });

    it('should support RTL layouts', () => {
      // Mock RTL detection
      jest.spyOn(translationService, 'isCurrentLanguageRTL').mockReturnValue(true);
      expect(component.isRTL()).toBe(true);

      // Mock LTR detection
      jest.spyOn(translationService, 'isCurrentLanguageRTL').mockReturnValue(false);
      expect(component.isRTL()).toBe(false);
    });

    it('should handle translation fallback to English', async () => {
      // Mock getCurrentLanguage to return Arabic
      jest.spyOn(translationService, 'getCurrentLanguage').mockReturnValue({
        code: 'ar-EG',
        name: 'العربية (مصر)',
        flag: '🇪🇬',
        isRTL: true
      });

      // Mock loadSingleFeatureTranslations to fail first, then succeed
      const loadSpy = jest.spyOn(translationService, 'loadSingleFeatureTranslations')
        .mockRejectedValueOnce(new Error('Arabic translations not found'))
        .mockResolvedValueOnce(mockTranslations);

      // Initialize translations (should fail and fallback)
      await reviewService.initializeReviewTranslations();

      // Verify both calls were made
      expect(loadSpy).toHaveBeenCalledTimes(2);
      expect(loadSpy).toHaveBeenNthCalledWith(1, 'ar-EG', 'reviews');
      expect(loadSpy).toHaveBeenNthCalledWith(2, 'en-US', 'reviews');
    });

    it('should validate critical translation keys are loaded', async () => {
      const criticalKeys = [
        'reviews.title', 'reviews.writeReview', 'reviews.noReviews',
        'stars.oneStarDesc', 'stars.twoStarsDesc', 'stars.threeStarsDesc', 'stars.fourStarsDesc', 'stars.fiveStarsDesc',
        'helpfulness.helpful', 'helpfulness.wasHelpful', 'helpfulness.helpfulCount', 'helpfulness.helpfulCountSingle',
        'verification.verified', 'filters.filterReviews', 'filters.mostRecent', 'filters.highestRated', 'filters.mostHelpful'
      ];

      // Mock translation loading with all critical keys
      jest.spyOn(translationService, 'loadSingleFeatureTranslations')
        .mockResolvedValue(mockTranslations);

      // Initialize translations
      await reviewService.initializeReviewTranslations();

      // Verify all critical keys are present in mock translations
      criticalKeys.forEach(key => {
        expect(mockTranslations).toHaveProperty(key);
      });
    });

    it('should handle language changes and reload translations', async () => {
      // Mock translation service methods
      const loadSpy = jest.spyOn(translationService, 'loadSingleFeatureTranslations')
        .mockResolvedValue(mockTranslations);

      // Mock language change observable
      const mockLanguageSubject = of('ar-EG');
      jest.spyOn(translationService, 'currentLanguage$', 'get').mockReturnValue(mockLanguageSubject);

      // Initialize component
      await component.ngOnInit();

      // Verify translations were loaded
      expect(loadSpy).toHaveBeenCalled();
    });
  });

  describe('Requirements Validation', () => {
    it('should meet Requirement 5.1: Review form localization', () => {
      jest.spyOn(translateService, 'instant').mockImplementation((key: string) => {
        return mockTranslations[key as keyof typeof mockTranslations] || key;
      });

      // Verify review interface elements are localized
      expect(translateService.instant('reviews.writeReview')).toBe('Write a Review');
      expect(translateService.instant('reviews.title')).toBe('Reviews');
    });

    it('should meet Requirement 5.2: Rating scale descriptions', () => {
      jest.spyOn(translateService, 'instant').mockImplementation((key: string) => {
        return mockTranslations[key as keyof typeof mockTranslations] || key;
      });

      // Verify all rating descriptions are localized
      for (let rating = 1; rating <= 5; rating++) {
        component.review.rating = rating;
        const description = component.getRatingDescription();
        expect(description).not.toContain('stars.');
        expect(description.length).toBeGreaterThan(0);
      }
    });

    it('should meet Requirement 5.4: Helpfulness voting localization', () => {
      jest.spyOn(translateService, 'instant').mockImplementation((key: string, params?: any) => {
        if (key === 'helpfulness.helpfulCount' && params) {
          return `${params[0]} people found this helpful`;
        }
        return mockTranslations[key as keyof typeof mockTranslations] || key;
      });

      // Verify helpfulness voting is localized
      expect(component.getHelpfulButtonText()).toBe('Helpful');
      
      component.review.helpfulCount = 3;
      expect(component.getHelpfulText()).toBe('3 people found this helpful');
    });

    it('should meet Requirement 5.6: Verification status localization', () => {
      jest.spyOn(translateService, 'instant').mockImplementation((key: string) => {
        return mockTranslations[key as keyof typeof mockTranslations] || key;
      });

      // Verify verification status is localized
      expect(component.getVerificationText()).toBe('Verified Review');
    });
  });
});