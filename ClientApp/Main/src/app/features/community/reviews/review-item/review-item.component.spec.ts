import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ReviewItemComponent } from './review-item.component';
import { ReviewService } from '../../../services/review.service';
import { TranslationService } from '../../../../../core/services/translation.service';
import { Review } from '../../../../../core/models/review.model';

describe('ReviewItemComponent', () => {
  let component: ReviewItemComponent;
  let fixture: ComponentFixture<ReviewItemComponent>;
  let mockReviewService: jasmine.SpyObj<ReviewService>;
  let mockTranslationService: jasmine.SpyObj<TranslationService>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;

  const mockReview: Review = {
    id: '1',
    title: 'Great Car',
    content: 'This is an excellent car with great features.',
    rating: 5,
    type: 1,
    isVerified: true,
    helpfulCount: 3,
    createdAt: '2024-01-15T10:30:00Z',
    userId: 'user1',
    userFirstName: 'John',
    userLastName: 'Doe',
    carBrand: 'Toyota',
    carModel: 'Camry',
    carYear: 2023
  };

  beforeEach(async () => {
    const reviewServiceSpy = jasmine.createSpyObj('ReviewService', ['markHelpful', 'initializeReviewTranslations']);
    const translationServiceSpy = jasmine.createSpyObj('TranslationService', ['getCurrentLanguage', 'isCurrentLanguageRTL'], {
      currentLanguage$: of('en-US')
    });
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant']);

    await TestBed.configureTestingModule({
      imports: [
        ReviewItemComponent,
        TranslateModule.forRoot(),
        HttpClientTestingModule
      ],
      providers: [
        { provide: ReviewService, useValue: reviewServiceSpy },
        { provide: TranslationService, useValue: translationServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy }
      ]
    }).compileComponents();

    mockReviewService = TestBed.inject(ReviewService) as jasmine.SpyObj<ReviewService>;
    mockTranslationService = TestBed.inject(TranslationService) as jasmine.SpyObj<TranslationService>;
    mockTranslateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;

    fixture = TestBed.createComponent(ReviewItemComponent);
    component = fixture.componentInstance;
    component.review = mockReview;

    // Setup default mocks
    mockTranslationService.getCurrentLanguage.and.returnValue({ code: 'en-US', name: 'English', flag: '🇺🇸', isRTL: false });
    mockTranslationService.isCurrentLanguageRTL.and.returnValue(false);
    mockReviewService.initializeReviewTranslations.and.returnValue(Promise.resolve());
    mockReviewService.markHelpful.and.returnValue(of({ succeeded: true, data: null, errors: [] }));
    mockTranslateService.instant.and.returnValue('Mocked Translation');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize review translations on init', async () => {
    await component.ngOnInit();
    expect(mockReviewService.initializeReviewTranslations).toHaveBeenCalled();
  });

  it('should return correct number of stars', () => {
    const stars = component.getStars();
    expect(stars.length).toBe(5);
  });

  it('should return correct number of empty stars', () => {
    component.review.rating = 3;
    const emptyStars = component.getEmptyStars();
    expect(emptyStars.length).toBe(2);
  });

  it('should get rating description for 5 stars', () => {
    mockTranslateService.instant.and.returnValue('Excellent - Outstanding experience');
    const description = component.getRatingDescription();
    expect(mockTranslateService.instant).toHaveBeenCalledWith('stars.fiveStarsDesc');
    expect(description).toBe('Excellent - Outstanding experience');
  });

  it('should get rating description for 1 star', () => {
    component.review.rating = 1;
    mockTranslateService.instant.and.returnValue('Poor - Very disappointing');
    const description = component.getRatingDescription();
    expect(mockTranslateService.instant).toHaveBeenCalledWith('stars.oneStarDesc');
    expect(description).toBe('Poor - Very disappointing');
  });

  it('should get helpful text for zero helpful count', () => {
    component.review.helpfulCount = 0;
    mockTranslateService.instant.and.returnValue('Was this review helpful?');
    const helpfulText = component.getHelpfulText();
    expect(mockTranslateService.instant).toHaveBeenCalledWith('helpfulness.wasHelpful');
    expect(helpfulText).toBe('Was this review helpful?');
  });

  it('should get helpful text for single helpful count', () => {
    component.review.helpfulCount = 1;
    mockTranslateService.instant.and.returnValue('1 person found this helpful');
    const helpfulText = component.getHelpfulText();
    expect(mockTranslateService.instant).toHaveBeenCalledWith('helpfulness.helpfulCountSingle');
    expect(helpfulText).toBe('1 person found this helpful');
  });

  it('should get helpful text for multiple helpful count', () => {
    component.review.helpfulCount = 5;
    mockTranslateService.instant.and.returnValue('5 people found this helpful');
    const helpfulText = component.getHelpfulText();
    expect(mockTranslateService.instant).toHaveBeenCalledWith('helpfulness.helpfulCount', { 0: 5 });
    expect(helpfulText).toBe('5 people found this helpful');
  });

  it('should mark review as helpful', async () => {
    await component.markHelpful();
    expect(mockReviewService.markHelpful).toHaveBeenCalledWith('1');
    expect(component.review.helpfulCount).toBe(4); // Should increment from 3 to 4
  });

  it('should handle RTL correctly for Arabic language', () => {
    mockTranslationService.isCurrentLanguageRTL.and.returnValue(true);
    expect(component.isRTL()).toBe(true);
  });

  it('should handle LTR correctly for English language', () => {
    mockTranslationService.isCurrentLanguageRTL.and.returnValue(false);
    expect(component.isRTL()).toBe(false);
  });

  it('should prevent multiple simultaneous helpful marking', async () => {
    component.isMarkingHelpful = true;
    await component.markHelpful();
    expect(mockReviewService.markHelpful).not.toHaveBeenCalled();
  });

  it('should handle error when marking helpful fails', async () => {
    mockReviewService.markHelpful.and.returnValue(of({ succeeded: false, data: null, errors: ['Error'] }));
    const originalCount = component.review.helpfulCount;
    await component.markHelpful();
    expect(component.review.helpfulCount).toBe(originalCount); // Should not increment
  });
});