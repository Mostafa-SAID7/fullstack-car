import { ApiService } from '../api/ApiService';
import { videoService } from './VideoService';
import { podcastService } from './PodcastService';
import type { 
  Video, 
  Podcast, 
  MediaFilters, 
  PaginatedResult, 
  MediaAnalytics, 
  MediaDashboardStats,
  MediaItem,
  MediaType
} from './types';

export class MediaService extends ApiService {
  private readonly baseUrl = '/api/v7.0/media';

  // Combined media operations
  async getAllMedia(filters?: MediaFilters): Promise<PaginatedResult<MediaItem>> {
    const queryString = filters ? this.buildQueryString(this.buildFilterParams(filters)) : '';
    const endpoint = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    
    return this.withErrorHandling(async () => {
      return this.get<PaginatedResult<MediaItem>>(endpoint);
    });
  }

  async searchAllMedia(query: string, page: number = 1, pageSize: number = 10): Promise<{
    videos: Video[];
    podcasts: Podcast[];
    totalResults: number;
  }> {
    const queryString = this.buildQueryString({ query, page, pageSize });
    
    return this.withErrorHandling(async () => {
      return this.get<{
        videos: Video[];
        podcasts: Podcast[];
        totalResults: number;
      }>(`${this.baseUrl}/search?${queryString}`);
    });
  }

  async getMediaDashboard(): Promise<MediaDashboardStats> {
    return this.withErrorHandling(async () => {
      return this.get<MediaDashboardStats>(`${this.baseUrl}/dashboard`);
    });
  }

  async getMediaAnalytics(startDate?: string, endDate?: string): Promise<MediaAnalytics> {
    const params: Record<string, any> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const queryString = Object.keys(params).length > 0 ? this.buildQueryString(params) : '';
    const endpoint = queryString ? `${this.baseUrl}/analytics?${queryString}` : `${this.baseUrl}/analytics`;
    
    return this.withErrorHandling(async () => {
      return this.get<MediaAnalytics>(endpoint);
    });
  }

  async uploadThumbnail(file: File): Promise<{ url: string; thumbnailId: string }> {
    const formData = new FormData();
    formData.append('thumbnail', file);
    
    return this.withErrorHandling(async () => {
      return this.post<{ url: string; thumbnailId: string }>(`${this.baseUrl}/thumbnails`, formData);
    });
  }

  async getDashboardStats(): Promise<MediaDashboardStats> {
    return this.withErrorHandling(async () => {
      return this.get<MediaDashboardStats>(`${this.baseUrl}/dashboard/stats`);
    });
  }

  async getOverallAnalytics(): Promise<MediaAnalytics> {
    return this.withErrorHandling(async () => {
      return this.get<MediaAnalytics>(`${this.baseUrl}/analytics`);
    });
  }

  async getTrendingContent(count: number = 10, days: number = 7): Promise<{
    videos: Video[];
    podcasts: Podcast[];
  }> {
    const queryString = this.buildQueryString({ count, days });
    
    return this.withErrorHandling(async () => {
      return this.get<{
        videos: Video[];
        podcasts: Podcast[];
      }>(`${this.baseUrl}/trending?${queryString}`);
    });
  }

  async getFeaturedContent(count: number = 10): Promise<{
    videos: Video[];
    podcasts: Podcast[];
  }> {
    const queryString = this.buildQueryString({ count });
    
    return this.withErrorHandling(async () => {
      return this.get<{
        videos: Video[];
        podcasts: Podcast[];
      }>(`${this.baseUrl}/featured?${queryString}`);
    });
  }

  async getAllCategories(): Promise<{
    videoCategories: string[];
    podcastCategories: string[];
  }> {
    return this.withErrorHandling(async () => {
      return this.get<{
        videoCategories: string[];
        podcastCategories: string[];
      }>(`${this.baseUrl}/categories`);
    });
  }

  async bulkDelete(ids: string[], type: MediaType): Promise<{
    deletedCount: number;
    failedIds: string[];
  }> {
    return this.withErrorHandling(async () => {
      return this.post<{
        deletedCount: number;
        failedIds: string[];
      }>(`${this.baseUrl}/bulk/delete`, {
        ids,
        type
      });
    });
  }

  async bulkPublish(ids: string[], type: MediaType): Promise<{
    publishedCount: number;
    failedIds: string[];
  }> {
    return this.withErrorHandling(async () => {
      return this.post<{
        publishedCount: number;
        failedIds: string[];
      }>(`${this.baseUrl}/bulk/publish`, {
        ids,
        type
      });
    });
  }

  async bulkUpdateTags(ids: string[], type: MediaType, tags: string[]): Promise<{
    updatedCount: number;
    failedIds: string[];
  }> {
    return this.withErrorHandling(async () => {
      return this.post<{
        updatedCount: number;
        failedIds: string[];
      }>(`${this.baseUrl}/bulk/update-tags`, {
        ids,
        type,
        tags
      });
    });
  }

  async exportData(filters?: MediaFilters, format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    const queryString = filters ? this.buildQueryString({
      ...this.buildFilterParams(filters),
      format
    }) : `format=${format}`;
    
    const result = await this.get<ArrayBuffer>(`${this.baseUrl}/export?${queryString}`, {
      headers: {
        'Accept': format === 'csv' ? 'text/csv' : 'application/json'
      }
    });
    
    return new Blob([result.data!], {
      type: format === 'csv' ? 'text/csv' : 'application/json'
    });
  }

  async getStorageStats(): Promise<{
    totalSize: number;
    videoSize: number;
    podcastSize: number;
    availableSpace: number;
    usagePercentage: number;
  }> {
    return this.withErrorHandling(async () => {
      return this.get<{
        totalSize: number;
        videoSize: number;
        podcastSize: number;
        availableSpace: number;
        usagePercentage: number;
      }>(`${this.baseUrl}/storage/stats`);
    });
  }

  async getRecentActivity(count: number = 20): Promise<{
    type: MediaType;
    action: 'created' | 'published' | 'liked' | 'commented' | 'viewed' | 'played';
    mediaId: string;
    title: string;
    timestamp: string;
    userId?: string;
    userName?: string;
  }[]> {
    const queryString = this.buildQueryString({ count });
    
    return this.withErrorHandling(async () => {
      return this.get<{
        type: MediaType;
        action: 'created' | 'published' | 'liked' | 'commented' | 'viewed' | 'played';
        mediaId: string;
        title: string;
        timestamp: string;
        userId?: string;
        userName?: string;
      }[]>(`${this.baseUrl}/activity/recent?${queryString}`);
    });
  }

  // Convenience methods that delegate to specific services
  get videos() {
    return videoService;
  }

  get podcasts() {
    return podcastService;
  }

  // Helper method to build filter parameters
  private buildFilterParams(filters: MediaFilters): Record<string, any> {
    const params: Record<string, any> = {};
    
    if (filters.search) params.search = filters.search;
    if (filters.isPublic !== undefined) params.isPublic = filters.isPublic;
    if (filters.tags?.length) params.tags = filters.tags.join(',');
    if (filters.creatorId) params.creatorId = filters.creatorId;
    if (filters.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters.dateTo) params.dateTo = filters.dateTo;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;
    if (filters.pageNumber) params.pageNumber = filters.pageNumber;
    if (filters.pageSize) params.pageSize = filters.pageSize;
    if (filters.status) params.status = filters.status;

    return params;
  }
}

export const mediaService = new MediaService();