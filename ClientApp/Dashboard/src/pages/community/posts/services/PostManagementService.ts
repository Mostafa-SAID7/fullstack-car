import { postApiService } from '@/services/api/post-api.service';
import { PostDto, CreatePostRequest, UpdatePostRequest, PostAnalytics } from '@/types/community/post';
import { PagedResult } from '@/types/community/common';

export class PostManagementService {
  async getPosts(params: {
    pageNumber?: number;
    pageSize?: number;
    groupId?: string;
    userId?: string;
  }): Promise<PagedResult<PostDto>> {
    return postApiService.getPosts(params);
  }

  async getPost(id: string): Promise<PostDto> {
    return postApiService.getPost(id);
  }

  async createPost(request: CreatePostRequest): Promise<PostDto> {
    return postApiService.createPost(request);
  }

  async updatePost(id: string, request: UpdatePostRequest): Promise<PostDto> {
    return postApiService.updatePost(id, request);
  }

  async deletePost(id: string): Promise<void> {
    return postApiService.deletePost(id);
  }

  async getAnalytics(): Promise<PostAnalytics> {
    return postApiService.getAnalytics();
  }

  async bulkDelete(postIds: string[]): Promise<void> {
    await Promise.all(postIds.map(id => this.deletePost(id)));
  }

  async bulkUpdateStatus(postIds: string[], status: number): Promise<void> {
    // Note: This is a placeholder - actual status update would need proper endpoint
    // For now, we'll skip this as the API doesn't have a status update endpoint
    console.warn('Bulk status update not implemented - API endpoint needed');
  }
}

export const postManagementService = new PostManagementService();
