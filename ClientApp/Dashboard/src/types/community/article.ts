/**
 * News/Article-related models matching backend DTOs
 */

export const enum ArticleStatus {
  Draft = 1,
  Published = 2,
  Archived = 3,
  Featured = 4
}

export const enum ArticleCategory {
  Industry = 1,
  Technology = 2,
  Reviews = 3,
  Events = 4,
  Tips = 5,
  Maintenance = 6,
  Lifestyle = 7,
  Racing = 8
}

export interface ArticleDto {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: ArticleCategory;
  status: ArticleStatus;
  imageUrl?: string;
  tags?: string[];
  viewsCount: number;
  likesCount: number;
  sharesCount: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt?: Date;
  publishedAt?: Date;
  
  authorId: string;
  authorFirstName: string;
  authorLastName: string;
  authorProfileImageUrl?: string;
}

export interface CreateArticleRequest {
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: ArticleCategory;
  imageUrl?: string;
  tags?: string[];
}

export interface UpdateArticleRequest {
  title?: string;
  slug?: string;
  summary?: string;
  content?: string;
  category?: ArticleCategory;
  imageUrl?: string;
  tags?: string[];
}

export interface NewsCommentDto {
  id: string;
  articleId: string;
  content: string;
  likesCount: number;
  createdAt: Date;
  updatedAt?: Date;
  
  userId: string;
  userFirstName: string;
  userLastName: string;
  userProfileImageUrl?: string;
}

export interface CreateNewsCommentRequest {
  articleId: string;
  content: string;
}

export interface ArticleTagDto {
  id: string;
  name: string;
  slug: string;
  articlesCount: number;
}
