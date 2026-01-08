import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
  Podcast, 
  PodcastDetails, 
  PodcastList, 
  PodcastComment, 
  PodcastSeries,
  CreatePodcastRequest, 
  UpdatePodcastRequest, 
  UploadPodcastRequest,
  MediaFilters 
} from '../models';

export interface PodcastCategory {
  id: number;
  name: string;
  description: string;
  iconUrl?: string;
  podcastCount: number;
  subscriberCount: number;
}

export interface PodcastDashboard {
  stats: {
    totalPodcasts: number;
    totalListens: number;
    totalSubscribers: number;
    monthlyListens: number;
    totalListenTime: string;
    newEpisodesCount: number;
  };
  recentPodcasts: PodcastList[];
  trendingPodcasts: PodcastList[];
  recommendedPodcasts: PodcastList[];
  newEpisodes: PodcastList[];
  popularCategories: PodcastCategory[];
}

export interface PodcastFilters extends MediaFilters {
  categoryId?: number;
  duration?: 'short' | 'medium' | 'long';
}

@Injectable({
  providedIn: 'root'
})
export class PodcastService {
  private readonly apiUrl = `${environment.apiUrl}/api/v7/podcast`;
  private currentPodcastSubject = new BehaviorSubject<PodcastDetails | null>(null);
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  private currentTimeSubject = new BehaviorSubject<number>(0);

  public currentPodcast$ = this.currentPodcastSubject.asObservable();
  public isPlaying$ = this.isPlayingSubject.asObservable();
  public currentTime$ = this.currentTimeSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Podcast CRUD Operations
  getPodcasts(filters?: PodcastFilters): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = (filters as any)[key];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }
    return this.http.get(`${this.apiUrl}`, { params });
  }

  getPodcast(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createPodcast(podcast: CreatePodcastRequest): Observable<any> {
    return this.http.post(this.apiUrl, podcast);
  }

  updatePodcast(id: string, podcast: UpdatePodcastRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, podcast);
  }

  deletePodcast(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  uploadPodcastFile(id: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/${id}/upload`, formData);
  }

  // Category Operations
  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`);
  }

  getPodcastsByCategory(categoryId: number, page = 1, pageSize = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get(`${this.apiUrl}/category/${categoryId}`, { params });
  }

  // Search Operations
  searchPodcasts(filters: PodcastFilters): Observable<any> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      const value = (filters as any)[key];
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });
    return this.http.get(`${this.apiUrl}/search`, { params });
  }

  // Featured and Trending
  getFeaturedPodcasts(count = 10): Observable<any> {
    const params = new HttpParams().set('count', count.toString());
    return this.http.get(`${this.apiUrl}/featured`, { params });
  }

  getTrendingPodcasts(count = 10): Observable<any> {
    const params = new HttpParams().set('count', count.toString());
    return this.http.get(`${this.apiUrl}/trending`, { params });
  }

  // Subscription Operations
  subscribeToPodcast(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/subscribe`, {});
  }

  unsubscribeFromPodcast(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/subscribe`);
  }

  getUserSubscriptions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/subscriptions`);
  }

  // Analytics
  getPodcastAnalytics(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/analytics`);
  }

  recordPodcastPlay(id: string, duration?: number, position?: number, completed = false): Observable<any> {
    const payload = {
      duration: duration ? `00:00:${duration.toString().padStart(2, '0')}` : undefined,
      position: position ? `00:00:${position.toString().padStart(2, '0')}` : undefined,
      completed
    };
    return this.http.post(`${this.apiUrl}/${id}/play`, payload);
  }

  // Dashboard
  getDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }

  // Player State Management
  setCurrentPodcast(podcast: PodcastDetails | null): void {
    this.currentPodcastSubject.next(podcast);
  }

  setPlayingState(isPlaying: boolean): void {
    this.isPlayingSubject.next(isPlaying);
  }

  setCurrentTime(time: number): void {
    this.currentTimeSubject.next(time);
  }

  getCurrentPodcast(): PodcastDetails | null {
    return this.currentPodcastSubject.value;
  }

  getIsPlaying(): boolean {
    return this.isPlayingSubject.value;
  }

  getCurrentTime(): number {
    return this.currentTimeSubject.value;
  }

  // Utility Methods
  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  parseDuration(duration: string): number {
    const parts = duration.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return 0;
  }
}