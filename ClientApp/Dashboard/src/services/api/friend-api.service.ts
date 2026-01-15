import { BaseApiService } from './base-api.service';
import { 
  FriendDto, 
  FriendRequestDto, 
  SendFriendRequestRequest, 
  RespondToFriendRequestRequest,
  UserConnectionDto,
  UserProfileDto
} from '../../types/community/friend';
import { PagedResult } from '../../types/community/common';

export class FriendApiService extends BaseApiService {
  private readonly endpoint = '/v7/community/friends';

  async getFriends(params: {
    pageNumber?: number;
    pageSize?: number;
    userId?: string;
  }): Promise<PagedResult<FriendDto>> {
    return this.get<PagedResult<FriendDto>>(this.endpoint, {
      cache: true,
      cacheTTL: 120000,
      params: {
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 20,
        ...(params.userId && { userId: params.userId })
      }
    });
  }

  async getFriendRequests(pageNumber: number = 1): Promise<PagedResult<FriendRequestDto>> {
    return this.get<PagedResult<FriendRequestDto>>(`${this.endpoint}/requests`, {
      cache: true,
      cacheTTL: 30000,
      params: { pageNumber, pageSize: 20 }
    });
  }

  async sendFriendRequest(request: SendFriendRequestRequest): Promise<FriendRequestDto> {
    return this.post<FriendRequestDto>(`${this.endpoint}/requests`, request);
  }

  async respondToFriendRequest(request: RespondToFriendRequestRequest): Promise<void> {
    return this.post<void>(`${this.endpoint}/requests/${request.requestId}/respond`, { accept: request.accept });
  }

  async removeFriend(friendId: string): Promise<void> {
    return this.delete<void>(`${this.endpoint}/${friendId}`);
  }

  async blockUser(userId: string): Promise<void> {
    return this.post<void>(`${this.endpoint}/block/${userId}`, {});
  }

  async unblockUser(userId: string): Promise<void> {
    return this.delete<void>(`${this.endpoint}/block/${userId}`);
  }

  async getConnections(userId: string, pageNumber: number = 1): Promise<PagedResult<UserConnectionDto>> {
    return this.get<PagedResult<UserConnectionDto>>(`${this.endpoint}/connections/${userId}`, {
      cache: true,
      cacheTTL: 60000,
      params: { pageNumber, pageSize: 20 }
    });
  }

  async getUserProfile(userId: string): Promise<UserProfileDto> {
    return this.get<UserProfileDto>(`${this.endpoint}/profile/${userId}`, {
      cache: true,
      cacheTTL: 300000
    });
  }
}

export const friendApiService = new FriendApiService();
