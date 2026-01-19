export enum PageType {
  Article = 1,
  Guide = 2,
  FAQ = 3,
  Policy = 4,
  About = 5,
  Help = 6
}

export enum PageStatus {
  Draft = 1,
  Published = 2,
  Archived = 3
}

export interface PageDto {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  type: PageType;
  status: PageStatus;
  metaTitle?: string;
  metaDescription?: string;
  featuredImageUrl?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  authorName: string;
  viewCount: number;
  tags: string[];
}

export interface PageContentDto {
  id: string;
  pageId: string;
  content: string;
  version: number;
  createdAt: Date;
  createdBy: string;
}

export interface CreatePageRequest {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  type: PageType;
  metaTitle?: string;
  metaDescription?: string;
  featuredImageUrl?: string;
  tags?: string[];
}

export interface UpdatePageRequest {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  type?: PageType;
  metaTitle?: string;
  metaDescription?: string;
  featuredImageUrl?: string;
  tags?: string[];
}

export interface PageRevisionDto {
  id: string;
  pageId: string;
  title: string;
  content: string;
  version: number;
  createdAt: Date;
  createdBy: string;
  createdByName: string;
  changeDescription?: string;
}