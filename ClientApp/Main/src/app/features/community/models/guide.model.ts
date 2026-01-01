export interface Guide {
  id: number;
  title: string;
  content: string;
  summary: string;
  category: GuideCategory;
  categoryName: string;
  difficulty: GuideDifficulty;
  difficultyName: string;
  estimatedReadTime: number;
  isFeatured: boolean;
  isPublished: boolean;
  viewCount: number;
  likeCount: number;
  bookmarkCount: number;
  tags: string[];
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt?: Date;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  steps: GuideStep[];
  isBookmarked: boolean;
  userRating?: number;
  averageRating: number;
  ratingCount: number;
}

export interface GuideListItem {
  id: number;
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

export interface GuideStep {
  id: number;
  stepNumber: number;
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  isRequired: boolean;
  tips?: string;
  warningNotes?: string;
  estimatedTime: number;
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
  imageUrl?: string;
  videoUrl?: string;
  isRequired: boolean;
  tips?: string;
  warningNotes?: string;
  estimatedTime: number;
}

export interface RateGuideRequest {
  guideId: number;
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