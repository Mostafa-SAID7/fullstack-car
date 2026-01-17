export interface Group {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  avatar?: string;
  type: 'public' | 'private' | 'secret';
  category: string;
  memberCount: number;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  moderatorIds: string[];
  tags: string[];
  rules: string[];
  settings: GroupSettings;
  stats: GroupStats;
}

export interface GroupSettings {
  allowMemberPosts: boolean;
  requirePostApproval: boolean;
  allowMemberInvites: boolean;
  allowDiscussions: boolean;
  allowEvents: boolean;
  allowPolls: boolean;
  autoApproveMembers: boolean;
  showMemberList: boolean;
  allowExternalSharing: boolean;
}

export interface GroupStats {
  totalMembers: number;
  activeMembersToday: number;
  activeMembersWeek: number;
  totalPosts: number;
  postsToday: number;
  postsWeek: number;
  engagementRate: number;
  growthRate: number;
}

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  role: 'owner' | 'moderator' | 'member';
  joinedAt: Date;
  lastActiveAt: Date;
  status: 'active' | 'inactive' | 'banned';
  permissions: GroupPermissions;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
    verified: boolean;
  };
}

export interface GroupPermissions {
  canPost: boolean;
  canComment: boolean;
  canInvite: boolean;
  canModerate: boolean;
  canManageMembers: boolean;
  canEditGroup: boolean;
  canDeleteGroup: boolean;
}

export interface GroupPost {
  id: string;
  groupId: string;
  authorId: string;
  content: string;
  mediaUrls: string[];
  type: 'text' | 'image' | 'video' | 'poll' | 'event' | 'discussion';
  status: 'published' | 'pending' | 'rejected' | 'draft';
  isPinned: boolean;
  allowComments: boolean;
  createdAt: Date;
  updatedAt: Date;
  stats: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
    role: string;
  };
}

export interface GroupInvitation {
  id: string;
  groupId: string;
  inviterId: string;
  inviteeId: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  message?: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface GroupJoinRequest {
  id: string;
  groupId: string;
  userId: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export interface GroupEvent {
  id: string;
  groupId: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  isVirtual: boolean;
  maxAttendees?: number;
  attendeeCount: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: Date;
}

export interface GroupDiscussion {
  id: string;
  groupId: string;
  title: string;
  description: string;
  category: string;
  isPinned: boolean;
  isLocked: boolean;
  replyCount: number;
  lastReplyAt: Date;
  createdBy: string;
  createdAt: Date;
}

export interface GroupReport {
  id: string;
  groupId: string;
  reporterId: string;
  targetType: 'post' | 'comment' | 'member' | 'group';
  targetId: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  action?: string;
}

export interface CreateGroupRequest {
  name: string;
  description: string;
  type: 'public' | 'private' | 'secret';
  category: string;
  tags: string[];
  rules: string[];
  coverImage?: File;
  avatar?: File;
  settings: Partial<GroupSettings>;
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
  type?: 'public' | 'private' | 'secret';
  category?: string;
  tags?: string[];
  rules?: string[];
  coverImage?: File;
  avatar?: File;
  settings?: Partial<GroupSettings>;
}

export interface GroupSearchFilters {
  query?: string;
  category?: string;
  type?: 'public' | 'private' | 'secret';
  tags?: string[];
  memberCountMin?: number;
  memberCountMax?: number;
  sortBy?: 'name' | 'members' | 'activity' | 'created' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}