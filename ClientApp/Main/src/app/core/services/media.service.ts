import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Result } from '../models/result.model';

export interface MediaFilters {
  search?: string;
  category?: string;
  tags?: string[];
  isPublic?: boolean;
  creatorId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  fileSize: number;
  quality: string;
  viewCount: number;
  creatorId: string;
  creatorName: string;
  status: string;
  isPublic: boolean;
  allowComments: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  tags: string[];
}

export interface Podcast {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  thumbnailUrl: string;
  duration: string;
  fileSize: number;
  playCount: number;
  allowDownload: boolean;
  episodeNumber?: number;
  seasonNumber?: number;
  seriesId?: string;
  transcript?: string;
  creatorId: string;
  creatorName: string;
  status: string;
  isPublic: boolean;
  allowComments: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  tags: string[];
}

export interface MediaAnalytics {
  id: string;
  mediaId: string;
  mediaType: string;
  viewsToday: number;
  viewsWeek: number;
  viewsMonth: number;
  viewsTotal: number;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  sharesCount: number;
  lastUpdated: Date;
}

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private readonly apiUrl = `${environment.apiUrl}/v7.0/media`;

  constructor(private http: HttpClient) {}

  // Video methods
  getVideos(filters?: MediaFilters, pageNumber: number = 1, pageSize: number = 10): Observable<Result<PaginatedResult<Video>>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.category) params = params.set('category', filters.category);
      if (filters.isPublic !== undefined) params = params.set('isPublic', filters.isPublic.toString());
      if (filters.creatorId) params = params.set('creatorId', filters.creatorId);
      if (filters.tags && filters.tags.length > 0) {
        filters.tags.forEach(tag => params = params.append('tags', tag));
      }
    }

    return this.http.get<Result<PaginatedResult<Video>>>(`${this.apiUrl}/videos`, { params });
  }

  getVideo(id: string): Observable<Result<Video>> {
    return this.http.get<Result<Video>>(`${this.apiUrl}/videos/${id}`);
  }

  getTrendingVideos(limit: number = 10): Observable<Result<Video[]>> {
    return this.http.get<Result<Video[]>>(`${this.apiUrl}/videos/discovery/trending?limit=${limit}`);
  }

  getFeaturedVideos(limit: number = 10): Observable<Result<Video[]>> {
    return this.http.get<Result<Video[]>>(`${this.apiUrl}/videos/discovery/featured?limit=${limit}`);
  }

  searchVideos(query: string, filters?: MediaFilters): Observable<Result<Video[]>> {
    let params = new HttpParams().set('q', query);
    
    if (filters) {
      if (filters.category) params = params.set('category', filters.category);
      if (filters.tags && filters.tags.length > 0) {
        filters.tags.forEach(tag => params = params.append('tags', tag));
      }
    }

    return this.http.get<Result<Video[]>>(`${this.apiUrl}/videos/discovery/search`, { params });
  }

  // Podcast methods
  getPodcasts(filters?: MediaFilters, pageNumber: number = 1, pageSize: number = 10): Observable<Result<PaginatedResult<Podcast>>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.category) params = params.set('category', filters.category);
      if (filters.isPublic !== undefined) params = params.set('isPublic', filters.isPublic.toString());
      if (filters.creatorId) params = params.set('creatorId', filters.creatorId);
      if (filters.tags && filters.tags.length > 0) {
        filters.tags.forEach(tag => params = params.append('tags', tag));
      }
    }

    return this.http.get<Result<PaginatedResult<Podcast>>>(`${this.apiUrl}/podcasts`, { params });
  }

  getPodcast(id: string): Observable<Result<Podcast>> {
    return this.http.get<Result<Podcast>>(`${this.apiUrl}/podcasts/${id}`);
  }

  getTrendingPodcasts(limit: number = 10): Observable<Result<Podcast[]>> {
    return this.http.get<Result<Podcast[]>>(`${this.apiUrl}/podcasts/discovery/trending?limit=${limit}`);
  }

  getFeaturedPodcasts(limit: number = 10): Observable<Result<Podcast[]>> {
    return this.http.get<Result<Podcast[]>>(`${this.apiUrl}/podcasts/discovery/featured?limit=${limit}`);
  }

  searchPodcasts(query: string, filters?: MediaFilters): Observable<Result<Podcast[]>> {
    let params = new HttpParams().set('q', query);
    
    if (filters) {
      if (filters.category) params = params.set('category', filters.category);
      if (filters.tags && filters.tags.length > 0) {
        filters.tags.forEach(tag => params = params.append('tags', tag));
      }
    }

    return this.http.get<Result<Podcast[]>>(`${this.apiUrl}/podcasts/discovery/search`, { params });
  }

  // Analytics methods
  getVideoAnalytics(videoId: string): Observable<Result<MediaAnalytics>> {
    return this.http.get<Result<MediaAnalytics>>(`${this.apiUrl}/videos/analytics/${videoId}`);
  }

  getPodcastAnalytics(podcastId: string): Observable<Result<MediaAnalytics>> {
    return this.http.get<Result<MediaAnalytics>>(`${this.apiUrl}/podcasts/analytics/${podcastId}`);
  }

  getDashboardAnalytics(): Observable<Result<any>> {
    return this.http.get<Result<any>>(`${this.apiUrl}/analytics/dashboard`);
  }

  // Interaction methods
  likeVideo(videoId: string): Observable<Result<void>> {
    return this.http.post<Result<void>>(`${this.apiUrl}/videos/interactions/${videoId}/like`, {});
  }

  likePodcast(podcastId: string): Observable<Result<void>> {
    return this.http.post<Result<void>>(`${this.apiUrl}/podcasts/interactions/${podcastId}/like`, {});
  }

  subscribeToPodcast(podcastId: string): Observable<Result<void>> {
    return this.http.post<Result<void>>(`${this.apiUrl}/podcasts/interactions/${podcastId}/subscribe`, {});
  }

  unsubscribeFromPodcast(podcastId: string): Observable<Result<void>> {
    return this.http.delete<Result<void>>(`${this.apiUrl}/podcasts/interactions/${podcastId}/subscribe`);
  }

  // Categories
  getCategories(): Observable<Result<string[]>> {
    return this.http.get<Result<string[]>>(`${this.apiUrl}/categories`);
  }
}