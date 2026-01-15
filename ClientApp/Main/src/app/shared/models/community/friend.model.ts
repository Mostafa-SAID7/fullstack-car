/**
 * Friend/Social-related models matching backend DTOs
 */

export enum FriendshipStatus {
  Pending = 1,
  Accepted = 2,
  Rejected = 3,
  Blocked = 4
}

export enum ConnectionType {
  Friend = 1,
  Following = 2,
  Follower = 3,
  Blocked = 4
}

export interface FriendDto {
  id: string;
  userId: string;
  friendId: string;
  status: FriendshipStatus;
  createdAt: Date;
  acceptedAt?: Date;

  friendFirstName: string;
  friendLastName: string;
  friendProfileImageUrl?: string;
  friendIsVerified: boolean;
}

export interface FriendRequestDto {
  id: string;
  senderId: string;
  receiverId: string;
  status: FriendshipStatus;
  message?: string;
  createdAt: Date;
  respondedAt?: Date;

  senderFirstName: string;
  senderLastName: string;
  senderProfileImageUrl?: string;
  senderIsVerified: boolean;
}

export interface SendFriendRequestRequest {
  receiverId: string;
  message?: string;
}

export interface RespondToFriendRequestRequest {
  requestId: string;
  accept: boolean;
}

export interface UserConnectionDto {
  id: string;
  userId: string;
  connectedUserId: string;
  connectionType: ConnectionType;
  createdAt: Date;

  connectedUserFirstName: string;
  connectedUserLastName: string;
  connectedUserProfileImageUrl?: string;
  connectedUserIsVerified: boolean;
}

