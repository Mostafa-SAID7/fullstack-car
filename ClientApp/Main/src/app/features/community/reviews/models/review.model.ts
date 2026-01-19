export interface Review {
  id: string;
  title: string;
  content: string;
  rating: number; // 1-5 stars
  pros?: string[];
  cons?: string[];
  
  // Target information
  targetType: 'car' | 'dealership' | 'service' | 'product';
  targetId: string;
  targetName: string;
  
  // Author information
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorVerified: boolean;
  
  // Media
  images: string[];
  videos?: string[];
  
  // Engagement
  likesCount: number;
  dislikesCount: number;
  helpfulCount: number;
  commentsCount: number;
  
  // User interactions
  isLiked?: boolean;
  isDisliked?: boolean;
  isHelpful?: boolean;
  
  // Status
  status: ReviewStatus;
  isVerifiedPurchase: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt?: Date;
  
  // Moderation
  isFlagged: boolean;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  
  // Additional metadata
  tags: string[];
  category?: string;
  location?: string;
}

export enum ReviewStatus {
  Draft = 'draft',
  Published = 'published',
  Hidden = 'hidden',
  Deleted = 'deleted'
}

export interface ReviewComment {
  id: string;
  reviewId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  likesCount: number;
  isLiked?: boolean;
  createdAt: Date;
  updatedAt?: Date;
  parentId?: string;
  replies?: ReviewComment[];
}

export interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  recommendationPercentage: number;
}

export interface CreateReviewRequest {
  title: string;
  content: string;
  rating: number;
  pros?: string[];
  cons?: string[];
  targetType: string;
  targetId: string;
  images?: string[];
  tags?: string[];
  category?: string;
  location?: string;
}

export interface UpdateReviewRequest {
  title?: string;
  content?: string;
  rating?: number;
  pros?: string[];
  cons?: string[];
  images?: string[];
  tags?: string[];
  category?: string;
}

export interface ReviewFilters {
  rating?: number;
  category?: string;
  location?: string;
  sortBy?: 'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'helpful';
  verifiedOnly?: boolean;
  withImages?: boolean;
  pageNumber?: number;
  pageSize?: number;
}