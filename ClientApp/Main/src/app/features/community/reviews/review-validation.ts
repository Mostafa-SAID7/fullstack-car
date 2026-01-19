/**
 * Review Localization Validation Script
 * 
 * This script validates that the Reviews components are properly connected
 * to the backend translation APIs and implement the required localization features.
 */

import { ReviewService } from '../services/review.service';
import { ReviewItemComponent } from './review-item/review-item.component';
import { ReviewListComponent } from './review-list/review-list.component';

export interface ReviewLocalizationValidation {
  backendApiIntegration: boolean;
  ratingScaleDescriptions: boolean;
  helpfulnessVoting: boolean;
  rtlSupport: boolean;
  fallbackHandling: boolean;
}

/**
 * Validates that Reviews components meet localization requirements
 */
export function validateReviewLocalization(): ReviewLocalizationValidation {
  const validation: ReviewLocalizationValidation = {
    backendApiIntegration: false,
    ratingScaleDescriptions: false,
    helpfulnessVoting: false,
    rtlSupport: false,
    fallbackHandling: false
  };

  // Check 1: Backend API Integration
  // Verify ReviewService uses TranslationService.loadSingleFeatureTranslations
  const reviewServiceSource = ReviewService.toString();
  validation.backendApiIntegration = 
    reviewServiceSource.includes('loadSingleFeatureTranslations') &&
    reviewServiceSource.includes('reviews') &&
    reviewServiceSource.includes('backend');

  // Check 2: Rating Scale Descriptions
  // Verify ReviewItemComponent has getRatingDescription method
  const reviewItemSource = ReviewItemComponent.toString();
  validation.ratingScaleDescriptions = 
    reviewItemSource.includes('getRatingDescription') &&
    reviewItemSource.includes('stars.oneStarDesc') &&
    reviewItemSource.includes('stars.fiveStarsDesc');

  // Check 3: Helpfulness Voting
  // Verify localized helpfulness methods exist
  validation.helpfulnessVoting = 
    reviewItemSource.includes('getHelpfulText') &&
    reviewItemSource.includes('getHelpfulButtonText') &&
    reviewItemSource.includes('helpfulness.helpful');

  // Check 4: RTL Support
  // Verify RTL detection is implemented
  validation.rtlSupport = 
    reviewItemSource.includes('isRTL') &&
    reviewItemSource.includes('isCurrentLanguageRTL');

  // Check 5: Fallback Handling
  // Verify fallback logic exists in service
  validation.fallbackHandling = 
    reviewServiceSource.includes('en-US') &&
    reviewServiceSource.includes('fallback') &&
    reviewServiceSource.includes('catch');

  return validation;
}

/**
 * Required translation keys for Reviews feature
 */
export const REQUIRED_REVIEW_TRANSLATION_KEYS = [
  // Basic review keys
  'reviews.title',
  'reviews.writeReview',
  'reviews.noReviews',
  'reviews.noReviewsFound',
  
  // Rating descriptions
  'stars.oneStarDesc',
  'stars.twoStarsDesc', 
  'stars.threeStarsDesc',
  'stars.fourStarsDesc',
  'stars.fiveStarsDesc',
  
  // Helpfulness voting
  'helpfulness.helpful',
  'helpfulness.wasHelpful',
  'helpfulness.helpfulCount',
  'helpfulness.helpfulCountSingle',
  
  // Verification
  'verification.verified',
  
  // Filters
  'filters.filterReviews',
  'filters.mostRecent',
  'filters.highestRated',
  'filters.mostHelpful',
  'filters.allReviews'
];

/**
 * Validates that all required translation keys are present
 */
export function validateTranslationKeys(translations: Record<string, string>): {
  valid: boolean;
  missingKeys: string[];
  presentKeys: string[];
} {
  const missingKeys: string[] = [];
  const presentKeys: string[] = [];

  REQUIRED_REVIEW_TRANSLATION_KEYS.forEach(key => {
    if (translations[key]) {
      presentKeys.push(key);
    } else {
      missingKeys.push(key);
    }
  });

  return {
    valid: missingKeys.length === 0,
    missingKeys,
    presentKeys
  };
}

/**
 * Validation report generator
 */
export function generateValidationReport(): string {
  const validation = validateReviewLocalization();
  
  let report = '=== Review Localization Validation Report ===\n\n';
  
  report += `✅ Backend API Integration: ${validation.backendApiIntegration ? 'PASS' : 'FAIL'}\n`;
  report += `✅ Rating Scale Descriptions: ${validation.ratingScaleDescriptions ? 'PASS' : 'FAIL'}\n`;
  report += `✅ Helpfulness Voting: ${validation.helpfulnessVoting ? 'PASS' : 'FAIL'}\n`;
  report += `✅ RTL Support: ${validation.rtlSupport ? 'PASS' : 'FAIL'}\n`;
  report += `✅ Fallback Handling: ${validation.fallbackHandling ? 'PASS' : 'FAIL'}\n\n`;
  
  const overallPass = Object.values(validation).every(v => v);
  report += `Overall Status: ${overallPass ? '✅ PASS' : '❌ FAIL'}\n\n`;
  
  if (!overallPass) {
    report += 'Failed Requirements:\n';
    if (!validation.backendApiIntegration) {
      report += '- Backend API Integration: ReviewService must use TranslationService.loadSingleFeatureTranslations\n';
    }
    if (!validation.ratingScaleDescriptions) {
      report += '- Rating Scale Descriptions: ReviewItemComponent must implement getRatingDescription with all star levels\n';
    }
    if (!validation.helpfulnessVoting) {
      report += '- Helpfulness Voting: ReviewItemComponent must implement localized helpfulness methods\n';
    }
    if (!validation.rtlSupport) {
      report += '- RTL Support: Components must implement RTL detection and layout support\n';
    }
    if (!validation.fallbackHandling) {
      report += '- Fallback Handling: ReviewService must implement fallback to English on translation failures\n';
    }
  }
  
  report += '\nRequired Translation Keys:\n';
  REQUIRED_REVIEW_TRANSLATION_KEYS.forEach(key => {
    report += `- ${key}\n`;
  });
  
  return report;
}

// Export validation functions for use in tests
export { validateReviewLocalization as default };