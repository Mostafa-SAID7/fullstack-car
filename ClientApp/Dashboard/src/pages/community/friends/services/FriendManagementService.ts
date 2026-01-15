import { friendApiService } from '@/services/api/friend-api.service';
import { FriendDto, FriendRequestDto, UserConnectionDto } from '@/types/community/friend';
import { PagedResult } from '@/types/community/common';

export class FriendManagementService {
  async getFriends(params: {
    pageNumber?: number;
    pageSize?: number;
    userId?: string;
  }): Promise<PagedResult<FriendDto>> {
    return friendApiService.getFriends(params);
  }

  async getFriendRequests(pageNumber?: number): Promise<PagedResult<FriendRequestDto>> {
    return friendApiService.getFriendRequests(pageNumber);
  }

  async acceptFriendRequest(requestId: string): Promise<void> {
    return friendApiService.respondToFriendRequest({ requestId, accept: true });
  }

  async rejectFriendRequest(requestId: string): Promise<void> {
    return friendApiService.respondToFriendRequest({ requestId, accept: false });
  }

  async removeFriend(friendId: string): Promise<void> {
    return friendApiService.removeFriend(friendId);
  }

  async blockUser(userId: string): Promise<void> {
    return friendApiService.blockUser(userId);
  }

  async unblockUser(userId: string): Promise<void> {
    return friendApiService.unblockUser(userId);
  }

  async getConnections(userId: string, pageNumber?: number): Promise<PagedResult<UserConnectionDto>> {
    return friendApiService.getConnections(userId, pageNumber);
  }

  async bulkRemoveFriends(friendIds: string[]): Promise<void> {
    await Promise.all(friendIds.map(id => this.removeFriend(id)));
  }

  async bulkAcceptRequests(requestIds: string[]): Promise<void> {
    await Promise.all(requestIds.map(id => this.acceptFriendRequest(id)));
  }

  async bulkRejectRequests(requestIds: string[]): Promise<void> {
    await Promise.all(requestIds.map(id => this.rejectFriendRequest(id)));
  }
}

export const friendManagementService = new FriendManagementService();
