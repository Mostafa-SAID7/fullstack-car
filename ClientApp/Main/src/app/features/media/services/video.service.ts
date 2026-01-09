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

  uploadVideo(file: File, metadata: UploadVideoRequest, onProgress?: (progress: number) => void): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // For small files (< 50MB), use regular upload with progress
    if (file.size < 50 * 1024 * 1024) {
      return this.uploadVideoRegular(formData, onProgress);
    }
    
    // For large files, use chunked upload
    return this.uploadVideoChunked(file, metadata, onProgress);
  }

  private uploadVideoRegular(formData: FormData, onProgress?: (progress: number) => void): Observable<any> {
    return new Observable(observer => {
      const xhr = new XMLHttpRequest();

      // Set up progress tracking
      if (onProgress && xhr.upload) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
          }
        });
      }

      // Set up response handling
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            observer.next(response);
            observer.complete();
          } catch (e) {
            observer.error(new Error('Invalid response format'));
          }
        } else {
          observer.error(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        observer.error(new Error('Network error occurred'));
      });

      xhr.addEventListener('timeout', () => {
        observer.error(new Error('Request timeout'));
      });

      // Send request
      xhr.open('POST', `${this.apiUrl}/upload`);
      
      // Add auth header if available
      const token = localStorage.getItem('auth_token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  }

  private uploadVideoChunked(file: File, metadata: UploadVideoRequest, onProgress?: (progress: number) => void): Observable<any> {
    return new Observable(observer => {
      const chunkSize = 5 * 1024 * 1024; // 5MB chunks
      const totalChunks = Math.ceil(file.size / chunkSize);
      const uploadId = this.generateUploadId();
      let uploadedBytes = 0;

      const uploadChunk = async (chunkNumber: number) => {
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
          Object.entries(metadata).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              formData.append(key, value.toString());
            }
          });
        }

        try {
          const response = await this.http.post(`${this.apiUrl}/upload/chunked`, formData).toPromise();
          
          uploadedBytes += chunk.size;
          const progress = Math.round((uploadedBytes / file.size) * 100);
          onProgress?.(progress);

          // If this is the last chunk and upload is complete
          if (chunkNumber === totalChunks && (response as any)?.isComplete) {
            observer.next(response);
            observer.complete();
            return;
          }

          // Upload next chunk
          if (chunkNumber < totalChunks) {
            await uploadChunk(chunkNumber + 1);
          }
        } catch (error) {
          observer.error(error);
        }
      };

      // Start uploading chunks
      uploadChunk(1);
    });
  }

  private generateUploadId(): string {
    return `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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