import { ApiService } from '../api/ApiService';
import type { Podcast, PodcastUploadRequest, MediaFilters, PaginatedResult, MediaAnalytics } from './types';

export class PodcastService extends ApiService {
  private readonly baseUrl = '/api/v7.0/media/podcasts';

  async getPodcasts(filters?: MediaFilters): Promise<PaginatedResult<Podcast>> {
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

    const result = await this.get<PaginatedResult<Podcast>>(`${this.baseUrl}?${params}`);
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch podcasts');
  }

  async getPodcast(id: string): Promise<Podcast> {
    const result = await this.get<Podcast>(`${this.baseUrl}/${id}`);
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch podcast');
  }

  async createPodcast(request: PodcastUploadRequest): Promise<Podcast> {
    const result = await this.post<Podcast>(this.baseUrl, request);
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to create podcast');
  }

  async updatePodcast(id: string, request: Partial<PodcastUploadRequest>): Promise<Podcast> {
    const result = await this.put<Podcast>(`${this.baseUrl}/${id}`, request);
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to update podcast');
  }

  async deletePodcast(id: string): Promise<void> {
    const result = await this.delete(`${this.baseUrl}/${id}`);
    if (!result.succeeded) {
      throw new Error(result.message || 'Failed to delete podcast');
    }
  }

  async publishPodcast(id: string): Promise<Podcast> {
    const result = await this.post<Podcast>(`${this.baseUrl}/${id}/publish`);
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to publish podcast');
  }

  async getMyPodcasts(pageNumber: number = 1, pageSize: number = 10): Promise<PaginatedResult<Podcast>> {
    const params = new URLSearchParams();
    params.append('pageNumber', pageNumber.toString());
    params.append('pageSize', pageSize.toString());

    const result = await this.get<PaginatedResult<Podcast>>(`${this.baseUrl}/my-podcasts?${params}`);
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch my podcasts');
  }

  async uploadPodcast(
    file: File, 
    request: PodcastUploadRequest,
    onProgress?: (progress: number) => void
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
    if (request.episodeNumber) formData.append('episodeNumber', request.episodeNumber.toString());
    if (request.seasonNumber) formData.append('seasonNumber', request.seasonNumber.toString());
    if (request.seriesId) formData.append('seriesId', request.seriesId);
    if (request.transcript) formData.append('transcript', request.transcript);

    const result = await this.postWithProgress<{
      podcastId: string;
      audioUrl: string;
      fileSize: number;
      fileName: string;
    }>('/api/v7.0/media/podcasts/upload', formData, onProgress, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to upload podcast');
  }

  async getTrendingPodcasts(count: number = 10, days: number = 7): Promise<Podcast[]> {
    const params = new URLSearchParams();
    params.append('count', count.toString());
    params.append('days', days.toString());

    const result = await this.get<Podcast[]>(`/api/v7.0/media/podcasts/discovery/trending?${params}`);
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch trending podcasts');
  }

  async searchPodcasts(query: string, page: number = 1, pageSize: number = 10): Promise<Podcast[]> {
    const params = new URLSearchParams();
    params.append('query', query);
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    const result = await this.get<Podcast[]>(`/api/v7.0/media/podcasts/discovery/search?${params}`);
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to search podcasts');
  }

  async getFeaturedPodcasts(count: number = 10): Promise<Podcast[]> {
    const params = new URLSearchParams();
    params.append('count', count.toString());

    const result = await this.get<Podcast[]>(`/api/v7.0/media/podcasts/discovery/featured?${params}`);
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch featured podcasts');
  }

  async getPodcastCategories(): Promise<string[]> {
    const result = await this.get<string[]>(`/api/v7.0/media/podcasts/discovery/categories`);
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch podcast categories');
  }

  async getPodcastAnalytics(id: string): Promise<MediaAnalytics> {
    const result = await this.get<MediaAnalytics>(`/api/v7.0/media/podcasts/analytics/${id}`);
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch podcast analytics');
  }

  async getPodcastDashboard(): Promise<MediaAnalytics> {
    const result = await this.get<MediaAnalytics>(`/api/v7.0/media/podcasts/analytics`);
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch podcast dashboard');
  }

  async likePodcast(id: string): Promise<void> {
    const result = await this.post(`/api/v7.0/media/podcasts/interactions/${id}/like`);
    if (!result.succeeded) {
      throw new Error(result.message || 'Failed to like podcast');
    }
  }

  async addComment(id: string, content: string, parentCommentId?: string): Promise<any> {
    const result = await this.post(`/api/v7.0/media/podcasts/interactions/${id}/comments`, {
      content,
      parentCommentId
    });
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to add comment');
  }

  async subscribeToPodcast(id: string): Promise<void> {
    const result = await this.post(`/api/v7.0/media/podcasts/interactions/${id}/subscribe`);
    if (!result.succeeded) {
      throw new Error(result.message || 'Failed to subscribe to podcast');
    }
  }

  async unsubscribeFromPodcast(id: string): Promise<void> {
    const result = await this.delete(`/api/v7.0/media/podcasts/interactions/${id}/subscribe`);
    if (!result.succeeded) {
      throw new Error(result.message || 'Failed to unsubscribe from podcast');
    }
  }

  async getUserSubscriptions(): Promise<Podcast[]> {
    const result = await this.get<Podcast[]>(`/api/v7.0/media/podcasts/interactions/subscriptions`);
    if (result.succeeded && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch user subscriptions');
  }
}

export const podcastService = new PodcastService();