import { BaseApiService } from './base-api.service';
import { PostDto, CreatePostRequest, UpdatePostRequest, CommentDto, PostAnalytics } from '../../types/community/post';
import { PagedResult } from '../../types/community/common';

export class PostApiService extends BaseApiService {
  private readonly endpoint = '/v7/community/posts';

  async getPosts(params: {
    pageNumber?: number;
    pageSize?: number;
    groupId?: string;
    userId?: string;
  }): Promise<PagedResult<PostDto>> {
    return this.get<PagedResult<PostDto>>(this.endpoint, {
      cache: true,
      cacheTTL: 60000, // 1 minute
      params: {
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 20,
        ...(params.groupId && { groupId: params.groupId }),
        ...(params.userId && { userId: params.userId })
      }
    });
  }

  async getPost(id: string): Promise<PostDto> {
    return this.get<PostDto>(`${this.endpoint}/${id}`, {
      cache: true,
      cacheTTL: 300000 // 5 minutes
    });
  }

  async createPost(request: CreatePostRequest): Promise<PostDto> {
    return this.post<PostDto>(this.endpoint, request);
  }

  async updatePost(id: string, request: UpdatePostRequest): Promise<PostDto> {
    return this.put<PostDto>(`${this.endpoint}/${id}`, request);
  }

  async deletePost(id: string): Promise<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  async likePost(id: string): Promise<void> {
    return this.post<void>(`${this.endpoint}/${id}/like`, {});
  }

  async unlikePost(id: string): Promise<void> {
    return this.delete<void>(`${this.endpoint}/${id}/like`);
  }

  async getComments(postId: string, pageNumber: number = 1): Promise<PagedResult<CommentDto>> {
    return this.get<PagedResult<CommentDto>>(`${this.endpoint}/${postId}/comments`, {
      cache: true,
      cacheTTL: 30000, // 30 seconds
      params: {
        pageNumber,
        pageSize: 20
      }
    });
  }

  async addComment(postId: string, content: string): Promise<CommentDto> {
    return this.post<CommentDto>(`${this.endpoint}/${postId}/comments`, { content });
  }

  async getAnalytics(): Promise<PostAnalytics> {
    return this.get<PostAnalytics>(`${this.endpoint}/analytics`, {
      cache: true,
      cacheTTL: 120000 // 2 minutes
    });
  }
}

export const postApiService = new PostApiService();
