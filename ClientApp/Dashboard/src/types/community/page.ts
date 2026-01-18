/**
 * Page-related models matching backend DTOs
 */

export const PageStatus = {
  Draft: 1,
  Published: 2,
  Archived: 3
} as const;

export type PageStatus = (typeof PageStatus)[keyof typeof PageStatus];

export const PageType = {
  Article: 1,
  Guide: 2,
  FAQ: 3,
  Policy: 4,
  About: 5,
  Help: 6
} as const;

export type PageType = (typeof PageType)[keyof typeof PageType];

export interface PageDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: PageType;
  status: PageStatus;
  viewsCount: number;
  createdAt: Date;
  updatedAt?: Date;
  publishedAt?: Date;

  authorId: string;
  authorFirstName: string;
  authorLastName: string;
}

export interface PageContentDto {
  id: string;
  pageId: string;
  content: string; // HTML or Markdown
  version: number;
  createdAt: Date;

  authorId: string;
  authorFirstName: string;
  authorLastName: string;
}

export interface CreatePageRequest {
  title: string;
  slug: string;
  description: string;
  type: PageType;
  content: string;
}

export interface UpdatePageRequest {
  title?: string;
  slug?: string;
  description?: string;
  type?: PageType;
  content?: string;
}

export interface PageRevisionDto {
  id: string;
  pageId: string;
  version: number;
  content: string;
  changeDescription?: string;
  createdAt: Date;

  authorId: string;
  authorFirstName: string;
  authorLastName: string;
}
