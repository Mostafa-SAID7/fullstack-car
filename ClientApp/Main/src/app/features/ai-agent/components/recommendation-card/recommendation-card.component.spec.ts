import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecommendationCardComponent, RecommendationAction } from './recommendation-card.component';
import { CarRecommendation } from '../../models/ai-agent.models';

describe('RecommendationCardComponent', () => {
  let component: RecommendationCardComponent;
  let fixture: ComponentFixture<RecommendationCardComponent>;

  const mockRecommendation: CarRecommendation = {
    id: 'car-123',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    priceRange: '$25,000 - $30,000',
    mileage: '15,000 miles',
    location: 'Dubai, UAE',
    imageUrl: 'https://example.com/car.jpg',
    confidenceScore: 0.85,
    matchReasons: [
      'Matches your budget',
      'Excellent fuel efficiency',
      'High reliability rating'
    ],
    pros: [
      'Low maintenance costs',
      'Great resale value',
      'Spacious interior'
    ],
    cons: [
      'Basic infotainment system',
      'Not very sporty'
    ],
    features: ['Automatic', 'Sunroof', 'Leather seats'],
    sellerRating: 4.5,
    listingUrl: 'https://example.com/listing/car-123'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendationCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RecommendationCardComponent);
    component = fixture.componentInstance;
    component.recommendation = mockRecommendation;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with recommendation data', () => {
      expect(component.recommendation).toEqual(mockRecommendation);
      expect(component.saved).toBe(false);
      expect(component.selected).toBe(false);
      expect(component.compact).toBe(false);
    });

    it('should accept saved state', () => {
      component.saved = true;
      fixture.detectChanges();
      expect(component.saved).toBe(true);
    });

    it('should accept selected state', () => {
      component.selected = true;
      fixture.detectChanges();
      expect(component.selected).toBe(true);
    });

    it('should accept compact mode', () => {
      component.compact = true;
      fixture.detectChanges();
      expect(component.compact).toBe(true);
    });
  });

  describe('View Action', () => {
    it('should emit view action', (done) => {
      component.actionClick.subscribe((action: RecommendationAction) => {
        expect(action.type).toBe('view');
        expect(action.recommendation).toEqual(mockRecommendation);
        done();
      });

      component.onView();
    });
  });

  describe('Save Action', () => {
    it('should emit save action', (done) => {
      component.actionClick.subscribe((action: RecommendationAction) => {
        expect(action.type).toBe('save');
        expect(action.recommendation).toEqual(mockRecommendation);
        done();
      });

      component.onSave();
    });

    it('should work when already saved', (done) => {
      component.saved = true;

      component.actionClick.subscribe((action: RecommendationAction) => {
        expect(action.type).toBe('save');
        done();
      });

      component.onSave();
    });
  });

  describe('Share Action', () => {
    it('should emit share action', (done) => {
      component.actionClick.subscribe((action: RecommendationAction) => {
        expect(action.type).toBe('share');
        expect(action.recommendation).toEqual(mockRecommendation);
        done();
      });

      component.onShare();
    });
  });

  describe('Compare Action', () => {
    it('should emit compare action', (done) => {
      component.actionClick.subscribe((action: RecommendationAction) => {
        expect(action.type).toBe('compare');
        expect(action.recommendation).toEqual(mockRecommendation);
        done();
      });

      component.onCompare();
    });
  });

  describe('Confidence Score Display', () => {
    it('should return green color for high confidence (>= 0.8)', () => {
      component.recommendation.confidenceScore = 0.85;
      expect(component.getConfidenceColor()).toBe('#198754');
    });

    it('should return yellow color for medium confidence (0.6-0.79)', () => {
      component.recommendation.confidenceScore = 0.7;
      expect(component.getConfidenceColor()).toBe('#ffc107');
    });

    it('should return red color for low confidence (< 0.6)', () => {
      component.recommendation.confidenceScore = 0.5;
      expect(component.getConfidenceColor()).toBe('#dc3545');
    });

    it('should return "High Match" label for high confidence', () => {
      component.recommendation.confidenceScore = 0.9;
      expect(component.getConfidenceLabel()).toBe('High Match');
    });

    it('should return "Good Match" label for medium confidence', () => {
      component.recommendation.confidenceScore = 0.65;
      expect(component.getConfidenceLabel()).toBe('Good Match');
    });

    it('should return "Fair Match" label for low confidence', () => {
      component.recommendation.confidenceScore = 0.4;
      expect(component.getConfidenceLabel()).toBe('Fair Match');
    });

    it('should handle edge case at 0.8 threshold', () => {
      component.recommendation.confidenceScore = 0.8;
      expect(component.getConfidenceColor()).toBe('#198754');
      expect(component.getConfidenceLabel()).toBe('High Match');
    });

    it('should handle edge case at 0.6 threshold', () => {
      component.recommendation.confidenceScore = 0.6;
      expect(component.getConfidenceColor()).toBe('#ffc107');
      expect(component.getConfidenceLabel()).toBe('Good Match');
    });
  });

  describe('Price Formatting', () => {
    it('should format price range correctly', () => {
      const result = component.formatPrice('$25,000 - $30,000');
      expect(result).toBe('$25,000 - $30,000');
    });

    it('should handle missing price range', () => {
      const result = component.formatPrice(undefined);
      expect(result).toBe('Price not available');
    });

    it('should handle empty price range', () => {
      const result = component.formatPrice('');
      expect(result).toBe('Price not available');
    });

    it('should handle single price value', () => {
      const result = component.formatPrice('$28,000');
      expect(result).toBe('$28,000');
    });
  });

  describe('Recommendation Data Display', () => {
    it('should display car make and model', () => {
      expect(component.recommendation.make).toBe('Toyota');
      expect(component.recommendation.model).toBe('Camry');
    });

    it('should display year', () => {
      expect(component.recommendation.year).toBe(2023);
    });

    it('should display location', () => {
      expect(component.recommendation.location).toBe('Dubai, UAE');
    });

    it('should display mileage', () => {
      expect(component.recommendation.mileage).toBe('15,000 miles');
    });

    it('should display match reasons', () => {
      expect(component.recommendation.matchReasons.length).toBe(3);
      expect(component.recommendation.matchReasons[0]).toBe('Matches your budget');
    });

    it('should display pros and cons', () => {
      expect(component.recommendation.pros.length).toBe(3);
      expect(component.recommendation.cons.length).toBe(2);
    });

    it('should display features', () => {
      expect(component.recommendation.features.length).toBe(3);
      expect(component.recommendation.features).toContain('Automatic');
    });

    it('should display seller rating', () => {
      expect(component.recommendation.sellerRating).toBe(4.5);
    });
  });

  describe('Action Event Structure', () => {
    it('should emit action with correct structure', (done) => {
      component.actionClick.subscribe((action: RecommendationAction) => {
        expect(action).toEqual({
          type: 'view',
          recommendation: mockRecommendation
        });
        done();
      });

      component.onView();
    });

    it('should include full recommendation data in action', (done) => {
      component.actionClick.subscribe((action: RecommendationAction) => {
        expect(action.recommendation.id).toBe('car-123');
        expect(action.recommendation.make).toBe('Toyota');
        expect(action.recommendation.confidenceScore).toBe(0.85);
        done();
      });

      component.onView();
    });
  });

  describe('State Management', () => {
    it('should maintain saved state', () => {
      component.saved = true;
      fixture.detectChanges();
      expect(component.saved).toBe(true);
    });

    it('should maintain selected state', () => {
      component.selected = true;
      fixture.detectChanges();
      expect(component.selected).toBe(true);
    });

    it('should handle multiple state flags', () => {
      component.saved = true;
      component.selected = true;
      component.compact = true;
      fixture.detectChanges();
      
      expect(component.saved).toBe(true);
      expect(component.selected).toBe(true);
      expect(component.compact).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle recommendation with minimal data', () => {
      const minimalRec: CarRecommendation = {
        id: 'car-456',
        make: 'Honda',
        model: 'Civic',
        year: 2022,
        confidenceScore: 0.7,
        matchReasons: [],
        pros: [],
        cons: [],
        features: []
      };

      component.recommendation = minimalRec;
      fixture.detectChanges();

      expect(component.recommendation.id).toBe('car-456');
      expect(component.getConfidenceLabel()).toBe('Good Match');
    });

    it('should handle recommendation without optional fields', () => {
      const recWithoutOptionals: CarRecommendation = {
        id: 'car-789',
        make: 'Ford',
        model: 'Focus',
        year: 2021,
        confidenceScore: 0.6,
        matchReasons: ['Affordable'],
        pros: ['Good value'],
        cons: ['Basic features'],
        features: ['Manual']
      };

      component.recommendation = recWithoutOptionals;
      fixture.detectChanges();

      expect(component.formatPrice(recWithoutOptionals.priceRange)).toBe('Price not available');
    });

    it('should handle extreme confidence scores', () => {
      component.recommendation.confidenceScore = 1.0;
      expect(component.getConfidenceColor()).toBe('#198754');
      expect(component.getConfidenceLabel()).toBe('High Match');

      component.recommendation.confidenceScore = 0.0;
      expect(component.getConfidenceColor()).toBe('#dc3545');
      expect(component.getConfidenceLabel()).toBe('Fair Match');
    });
  });
});
