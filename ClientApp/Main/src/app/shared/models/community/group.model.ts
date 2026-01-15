/**
 * Group-related models matching backend DTOs
 */

export enum GroupType {
  General = 1,
  CarBrand = 2,
  CarModel = 3,
  LocalCommunity = 4,
  Maintenance = 5,
  Racing = 6,
  Modification = 7,
  BuyingSelling = 8
}

export enum GroupPrivacy {
  Public = 1,
  Private = 2,
  Secret = 3
}

export enum GroupMemberRole {
  Owner = 1,
  Admin = 2,
  Moderator = 3,
  Member = 4
}

export interface GroupDto {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  type: GroupType;
  privacy: GroupPrivacy;
  membersCount: number;
  postsCount: number;
  createdAt: Date;
  updatedAt?: Date;
  
  ownerId: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerProfileImageUrl?: string;
}

export interface CreateGroupRequest {
  name: string;
  description: string;
  imageUrl?: string;
  type: GroupType;
  privacy: GroupPrivacy;
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
  imageUrl?: string;
  type?: GroupType;
  privacy?: GroupPrivacy;
}

export interface GroupMemberDto {
  id: string;
  groupId: string;
  userId: string;
  role: GroupMemberRole;
  joinedAt: Date;
  
  userFirstName: string;
  userLastName: string;
  userProfileImageUrl?: string;
}

export interface JoinGroupRequest {
  groupId: string;
}
