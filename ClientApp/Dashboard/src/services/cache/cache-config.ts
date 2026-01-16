/**
 * Cache Configuration
 * Defines TTL (Time To Live) values for different types of data
 */

export const CACHE_CONFIG = {
  // Short-lived cache (30 seconds - 1 minute)
  // For frequently changing data like comments, likes, real-time counts
  SHORT: {
    TTL: 30000, // 30 seconds
    KEYS: {
      COMMENTS: 'comments',
      LIKES: 'likes',
      LIVE_COUNTS: 'counts'
    }
  },

  // Medium-lived cache (1-5 minutes)
  // For moderately changing data like posts, reviews, analytics
  MEDIUM: {
    TTL: 120000, // 2 minutes
    KEYS: {
      POSTS: 'posts',
      GROUPS: 'groups',
      REVIEWS: 'reviews',
      ANALYTICS: 'analytics',
      FRIENDS: 'friends'
    }
  },

  // Long-lived cache (5-15 minutes)
  // For rarely changing data like user profiles, categories, settings
  LONG: {
    TTL: 300000, // 5 minutes
    KEYS: {
      USER_PROFILE: 'user-profile',
      CATEGORIES: 'categories',
      TAGS: 'tags',
      SETTINGS: 'settings',
      GUIDES: 'guides',
      PAGES: 'pages'
    }
  },

  // Very long-lived cache (15-60 minutes)
  // For static or rarely changing data like system config, translations
  VERY_LONG: {
    TTL: 900000, // 15 minutes
    KEYS: {
      SYSTEM_CONFIG: 'system-config',
      TRANSLATIONS: 'translations',
      STATIC_CONTENT: 'static-content'
    }
  }
} as const;

/**
 * Cache invalidation patterns
 * Defines which cache keys to invalidate for different operations
 */
export const CACHE_INVALIDATION_PATTERNS = {
  // Post operations
  POST_CREATE: ['posts*', 'analytics*', 'counts*'],
  POST_UPDATE: ['posts*', 'analytics*'],
  POST_DELETE: ['posts*', 'analytics*', 'counts*'],
  POST_LIKE: ['posts*', 'likes*', 'counts*'],
  POST_COMMENT: ['posts*', 'comments*', 'counts*'],

  // Group operations
  GROUP_CREATE: ['groups*', 'analytics*', 'counts*'],
  GROUP_UPDATE: ['groups*', 'analytics*'],
  GROUP_DELETE: ['groups*', 'analytics*', 'counts*'],
  GROUP_JOIN: ['groups*', 'counts*'],
  GROUP_LEAVE: ['groups*', 'counts*'],

  // Friend operations
  FRIEND_REQUEST: ['friends*', 'counts*'],
  FRIEND_ACCEPT: ['friends*', 'counts*'],
  FRIEND_REJECT: ['friends*', 'counts*'],
  FRIEND_REMOVE: ['friends*', 'counts*'],

  // Review operations
  REVIEW_CREATE: ['reviews*', 'analytics*', 'counts*'],
  REVIEW_UPDATE: ['reviews*', 'analytics*'],
  REVIEW_DELETE: ['reviews*', 'analytics*', 'counts*'],
  REVIEW_HELPFUL: ['reviews*', 'counts*'],

  // Guide operations
  GUIDE_CREATE: ['guides*', 'analytics*', 'counts*'],
  GUIDE_UPDATE: ['guides*', 'analytics*'],
  GUIDE_DELETE: ['guides*', 'analytics*', 'counts*'],
  GUIDE_BOOKMARK: ['guides*', 'counts*'],

  // Article operations
  ARTICLE_CREATE: ['articles*', 'news*', 'analytics*', 'counts*'],
  ARTICLE_UPDATE: ['articles*', 'news*', 'analytics*'],
  ARTICLE_DELETE: ['articles*', 'news*', 'analytics*', 'counts*'],
  ARTICLE_LIKE: ['articles*', 'news*', 'likes*', 'counts*'],

  // Location operations
  LOCATION_CREATE: ['locations*', 'maps*', 'analytics*', 'counts*'],
  LOCATION_UPDATE: ['locations*', 'maps*', 'analytics*'],
  LOCATION_DELETE: ['locations*', 'maps*', 'analytics*', 'counts*'],
  LOCATION_CHECKIN: ['locations*', 'maps*', 'counts*'],
  LOCATION_REVIEW: ['locations*', 'maps*', 'reviews*', 'counts*'],

  // Page operations
  PAGE_CREATE: ['pages*', 'analytics*', 'counts*'],
  PAGE_UPDATE: ['pages*', 'analytics*'],
  PAGE_DELETE: ['pages*', 'analytics*', 'counts*'],
  PAGE_PUBLISH: ['pages*', 'analytics*'],

  // QA operations
  QUESTION_CREATE: ['questions*', 'qa*', 'analytics*', 'counts*'],
  ANSWER_CREATE: ['answers*', 'qa*', 'counts*'],
  ANSWER_ACCEPT: ['answers*', 'qa*', 'analytics*'],
  VOTE_CREATE: ['votes*', 'qa*', 'counts*'],

  // Global operations
  USER_LOGOUT: ['*'], // Clear all cache on logout
  SYSTEM_UPDATE: ['system-config*', 'settings*']
} as const;

/**
 * Cache warming configuration
 * Defines which data to preload on app start
 */
export const CACHE_WARMING_CONFIG = {
  ENABLED: true,
  ENDPOINTS: [
    // Preload user profile
    { endpoint: '/v1/users/profile', ttl: CACHE_CONFIG.LONG.TTL },
    // Preload system settings
    { endpoint: '/v4/system/settings', ttl: CACHE_CONFIG.VERY_LONG.TTL },
    // Preload categories
    { endpoint: '/v7/community/posts/categories', ttl: CACHE_CONFIG.LONG.TTL },
    { endpoint: '/v7/community/groups/categories', ttl: CACHE_CONFIG.LONG.TTL }
  ]
} as const;

/**
 * Cache size limits
 */
export const CACHE_LIMITS = {
  MAX_ENTRIES: 1000, // Maximum number of cache entries
  MAX_SIZE_MB: 50, // Maximum cache size in MB
  CLEANUP_THRESHOLD: 0.8 // Trigger cleanup when 80% full
} as const;

/**
 * Cache metrics configuration
 */
export const CACHE_METRICS_CONFIG = {
  ENABLED: true,
  TRACK_HIT_RATE: true,
  TRACK_SIZE: true,
  TRACK_PERFORMANCE: true,
  LOG_INTERVAL: 60000 // Log metrics every minute
} as const;
