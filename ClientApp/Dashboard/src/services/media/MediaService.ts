import { ApiService } from '../api/ApiService';
import type { MediaDashboardStats, MediaAnalytics, MediaItem } from './types';

export class MediaService extends ApiService {
  private readonly baseUrl = '/api/v7.0/media';

  async getMediaDashboard(): Promise<MediaDashboardStats> {
    const result = await this.get<MediaDashboardStats>(`${this.baseUrl}/dashboard`);
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch media dashboard');
  }

  async getMediaAnalytics(startDate?: Date, endDate?: Date): Promise<MediaAnalytics> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());

    const result = await this.get<MediaAnalytics>(`${this.baseUrl}/analytics?${params}`);
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch media analytics');
  }

  async searchMedia(query: string, type: 'all' | 'video' | 'podcast' = 'all'): Promise<{
    videos: MediaItem[];
    podcasts: MediaItem[];
  }> {
    const params = new URLSearchParams();
    params.append('query', query);
    params.append('type', type);

    const result = await this.get<{
      videos: MediaItem[];
      podcasts: MediaItem[];
    }>(`${this.baseUrl}/search?${params}`);
    
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to search media');
  }

  async getTrendingMedia(count: number = 10, days: number = 7): Promise<{
    videos: MediaItem[];
    podcasts: MediaItem[];
  }> {
    const params = new URLSearchParams();
    params.append('count', count.toString());
    params.append('days', days.toString());

    const result = await this.get<{
      videos: MediaItem[];
      podcasts: MediaItem[];
    }>(`${this.baseUrl}/trending?${params}`);
    
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch trending media');
  }

  async getAllCategories(): Promise<string[]> {
    const result = await this.get<string[]>(`${this.baseUrl}/categories`);
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch categories');
  }

  async uploadThumbnail(file: File): Promise<{
    thumbnailUrl: string;
    fileName: string;
  }> {
    const formData = new FormData();
    formData.append('file', file);

    const result = await this.post<{
      thumbnailUrl: string;
      fileName: string;
    }>('/api/v7.0/media/thumbnails/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to upload thumbnail');
  }
}

export const mediaService = new MediaService();