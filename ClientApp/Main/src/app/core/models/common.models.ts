export interface AuthorInfo {
  id: string;
  username: string;
  displayName: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  verified: boolean;
  reputation?: number;
  badgeCount?: number;
}

export interface ThreadedComment {
  id: string;
  content: string;
  authorId: string;
  author: AuthorInfo;
  parentId?: string;
  replies?: ThreadedComment[];
  likesCount: number;
  isLiked: boolean;
  createdAt: Date;
  updatedAt?: Date;
  isEdited: boolean;
  isDeleted: boolean;
  level: number;
}

export interface MediaAttachment {
  id: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  thumbnailUrl?: string;
  filename: string;
  size: number;
  mimeType: string;
  alt?: string;
  caption?: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  usageCount: number;
  category?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  parentId?: string;
  children?: Category[];
  itemCount: number;
}

export interface Reaction {
  id: string;
  type: 'like' | 'love' | 'laugh' | 'angry' | 'sad' | 'wow';
  emoji: string;
  userId: string;
  userName: string;
  createdAt: Date;
}

export interface Vote {
  id: string;
  type: 'up' | 'down';
  userId: string;
  createdAt: Date;
}

export interface Rating {
  id: string;
  value: number; // 1-5 stars
  userId: string;
  userName: string;
  review?: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  userId: string;
  createdAt: Date;
  actionUrl?: string;
  icon?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  privacy: {
    showEmail: boolean;
    showProfile: boolean;
    allowMessages: boolean;
  };
}