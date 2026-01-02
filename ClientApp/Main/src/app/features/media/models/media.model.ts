export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  videoUrl: string;
  previewUrl?: string;
  duration: string; // TimeSpan as string
  quality: VideoQuality;
  status: MediaStatus;
  fileSize: number;
  tags?: string;
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  isPublic: boolean;
  allowComments: boolean;
  publishedAt?: Date;
  creatorId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface VideoList {
  id: string;
  title: string;
  thumbnail?: string;
  thumbnailUrl?: string;
  duration: string;
  viewCount: number;
  likeCount: number;
  publishedAt?: Date;
  creatorId: string;
  creatorName: string;
  description: string;
  tags?: string;
  commentsCount: number;
}

export interface VideoDetails extends Video {
  comments: VideoComment[];
  isLikedByUser: boolean;
  isDislikedByUser: boolean;
  creatorName: string;
  thumbnailUrl?: string;
  commentsCount: number;
}

export interface Podcast {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  audioUrl: string;
  duration: string;
  status: MediaStatus;
  fileSize: number;
  tags?: string;
  playCount: number;
  likeCount: number;
  downloadCount: number;
  isPublic: boolean;
  allowComments: boolean;
  allowDownload: boolean;
  publishedAt?: Date;
  transcript?: string;
  episodeNumber: number;
  seasonNumber: number;
  seriesId?: string;
  creatorId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface PodcastList {
  id: string;
  title: string;
  coverImage?: string;
  thumbnailUrl?: string;
  duration: string;
  playCount: number;
  playsCount: number;
  likeCount: number;
  likesCount: number;
  publishedAt?: Date;
  episodeNumber: number;
  seasonNumber?: number;
  creatorId: string;
  creatorName: string;
  description: string;
  tags?: string;
  commentsCount: number;
}

export interface PodcastDetails extends Podcast {
  series?: PodcastSeries;
  comments: PodcastComment[];
  isLikedByUser: boolean;
  isLiked: boolean;
  creatorName: string;
  thumbnailUrl?: string;
  audioUrl: string;
  likesCount: number;
  commentsCount: number;
}

export interface PodcastSeries {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  isActive: boolean;
  category?: string;
  language: string;
  creatorId: string;
  episodeCount: number;
  createdAt: Date;
}

export interface VideoComment {
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
  replies: VideoComment[];
}

export interface PodcastComment {
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
  replies: PodcastComment[];
}

export interface VideoPlaylist {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  creatorId: string;
  items: VideoPlaylistItem[];
  videos?: VideoList[];
  videoCount: number;
  viewCount: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface VideoPlaylistItem {
  id: string;
  playlistId: string;
  videoId: string;
  order: number;
  video?: VideoList;
  createdAt: Date;
}

export enum VideoQuality {
  SD_480p = 480,
  HD_720p = 720,
  FullHD_1080p = 1080,
  UltraHD_4K = 2160
}

export enum MediaStatus {
  Draft = 'Draft',
  Processing = 'Processing',
  Published = 'Published',
  Archived = 'Archived'
}

export interface CreateVideoRequest {
  title: string;
  description: string;
  thumbnail?: string;
  quality: VideoQuality;
  tags?: string;
  isPublic: boolean;
  allowComments: boolean;
}

export interface UpdateVideoRequest {
  title: string;
  description: string;
  thumbnail?: string;
  tags?: string;
  isPublic: boolean;
  allowComments: boolean;
}

export interface CreatePodcastRequest {
  title: string;
  description: string;
  coverImage?: string;
  tags?: string;
  isPublic: boolean;
  allowComments: boolean;
  allowDownload: boolean;
  episodeNumber: number;
  seasonNumber: number;
  seriesId?: string;
  transcript?: string;
}

export interface UpdatePodcastRequest {
  title: string;
  description: string;
  coverImage?: string;
  tags?: string;
  isPublic: boolean;
  allowComments: boolean;
  allowDownload: boolean;
  transcript?: string;
}

export interface UploadVideoRequest {
  title: string;
  description: string;
  quality: VideoQuality;
  tags?: string;
  isPublic: boolean;
  allowComments: boolean;
}

export interface UploadPodcastRequest {
  title: string;
  description: string;
  tags?: string;
  isPublic: boolean;
  allowComments: boolean;
  allowDownload: boolean;
  episodeNumber: number;
  seasonNumber: number;
  seriesId?: string;
  transcript?: string;
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