import { AuthorInfo, ThreadedComment } from '@core/models/common.models';
import { BaseEntity, WithAuthor, WithContent, WithMetadata, WithUserInteraction } from '@core/models/base.models';

export interface Guide extends BaseEntity, WithContent, WithAuthor, WithUserInteraction {
  // From WithMetadata (manual override to avoid conflict)
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  featuredImageUrl?: string;

  category: GuideCategory;
  categoryName: string;
  difficulty: GuideDifficulty;
  difficultyName: string;
  estimatedReadTime: number;
  isFeatured: boolean;
  isPublished: boolean;
  thumbnailUrl?: string;

  summary: string; // Added

  userRating?: number;
  averageRating: number;
  ratingCount: number;
}

/**
 * Guide with full hierarchy (steps, comments, ratings)
 */
export interface GuideWithDetails extends Guide {
  steps: GuideStep[];
  comments?: GuideComment[];
  ratings?: GuideRating[];
}

export interface GuideListItem {
  id: string;
  title: string;
  summary: string;
  category: GuideCategory;
  categoryName: string;
  difficulty: GuideDifficulty;
  difficultyName: string;
  estimatedReadTime: number;
  isFeatured: boolean;
  viewCount: number;
  likeCount: number;
  bookmarkCount: number;
  tags: string[];
  thumbnailUrl?: string;
  createdAt: Date;
  authorName: string;
  authorAvatar?: string;
  isBookmarked: boolean;
  averageRating: number;
  ratingCount: number;
}

export interface GuideStep extends BaseEntity, WithContent {
  guideId: string;
  stepNumber: number;
  imageUrl?: string;
  videoUrl?: string;
  isRequired: boolean;
  tips?: string;
  warningNotes?: string;
  estimatedTime: number;
}

/**
 * Comment on a guide with threading support
 */
export interface GuideComment extends ThreadedComment {
  guideId: string;
}

/**
 * Rating/Review for a guide
 */
export interface GuideRating extends BaseEntity, WithAuthor {
  guideId: string;
  rating: number;
  comment?: string;
  isHelpful: boolean;
  helpfulCount: number;
}

export interface CreateGuideRequest {
  title: string;
  content: string;
  summary: string;
  category: GuideCategory;
  difficulty: GuideDifficulty;
  estimatedReadTime: number;
  tags: string;
  thumbnailUrl?: string;
  steps: CreateGuideStepRequest[];
}

export interface CreateGuideStepRequest {
  stepNumber: number;
  title: string;
  content: string;
  summary: string;
  excerpt?: string;
  imageUrl?: string; // Added
  videoUrl?: string;
  isRequired: boolean;
  tips?: string;
  warningNotes?: string;
  estimatedTime: number;
}

export interface RateGuideRequest {
  guideId: string;
  rating: number;
  comment?: string;
  isHelpful: boolean;
}

export enum GuideCategory {
  Maintenance = 1,
  Repair = 2,
  Modification = 3,
  Buying = 4,
  Selling = 5,
  Insurance = 6,
  Safety = 7,
  Performance = 8,
  Restoration = 9,
  Electronics = 10,
  Interior = 11,
  Exterior = 12,
  Engine = 13,
  Transmission = 14,
  Suspension = 15,
  Brakes = 16,
  Wheels = 17,
  Detailing = 18,
  Tools = 19,
  General = 20
}

export enum GuideDifficulty {
  Beginner = 1,
  Intermediate = 2,
  Advanced = 3,
  Expert = 4
}

export interface GuideFilters {
  page?: number;
  pageSize?: number;
  category?: GuideCategory;
  difficulty?: GuideDifficulty;
  searchTerm?: string;
  isFeatured?: boolean;
  sortBy?: string;
  sortDescending?: boolean;
}