import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaginatedResult } from '../../../core/models/pagination.model';
import {
  Video,
  VideoList,
  VideoDetails,
  Podcast,
  PodcastList,
  PodcastDetails,
  PodcastSeries,
  VideoPlaylist,
  CreateVideoRequest,
  UpdateVideoRequest,
  CreatePodcastRequest,
  UpdatePodcastRequest,
  UploadVideoRequest,
  UploadPodcastRequest,
  MediaFilters
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private readonly apiUrl = `${environment.apiUrl}/v7/media`;

  constructor(private http: HttpClient) {}

  // Video Services
  getVideos(filters: Partial<MediaFilters> = {}): Observable<PaginatedResult<VideoList>> {
    let params = new HttpParams();
    
    if (filters.searchTerm) params = params.set('searchTerm', filters.searchTerm);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.creatorId) params = params.set('creatorId', filters.creatorId);
    if (filters.tags) params = params.set('tags', filters.tags);
    if (filters.fromDate) params = params.set('fromDate', filters.fromDate.toISOString());
    if (filters.toDate) params = params.set('toDate', filters.toDate.toISOString());
    
    params = params.set('pageNumber', (filters.pageNumber || 1).toString());
    params = params.set('pageSize', (filters.pageSize || 10).toString());
    params = params.set('sortBy', filters.sortBy || 'CreatedAt');
    params = params.set('sortDescending', (filters.sortDescending !== false).toString());

    return this.http.get<PaginatedResult<VideoList>>(`${this.apiUrl}/videos`, { params });
  }

  getVideo(id: string): Observable<VideoDetails> {
    return this.http.get<VideoDetails>(`${this.apiUrl}/videos/${id}`);
  }

  createVideo(request: CreateVideoRequest): Observable<Video> {
    return this.http.post<Video>(`${this.apiUrl}/videos`, request);
  }

  updateVideo(id: string, request: UpdateVideoRequest): Observable<Video> {
    return this.http.put<Video>(`${this.apiUrl}/videos/${id}`, request);
  }

  deleteVideo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/videos/${id}`);
  }

  publishVideo(id: string): Observable<Video> {
    return this.http.post<Video>(`${this.apiUrl}/videos/${id}/publish`, {});
  }

  likeVideo(id: string, isLike: boolean): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/videos/${id}/like`, { isLike });
  }

  addVideoComment(id: string, content: string, parentCommentId?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/videos/${id}/comments`, { content, parentCommentId });
  }

  getMyVideos(pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<VideoList>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<PaginatedResult<VideoList>>(`${this.apiUrl}/videos/my-videos`, { params });
  }

  getTrendingVideos(count: number = 10, days: number = 7): Observable<VideoList[]> {
    const params = new HttpParams()
      .set('count', count.toString())
      .set('days', days.toString());
    
    return this.http.get<VideoList[]>(`${this.apiUrl}/videos/trending`, { params });
  }

  // Podcast Services
  getPodcasts(filters: Partial<MediaFilters> = {}): Observable<PaginatedResult<PodcastList>> {
    let params = new HttpParams();
    
    if (filters.searchTerm) params = params.set('searchTerm', filters.searchTerm);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.creatorId) params = params.set('creatorId', filters.creatorId);
    if (filters.tags) params = params.set('tags', filters.tags);
    if (filters.fromDate) params = params.set('fromDate', filters.fromDate.toISOString());
    if (filters.toDate) params = params.set('toDate', filters.toDate.toISOString());
    
    params = params.set('pageNumber', (filters.pageNumber || 1).toString());
    params = params.set('pageSize', (filters.pageSize || 10).toString());
    params = params.set('sortBy', filters.sortBy || 'CreatedAt');
    params = params.set('sortDescending', (filters.sortDescending !== false).toString());

    return this.http.get<PaginatedResult<PodcastList>>(`${this.apiUrl}/podcasts`, { params });
  }

  getPodcast(id: string): Observable<PodcastDetails> {
    return this.http.get<PodcastDetails>(`${this.apiUrl}/podcasts/${id}`);
  }

  createPodcast(request: CreatePodcastRequest): Observable<Podcast> {
    return this.http.post<Podcast>(`${this.apiUrl}/podcasts`, request);
  }

  updatePodcast(id: string, request: UpdatePodcastRequest): Observable<Podcast> {
    return this.http.put<Podcast>(`${this.apiUrl}/podcasts/${id}`, request);
  }

  deletePodcast(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/podcasts/${id}`);
  }

  publishPodcast(id: string): Observable<Podcast> {
    return this.http.post<Podcast>(`${this.apiUrl}/podcasts/${id}/publish`, {});
  }

  likePodcast(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/podcasts/${id}/like`, {});
  }

  addPodcastComment(id: string, content: string, parentCommentId?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/podcasts/${id}/comments`, { content, parentCommentId });
  }

  getMyPodcasts(pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<PodcastList>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<PaginatedResult<PodcastList>>(`${this.apiUrl}/podcasts/my-podcasts`, { params });
  }

  getTrendingPodcasts(count: number = 10, days: number = 7): Observable<PodcastList[]> {
    const params = new HttpParams()
      .set('count', count.toString())
      .set('days', days.toString());
    
    return this.http.get<PodcastList[]>(`${this.apiUrl}/podcasts/trending`, { params });
  }

  // Upload Services
  uploadVideo(file: File, request: UploadVideoRequest): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', request.title);
    formData.append('description', request.description);
    formData.append('quality', request.quality.toString());
    if (request.tags) formData.append('tags', request.tags);
    formData.append('isPublic', request.isPublic.toString());
    formData.append('allowComments', request.allowComments.toString());

    return this.http.post(`${this.apiUrl}/upload/video`, formData);
  }

  uploadPodcast(file: File, request: UploadPodcastRequest): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', request.title);
    formData.append('description', request.description);
    if (request.tags) formData.append('tags', request.tags);
    formData.append('isPublic', request.isPublic.toString());
    formData.append('allowComments', request.allowComments.toString());
    formData.append('allowDownload', request.allowDownload.toString());
    formData.append('episodeNumber', request.episodeNumber.toString());
    formData.append('seasonNumber', request.seasonNumber.toString());
    if (request.seriesId) formData.append('seriesId', request.seriesId);
    if (request.transcript) formData.append('transcript', request.transcript);

    return this.http.post(`${this.apiUrl}/upload/podcast`, formData);
  }

  uploadThumbnail(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/upload/thumbnail`, formData);
  }

  // Playlist Services
  getPlaylists(): Observable<VideoPlaylist[]> {
    return this.http.get<VideoPlaylist[]>(`${this.apiUrl}/playlists`);
  }

  createPlaylist(name: string, description?: string, isPublic: boolean = true): Observable<VideoPlaylist> {
    return this.http.post<VideoPlaylist>(`${this.apiUrl}/playlists`, { name, description, isPublic });
  }

  addToPlaylist(playlistId: string, videoId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/playlists/${playlistId}/videos`, { videoId });
  }

  removeFromPlaylist(playlistId: string, videoId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/playlists/${playlistId}/videos/${videoId}`);
  }
}