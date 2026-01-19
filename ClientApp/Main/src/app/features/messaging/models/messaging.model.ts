/**
 * Messaging and Chat Models for Real-time Communication
 * Supports direct messages, group chats, and real-time features
 */

export enum MessageType {
  Text = 'text',
  Image = 'image',
  File = 'file',
  Audio = 'audio',
  Video = 'video',
  System = 'system'
}

export enum MessageStatus {
  Sending = 'sending',
  Sent = 'sent',
  Delivered = 'delivered',
  Read = 'read',
  Failed = 'failed'
}

export enum ConversationType {
  Direct = 'direct',
  Group = 'group'
}

export enum ParticipantRole {
  Member = 'member',
  Admin = 'admin',
  Owner = 'owner'
}

export interface MessageDto {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  type: MessageType;
  content: string;
  attachments?: MessageAttachment[];
  replyToId?: string;
  status: MessageStatus;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MessageAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
}

export interface ConversationDto {
  id: string;
  type: ConversationType;
  name?: string; // For group conversations
  description?: string;
  avatar?: string;
  participants: ConversationParticipant[];
  lastMessage?: MessageDto;
  unreadCount: number;
  isArchived: boolean;
  isMuted: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ConversationParticipant {
  userId: string;
  userName: string;
  userAvatar?: string;
  role: ParticipantRole;
  isOnline: boolean;
  lastSeen?: string;
  joinedAt: string;
}

export interface CreateConversationRequest {
  type: ConversationType;
  participantIds: string[];
  name?: string;
  description?: string;
}

export interface SendMessageRequest {
  conversationId: string;
  type: MessageType;
  content: string;
  attachments?: File[];
  replyToId?: string;
}

export interface ConversationListResponse {
  conversations: ConversationDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface MessageListResponse {
  messages: MessageDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ConversationFilters {
  page?: number;
  pageSize?: number;
  type?: ConversationType;
  search?: string;
  isArchived?: boolean;
  isMuted?: boolean;
}

export interface MessageFilters {
  page?: number;
  pageSize?: number;
  type?: MessageType;
  senderId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
  timestamp: string;
}

export interface OnlineStatus {
  userId: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  userName: string;
  emoji: string;
  createdAt: string;
}

// SignalR Events
export interface MessageEvent {
  type: 'message_sent' | 'message_delivered' | 'message_read' | 'message_deleted' | 'message_edited';
  message: MessageDto;
  conversationId: string;
  timestamp: string;
}

export interface ConversationEvent {
  type: 'conversation_created' | 'conversation_updated' | 'participant_added' | 'participant_removed' | 'participant_role_changed';
  conversation: ConversationDto;
  timestamp: string;
}

export interface TypingEvent {
  type: 'typing_start' | 'typing_stop';
  conversationId: string;
  userId: string;
  userName: string;
  timestamp: string;
}

export interface OnlineStatusEvent {
  type: 'user_online' | 'user_offline';
  userId: string;
  isOnline: boolean;
  lastSeen?: string;
  timestamp: string;
}

// Push Notification Models
export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  data?: {
    conversationId?: string;
    messageId?: string;
    senderId?: string;
    type: 'message' | 'notification' | 'system';
  };
  actions?: PushNotificationAction[];
}

export interface PushNotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface RegisterPushRequest {
  subscription: PushSubscription;
  deviceInfo: {
    userAgent: string;
    platform: string;
    language: string;
  };
}

// Notification Preferences for Messaging
export interface MessagingNotificationPreferences {
  directMessages: {
    push: boolean;
    email: boolean;
    inApp: boolean;
    sound: boolean;
  };
  groupMessages: {
    push: boolean;
    email: boolean;
    inApp: boolean;
    sound: boolean;
  };
  mentions: {
    push: boolean;
    email: boolean;
    inApp: boolean;
    sound: boolean;
  };
  quietHours: {
    enabled: boolean;
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
  };
}

// Type guards
export function isMessageType(value: string): value is MessageType {
  return Object.values(MessageType).includes(value as MessageType);
}

export function isMessageStatus(value: string): value is MessageStatus {
  return Object.values(MessageStatus).includes(value as MessageStatus);
}

export function isConversationType(value: string): value is ConversationType {
  return Object.values(ConversationType).includes(value as ConversationType);
}