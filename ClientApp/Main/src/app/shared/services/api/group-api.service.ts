import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { BaseApiService } from './base-api.service';
import { GroupDto, CreateGroupRequest, UpdateGroupRequest, GroupMemberDto, JoinGroupRequest } from '../../models/community/group.model';
import { PagedResult } from '../../models/community/common.model';

@Injectable({
  providedIn: 'root'
})
export class GroupApiService extends BaseApiService {
  private readonly endpoint = '/v7/community/groups';

  getGroups(params: {
    pageNumber?: number;
    pageSize?: number;
    type?: number;
    privacy?: number;
  }): Observable<PagedResult<GroupDto>> {
    let httpParams = new HttpParams()
      .set('pageNumber', (params.pageNumber || 1).toString())
      .set('pageSize', (params.pageSize || 20).toString());
    
    if (params.type) {
      httpParams = httpParams.set('type', params.type.toString());
    }
    if (params.privacy) {
      httpParams = httpParams.set('privacy', params.privacy.toString());
    }
    
    return this.get<PagedResult<GroupDto>>(this.endpoint, {
      cache: true,
      cacheTTL: 120000, // 2 minutes
      params: httpParams
    });
  }

  getGroup(id: string): Observable<GroupDto> {
    return this.get<GroupDto>(`${this.endpoint}/${id}`, {
      cache: true,
      cacheTTL: 300000 // 5 minutes
    });
  }

  createGroup(request: CreateGroupRequest): Observable<GroupDto> {
    return this.post<GroupDto>(this.endpoint, request);
  }

  updateGroup(id: string, request: UpdateGroupRequest): Observable<GroupDto> {
    return this.put<GroupDto>(`${this.endpoint}/${id}`, request);
  }

  deleteGroup(id: string): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  joinGroup(request: JoinGroupRequest): Observable<void> {
    return this.post<void>(`${this.endpoint}/${request.groupId}/join`, {});
  }

  leaveGroup(groupId: string): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${groupId}/leave`);
  }

  getMembers(groupId: string, pageNumber: number = 1): Observable<PagedResult<GroupMemberDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', '20');
    
    return this.get<PagedResult<GroupMemberDto>>(`${this.endpoint}/${groupId}/members`, {
      cache: true,
      cacheTTL: 60000, // 1 minute
      params
    });
  }

  updateMemberRole(groupId: string, userId: string, role: number): Observable<void> {
    return this.put<void>(`${this.endpoint}/${groupId}/members/${userId}`, { role });
  }

  removeMember(groupId: string, userId: string): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${groupId}/members/${userId}`);
  }
}
