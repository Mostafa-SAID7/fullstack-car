/**
 * Post-related models matching backend DTOs
 */

export enum PostType {
  General = 1,
  Question = 2,
  Review = 3,
  News = 4,
  Guide = 5,
  CarShowcase = 6,
  Maintenance = 7,
  BuyingSelling = 8
}

export enum PostStatus {
  Draft = 1,
  Published = 2,
  Archived = 3,
  Deleted = 4,
  Flagged = 5,
  UnderReview = 6
}

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

export interface CreateCommentRequest {
  postId: string;
  content: string;
}

export interface PostAnalytics {
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  engagementRate: number;
}

export interface Post extends PostDto { }
