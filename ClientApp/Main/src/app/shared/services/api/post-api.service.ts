import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { BaseApiService } from './base-api.service';
import { PostDto, CreatePostRequest, UpdatePostRequest, CommentDto, PostAnalytics } from '../../models/community/post.model';
import { PagedResult } from '../../models/community/common.model';

@Injectable({
  providedIn: 'root'
})
export class PostApiService extends BaseApiService {
  private readonly endpoint = '/v7/community/posts';

  getPosts(params: {
    pageNumber?: number;
    pageSize?: number;
    groupId?: string;
    userId?: string;
  }): Observable<PagedResult<PostDto>> {
    let httpParams = new HttpParams()
      .set('pageNumber', (params.pageNumber || 1).toString())
      .set('pageSize', (params.pageSize || 20).toString());
    
    if (params.groupId) {
      httpParams = httpParams.set('groupId', params.groupId);
    }
    if (params.userId) {
      httpParams = httpParams.set('userId', params.userId);
    }
    
    return this.get<PagedResult<PostDto>>(this.endpoint, {
      cache: true,
      cacheTTL: 60000, // 1 minute
      params: httpParams
    });
  }

  getPost(id: string): Observable<PostDto> {
    return this.get<PostDto>(`${this.endpoint}/${id}`, {
      cache: true,
      cacheTTL: 300000 // 5 minutes
    });
  }

  createPost(request: CreatePostRequest): Observable<PostDto> {
    return this.post<PostDto>(this.endpoint, request);
  }

  updatePost(id: string, request: UpdatePostRequest): Observable<PostDto> {
    return this.put<PostDto>(`${this.endpoint}/${id}`, request);
  }

  deletePost(id: string): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  likePost(id: string): Observable<void> {
    return this.post<void>(`${this.endpoint}/${id}/like`, {});
  }

  unlikePost(id: string): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}/like`);
  }

  getComments(postId: string, pageNumber: number = 1): Observable<PagedResult<CommentDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', '20');
    
    return this.get<PagedResult<CommentDto>>(`${this.endpoint}/${postId}/comments`, {
      cache: true,
      cacheTTL: 30000, // 30 seconds
      params
    });
  }

  addComment(postId: string, content: string): Observable<CommentDto> {
    return this.post<CommentDto>(`${this.endpoint}/${postId}/comments`, { content });
  }

  getAnalytics(): Observable<PostAnalytics> {
    return this.get<PostAnalytics>(`${this.endpoint}/analytics`, {
      cache: true,
      cacheTTL: 120000 // 2 minutes
    });
  }
}
