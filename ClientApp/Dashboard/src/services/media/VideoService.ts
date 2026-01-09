import { ApiService } from '../api/ApiService';
import type { Video, VideoUploadRequest, MediaFilters, PaginatedResult, MediaAnalytics } from './types';

export class VideoService extends ApiService {
  private readonly baseUrl = '/api/v7.0/media/videos';

  async getVideos(filters?: MediaFilters): Promise<PaginatedResult<Video>> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.isPublic !== undefined) params.append('isPublic', filters.isPublic.toString());
    if (filters?.tags?.length) params.append('tags', filters.tags.join(','));
    if (filters?.creatorId) params.append('creatorId', filters.creatorId);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters?.pageNumber) params.append('pageNumber', filters.pageNumber.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());

    const result = await this.get<PaginatedResult<Video>>(`${this.baseUrl}?${params}`);
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch videos');
  }

  async getVideo(id: string): Promise<Video> {
    const result = await this.get<Video>(`${this.baseUrl}/${id}`);
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch video');
  }

  async createVideo(request: VideoUploadRequest): Promise<Video> {
    const result = await this.post<Video>(this.baseUrl, request);
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to create video');
  }

  async updateVideo(id: string, request: Partial<VideoUploadRequest>): Promise<Video> {
    const result = await this.put<Video>(`${this.baseUrl}/${id}`, request);
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to update video');
  }

  async deleteVideo(id: string): Promise<void> {
    const result = await this.delete(`${this.baseUrl}/${id}`);
    if (!result.succeeded) {
      throw new Error(result.message || 'Failed to delete video');
    }
  }

  async publishVideo(id: string): Promise<Video> {
    const result = await this.post<Video>(`${this.baseUrl}/${id}/publish`);
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to publish video');
  }

  async getMyVideos(pageNumber: number = 1, pageSize: number = 10): Promise<PaginatedResult<Video>> {
    const params = new URLSearchParams();
    params.append('pageNumber', pageNumber.toString());
    params.append('pageSize', pageSize.toString());

    const result = await this.get<PaginatedResult<Video>>(`${this.baseUrl}/my-videos?${params}`);
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch my videos');
  }

  async uploadVideo(
    file: File, 
    request: VideoUploadRequest,
    onProgress?: (progress: number) => void
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
    onProgress?: (progress: number) => void
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

    const result = await this.postWithProgress<{
      videoId: string;
      videoUrl: string;
      fileSize: number;
      fileName: string;
    }>('/api/v7.0/media/videos/upload', formData, onProgress, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to upload video');
  }

  private async uploadVideoChunked(
    file: File, 
    request: VideoUploadRequest,
    onProgress?: (progress: number) => void
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
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!result.succeeded) {
        throw new Error(result.message || `Failed to upload chunk ${chunkNumber}`);
      }

      uploadedBytes += chunk.size;
      const progress = Math.round((uploadedBytes / file.size) * 100);
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
    const result = await this.get<{
      uploadedChunks: number;
      progress?: number;
    }>(`/api/v7.0/media/videos/upload/progress/${uploadId}`);
    
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to get upload progress');
  }

  private generateUploadId(): string {
    return `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getTrendingVideos(count: number = 10, days: number = 7): Promise<Video[]> {
    const params = new URLSearchParams();
    params.append('count', count.toString());
    params.append('days', days.toString());

    const result = await this.get<Video[]>(`/api/v7.0/media/videos/discovery/trending?${params}`);
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch trending videos');
  }

  async searchVideos(query: string, page: number = 1, pageSize: number = 10): Promise<Video[]> {
    const params = new URLSearchParams();
    params.append('query', query);
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    const result = await this.get<Video[]>(`/api/v7.0/media/videos/discovery/search?${params}`);
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to search videos');
  }

  async getFeaturedVideos(count: number = 10): Promise<Video[]> {
    const params = new URLSearchParams();
    params.append('count', count.toString());

    const result = await this.get<Video[]>(`/api/v7.0/media/videos/discovery/featured?${params}`);
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch featured videos');
  }

  async getVideoCategories(): Promise<string[]> {
    const result = await this.get<string[]>(`/api/v7.0/media/videos/discovery/categories`);
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch video categories');
  }

  async getVideoAnalytics(id: string): Promise<MediaAnalytics> {
    const result = await this.get<MediaAnalytics>(`/api/v7.0/media/videos/analytics/${id}`);
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch video analytics');
  }

  async getVideoDashboard(): Promise<MediaAnalytics> {
    const result = await this.get<MediaAnalytics>(`/api/v7.0/media/videos/analytics`);
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch video dashboard');
  }

  async likeVideo(id: string, isLike: boolean = true): Promise<void> {
    const result = await this.post(`/api/v7.0/media/videos/interactions/${id}/like`, { isLike });
    if (!result.succeeded) {
      throw new Error(result.message || 'Failed to like video');
    }
  }

  async addComment(id: string, content: string, parentCommentId?: string): Promise<any> {
    const result = await this.post(`/api/v7.0/media/videos/interactions/${id}/comments`, {
      content,
      parentCommentId
    });
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to add comment');
  }
}

export const videoService = new VideoService();