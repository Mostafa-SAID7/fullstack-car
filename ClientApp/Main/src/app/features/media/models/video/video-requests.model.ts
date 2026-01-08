import { VideoQuality } from './video.model';

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

export interface UploadVideoRequest {
  title: string;
  description: string;
  quality: VideoQuality;
  tags?: string;
  isPublic: boolean;
  allowComments: boolean;
}