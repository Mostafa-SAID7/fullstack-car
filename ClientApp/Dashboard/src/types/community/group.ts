/**
 * Group-related models matching backend DTOs
 */

export const GroupType = {
  General: 1,
  CarBrand: 2,
  CarModel: 3,
  LocalCommunity: 4,
  Maintenance: 5,
  Racing: 6,
  Modification: 7,
  BuyingSelling: 8
} as const;

export type GroupType = (typeof GroupType)[keyof typeof GroupType];

export const GroupPrivacy = {
  Public: 1,
  Private: 2,
  Secret: 3
} as const;

export type GroupPrivacy = (typeof GroupPrivacy)[keyof typeof GroupPrivacy];

export const GroupMemberRole = {
  Owner: 1,
  Admin: 2,
  Moderator: 3,
  Member: 4
} as const;

export type GroupMemberRole = (typeof GroupMemberRole)[keyof typeof GroupMemberRole];

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
