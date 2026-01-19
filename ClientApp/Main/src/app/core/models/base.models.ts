export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WithAuthor {
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorVerified?: boolean;
}

export interface WithContent {
  title: string;
  content: string;
  excerpt?: string;
}

export interface WithMetadata {
  tags: string[];
  category?: string;
  metaTitle?: string;
  metaDescription?: string;
  featuredImageUrl?: string;
}

export interface WithUserInteraction {
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  sharesCount?: number;
  bookmarksCount?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export interface WithStatus {
  status: 'draft' | 'published' | 'archived' | 'deleted';
  publishedAt?: Date;
}

export interface WithVisibility {
  isPublic: boolean;
  visibility: 'public' | 'private' | 'unlisted';
}

export interface WithModeration {
  isFlagged: boolean;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  moderatedAt?: Date;
  moderatedBy?: string;
  moderationReason?: string;
}