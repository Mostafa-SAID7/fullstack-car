import { ApiService } from '../api/ApiService';
import { REQUEST_TIMEOUTS } from '../../config/api/base';
import type { Podcast, PodcastUploadRequest, MediaFilters, PaginatedResult, MediaAnalytics } from './types';

export class PodcastService extends ApiService {
  private readonly baseUrl = '/api/v7.0/media/podcasts';

  async getPodcasts(filters?: MediaFilters): Promise<PaginatedResult<Podcast>> {
    const queryString = filters ? this.buildQueryString(this.buildFilterParams(filters)) : '';
    const endpoint = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    
    return this.withErrorHandling(async () => {
      return this.get<PaginatedResult<Podcast>>(endpoint);
    });
  }

  async getPodcast(id: string): Promise<Podcast> {
    return this.withErrorHandling(async () => {
      return this.get<Podcast>(`${this.baseUrl}/${id}`);
    });
  }

  async createPodcast(request: PodcastUploadRequest): Promise<Podcast> {
    return this.withErrorHandling(async () => {
      return this.post<Podcast>(this.baseUrl, request);
    });
  }

  async updatePodcast(id: string, request: Partial<PodcastUploadRequest>): Promise<Podcast> {
    return this.withErrorHandling(async () => {
      return this.put<Podcast>(`${this.baseUrl}/${id}`, request);
    });
  }

  async deletePodcast(id: string): Promise<void> {
    return this.withErrorHandling(async () => {
      return this.delete<void>(`${this.baseUrl}/${id}`);
    });
  }

  async publishPodcast(id: string): Promise<Podcast> {
    return this.withErrorHandling(async () => {
      return this.post<Podcast>(`${this.baseUrl}/${id}/publish`);
    });
  }

  async getMyPodcasts(pageNumber: number = 1, pageSize: number = 10): Promise<PaginatedResult<Podcast>> {
    const queryString = this.buildQueryString({ pageNumber, pageSize });
    
    return this.withErrorHandling(async () => {
      return this.get<PaginatedResult<Podcast>>(`${this.baseUrl}/my-podcasts?${queryString}`);
    });
  }

  async uploadPodcast(
    file: File, 
    request: PodcastUploadRequest,
    onProgress?: (progress: { loaded: number; total: number; percentage: number }) => void
  ): Promise<{
    podcastId: string;
    audioUrl: string;
    fileSize: number;
    fileName: string;
  }> {
    // For small files (< 50MB), use regular upload
    if (file.size < 50 * 1024 * 1024) {
      return this.uploadPodcastRegular(file, request, onProgress);
    }
    
    // For large files, use chunked upload
    return this.uploadPodcastChunked(file, request, onProgress);
  }

  private async uploadPodcastRegular(
    file: File, 
    request: PodcastUploadRequest,
    onProgress?: (progress: { loaded: number; total: number; percentage: number }) => void
  ): Promise<{
    podcastId: string;
    audioUrl: string;
    fileSize: number;
    fileName: string;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', request.title);
    formData.append('description', request.description);
    formData.append('tags', request.tags.join(','));
    formData.append('isPublic', request.isPublic.toString());
    formData.append('allowComments', request.allowComments.toString());
    formData.append('allowDownload', request.allowDownload.toString());
    
    if (request.episodeNumber) {
      formData.append('episodeNumber', request.episodeNumber.toString());
    }
    if (request.seasonNumber) {
      formData.append('seasonNumber', request.seasonNumber.toString());
    }
    if (request.seriesId) {
      formData.append('seriesId', request.seriesId);
    }
    if (request.transcript) {
      formData.append('transcript', request.transcript);
    }

    return this.withErrorHandling(async () => {
      return this.postWithProgress<{
        podcastId: string;
        audioUrl: string;
        fileSize: number;
        fileName: string;
      }>('/api/v7.0/media/podcasts/upload', formData, onProgress, {
        timeout: REQUEST_TIMEOUTS.UPLOAD
      });
    });
  }

  private async uploadPodcastChunked(
    file: File, 
    request: PodcastUploadRequest,
    onProgress?: (progress: { loaded: number; total: number; percentage: number }) => void
  ): Promise<{
    podcastId: string;
    audioUrl: string;
    fileSize: number;
    fileName: string;
  }> {
    const chunkSize = 5 * 1024 * 1024; // 5MB chunks
    const totalChunks = Math.ceil(file.size / chunkSize);
    const uploadId = this.generateUploadId();
    
    let uploadedBytes = 0;

    // Upload chunks
    for (let chunkNumber = 1; chunkNumber <= totalChunks; chunkNumber++) {
      const start = (chunkNumber - 1) * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('uploadId', uploadId);
      formData.append('chunkNumber', chunkNumber.toString());
      formData.append('totalChunks', totalChunks.toString());
      formData.append('fileName', file.name);
      
      // Include metadata only on the last chunk
      if (chunkNumber === totalChunks) {
        formData.append('title', request.title);
        formData.append('description', request.description);
        formData.append('tags', request.tags.join(','));
        formData.append('isPublic', request.isPublic.toString());
        formData.append('allowComments', request.allowComments.toString());
        formData.append('allowDownload', request.allowDownload.toString());
        
        if (request.episodeNumber) {
          formData.append('episodeNumber', request.episodeNumber.toString());
        }
        if (request.seasonNumber) {
          formData.append('seasonNumber', request.seasonNumber.toString());
        }
        if (request.seriesId) {
          formData.append('seriesId', request.seriesId);
        }
        if (request.transcript) {
          formData.append('transcript', request.transcript);
        }
      }

      const result = await this.post<any>('/api/v7.0/media/podcasts/upload/chunked', formData, {
        timeout: REQUEST_TIMEOUTS.UPLOAD
      });

      if (!result.succeeded) {
        throw new Error(result.message || `Failed to upload chunk ${chunkNumber}`);
      }

      uploadedBytes += chunk.size;
      const progress = {
        loaded: uploadedBytes,
        total: file.size,
        percentage: Math.round((uploadedBytes / file.size) * 100)
      };
      onProgress?.(progress);

      // If this is the last chunk and upload is complete
      if (chunkNumber === totalChunks && result.data?.isComplete) {
        return {
          podcastId: result.data.podcastId,
          audioUrl: result.data.audioUrl,
          fileSize: result.data.fileSize,
          fileName: result.data.fileName
        };
      }
    }

    throw new Error('Upload completed but no final result received');
  }

  async getUploadProgress(uploadId: string): Promise<{
    uploadedChunks: number;
    progress?: number;
  }> {
    return this.withErrorHandling(async () => {
      return this.get<{
        uploadedChunks: number;
        progress?: number;
      }>(`/api/v7.0/media/podcasts/upload/progress/${uploadId}`);
    });
  }

  private generateUploadId(): string {
    return `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getTrendingPodcasts(count: number = 10, days: number = 7): Promise<Podcast[]> {
    const queryString = this.buildQueryString({ count, days });
    
    return this.withErrorHandling(async () => {
      return this.get<Podcast[]>(`/api/v7.0/media/podcasts/discovery/trending?${queryString}`);
    });
  }

  async searchPodcasts(query: string, page: number = 1, pageSize: number = 10): Promise<Podcast[]> {
    const queryString = this.buildQueryString({ query, page, pageSize });
    
    return this.withErrorHandling(async () => {
      return this.get<Podcast[]>(`/api/v7.0/media/podcasts/discovery/search?${queryString}`);
    });
  }

  async getFeaturedPodcasts(count: number = 10): Promise<Podcast[]> {
    const queryString = this.buildQueryString({ count });
    
    return this.withErrorHandling(async () => {
      return this.get<Podcast[]>(`/api/v7.0/media/podcasts/discovery/featured?${queryString}`);
    });
  }

  async getPodcastCategories(): Promise<string[]> {
    return this.withErrorHandling(async () => {
      return this.get<string[]>(`/api/v7.0/media/podcasts/discovery/categories`);
    });
  }

  async getPodcastAnalytics(id: string): Promise<MediaAnalytics> {
    return this.withErrorHandling(async () => {
      return this.get<MediaAnalytics>(`/api/v7.0/media/podcasts/analytics/${id}`);
    });
  }

  async getPodcastDashboard(): Promise<MediaAnalytics> {
    return this.withErrorHandling(async () => {
      return this.get<MediaAnalytics>(`/api/v7.0/media/podcasts/analytics`);
    });
  }

  async likePodcast(id: string, isLike: boolean = true): Promise<void> {
    return this.withErrorHandling(async () => {
      return this.post<void>(`/api/v7.0/media/podcasts/interactions/${id}/like`, { isLike });
    });
  }

  async addComment(id: string, content: string, parentCommentId?: string): Promise<any> {
    return this.withErrorHandling(async () => {
      return this.post<any>(`/api/v7.0/media/podcasts/interactions/${id}/comments`, {
        content,
        parentCommentId
      });
    });
  }

  async subscribeToPodcast(id: string): Promise<void> {
    return this.withErrorHandling(async () => {
      return this.post<void>(`/api/v7.0/media/podcasts/interactions/${id}/subscribe`);
    });
  }

  async unsubscribeFromPodcast(id: string): Promise<void> {
    return this.withErrorHandling(async () => {
      return this.delete<void>(`/api/v7.0/media/podcasts/interactions/${id}/subscribe`);
    });
  }

  async getPodcastSeries(seriesId: string): Promise<Podcast[]> {
    return this.withErrorHandling(async () => {
      return this.get<Podcast[]>(`${this.baseUrl}/series/${seriesId}`);
    });
  }

  async createPodcastSeries(name: string, description: string): Promise<{ seriesId: string }> {
    return this.withErrorHandling(async () => {
      return this.post<{ seriesId: string }>(`${this.baseUrl}/series`, {
        name,
        description
      });
    });
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

export const podcastService = new PodcastService();