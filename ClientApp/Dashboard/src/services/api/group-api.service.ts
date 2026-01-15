import { BaseApiService } from './base-api.service';
import { GroupDto, CreateGroupRequest, UpdateGroupRequest, GroupMemberDto, JoinGroupRequest } from '../../types/community/group';
import { PagedResult } from '../../types/community/common';

export class GroupApiService extends BaseApiService {
  private readonly endpoint = '/v7/community/groups';

  async getGroups(params: {
    pageNumber?: number;
    pageSize?: number;
    type?: number;
    privacy?: number;
  }): Promise<PagedResult<GroupDto>> {
    return this.get<PagedResult<GroupDto>>(this.endpoint, {
      cache: true,
      cacheTTL: 120000, // 2 minutes
      params: {
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 20,
        ...(params.type && { type: params.type }),
        ...(params.privacy && { privacy: params.privacy })
      }
    });
  }

  async getGroup(id: string): Promise<GroupDto> {
    return this.get<GroupDto>(`${this.endpoint}/${id}`, {
      cache: true,
      cacheTTL: 300000 // 5 minutes
    });
  }

  async createGroup(request: CreateGroupRequest): Promise<GroupDto> {
    return this.post<GroupDto>(this.endpoint, request);
  }

  async updateGroup(id: string, request: UpdateGroupRequest): Promise<GroupDto> {
    return this.put<GroupDto>(`${this.endpoint}/${id}`, request);
  }

  async deleteGroup(id: string): Promise<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  async joinGroup(request: JoinGroupRequest): Promise<void> {
    return this.post<void>(`${this.endpoint}/${request.groupId}/join`, {});
  }

  async leaveGroup(groupId: string): Promise<void> {
    return this.delete<void>(`${this.endpoint}/${groupId}/leave`);
  }

  async getMembers(groupId: string, pageNumber: number = 1): Promise<PagedResult<GroupMemberDto>> {
    return this.get<PagedResult<GroupMemberDto>>(`${this.endpoint}/${groupId}/members`, {
      cache: true,
      cacheTTL: 60000, // 1 minute
      params: {
        pageNumber,
        pageSize: 20
      }
    });
  }

  async updateMemberRole(groupId: string, userId: string, role: number): Promise<void> {
    return this.put<void>(`${this.endpoint}/${groupId}/members/${userId}`, { role });
  }

  async removeMember(groupId: string, userId: string): Promise<void> {
    return this.delete<void>(`${this.endpoint}/${groupId}/members/${userId}`);
  }
}

export const groupApiService = new GroupApiService();
