// Media Types for Dashboard

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  fileSize: number;
  quality: string;
  tags: string[];
  isPublic: boolean;
  allowComments: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  creatorId: string;
  creatorName: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  status: 'draft' | 'published' | 'archived';
}

export interface Podcast {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  thumbnailUrl?: string;
  duration: number;
  fileSize: number;
  tags: string[];
  isPublic: boolean;
  allowComments: boolean;
  allowDownload: boolean;
  playCount: number;
  likeCount: number;
  commentCount: number;
  subscriptionCount: number;
  episodeNumber?: number;
  seasonNumber?: number;
  seriesId?: string;
  transcript?: string;
  creatorId: string;
  creatorName: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  status: 'draft' | 'published' | 'archived';
}

export interface MediaFilters {
  search?: string;
  isPublic?: boolean;
  tags?: string[];
  creatorId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  pageNumber?: number;
  pageSize?: number;
  status?: 'draft' | 'published' | 'archived';
}

export interface PaginatedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface VideoUploadRequest {
  title: string;
  description: string;
  quality: string;
  tags: string[];
  isPublic: boolean;
  allowComments: boolean;
}

export interface PodcastUploadRequest {
  title: string;
  description: string;
  tags: string[];
  isPublic: boolean;
  allowComments: boolean;
  allowDownload: boolean;
  episodeNumber?: number;
  seasonNumber?: number;
  seriesId?: string;
  transcript?: string;
}

export interface MediaAnalytics {
  totalVideos?: number;
  totalPodcasts?: number;
  totalViews?: number;
  totalPlays?: number;
  totalLikes?: number;
  totalComments?: number;
  totalSubscribers?: number;
  recentActivity?: any[];
  videoId?: string;
  podcastId?: string;
  views?: number;
  plays?: number;
  likes?: number;
  comments?: number;
  watchTime?: number;
  engagement?: number;
}

export interface MediaDashboardStats {
  videos: {
    total: number;
    published: number;
    draft: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
  };
  podcasts: {
    total: number;
    published: number;
    draft: number;
    totalPlays: number;
    totalLikes: number;
    totalSubscribers: number;
  };
  recentActivity: {
    type: 'video' | 'podcast';
    action: 'created' | 'published' | 'liked' | 'commented';
    title: string;
    timestamp: string;
  }[];
}

export type MediaType = 'video' | 'podcast';

export interface MediaItem {
  id: string;
  type: MediaType;
  title: string;
  description: string;
  thumbnailUrl?: string;
  createdAt: string;
  status: 'draft' | 'published' | 'archived';
  stats: {
    views?: number;
    plays?: number;
    likes: number;
    comments: number;
  };
}