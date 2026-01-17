import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EventTrackingService } from './event-tracking.service';
import { UserProfileService } from './user-profile.service';

export interface SocialPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  mediaAttachments: MediaAttachment[];
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
  visibility: 'public' | 'followers' | 'private';
  tags: string[];
  mentions: string[];
  location?: string;
  stats: PostStats;
  userInteraction: UserInteraction;
}

export interface MediaAttachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  thumbnailUrl?: string;
  filename: string;
  size: number;
  mimeType: string;
  metadata: Record<string, any>;
}

export interface PostStats {
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  bookmarksCount: number;
}

export interface UserInteraction {
  isLiked: boolean;
  isBookmarked: boolean;
  isShared: boolean;
  reactionType?: 'like' | 'love' | 'laugh' | 'angry' | 'sad' | 'wow';
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
  parentCommentId?: string;
  replies: Comment[];
  stats: CommentStats;
  userInteraction: CommentInteraction;
}

export interface CommentStats {
  likesCount: number;
  repliesCount: number;
}

export interface CommentInteraction {
  isLiked: boolean;
}

export interface Reaction {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'post' | 'comment';
  type: 'like' | 'love' | 'laugh' | 'angry' | 'sad' | 'wow';
  createdAt: Date;
}

export interface Share {
  id: string;
  userId: string;
  postId: string;
  shareType: 'repost' | 'quote' | 'external';
  shareContent?: string;
  platform?: string;
  createdAt: Date;
}

export interface Bookmark {
  id: string;
  userId: string;
  postId: string;
  collectionId?: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'share' | 'follow' | 'mention' | 'reaction';
  actorId: string;
  actorName: string;
  actorAvatar: string;
  targetId: string;
  targetType: 'post' | 'comment' | 'user';
  content: string;
  isRead: boolean;
  createdAt: Date;
}

/**
 * Social Interaction Service
 * 
 * Manages social features and interactions:
 * - Post likes, comments, and reactions
 * - Sharing and bookmarking functionality
 * - Real-time social notifications
 * - User engagement tracking
 * - Social analytics and insights
 */
@Injectable({
  providedIn: 'root'
})
export class SocialInteractionService {
  private eventTrackingService = inject(EventTrackingService);
  private userProfileService = inject(UserProfileService);

  private posts = new BehaviorSubject<SocialPost[]>([]);
  private comments = new BehaviorSubject<Comment[]>([]);
  private reactions = new BehaviorSubject<Reaction[]>([]);
  private shares = new BehaviorSubject<Share[]>([]);
  private bookmarks = new BehaviorSubject<Bookmark[]>([]);
  private notifications = new BehaviorSubject<Notification[]>([]);
  private isLoading = new BehaviorSubject<boolean>(false);

  public readonly posts$ = this.posts.asObservable();
  public readonly comments$ = this.comments.asObservable();
  public readonly reactions$ = this.reactions.asObservable();
  public readonly shares$ = this.shares.asObservable();
  public readonly bookmarks$ = this.bookmarks.asObservable();
  public readonly notifications$ = this.notifications.asObservable();
  public readonly isLoading$ = this.isLoading.asObservable();

  constructor() {
    this.initializeSocialInteraction();
  }

  /**
   * Initialize social interaction service
   */
  private initializeSocialInteraction(): void {
    this.loadPosts();
    this.loadComments();
    this.loadReactions();
    this.loadShares();
    this.loadBookmarks();
    this.loadNotifications();

    console.log('💬 Social interaction service initialized');
  }

  /**
   * Load posts from storage
   */
  private loadPosts(): void {
    try {
      const stored = localStorage.getItem('social-posts');
      if (stored) {
        const posts = JSON.parse(stored) as SocialPost[];
        // Convert date strings back to Date objects
        posts.forEach(post => {
          post.createdAt = new Date(post.createdAt);
          post.updatedAt = new Date(post.updatedAt);
        });
        this.posts.next(posts);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  }

  /**
   * Load comments from storage
   */
  private loadComments(): void {
    try {
      const stored = localStorage.getItem('social-comments');
      if (stored) {
        const comments = JSON.parse(stored) as Comment[];
        // Convert date strings back to Date objects
        comments.forEach(comment => {
          comment.createdAt = new Date(comment.createdAt);
          comment.updatedAt = new Date(comment.updatedAt);
          comment.replies.forEach(reply => {
            reply.createdAt = new Date(reply.createdAt);
            reply.updatedAt = new Date(reply.updatedAt);
          });
        });
        this.comments.next(comments);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  }

  /**
   * Load reactions from storage
   */
  private loadReactions(): void {
    try {
      const stored = localStorage.getItem('social-reactions');
      if (stored) {
        const reactions = JSON.parse(stored) as Reaction[];
        // Convert date strings back to Date objects
        reactions.forEach(reaction => {
          reaction.createdAt = new Date(reaction.createdAt);
        });
        this.reactions.next(reactions);
      }
    } catch (error) {
      console.error('Failed to load reactions:', error);
    }
  }

  /**
   * Load shares from storage
   */
  private loadShares(): void {
    try {
      const stored = localStorage.getItem('social-shares');
      if (stored) {
        const shares = JSON.parse(stored) as Share[];
        // Convert date strings back to Date objects
        shares.forEach(share => {
          share.createdAt = new Date(share.createdAt);
        });
        this.shares.next(shares);
      }
    } catch (error) {
      console.error('Failed to load shares:', error);
    }
  }

  /**
   * Load bookmarks from storage
   */
  private loadBookmarks(): void {
    try {
      const stored = localStorage.getItem('social-bookmarks');
      if (stored) {
        const bookmarks = JSON.parse(stored) as Bookmark[];
        // Convert date strings back to Date objects
        bookmarks.forEach(bookmark => {
          bookmark.createdAt = new Date(bookmark.createdAt);
        });
        this.bookmarks.next(bookmarks);
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    }
  }

  /**
   * Load notifications from storage
   */
  private loadNotifications(): void {
    try {
      const stored = localStorage.getItem('social-notifications');
      if (stored) {
        const notifications = JSON.parse(stored) as Notification[];
        // Convert date strings back to Date objects
        notifications.forEach(notification => {
          notification.createdAt = new Date(notification.createdAt);
        });
        this.notifications.next(notifications);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }

  /**
   * Like or unlike a post
   */
  async togglePostLike(postId: string): Promise<void> {
    const currentUser = this.userProfileService.currentProfile();
    if (!currentUser) throw new Error('User not authenticated');

    const posts = this.posts.value;
    const post = posts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');

    const reactions = this.reactions.value;
    const existingReaction = reactions.find(
      r => r.userId === currentUser.id && r.targetId === postId && r.targetType === 'post'
    );

    if (existingReaction) {
      // Remove like
      const updatedReactions = reactions.filter(r => r.id !== existingReaction.id);
      this.reactions.next(updatedReactions);

      // Update post stats
      post.stats.likesCount = Math.max(0, post.stats.likesCount - 1);
      post.userInteraction.isLiked = false;
      post.userInteraction.reactionType = undefined;

      this.eventTrackingService.trackCustomEvent({
        name: 'post_unliked',
        category: 'social',
        action: 'unlike',
        parameters: {
          post_id: postId,
          user_id: currentUser.id
        }
      });
    } else {
      // Add like
      const newReaction: Reaction = {
        id: this.generateId(),
        userId: currentUser.id,
        targetId: postId,
        targetType: 'post',
        type: 'like',
        createdAt: new Date()
      };

      const updatedReactions = [...reactions, newReaction];
      this.reactions.next(updatedReactions);

      // Update post stats
      post.stats.likesCount++;
      post.userInteraction.isLiked = true;
      post.userInteraction.reactionType = 'like';

      // Create notification for post author
      if (post.authorId !== currentUser.id) {
        this.createNotification({
          userId: post.authorId,
          type: 'like',
          actorId: currentUser.id,
          actorName: `${currentUser.firstName} ${currentUser.lastName}`.trim(),
          actorAvatar: currentUser.profileImageUrl || '',
          targetId: postId,
          targetType: 'post',
          content: `${currentUser.firstName} ${currentUser.lastName}`.trim() + ' liked your post'
        });
      }

      this.eventTrackingService.trackCustomEvent({
        name: 'post_liked',
        category: 'social',
        action: 'like',
        parameters: {
          post_id: postId,
          user_id: currentUser.id
        }
      });
    }

    // Update posts and save
    this.posts.next(posts);
    this.savePosts();
    this.saveReactions();
  }

  /**
   * Add reaction to post
   */
  async addPostReaction(postId: string, reactionType: Reaction['type']): Promise<void> {
    const currentUser = this.userProfileService.currentProfile();
    if (!currentUser) throw new Error('User not authenticated');

    const posts = this.posts.value;
    const post = posts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');

    const reactions = this.reactions.value;

    // Remove existing reaction if any
    const existingReaction = reactions.find(
      r => r.userId === currentUser.id && r.targetId === postId && r.targetType === 'post'
    );

    let updatedReactions = reactions;
    if (existingReaction) {
      updatedReactions = reactions.filter(r => r.id !== existingReaction.id);
      post.stats.likesCount = Math.max(0, post.stats.likesCount - 1);
    }

    // Add new reaction
    const newReaction: Reaction = {
      id: this.generateId(),
      userId: currentUser.id,
      targetId: postId,
      targetType: 'post',
      type: reactionType,
      createdAt: new Date()
    };

    updatedReactions.push(newReaction);
    this.reactions.next(updatedReactions);

    // Update post stats
    post.stats.likesCount++;
    post.userInteraction.isLiked = true;
    post.userInteraction.reactionType = reactionType;

    // Create notification for post author
    if (post.authorId !== currentUser.id) {
      this.createNotification({
        userId: post.authorId,
        type: 'reaction',
        actorId: currentUser.id,
        actorName: `${currentUser.firstName} ${currentUser.lastName}`.trim(),
        actorAvatar: currentUser.profileImageUrl || '',
        targetId: postId,
        targetType: 'post',
        content: `${currentUser.firstName} ${currentUser.lastName}`.trim() + ` reacted ${reactionType} to your post`
      });
    }

    this.eventTrackingService.trackCustomEvent({
      name: 'post_reaction_added',
      category: 'social',
      action: 'reaction',
      parameters: {
        post_id: postId,
        reaction_type: reactionType,
        user_id: currentUser.id
      }
    });

    // Update posts and save
    this.posts.next(posts);
    this.savePosts();
    this.saveReactions();
  }

  /**
   * Add comment to post
   */
  async addComment(postId: string, content: string, parentCommentId?: string): Promise<Comment> {
    const currentUser = this.userProfileService.currentProfile();
    if (!currentUser) throw new Error('User not authenticated');

    const posts = this.posts.value;
    const post = posts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');

    const newComment: Comment = {
      id: this.generateId(),
      postId,
      authorId: currentUser.id,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`.trim(),
      authorAvatar: currentUser.profileImageUrl || '',
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      isEdited: false,
      parentCommentId,
      replies: [],
      stats: {
        likesCount: 0,
        repliesCount: 0
      },
      userInteraction: {
        isLiked: false
      }
    };

    const comments = this.comments.value;

    if (parentCommentId) {
      // Add as reply to parent comment
      const parentComment = comments.find(c => c.id === parentCommentId);
      if (parentComment) {
        parentComment.replies.push(newComment);
        parentComment.stats.repliesCount++;
      }
    } else {
      // Add as top-level comment
      comments.push(newComment);
    }

    // Update post comment count
    post.stats.commentsCount++;

    this.comments.next(comments);
    this.posts.next(posts);

    // Create notification for post author
    if (post.authorId !== currentUser.id) {
      this.createNotification({
        userId: post.authorId,
        type: 'comment',
        actorId: currentUser.id,
        actorName: `${currentUser.firstName} ${currentUser.lastName}`.trim(),
        actorAvatar: currentUser.profileImageUrl || '',
        targetId: postId,
        targetType: 'post',
        content: `${currentUser.firstName} ${currentUser.lastName}`.trim() + ' commented on your post'
      });
    }

    this.eventTrackingService.trackCustomEvent({
      name: 'comment_added',
      category: 'social',
      action: 'comment',
      parameters: {
        post_id: postId,
        comment_id: newComment.id,
        is_reply: !!parentCommentId,
        user_id: currentUser.id
      }
    });

    this.saveComments();
    this.savePosts();

    return newComment;
  }

  /**
   * Share a post
   */
  async sharePost(postId: string, shareType: Share['shareType'], shareContent?: string, platform?: string): Promise<void> {
    const currentUser = this.userProfileService.currentProfile();
    if (!currentUser) throw new Error('User not authenticated');

    const posts = this.posts.value;
    const post = posts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');

    const newShare: Share = {
      id: this.generateId(),
      userId: currentUser.id,
      postId,
      shareType,
      shareContent,
      platform,
      createdAt: new Date()
    };

    const shares = this.shares.value;
    shares.push(newShare);
    this.shares.next(shares);

    // Update post share count
    post.stats.sharesCount++;
    post.userInteraction.isShared = true;

    // Create notification for post author
    if (post.authorId !== currentUser.id) {
      this.createNotification({
        userId: post.authorId,
        type: 'share',
        actorId: currentUser.id,
        actorName: `${currentUser.firstName} ${currentUser.lastName}`.trim(),
        actorAvatar: currentUser.profileImageUrl || '',
        targetId: postId,
        targetType: 'post',
        content: `${currentUser.firstName} ${currentUser.lastName}`.trim() + ' shared your post'
      });
    }

    this.eventTrackingService.trackCustomEvent({
      name: 'post_shared',
      category: 'social',
      action: 'share',
      parameters: {
        post_id: postId,
        share_type: shareType,
        platform: platform,
        user_id: currentUser.id
      }
    });

    this.posts.next(posts);
    this.savePosts();
    this.saveShares();
  }

  /**
   * Bookmark or unbookmark a post
   */
  async toggleBookmark(postId: string, collectionId?: string): Promise<void> {
    const currentUser = this.userProfileService.currentProfile();
    if (!currentUser) throw new Error('User not authenticated');

    const posts = this.posts.value;
    const post = posts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');

    const bookmarks = this.bookmarks.value;
    const existingBookmark = bookmarks.find(
      b => b.userId === currentUser.id && b.postId === postId
    );

    if (existingBookmark) {
      // Remove bookmark
      const updatedBookmarks = bookmarks.filter(b => b.id !== existingBookmark.id);
      this.bookmarks.next(updatedBookmarks);

      // Update post stats
      post.stats.bookmarksCount = Math.max(0, post.stats.bookmarksCount - 1);
      post.userInteraction.isBookmarked = false;

      this.eventTrackingService.trackCustomEvent({
        name: 'post_unbookmarked',
        category: 'social',
        action: 'unbookmark',
        parameters: {
          post_id: postId,
          user_id: currentUser.id
        }
      });
    } else {
      // Add bookmark
      const newBookmark: Bookmark = {
        id: this.generateId(),
        userId: currentUser.id,
        postId,
        collectionId,
        createdAt: new Date()
      };

      const updatedBookmarks = [...bookmarks, newBookmark];
      this.bookmarks.next(updatedBookmarks);

      // Update post stats
      post.stats.bookmarksCount++;
      post.userInteraction.isBookmarked = true;

      this.eventTrackingService.trackCustomEvent({
        name: 'post_bookmarked',
        category: 'social',
        action: 'bookmark',
        parameters: {
          post_id: postId,
          collection_id: collectionId,
          user_id: currentUser.id
        }
      });
    }

    this.posts.next(posts);
    this.savePosts();
    this.saveBookmarks();
  }

  /**
   * Create notification
   */
  private createNotification(notificationData: Omit<Notification, 'id' | 'isRead' | 'createdAt'>): void {
    const notification: Notification = {
      id: this.generateId(),
      isRead: false,
      createdAt: new Date(),
      ...notificationData
    };

    const notifications = this.notifications.value;
    notifications.unshift(notification); // Add to beginning

    // Keep only last 100 notifications
    if (notifications.length > 100) {
      notifications.splice(100);
    }

    this.notifications.next(notifications);
    this.saveNotifications();
  }

  /**
   * Mark notification as read
   */
  markNotificationAsRead(notificationId: string): void {
    const notifications = this.notifications.value;
    const notification = notifications.find(n => n.id === notificationId);

    if (notification && !notification.isRead) {
      notification.isRead = true;
      this.notifications.next(notifications);
      this.saveNotifications();
    }
  }

  /**
   * Mark all notifications as read
   */
  markAllNotificationsAsRead(): void {
    const notifications = this.notifications.value;
    let hasChanges = false;

    notifications.forEach(notification => {
      if (!notification.isRead) {
        notification.isRead = true;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      this.notifications.next(notifications);
      this.saveNotifications();
    }
  }

  /**
   * Get unread notification count
   */
  getUnreadNotificationCount(): number {
    return this.notifications.value.filter(n => !n.isRead).length;
  }

  /**
   * Get post comments
   */
  getPostComments(postId: string): Comment[] {
    return this.comments.value.filter(c => c.postId === postId && !c.parentCommentId);
  }

  /**
   * Get user bookmarks
   */
  getUserBookmarks(userId?: string): Bookmark[] {
    const targetUserId = userId || this.userProfileService.currentProfile()?.id;
    if (!targetUserId) return [];

    return this.bookmarks.value.filter(b => b.userId === targetUserId);
  }

  /**
   * Save data to storage
   */
  private savePosts(): void {
    localStorage.setItem('social-posts', JSON.stringify(this.posts.value));
  }

  private saveComments(): void {
    localStorage.setItem('social-comments', JSON.stringify(this.comments.value));
  }

  private saveReactions(): void {
    localStorage.setItem('social-reactions', JSON.stringify(this.reactions.value));
  }

  private saveShares(): void {
    localStorage.setItem('social-shares', JSON.stringify(this.shares.value));
  }

  private saveBookmarks(): void {
    localStorage.setItem('social-bookmarks', JSON.stringify(this.bookmarks.value));
  }

  private saveNotifications(): void {
    localStorage.setItem('social-notifications', JSON.stringify(this.notifications.value));
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `social_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current posts
   */
  getPosts(): SocialPost[] {
    return this.posts.value;
  }

  /**
   * Get current notifications
   */
  getNotifications(): Notification[] {
    return this.notifications.value;
  }

  /**
   * Clear all social data
   */
  clearAllData(): void {
    this.posts.next([]);
    this.comments.next([]);
    this.reactions.next([]);
    this.shares.next([]);
    this.bookmarks.next([]);
    this.notifications.next([]);

    // Clear storage
    localStorage.removeItem('social-posts');
    localStorage.removeItem('social-comments');
    localStorage.removeItem('social-reactions');
    localStorage.removeItem('social-shares');
    localStorage.removeItem('social-bookmarks');
    localStorage.removeItem('social-notifications');
  }
}