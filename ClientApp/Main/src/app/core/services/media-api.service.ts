import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClientService, ApiResponse } from './http-client.service';

// Media Types for Angular
export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  fileSize: number;
  quality: string;
  tags: string[];
  isPublic: boolean;
  allowComments: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  creatorId: string;
  creatorName: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  status: 'draft' | 'published' | 'archived';
}

export interface Podcast {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  thumbnailUrl?: string;
  duration: number;
  fileSize: number;
  tags: string[];
  isPublic: boolean;
  allowComments: boolean;
  allowDownload: boolean;
  playCount: number;
  likeCount: number;
  commentCount: number;
  subscriptionCount: number;
  episodeNumber?: number;
  seasonNumber?: number;
  seriesId?: string;
  transcript?: string;
  creatorId: string;
  creatorName: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  status: 'draft' | 'published' | 'archived';
}

export interface MediaFilters {
  search?: string;
  isPublic?: boolean;
  tags?: string[];
  creatorId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  pageNumber?: number;
  pageSize?: number;
  status?: 'draft' | 'published' | 'archived';
}

export interface PaginatedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface MediaAnalytics {
  totalVideos?: number;
  totalPodcasts?: number;
  totalViews?: number;
  totalPlays?: number;
  totalLikes?: number;
  totalComments?: number;
  totalSubscribers?: number;
  recentActivity?: any[];
  videoId?: string;
  podcastId?: string;
  views?: number;
  plays?: number;
  likes?: number;
  comments?: number;
  watchTime?: number;
  engagement?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MediaApiService {
  private readonly baseUrl = '/api/v7.0/media';

  constructor(private httpClient: HttpClientService) {}

  // Video Services
  getVideos(filters?: MediaFilters): Observable<PaginatedResult<Video>> {
    const queryString = filters ? this.buildQueryString(filters) : '';
    const endpoint = queryString ? `${this.baseUrl}/videos?${queryString}` : `${this.baseUrl}/videos`;
    
    return this.httpClient.get<PaginatedResult<Video>>(endpoint).pipe(
      map(response => this.extractData(response))
    );
  }

  getVideo(id: string): Observable<Video> {
    return this.httpClient.get<Video>(`${this.baseUrl}/videos/${id}`).pipe(
      map(response => this.extractData(response))
    );
  }

  getTrendingVideos(count: number = 10, days: number = 7): Observable<Video[]> {
    const queryString = this.httpClient.buildQueryString({ count, days });
    
    return this.httpClient.get<Video[]>(`${this.baseUrl}/videos/discovery/trending?${queryString}`).pipe(
      map(response => this.extractData(response))
    );
  }

  searchVideos(query: string, page: number = 1, pageSize: number = 10): Observable<Video[]> {
    const queryString = this.httpClient.buildQueryString({ query, page, pageSize });
    
    return this.httpClient.get<Video[]>(`${this.baseUrl}/videos/discovery/search?${queryString}`).pipe(
      map(response => this.extractData(response))
    );
  }

  getFeaturedVideos(count: number = 10): Observable<Video[]> {
    const queryString = this.httpClient.buildQueryString({ count });
    
    return this.httpClient.get<Video[]>(`${this.baseUrl}/videos/discovery/featured?${queryString}`).pipe(
      map(response => this.extractData(response))
    );
  }

  getVideoCategories(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.baseUrl}/videos/discovery/categories`).pipe(
      map(response => this.extractData(response))
    );
  }

  likeVideo(id: string, isLike: boolean = true): Observable<void> {
    return this.httpClient.post<void>(`${this.baseUrl}/videos/interactions/${id}/like`, { isLike }).pipe(
      map(response => this.extractData(response))
    );
  }

  addVideoComment(id: string, content: string, parentCommentId?: string): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/videos/interactions/${id}/comments`, {
      content,
      parentCommentId
    }).pipe(
      map(response => this.extractData(response))
    );
  }

  getVideoComments(id: string, page: number = 1, pageSize: number = 10): Observable<any[]> {
    const queryString = this.httpClient.buildQueryString({ page, pageSize });
    
    return this.httpClient.get<any[]>(`${this.baseUrl}/videos/interactions/${id}/comments?${queryString}`).pipe(
      map(response => this.extractData(response))
    );
  }

  // Podcast Services
  getPodcasts(filters?: MediaFilters): Observable<PaginatedResult<Podcast>> {
    const queryString = filters ? this.buildQueryString(filters) : '';
    const endpoint = queryString ? `${this.baseUrl}/podcasts?${queryString}` : `${this.baseUrl}/podcasts`;
    
    return this.httpClient.get<PaginatedResult<Podcast>>(endpoint).pipe(
      map(response => this.extractData(response))
    );
  }

  getPodcast(id: string): Observable<Podcast> {
    return this.httpClient.get<Podcast>(`${this.baseUrl}/podcasts/${id}`).pipe(
      map(response => this.extractData(response))
    );
  }

  getTrendingPodcasts(count: number = 10, days: number = 7): Observable<Podcast[]> {
    const queryString = this.httpClient.buildQueryString({ count, days });
    
    return this.httpClient.get<Podcast[]>(`${this.baseUrl}/podcasts/discovery/trending?${queryString}`).pipe(
      map(response => this.extractData(response))
    );
  }

  searchPodcasts(query: string, page: number = 1, pageSize: number = 10): Observable<Podcast[]> {
    const queryString = this.httpClient.buildQueryString({ query, page, pageSize });
    
    return this.httpClient.get<Podcast[]>(`${this.baseUrl}/podcasts/discovery/search?${queryString}`).pipe(
      map(response => this.extractData(response))
    );
  }

  getFeaturedPodcasts(count: number = 10): Observable<Podcast[]> {
    const queryString = this.httpClient.buildQueryString({ count });
    
    return this.httpClient.get<Podcast[]>(`${this.baseUrl}/podcasts/discovery/featured?${queryString}`).pipe(
      map(response => this.extractData(response))
    );
  }

  getPodcastCategories(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.baseUrl}/podcasts/discovery/categories`).pipe(
      map(response => this.extractData(response))
    );
  }

  likePodcast(id: string, isLike: boolean = true): Observable<void> {
    return this.httpClient.post<void>(`${this.baseUrl}/podcasts/interactions/${id}/like`, { isLike }).pipe(
      map(response => this.extractData(response))
    );
  }

  subscribeToPodcast(id: string): Observable<void> {
    return this.httpClient.post<void>(`${this.baseUrl}/podcasts/interactions/${id}/subscribe`).pipe(
      map(response => this.extractData(response))
    );
  }

  unsubscribeFromPodcast(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/podcasts/interactions/${id}/subscribe`).pipe(
      map(response => this.extractData(response))
    );
  }

  addPodcastComment(id: string, content: string, parentCommentId?: string): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/podcasts/interactions/${id}/comments`, {
      content,
      parentCommentId
    }).pipe(
      map(response => this.extractData(response))
    );
  }

  getPodcastComments(id: string, page: number = 1, pageSize: number = 10): Observable<any[]> {
    const queryString = this.httpClient.buildQueryString({ page, pageSize });
    
    return this.httpClient.get<any[]>(`${this.baseUrl}/podcasts/interactions/${id}/comments?${queryString}`).pipe(
      map(response => this.extractData(response))
    );
  }

  getPodcastSeries(seriesId: string): Observable<Podcast[]> {
    return this.httpClient.get<Podcast[]>(`${this.baseUrl}/podcasts/series/${seriesId}`).pipe(
      map(response => this.extractData(response))
    );
  }

  // Combined Media Services
  searchAllMedia(query: string, page: number = 1, pageSize: number = 10): Observable<{
    videos: Video[];
    podcasts: Podcast[];
    totalResults: number;
  }> {
    const queryString = this.httpClient.buildQueryString({ query, page, pageSize });
    
    return this.httpClient.get<{
      videos: Video[];
      podcasts: Podcast[];
      totalResults: number;
    }>(`${this.baseUrl}/search?${queryString}`).pipe(
      map(response => this.extractData(response))
    );
  }

  getTrendingContent(count: number = 10, days: number = 7): Observable<{
    videos: Video[];
    podcasts: Podcast[];
  }> {
    const queryString = this.httpClient.buildQueryString({ count, days });
    
    return this.httpClient.get<{
      videos: Video[];
      podcasts: Podcast[];
    }>(`${this.baseUrl}/trending?${queryString}`).pipe(
      map(response => this.extractData(response))
    );
  }

  getFeaturedContent(count: number = 10): Observable<{
    videos: Video[];
    podcasts: Podcast[];
  }> {
    const queryString = this.httpClient.buildQueryString({ count });
    
    return this.httpClient.get<{
      videos: Video[];
      podcasts: Podcast[];
    }>(`${this.baseUrl}/featured?${queryString}`).pipe(
      map(response => this.extractData(response))
    );
  }

  getAllCategories(): Observable<{
    videoCategories: string[];
    podcastCategories: string[];
  }> {
    return this.httpClient.get<{
      videoCategories: string[];
      podcastCategories: string[];
    }>(`${this.baseUrl}/categories`).pipe(
      map(response => this.extractData(response))
    );
  }

  // Analytics Services
  getVideoAnalytics(id: string): Observable<MediaAnalytics> {
    return this.httpClient.get<MediaAnalytics>(`${this.baseUrl}/videos/analytics/${id}`).pipe(
      map(response => this.extractData(response))
    );
  }

  getPodcastAnalytics(id: string): Observable<MediaAnalytics> {
    return this.httpClient.get<MediaAnalytics>(`${this.baseUrl}/podcasts/analytics/${id}`).pipe(
      map(response => this.extractData(response))
    );
  }

  getOverallAnalytics(): Observable<MediaAnalytics> {
    return this.httpClient.get<MediaAnalytics>(`${this.baseUrl}/analytics`).pipe(
      map(response => this.extractData(response))
    );
  }

  // Utility Methods
  private buildQueryString(filters: MediaFilters): string {
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

    return this.httpClient.buildQueryString(params);
  }

  private extractData<T>(response: ApiResponse<T>): T {
    if (response.succeeded && response.data !== undefined) {
      return response.data;
    }
    throw new Error(response.message || response.errors?.[0] || 'API request failed');
  }
}