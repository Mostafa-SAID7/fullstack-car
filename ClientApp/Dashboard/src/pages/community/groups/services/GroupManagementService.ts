import { groupApiService } from '@/services/api/group-api.service';
import { GroupDto, CreateGroupRequest, UpdateGroupRequest, GroupMemberDto } from '@/types/community/group';
import { PagedResult } from '@/types/community/common';

export class GroupManagementService {
  async getGroups(params: {
    pageNumber?: number;
    pageSize?: number;
    type?: number;
    privacy?: number;
  }): Promise<PagedResult<GroupDto>> {
    return groupApiService.getGroups(params);
  }

  async getGroup(id: string): Promise<GroupDto> {
    return groupApiService.getGroup(id);
  }

  async createGroup(request: CreateGroupRequest): Promise<GroupDto> {
    return groupApiService.createGroup(request);
  }

  async updateGroup(id: string, request: UpdateGroupRequest): Promise<GroupDto> {
    return groupApiService.updateGroup(id, request);
  }

  async deleteGroup(id: string): Promise<void> {
    return groupApiService.deleteGroup(id);
  }

  async getMembers(groupId: string, pageNumber?: number): Promise<PagedResult<GroupMemberDto>> {
    return groupApiService.getMembers(groupId, pageNumber);
  }

  async updateMemberRole(groupId: string, userId: string, role: number): Promise<void> {
    return groupApiService.updateMemberRole(groupId, userId, role);
  }

  async removeMember(groupId: string, userId: string): Promise<void> {
    return groupApiService.removeMember(groupId, userId);
  }

  async bulkDelete(groupIds: string[]): Promise<void> {
    await Promise.all(groupIds.map(id => this.deleteGroup(id)));
  }
}

export const groupManagementService = new GroupManagementService();
