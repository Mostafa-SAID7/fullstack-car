import { ApiService } from '../api/ApiService';
import { REQUEST_TIMEOUTS } from '../../config/api/base';
import type { Video, VideoUploadRequest, MediaFilters, PaginatedResult, MediaAnalytics } from './types';

export class VideoService extends ApiService {
  private readonly baseUrl = '/api/v7.0/media/videos';

  async getVideos(filters?: MediaFilters): Promise<PaginatedResult<Video>> {
    const queryString = filters ? this.buildQueryString(this.buildFilterParams(filters)) : '';
    const endpoint = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    
    return this.withErrorHandling(async () => {
      return this.get<PaginatedResult<Video>>(endpoint);
    });
  }

  async getVideo(id: string): Promise<Video> {
    return this.withErrorHandling(async () => {
      return this.get<Video>(`${this.baseUrl}/${id}`);
    });
  }

  async createVideo(request: VideoUploadRequest): Promise<Video> {
    return this.withErrorHandling(async () => {
      return this.post<Video>(this.baseUrl, request);
    });
  }

  async updateVideo(id: string, request: Partial<VideoUploadRequest>): Promise<Video> {
    return this.withErrorHandling(async () => {
      return this.put<Video>(`${this.baseUrl}/${id}`, request);
    });
  }

  async deleteVideo(id: string): Promise<void> {
    return this.withErrorHandling(async () => {
      return this.delete<void>(`${this.baseUrl}/${id}`);
    });
  }

  async publishVideo(id: string): Promise<Video> {
    return this.withErrorHandling(async () => {
      return this.post<Video>(`${this.baseUrl}/${id}/publish`);
    });
  }

  async getMyVideos(pageNumber: number = 1, pageSize: number = 10): Promise<PaginatedResult<Video>> {
    const queryString = this.buildQueryString({ pageNumber, pageSize });
    
    return this.withErrorHandling(async () => {
      return this.get<PaginatedResult<Video>>(`${this.baseUrl}/my-videos?${queryString}`);
    });
  }

  async uploadVideo(
    file: File, 
    request: VideoUploadRequest,
    onProgress?: (progress: { loaded: number; total: number; percentage: number }) => void
  ): Promise<{
    videoId: string;
    videoUrl: string;
    fileSize: number;
    fileName: string;
  }> {
    // For small files (< 50MB), use regular upload
    if (file.size < 50 * 1024 * 1024) {
      return this.uploadVideoRegular(file, request, onProgress);
    }
    
    // For large files, use chunked upload
    return this.uploadVideoChunked(file, request, onProgress);
  }

  private async uploadVideoRegular(
    file: File, 
    request: VideoUploadRequest,
    onProgress?: (progress: { loaded: number; total: number; percentage: number }) => void
  ): Promise<{
    videoId: string;
    videoUrl: string;
    fileSize: number;
    fileName: string;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', request.title);
    formData.append('description', request.description);
    formData.append('quality', request.quality);
    formData.append('tags', request.tags.join(','));
    formData.append('isPublic', request.isPublic.toString());
    formData.append('allowComments', request.allowComments.toString());

    return this.withErrorHandling(async () => {
      return this.postWithProgress<{
        videoId: string;
        videoUrl: string;
        fileSize: number;
        fileName: string;
      }>('/api/v7.0/media/videos/upload', formData, onProgress, {
        timeout: REQUEST_TIMEOUTS.UPLOAD
      });
    });
  }

  private async uploadVideoChunked(
    file: File, 
    request: VideoUploadRequest,
    onProgress?: (progress: { loaded: number; total: number; percentage: number }) => void
  ): Promise<{
    videoId: string;
    videoUrl: string;
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
        formData.append('quality', request.quality);
        formData.append('tags', request.tags.join(','));
        formData.append('isPublic', request.isPublic.toString());
        formData.append('allowComments', request.allowComments.toString());
      }

      const result = await this.post<any>('/api/v7.0/media/videos/upload/chunked', formData, {
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
          videoId: result.data.videoId,
          videoUrl: result.data.videoUrl,
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
      }>(`/api/v7.0/media/videos/upload/progress/${uploadId}`);
    });
  }

  private generateUploadId(): string {
    return `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getTrendingVideos(count: number = 10, days: number = 7): Promise<Video[]> {
    const queryString = this.buildQueryString({ count, days });
    
    return this.withErrorHandling(async () => {
      return this.get<Video[]>(`/api/v7.0/media/videos/discovery/trending?${queryString}`);
    });
  }

  async searchVideos(query: string, page: number = 1, pageSize: number = 10): Promise<Video[]> {
    const queryString = this.buildQueryString({ query, page, pageSize });
    
    return this.withErrorHandling(async () => {
      return this.get<Video[]>(`/api/v7.0/media/videos/discovery/search?${queryString}`);
    });
  }

  async getFeaturedVideos(count: number = 10): Promise<Video[]> {
    const queryString = this.buildQueryString({ count });
    
    return this.withErrorHandling(async () => {
      return this.get<Video[]>(`/api/v7.0/media/videos/discovery/featured?${queryString}`);
    });
  }

  async getVideoCategories(): Promise<string[]> {
    return this.withErrorHandling(async () => {
      return this.get<string[]>(`/api/v7.0/media/videos/discovery/categories`);
    });
  }

  async getVideoAnalytics(id: string): Promise<MediaAnalytics> {
    return this.withErrorHandling(async () => {
      return this.get<MediaAnalytics>(`/api/v7.0/media/videos/analytics/${id}`);
    });
  }

  async getVideoDashboard(): Promise<MediaAnalytics> {
    return this.withErrorHandling(async () => {
      return this.get<MediaAnalytics>(`/api/v7.0/media/videos/analytics`);
    });
  }

  async likeVideo(id: string, isLike: boolean = true): Promise<void> {
    return this.withErrorHandling(async () => {
      return this.post<void>(`/api/v7.0/media/videos/interactions/${id}/like`, { isLike });
    });
  }

  async addComment(id: string, content: string, parentCommentId?: string): Promise<any> {
    return this.withErrorHandling(async () => {
      return this.post<any>(`/api/v7.0/media/videos/interactions/${id}/comments`, {
        content,
        parentCommentId
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

export const videoService = new VideoService();