import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
  Video, 
  VideoDetails, 
  VideoList, 
  VideoComment, 
  CreateVideoRequest, 
  UpdateVideoRequest, 
  UploadVideoRequest,
  MediaFilters 
} from '../models';

export interface VideoFilters extends MediaFilters {
  category?: string;
  quality?: string;
  duration?: 'short' | 'medium' | 'long';
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private readonly apiUrl = `${environment.apiUrl}/api/v7/videos`;
  private currentVideoSubject = new BehaviorSubject<VideoDetails | null>(null);
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  private currentTimeSubject = new BehaviorSubject<number>(0);

  public currentVideo$ = this.currentVideoSubject.asObservable();
  public isPlaying$ = this.isPlayingSubject.asObservable();
  public currentTime$ = this.currentTimeSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Video CRUD Operations
  getVideos(filters?: VideoFilters): Observable<any> {
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

  getVideo(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createVideo(video: CreateVideoRequest): Observable<any> {
    return this.http.post(this.apiUrl, video);
  }

  updateVideo(id: string, video: UpdateVideoRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, video);
  }

  deleteVideo(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  uploadVideo(file: File, metadata: UploadVideoRequest): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  // Search and Discovery
  searchVideos(filters: VideoFilters): Observable<any> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      const value = (filters as any)[key];
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });
    return this.http.get(`${this.apiUrl}/search`, { params });
  }

  getFeaturedVideos(count = 10): Observable<any> {
    const params = new HttpParams().set('count', count.toString());
    return this.http.get(`${this.apiUrl}/featured`, { params });
  }

  getTrendingVideos(count = 10): Observable<any> {
    const params = new HttpParams().set('count', count.toString());
    return this.http.get(`${this.apiUrl}/trending`, { params });
  }

  getVideosByCategory(categoryId: string, page = 1, pageSize = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get(`${this.apiUrl}/category/${categoryId}`, { params });
  }

  // Interactions
  likeVideo(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/like`, {});
  }

  unlikeVideo(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/like`);
  }

  addComment(videoId: string, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${videoId}/comments`, { content });
  }

  getComments(videoId: string, page = 1, pageSize = 20): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get(`${this.apiUrl}/${videoId}/comments`, { params });
  }

  // Analytics
  getVideoAnalytics(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/analytics`);
  }

  recordView(id: string, watchTime?: number): Observable<any> {
    const payload = watchTime ? { watchTime } : {};
    return this.http.post(`${this.apiUrl}/${id}/view`, payload);
  }

  // Categories
  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`);
  }

  // Dashboard
  getDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }

  // Player State Management
  setCurrentVideo(video: VideoDetails | null): void {
    this.currentVideoSubject.next(video);
  }

  setPlayingState(isPlaying: boolean): void {
    this.isPlayingSubject.next(isPlaying);
  }

  setCurrentTime(time: number): void {
    this.currentTimeSubject.next(time);
  }

  getCurrentVideo(): VideoDetails | null {
    return this.currentVideoSubject.value;
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

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}