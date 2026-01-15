/**
 * Guide-related models matching backend DTOs
 */

export enum GuideDifficulty {
  Beginner = 1,
  Intermediate = 2,
  Advanced = 3,
  Expert = 4
}

export enum GuideCategory {
  Maintenance = 1,
  Repair = 2,
  Modification = 3,
  Cleaning = 4,
  Inspection = 5,
  Installation = 6,
  Troubleshooting = 7
}

export interface GuideDto {
  id: string;
  title: string;
  description: string;
  category: GuideCategory;
  difficulty: GuideDifficulty;
  estimatedTime: number; // in minutes
  imageUrl?: string;
  rating: number;
  ratingsCount: number;
  viewsCount: number;
  bookmarksCount: number;
  createdAt: Date;
  updatedAt?: Date;
  
  userId: string;
  userFirstName: string;
  userLastName: string;
  userProfileImageUrl?: string;
}

export interface GuideStepDto {
  id: string;
  guideId: string;
  stepNumber: number;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  tips?: string[];
  warnings?: string[];
}

export interface CreateGuideRequest {
  title: string;
  description: string;
  category: GuideCategory;
  difficulty: GuideDifficulty;
  estimatedTime: number;
  imageUrl?: string;
  steps: CreateGuideStepRequest[];
}

export interface CreateGuideStepRequest {
  stepNumber: number;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  tips?: string[];
  warnings?: string[];
}

export interface UpdateGuideRequest {
  title?: string;
  description?: string;
  category?: GuideCategory;
  difficulty?: GuideDifficulty;
  estimatedTime?: number;
  imageUrl?: string;
}

export interface GuideRatingDto {
  id: string;
  guideId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  
  userId: string;
  userFirstName: string;
  userLastName: string;
}
