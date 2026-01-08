import { BaseMediaItem, BaseComment } from '../shared';

export enum VideoQuality {
  SD_480p = 480,
  HD_720p = 720,
  FullHD_1080p = 1080,
  UltraHD_4K = 2160
}

export interface Video extends BaseMediaItem {
  thumbnail?: string;
  videoUrl: string;
  previewUrl?: string;
  duration: string; // TimeSpan as string
  quality: VideoQuality;
  viewCount: number;
  dislikeCount: number;
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

export interface VideoComment extends BaseComment {
  replies: VideoComment[];
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