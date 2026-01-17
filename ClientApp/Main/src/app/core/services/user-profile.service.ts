import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EventTrackingService } from './event-tracking.service';
import { AnalyticsService } from './analytics.service';

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  joinDate: Date;
  lastActive: Date;
  isVerified: boolean;
  isPrivate: boolean;
  preferences: UserPreferences;
  stats: UserStats;
  socialLinks: SocialLinks;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
  followers: boolean;
  likes: boolean;
  comments: boolean;
  mentions: boolean;
  newsletter: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'followers' | 'private';
  showEmail: boolean;
  showLocation: boolean;
  showActivity: boolean;
  allowMessages: 'everyone' | 'followers' | 'none';
  allowTags: boolean;
}

export interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
}

export interface UserStats {
  followersCount: number;
  followingCount: number;
  postsCount: number;
  likesReceived: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  reputation: number;
}

export interface SocialLinks {
  twitter?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'share' | 'follow' | 'post' | 'view';
  targetId: string;
  targetType: 'user' | 'post' | 'media' | 'playlist';
  timestamp: Date;
  metadata: Record<string, any>;
}

export interface UserRelationship {
  userId: string;
  targetUserId: string;
  type: 'following' | 'follower' | 'blocked' | 'muted';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User Profile Service
 * 
 * Manages user profiles and social features:
 * - User profile management and customization
 * - Social relationships (follow/unfollow)
 * - Activity tracking and feeds
 * - Privacy and notification settings
 * - User statistics and reputation
 */
@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private eventTrackingService = inject(EventTrackingService);
  private analyticsService = inject(AnalyticsService);

  private currentUser = new BehaviorSubject<UserProfile | null>(null);
  private userActivities = new BehaviorSubject<UserActivity[]>([]);
  private userRelationships = new BehaviorSubject<UserRelationship[]>([]);
  private isLoading = new BehaviorSubject<boolean>(false);

  public readonly currentUser$ = this.currentUser.asObservable();
  public readonly userActivities$ = this.userActivities.asObservable();
  public readonly userRelationships$ = this.userRelationships.asObservable();
  public readonly isLoading$ = this.isLoading.asObservable();

  constructor() {
    this.initializeUserProfile();
  }

  /**
   * Initialize user profile service
   */
  private initializeUserProfile(): void {
    this.loadCurrentUser();
    this.loadUserActivities();
    this.loadUserRelationships();
    
    console.log('👤 User profile service initialized');
  }

  /**
   * Load current user profile
   */
  private async loadCurrentUser(): Promise<void> {
    try {
      // In a real app, this would fetch from an API
      const storedUser = localStorage.getItem('current-user');
      if (storedUser) {
        const user = JSON.parse(storedUser) as UserProfile;
        // Convert date strings back to Date objects
        user.joinDate = new Date(user.joinDate);
        user.lastActive = new Date(user.lastActive);
        this.currentUser.next(user);
      }
    } catch (error) {
      console.error('Failed to load current user:', error);
    }
  }

  /**
   * Load user activities
   */
  private async loadUserActivities(): Promise<void> {
    try {
      const storedActivities = localStorage.getItem('user-activities');
      if (storedActivities) {
        const activities = JSON.parse(storedActivities) as UserActivity[];
        // Convert date strings back to Date objects
        activities.forEach(activity => {
          activity.timestamp = new Date(activity.timestamp);
        });
        this.userActivities.next(activities);
      }
    } catch (error) {
      console.error('Failed to load user activities:', error);
    }
  }

  /**
   * Load user relationships
   */
  private async loadUserRelationships(): Promise<void> {
    try {
      const storedRelationships = localStorage.getItem('user-relationships');
      if (storedRelationships) {
        const relationships = JSON.parse(storedRelationships) as UserRelationship[];
        // Convert date strings back to Date objects
        relationships.forEach(rel => {
          rel.createdAt = new Date(rel.createdAt);
          rel.updatedAt = new Date(rel.updatedAt);
        });
        this.userRelationships.next(relationships);
      }
    } catch (error) {
      console.error('Failed to load user relationships:', error);
    }
  }

  /**
   * Create or update user profile
   */
  async updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    this.isLoading.next(true);
    
    try {
      const currentUser = this.currentUser.value;
      
      const updatedUser: UserProfile = {
        ...currentUser,
        ...profileData,
        id: currentUser?.id || this.generateUserId(),
        lastActive: new Date()
      } as UserProfile;

      // Save to storage (in real app, this would be an API call)
      localStorage.setItem('current-user', JSON.stringify(updatedUser));
      
      this.currentUser.next(updatedUser);
      
      // Track profile update
      this.eventTrackingService.trackCustomEvent({
        name: 'profile_updated',
        category: 'user_profile',
        action: 'update',
        parameters: {
          user_id: updatedUser.id,
          fields_updated: Object.keys(profileData)
        }
      });
      
      // Update analytics user properties
      this.analyticsService.setUserProperties({
        userId: updatedUser.id,
        userType: updatedUser.isVerified ? 'verified' : 'free'
      });
      
      return updatedUser;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    } finally {
      this.isLoading.next(false);
    }
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<void> {
    const currentUser = this.currentUser.value;
    if (!currentUser) throw new Error('No current user');

    const updatedPreferences = {
      ...currentUser.preferences,
      ...preferences
    };

    await this.updateUserProfile({
      preferences: updatedPreferences
    });

    this.eventTrackingService.trackCustomEvent({
      name: 'preferences_updated',
      category: 'user_profile',
      action: 'preferences',
      parameters: {
        user_id: currentUser.id,
        preferences_updated: Object.keys(preferences)
      }
    });
  }

  /**
   * Follow a user
   */
  async followUser(targetUserId: string): Promise<void> {
    const currentUser = this.currentUser.value;
    if (!currentUser) throw new Error('No current user');

    // Check if already following
    const relationships = this.userRelationships.value;
    const existingRelationship = relationships.find(
      rel => rel.userId === currentUser.id && 
             rel.targetUserId === targetUserId && 
             rel.type === 'following'
    );

    if (existingRelationship) {
      console.log('Already following user');
      return;
    }

    // Create follow relationship
    const followRelationship: UserRelationship = {
      userId: currentUser.id,
      targetUserId,
      type: 'following',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Create follower relationship for target user
    const followerRelationship: UserRelationship = {
      userId: targetUserId,
      targetUserId: currentUser.id,
      type: 'follower',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedRelationships = [...relationships, followRelationship, followerRelationship];
    this.userRelationships.next(updatedRelationships);
    
    // Save to storage
    localStorage.setItem('user-relationships', JSON.stringify(updatedRelationships));

    // Update user stats
    const updatedUser = {
      ...currentUser,
      stats: {
        ...currentUser.stats,
        followingCount: currentUser.stats.followingCount + 1
      }
    };
    
    await this.updateUserProfile(updatedUser);

    // Track follow event
    this.eventTrackingService.trackCustomEvent({
      name: 'user_followed',
      category: 'social',
      action: 'follow',
      parameters: {
        user_id: currentUser.id,
        target_user_id: targetUserId
      }
    });

    // Add activity
    this.addUserActivity({
      type: 'follow',
      targetId: targetUserId,
      targetType: 'user',
      metadata: {}
    });
  }

  /**
   * Unfollow a user
   */
  async unfollowUser(targetUserId: string): Promise<void> {
    const currentUser = this.currentUser.value;
    if (!currentUser) throw new Error('No current user');

    const relationships = this.userRelationships.value;
    
    // Remove follow and follower relationships
    const updatedRelationships = relationships.filter(
      rel => !(
        (rel.userId === currentUser.id && rel.targetUserId === targetUserId && rel.type === 'following') ||
        (rel.userId === targetUserId && rel.targetUserId === currentUser.id && rel.type === 'follower')
      )
    );

    this.userRelationships.next(updatedRelationships);
    localStorage.setItem('user-relationships', JSON.stringify(updatedRelationships));

    // Update user stats
    const updatedUser = {
      ...currentUser,
      stats: {
        ...currentUser.stats,
        followingCount: Math.max(0, currentUser.stats.followingCount - 1)
      }
    };
    
    await this.updateUserProfile(updatedUser);

    // Track unfollow event
    this.eventTrackingService.trackCustomEvent({
      name: 'user_unfollowed',
      category: 'social',
      action: 'unfollow',
      parameters: {
        user_id: currentUser.id,
        target_user_id: targetUserId
      }
    });
  }

  /**
   * Add user activity
   */
  addUserActivity(activityData: Omit<UserActivity, 'id' | 'userId' | 'timestamp'>): void {
    const currentUser = this.currentUser.value;
    if (!currentUser) return;

    const activity: UserActivity = {
      id: this.generateActivityId(),
      userId: currentUser.id,
      timestamp: new Date(),
      ...activityData
    };

    const activities = this.userActivities.value;
    const updatedActivities = [activity, ...activities];
    
    // Keep only last 100 activities
    if (updatedActivities.length > 100) {
      updatedActivities.splice(100);
    }

    this.userActivities.next(updatedActivities);
    localStorage.setItem('user-activities', JSON.stringify(updatedActivities));
  }

  /**
   * Get user relationship status
   */
  getUserRelationshipStatus(targetUserId: string): 'following' | 'follower' | 'mutual' | 'blocked' | 'none' {
    const currentUser = this.currentUser.value;
    if (!currentUser) return 'none';

    const relationships = this.userRelationships.value;
    
    const isFollowing = relationships.some(
      rel => rel.userId === currentUser.id && 
             rel.targetUserId === targetUserId && 
             rel.type === 'following'
    );
    
    const isFollower = relationships.some(
      rel => rel.userId === targetUserId && 
             rel.targetUserId === currentUser.id && 
             rel.type === 'following'
    );
    
    const isBlocked = relationships.some(
      rel => rel.userId === currentUser.id && 
             rel.targetUserId === targetUserId && 
             rel.type === 'blocked'
    );

    if (isBlocked) return 'blocked';
    if (isFollowing && isFollower) return 'mutual';
    if (isFollowing) return 'following';
    if (isFollower) return 'follower';
    return 'none';
  }

  /**
   * Create default user profile
   */
  createDefaultProfile(userData: Partial<UserProfile>): UserProfile {
    return {
      id: this.generateUserId(),
      username: '',
      displayName: '',
      email: '',
      avatar: '/assets/default-avatar.png',
      bio: '',
      location: '',
      website: '',
      joinDate: new Date(),
      lastActive: new Date(),
      isVerified: false,
      isPrivate: false,
      preferences: {
        theme: 'auto',
        language: 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        notifications: {
          email: true,
          push: true,
          inApp: true,
          followers: true,
          likes: true,
          comments: true,
          mentions: true,
          newsletter: false
        },
        privacy: {
          profileVisibility: 'public',
          showEmail: false,
          showLocation: true,
          showActivity: true,
          allowMessages: 'everyone',
          allowTags: true
        },
        accessibility: {
          reducedMotion: false,
          highContrast: false,
          largeText: false,
          screenReader: false,
          keyboardNavigation: false
        }
      },
      stats: {
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
        likesReceived: 0,
        commentsCount: 0,
        sharesCount: 0,
        viewsCount: 0,
        reputation: 0
      },
      socialLinks: {},
      ...userData
    };
  }

  /**
   * Generate user ID
   */
  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate activity ID
   */
  private generateActivityId(): string {
    return `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current user
   */
  getCurrentUser(): UserProfile | null {
    return this.currentUser.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.currentUser.value;
  }

  /**
   * Sign out user
   */
  signOut(): void {
    this.currentUser.next(null);
    this.userActivities.next([]);
    this.userRelationships.next([]);
    
    // Clear storage
    localStorage.removeItem('current-user');
    localStorage.removeItem('user-activities');
    localStorage.removeItem('user-relationships');
    
    this.eventTrackingService.trackCustomEvent({
      name: 'user_signed_out',
      category: 'auth',
      action: 'sign_out'
    });
  }
}