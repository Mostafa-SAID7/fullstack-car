import { BaseMediaItem, BaseComment } from '../shared';

export interface Podcast extends BaseMediaItem {
  coverImage?: string;
  audioUrl: string;
  duration: string;
  playCount: number;
  downloadCount: number;
  allowDownload: boolean;
  transcript?: string;
  episodeNumber: number;
  seasonNumber: number;
  seriesId?: string;
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

export interface PodcastComment extends BaseComment {
  replies: PodcastComment[];
}