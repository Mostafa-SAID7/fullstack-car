import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { BaseApiService } from './base-api.service';
import {
  FriendDto,
  FriendRequestDto,
  SendFriendRequestRequest,
  RespondToFriendRequestRequest,
  UserConnectionDto
} from '../../models/community/friend.model';
import { PagedResult, UserProfileDto } from '../../models/community/common.model';

@Injectable({
  providedIn: 'root'
})
export class FriendApiService extends BaseApiService {
  private readonly endpoint = '/v7/community/friends';

  getFriends(params: {
    pageNumber?: number;
    pageSize?: number;
    userId?: string;
  }): Observable<PagedResult<FriendDto>> {
    let httpParams = new HttpParams()
      .set('pageNumber', (params.pageNumber || 1).toString())
      .set('pageSize', (params.pageSize || 20).toString());

    if (params.userId) {
      httpParams = httpParams.set('userId', params.userId);
    }

    return this.get<PagedResult<FriendDto>>(this.endpoint, {
      cache: true,
      cacheTTL: 120000, // 2 minutes
      params: httpParams
    });
  }

  getFriendRequests(pageNumber: number = 1): Observable<PagedResult<FriendRequestDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', '20');

    return this.get<PagedResult<FriendRequestDto>>(`${this.endpoint}/requests`, {
      cache: true,
      cacheTTL: 30000, // 30 seconds
      params
    });
  }

  sendFriendRequest(request: SendFriendRequestRequest): Observable<FriendRequestDto> {
    return this.post<FriendRequestDto>(`${this.endpoint}/requests`, request);
  }

  respondToFriendRequest(request: RespondToFriendRequestRequest): Observable<void> {
    return this.post<void>(`${this.endpoint}/requests/${request.requestId}/respond`, { accept: request.accept });
  }

  removeFriend(friendId: string): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${friendId}`);
  }

  blockUser(userId: string): Observable<void> {
    return this.post<void>(`${this.endpoint}/block/${userId}`, {});
  }

  unblockUser(userId: string): Observable<void> {
    return this.delete<void>(`${this.endpoint}/block/${userId}`);
  }

  getConnections(userId: string, pageNumber: number = 1): Observable<PagedResult<UserConnectionDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', '20');

    return this.get<PagedResult<UserConnectionDto>>(`${this.endpoint}/connections/${userId}`, {
      cache: true,
      cacheTTL: 60000, // 1 minute
      params
    });
  }

  getUserProfile(userId: string): Observable<UserProfileDto> {
    return this.get<UserProfileDto>(`${this.endpoint}/profile/${userId}`, {
      cache: true,
      cacheTTL: 300000 // 5 minutes
    });
  }
}
