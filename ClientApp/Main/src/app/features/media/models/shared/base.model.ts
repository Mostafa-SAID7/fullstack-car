export enum MediaStatus {
  Draft = 'Draft',
  Processing = 'Processing',
  Published = 'Published',
  Archived = 'Archived'
}

export interface BaseMediaItem {
  id: string;
  title: string;
  description: string;
  status: MediaStatus;
  fileSize: number;
  tags?: string;
  likeCount: number;
  isPublic: boolean;
  allowComments: boolean;
  publishedAt?: Date;
  creatorId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface BaseComment {
  id: string;
  content: string;
  userId: string;
  authorName: string;
  authorAvatar?: string;
  parentCommentId?: string;
  likeCount: number;
  isEdited: boolean;
  createdAt: Date;
  editedAt?: Date;
}

export interface MediaFilters {
  searchTerm?: string;
  status?: MediaStatus;
  creatorId?: string;
  tags?: string;
  fromDate?: Date;
  toDate?: Date;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDescending: boolean;
}