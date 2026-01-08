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