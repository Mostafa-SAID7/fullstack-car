/**
 * User Profile Models
 * Enhanced models for user profile management and social connections
 */

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  bio?: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
  location?: string;
  website?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  isVerified: boolean;
  isOnline: boolean;
  lastSeenAt?: string;
  joinedAt: string;
  
  // Social stats
  followersCount: number;
  followingCount: number;
  postsCount: number;
  friendsCount: number;
  
  // Privacy settings
  privacySettings: PrivacySettings;
  
  // User preferences
  preferences: UserProfilePreferences;
  
  // Social connections
  connectionStatus?: ConnectionStatus;
  mutualFriendsCount?: number;
  mutualFollowersCount?: number;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  emailVisibility: 'public' | 'friends' | 'private';
  phoneVisibility: 'public' | 'friends' | 'private';
  locationVisibility: 'public' | 'friends' | 'private';
  birthdateVisibility: 'public' | 'friends' | 'private';
  onlineStatusVisibility: 'public' | 'friends' | 'private';
  allowFriendRequests: boolean;
  allowFollowing: boolean;
  allowDirectMessages: boolean;
  allowTagging: boolean;
  showActivityStatus: boolean;
  searchableByEmail: boolean;
  searchableByPhone: boolean;
}

export interface UserProfilePreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  activityDigest: 'daily' | 'weekly' | 'monthly' | 'never';
  autoPlayVideos: boolean;
  showOnlineStatus: boolean;
}

export interface ConnectionStatus {
  isFriend: boolean;
  isFollowing: boolean;
  isFollowedBy: boolean;
  isBlocked: boolean;
  isBlockedBy: boolean;
  friendRequestSent: boolean;
  friendRequestReceived: boolean;
  followRequestSent: boolean;
  followRequestReceived: boolean;
}

export interface SocialConnection {
  id: string;
  userId: string;
  connectedUserId: string;
  connectionType: 'friend' | 'follower' | 'following';
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: string;
  acceptedAt?: string;
  
  // Connected user info
  connectedUser: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
    isVerified: boolean;
    isOnline: boolean;
    mutualConnectionsCount: number;
  };
}

export interface FollowRequest {
  id: string;
  followerId: string;
  followingId: string;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
  createdAt: string;
  respondedAt?: string;
  
  // Follower info
  follower: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
    isVerified: boolean;
    mutualConnectionsCount: number;
  };
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  location?: string;
  website?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
}

export interface UpdatePrivacySettingsRequest {
  privacySettings: Partial<PrivacySettings>;
}

export interface UpdatePreferencesRequest {
  preferences: Partial<UserProfilePreferences>;
}

export interface BlockUserRequest {
  userId: string;
  reason?: string;
}

export interface ReportUserRequest {
  userId: string;
  reason: 'spam' | 'harassment' | 'inappropriate-content' | 'fake-account' | 'other';
  description?: string;
}

export interface UserSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  bio?: string;
  location?: string;
  isVerified: boolean;
  isOnline: boolean;
  mutualConnectionsCount: number;
  connectionStatus: ConnectionStatus;
}

export interface ProfileActivity {
  id: string;
  userId: string;
  activityType: 'post' | 'comment' | 'like' | 'share' | 'friend' | 'follow';
  description: string;
  targetId?: string;
  targetType?: string;
  createdAt: string;
  isVisible: boolean;
}

export interface ProfileStats {
  postsCount: number;
  friendsCount: number;
  followersCount: number;
  followingCount: number;
  likesReceived: number;
  commentsReceived: number;
  sharesReceived: number;
  profileViews: number;
  joinedAt: string;
}