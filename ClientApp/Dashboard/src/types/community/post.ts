/**
 * Post-related models matching backend DTOs
 */

export const PostType = {
  General: 1,
  Question: 2,
  Review: 3,
  News: 4,
  Guide: 5,
  CarShowcase: 6,
  Maintenance: 7,
  BuyingSelling: 8
} as const;

export type PostType = typeof PostType[keyof typeof PostType];

export const PostStatus = {
  Draft: 1,
  Published: 2,
  Archived: 3,
  Deleted: 4,
  Flagged: 5,
  UnderReview: 6
} as const;

export type PostStatus = typeof PostStatus[keyof typeof PostStatus];

export interface PostDto {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  type: PostType;
  status: PostStatus;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt?: Date;
  
  userId: string;
  userFirstName: string;
  userLastName: string;
  userProfileImageUrl?: string;
  
  groupId?: string;
  groupName?: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  imageUrl?: string;
  type: PostType;
  groupId?: string;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  imageUrl?: string;
  type?: PostType;
}

export interface CommentDto {
  id: string;
  postId: string;
  content: string;
  likesCount: number;
  createdAt: Date;
  updatedAt?: Date;
  
  userId: string;
  userFirstName: string;
  userLastName: string;
  userProfileImageUrl?: string;
}

export interface PostAnalytics {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  flaggedPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  averageEngagement: number;
  topPosts: PostDto[];
  recentPosts: PostDto[];
}
