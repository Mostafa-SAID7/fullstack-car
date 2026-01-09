// Media Models for Angular Main App

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
  status: MediaStatus;
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
  status: MediaStatus;
}

export interface MediaComment {
  id: string;
  mediaId: string;
  mediaType: MediaType;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  parentCommentId?: string;
  replies?: MediaComment[];
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MediaInteraction {
  id: string;
  mediaId: string;
  mediaType: MediaType;
  userId: string;
  interactionType: InteractionType;
  createdAt: string;
}

export interface MediaAnalytics {
  totalVideos?: number;
  totalPodcasts?: number;
  totalViews?: number;
  totalPlays?: number;
  totalLikes?: number;
  totalComments?: number;
  totalSubscribers?: number;
  recentActivity?: MediaActivity[];
  videoId?: string;
  podcastId?: string;
  views?: number;
  plays?: number;
  likes?: number;
  comments?: number;
  watchTime?: number;
  engagement?: number;
}

export interface MediaActivity {
  type: MediaType;
  action: ActivityAction;
  mediaId: string;
  title: string;
  timestamp: string;
  userId?: string;
  userName?: string;
}

export interface MediaFilters {
  search?: string;
  isPublic?: boolean;
  tags?: string[];
  creatorId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  pageNumber?: number;
  pageSize?: number;
  status?: MediaStatus;
  mediaType?: MediaType;
}

export interface MediaSearchResult {
  videos: Video[];
  podcasts: Podcast[];
  totalResults: number;
  searchQuery: string;
  searchTime: number;
}

export interface MediaCategory {
  id: string;
  name: string;
  description?: string;
  mediaType: MediaType;
  itemCount: number;
}

export interface MediaPlaylist {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  creatorId: string;
  creatorName: string;
  items: MediaPlaylistItem[];
  totalDuration: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MediaPlaylistItem {
  id: string;
  playlistId: string;
  mediaId: string;
  mediaType: MediaType;
  title: string;
  thumbnailUrl?: string;
  duration: number;
  order: number;
  addedAt: string;
}

export interface PodcastSeries {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  creatorName: string;
  thumbnailUrl?: string;
  episodeCount: number;
  totalDuration: number;
  subscriberCount: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MediaSubscription {
  id: string;
  userId: string;
  mediaId?: string;
  seriesId?: string;
  mediaType: MediaType;
  notificationEnabled: boolean;
  subscribedAt: string;
}

// Enums
export enum MediaType {
  Video = 'video',
  Podcast = 'podcast'
}

export enum MediaStatus {
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived'
}

export enum InteractionType {
  Like = 'like',
  Dislike = 'dislike',
  Comment = 'comment',
  Share = 'share',
  Subscribe = 'subscribe',
  View = 'view',
  Play = 'play'
}

export enum ActivityAction {
  Created = 'created',
  Published = 'published',
  Liked = 'liked',
  Commented = 'commented',
  Viewed = 'viewed',
  Played = 'played',
  Shared = 'shared',
  Subscribed = 'subscribed'
}

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

// Utility Types
export type MediaItem = Video | Podcast;

export interface MediaUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  speed?: number;
  remainingTime?: number;
}

export interface MediaQuality {
  label: string;
  value: string;
  bitrate?: number;
  resolution?: string;
}

export interface MediaThumbnail {
  url: string;
  width: number;
  height: number;
  size?: number;
}

// API Response Types
export interface MediaListResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface MediaSearchResponse {
  videos: Video[];
  podcasts: Podcast[];
  totalResults: number;
  searchQuery: string;
  searchTime: number;
  suggestions?: string[];
}

export interface MediaTrendingResponse {
  videos: Video[];
  podcasts: Podcast[];
  period: string;
  generatedAt: string;
}

export interface MediaFeaturedResponse {
  videos: Video[];
  podcasts: Podcast[];
  updatedAt: string;
}

export interface MediaCategoriesResponse {
  videoCategories: MediaCategory[];
  podcastCategories: MediaCategory[];
}

// Form Models
export interface VideoUploadForm {
  title: string;
  description: string;
  quality: string;
  tags: string[];
  isPublic: boolean;
  allowComments: boolean;
  scheduledPublishAt?: Date;
}

export interface PodcastUploadForm {
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
  scheduledPublishAt?: Date;
}

export interface CommentForm {
  content: string;
  parentCommentId?: string;
}

export interface PlaylistForm {
  name: string;
  description?: string;
  isPublic: boolean;
}

export interface SeriesForm {
  name: string;
  description: string;
  isPublic: boolean;
}