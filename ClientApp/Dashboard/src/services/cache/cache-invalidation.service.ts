import { cacheService } from './cache.service';
import { CACHE_INVALIDATION_PATTERNS } from './cache-config';

/**
 * Cache Invalidation Service
 * Provides convenient methods for invalidating cache based on operations
 */
export class CacheInvalidationService {
  private static instance: CacheInvalidationService;

  private constructor() {}

  static getInstance(): CacheInvalidationService {
    if (!CacheInvalidationService.instance) {
      CacheInvalidationService.instance = new CacheInvalidationService();
    }
    return CacheInvalidationService.instance;
  }

  // Post operations
  onPostCreate(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.POST_CREATE);
  }

  onPostUpdate(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.POST_UPDATE);
  }

  onPostDelete(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.POST_DELETE);
  }

  onPostLike(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.POST_LIKE);
  }

  onPostComment(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.POST_COMMENT);
  }

  // Group operations
  onGroupCreate(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.GROUP_CREATE);
  }

  onGroupUpdate(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.GROUP_UPDATE);
  }

  onGroupDelete(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.GROUP_DELETE);
  }

  onGroupJoin(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.GROUP_JOIN);
  }

  onGroupLeave(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.GROUP_LEAVE);
  }

  // Friend operations
  onFriendRequest(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.FRIEND_REQUEST);
  }

  onFriendAccept(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.FRIEND_ACCEPT);
  }

  onFriendReject(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.FRIEND_REJECT);
  }

  onFriendRemove(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.FRIEND_REMOVE);
  }

  // Review operations
  onReviewCreate(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.REVIEW_CREATE);
  }

  onReviewUpdate(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.REVIEW_UPDATE);
  }

  onReviewDelete(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.REVIEW_DELETE);
  }

  onReviewHelpful(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.REVIEW_HELPFUL);
  }

  // Guide operations
  onGuideCreate(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.GUIDE_CREATE);
  }

  onGuideUpdate(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.GUIDE_UPDATE);
  }

  onGuideDelete(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.GUIDE_DELETE);
  }

  onGuideBookmark(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.GUIDE_BOOKMARK);
  }

  // Article operations
  onArticleCreate(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.ARTICLE_CREATE);
  }

  onArticleUpdate(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.ARTICLE_UPDATE);
  }

  onArticleDelete(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.ARTICLE_DELETE);
  }

  onArticleLike(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.ARTICLE_LIKE);
  }

  // Location operations
  onLocationCreate(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.LOCATION_CREATE);
  }

  onLocationUpdate(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.LOCATION_UPDATE);
  }

  onLocationDelete(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.LOCATION_DELETE);
  }

  onLocationCheckIn(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.LOCATION_CHECKIN);
  }

  onLocationReview(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.LOCATION_REVIEW);
  }

  // Page operations
  onPageCreate(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.PAGE_CREATE);
  }

  onPageUpdate(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.PAGE_UPDATE);
  }

  onPageDelete(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.PAGE_DELETE);
  }

  onPagePublish(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.PAGE_PUBLISH);
  }

  // QA operations
  onQuestionCreate(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.QUESTION_CREATE);
  }

  onAnswerCreate(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.ANSWER_CREATE);
  }

  onAnswerAccept(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.ANSWER_ACCEPT);
  }

  onVoteCreate(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.VOTE_CREATE);
  }

  // Global operations
  onUserLogout(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.USER_LOGOUT);
  }

  onSystemUpdate(): void {
    this.invalidatePatterns(CACHE_INVALIDATION_PATTERNS.SYSTEM_UPDATE);
  }

  // Helper method
  private invalidatePatterns(patterns: readonly string[]): void {
    cacheService.invalidatePatterns([...patterns]);
  }
}

export const cacheInvalidationService = CacheInvalidationService.getInstance();
