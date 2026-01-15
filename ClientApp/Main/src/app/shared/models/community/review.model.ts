/**
 * Review-related models matching backend DTOs
 */

export enum ReviewType {
  CarReview = 1,
  DealerReview = 2,
  ServiceReview = 3,
  ProductReview = 4,
  ExperienceReview = 5
}

export interface ReviewDto {
  id: string;
  title: string;
  content: string;
  rating: number;
  type: ReviewType;
  imageUrl?: string;
  isVerified: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt?: Date;
  
  userId: string;
  userFirstName: string;
  userLastName: string;
  userProfileImageUrl?: string;
  
  carBrand?: string;
  carModel?: string;
  carYear?: number;
}

export interface CreateReviewRequest {
  title: string;
  content: string;
  rating: number;
  type: ReviewType;
  imageUrl?: string;
  carBrand?: string;
  carModel?: string;
  carYear?: number;
}

export interface UpdateReviewRequest {
  title?: string;
  content?: string;
  rating?: number;
  imageUrl?: string;
}

export interface ReviewCommentDto {
  id: string;
  reviewId: string;
  content: string;
  likesCount: number;
  createdAt: Date;
  
  userId: string;
  userFirstName: string;
  userLastName: string;
  userProfileImageUrl?: string;
}
