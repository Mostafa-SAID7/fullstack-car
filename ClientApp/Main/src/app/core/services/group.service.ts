import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  Group,
  GroupMember,
  GroupPost,
  GroupJoinRequest,
  GroupEvent,
  GroupDiscussion,
  GroupReport,
  CreateGroupRequest,
  UpdateGroupRequest,
  GroupSearchFilters
} from '../models/group.model';
import { ApiResponse, PaginatedResponse } from '../models/api.model';
import { AuthService } from './auth.service';
import { NotificationService } from '../../shared/services/notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  private readonly apiUrl = '/api/groups';

  // Reactive state
  private userGroupsSubject = new BehaviorSubject<Group[]>([]);
  private joinedGroupsSubject = new BehaviorSubject<Group[]>([]);
  private managedGroupsSubject = new BehaviorSubject<Group[]>([]);

  // Signals for reactive state
  private _userGroups = signal<Group[]>([]);
  private _joinedGroups = signal<Group[]>([]);
  private _managedGroups = signal<Group[]>([]);
  private _selectedGroup = signal<Group | null>(null);
  private _groupMembers = signal<GroupMember[]>([]);
  private _groupPosts = signal<GroupPost[]>([]);
  private _isLoading = signal(false);

  // Public readonly signals
  readonly userGroups = this._userGroups.asReadonly();
  readonly joinedGroups = this._joinedGroups.asReadonly();
  readonly managedGroups = this._managedGroups.asReadonly();
  readonly selectedGroup = this._selectedGroup.asReadonly();
  readonly groupMembers = this._groupMembers.asReadonly();
  readonly groupPosts = this._groupPosts.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  // Computed values
  readonly totalGroups = computed(() => this._userGroups().length);
  readonly ownedGroups = computed(() =>
    this._userGroups().filter(group => group.ownerId === this.authService.currentUser()?.id)
  );
  readonly moderatedGroups = computed(() =>
    this._userGroups().filter(group =>
      group.moderatorIds.includes(this.authService.currentUser()?.id || '')
    )
  );

  constructor() {
    // Load user groups on service initialization
    this.loadUserGroups();
  }

  /**
   * Load user's groups
   */
  loadUserGroups(): void {
    this._isLoading.set(true);

    this.getUserGroups().subscribe({
      next: (groups) => {
        this._userGroups.set(groups);
        this._isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load user groups:', error);
        this._isLoading.set(false);
      }
    });
  }

  /**
   * Get all groups for current user
   */
  getUserGroups(): Observable<Group[]> {
    return this.http.get<ApiResponse<Group[]>>(`${this.apiUrl}/user`)
      .pipe(
        map(response => response.data || []),
        tap(groups => this.userGroupsSubject.next(groups))
      );
  }

  /**
   * Get joined groups
   */
  getJoinedGroups(): Observable<Group[]> {
    return this.http.get<ApiResponse<Group[]>>(`${this.apiUrl}/joined`)
      .pipe(
        map(response => response.data || []),
        tap(groups => {
          this._joinedGroups.set(groups);
          this.joinedGroupsSubject.next(groups);
        })
      );
  }

  /**
   * Get managed groups (owned or moderated)
   */
  getManagedGroups(): Observable<Group[]> {
    return this.http.get<ApiResponse<Group[]>>(`${this.apiUrl}/managed`)
      .pipe(
        map(response => response.data || []),
        tap(groups => {
          this._managedGroups.set(groups);
          this.managedGroupsSubject.next(groups);
        })
      );
  }

  /**
   * Search groups
   */
  searchGroups(filters: GroupSearchFilters): Observable<PaginatedResponse<Group>> {
    let params = new HttpParams();

    if (filters.query) params = params.set('query', filters.query);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.type) params = params.set('type', filters.type);
    if (filters.tags?.length) params = params.set('tags', filters.tags.join(','));
    if (filters.memberCountMin) params = params.set('memberCountMin', filters.memberCountMin.toString());
    if (filters.memberCountMax) params = params.set('memberCountMax', filters.memberCountMax.toString());
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params = params.set('sortOrder', filters.sortOrder);
    if (filters.pageNumber) params = params.set('pageNumber', filters.pageNumber.toString());
    if (filters.pageSize) params = params.set('pageSize', filters.pageSize.toString());

    return this.http.get<PaginatedResponse<Group>>(`${this.apiUrl}/search`, { params });
  }

  /**
   * Get group by ID
   */
  getGroup(groupId: string): Observable<Group> {
    return this.http.get<ApiResponse<Group>>(`${this.apiUrl}/${groupId}`)
      .pipe(
        map(response => response.data!),
        tap(group => this._selectedGroup.set(group))
      );
  }

  /**
   * Create new group
   */
  createGroup(request: CreateGroupRequest): Observable<Group> {
    const formData = new FormData();

    formData.append('name', request.name);
    formData.append('description', request.description);
    formData.append('type', request.type);
    formData.append('category', request.category);
    formData.append('tags', JSON.stringify(request.tags));
    formData.append('rules', JSON.stringify(request.rules));
    formData.append('settings', JSON.stringify(request.settings));

    if (request.coverImage) {
      formData.append('coverImage', request.coverImage);
    }

    if (request.avatar) {
      formData.append('avatar', request.avatar);
    }

    return this.http.post<ApiResponse<Group>>(this.apiUrl, formData)
      .pipe(
        map(response => response.data!),
        tap(group => {
          this._userGroups.update(groups => [...groups, group]);
          this.notificationService.success('Group created successfully!');
        })
      );
  }

  /**
   * Update group
   */
  updateGroup(groupId: string, request: UpdateGroupRequest): Observable<Group> {
    const formData = new FormData();

    if (request.name) formData.append('name', request.name);
    if (request.description) formData.append('description', request.description);
    if (request.type) formData.append('type', request.type);
    if (request.category) formData.append('category', request.category);
    if (request.tags) formData.append('tags', JSON.stringify(request.tags));
    if (request.rules) formData.append('rules', JSON.stringify(request.rules));
    if (request.settings) formData.append('settings', JSON.stringify(request.settings));

    if (request.coverImage) {
      formData.append('coverImage', request.coverImage);
    }

    if (request.avatar) {
      formData.append('avatar', request.avatar);
    }

    return this.http.put<ApiResponse<Group>>(`${this.apiUrl}/${groupId}`, formData)
      .pipe(
        map(response => response.data!),
        tap(group => {
          this._userGroups.update(groups =>
            groups.map(g => g.id === groupId ? group : g)
          );
          this._selectedGroup.set(group);
          this.notificationService.success('Group updated successfully!');
        })
      );
  }

  /**
   * Delete group
   */
  deleteGroup(groupId: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${groupId}`)
      .pipe(
        map(() => void 0),
        tap(() => {
          this._userGroups.update(groups => groups.filter(g => g.id !== groupId));
          this.notificationService.success('Group deleted successfully!');
        })
      );
  }

  /**
   * Join group
   */
  joinGroup(groupId: string, message?: string): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${groupId}/join`, { message })
      .pipe(
        map(() => void 0),
        tap(() => {
          this.notificationService.success('Join request sent successfully!');
          this.loadUserGroups(); // Refresh groups
        })
      );
  }

  /**
   * Leave group
   */
  leaveGroup(groupId: string): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${groupId}/leave`, {})
      .pipe(
        map(() => void 0),
        tap(() => {
          this._userGroups.update(groups => groups.filter(g => g.id !== groupId));
          this.notificationService.success('Left group successfully!');
        })
      );
  }

  /**
   * Get group members
   */
  getGroupMembers(groupId: string): Observable<GroupMember[]> {
    return this.http.get<ApiResponse<GroupMember[]>>(`${this.apiUrl}/${groupId}/members`)
      .pipe(
        map(response => response.data || []),
        tap(members => this._groupMembers.set(members))
      );
  }

  /**
   * Add member to group
   */
  addMember(groupId: string, userId: string, role: 'member' | 'moderator' = 'member'): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${groupId}/members`, { userId, role })
      .pipe(
        map(() => void 0),
        tap(() => {
          this.notificationService.success('Member added successfully!');
          this.getGroupMembers(groupId).subscribe(); // Refresh members
        })
      );
  }

  /**
   * Remove member from group
   */
  removeMember(groupId: string, userId: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${groupId}/members/${userId}`)
      .pipe(
        map(() => void 0),
        tap(() => {
          this._groupMembers.update(members => members.filter(m => m.userId !== userId));
          this.notificationService.success('Member removed successfully!');
        })
      );
  }

  /**
   * Update member role
   */
  updateMemberRole(groupId: string, userId: string, role: 'member' | 'moderator'): Observable<void> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${groupId}/members/${userId}/role`, { role })
      .pipe(
        map(() => void 0),
        tap(() => {
          this._groupMembers.update(members =>
            members.map(m => m.userId === userId ? { ...m, role } : m)
          );
          this.notificationService.success('Member role updated successfully!');
        })
      );
  }

  /**
   * Get group posts
   */
  getGroupPosts(groupId: string, page: number = 1, limit: number = 20): Observable<PaginatedResponse<GroupPost>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedResponse<GroupPost>>(`${this.apiUrl}/${groupId}/posts`, { params })
      .pipe(
        tap(response => {
          if (page === 1) {
            this._groupPosts.set(response.data);
          } else {
            this._groupPosts.update(posts => [...posts, ...response.data]);
          }
        })
      );
  }

  /**
   * Create group post
   */
  createGroupPost(groupId: string, content: string, mediaFiles?: File[], type: string = 'text'): Observable<GroupPost> {
    const formData = new FormData();
    formData.append('content', content);
    formData.append('type', type);

    if (mediaFiles?.length) {
      mediaFiles.forEach((file, index) => {
        formData.append(`media_${index}`, file);
      });
    }

    return this.http.post<ApiResponse<GroupPost>>(`${this.apiUrl}/${groupId}/posts`, formData)
      .pipe(
        map(response => response.data!),
        tap(post => {
          this._groupPosts.update(posts => [post, ...posts]);
          this.notificationService.success('Post created successfully!');
        })
      );
  }

  /**
   * Get join requests for group
   */
  getJoinRequests(groupId: string): Observable<GroupJoinRequest[]> {
    return this.http.get<ApiResponse<GroupJoinRequest[]>>(`${this.apiUrl}/${groupId}/join-requests`)
      .pipe(map(response => response.data || []));
  }

  /**
   * Approve join request
   */
  approveJoinRequest(groupId: string, requestId: string): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${groupId}/join-requests/${requestId}/approve`, {})
      .pipe(
        map(() => void 0),
        tap(() => {
          this.notificationService.success('Join request approved!');
        })
      );
  }

  /**
   * Reject join request
   */
  rejectJoinRequest(groupId: string, requestId: string): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${groupId}/join-requests/${requestId}/reject`, {})
      .pipe(
        map(() => void 0),
        tap(() => {
          this.notificationService.success('Join request rejected!');
        })
      );
  }

  /**
   * Send group invitation
   */
  sendInvitation(groupId: string, userId: string, message?: string): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${groupId}/invitations`, { userId, message })
      .pipe(
        map(() => void 0),
        tap(() => {
          this.notificationService.success('Invitation sent successfully!');
        })
      );
  }

  /**
   * Get group events
   */
  getGroupEvents(groupId: string): Observable<GroupEvent[]> {
    return this.http.get<ApiResponse<GroupEvent[]>>(`${this.apiUrl}/${groupId}/events`)
      .pipe(map(response => response.data || []));
  }

  /**
   * Get group discussions
   */
  getGroupDiscussions(groupId: string): Observable<GroupDiscussion[]> {
    return this.http.get<ApiResponse<GroupDiscussion[]>>(`${this.apiUrl}/${groupId}/discussions`)
      .pipe(map(response => response.data || []));
  }

  /**
   * Report group content
   */
  reportContent(groupId: string, targetType: string, targetId: string, reason: string, description: string): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${groupId}/reports`, {
      targetType,
      targetId,
      reason,
      description
    }).pipe(
      map(() => void 0),
      tap(() => {
        this.notificationService.success('Report submitted successfully!');
      })
    );
  }

  /**
   * Get group reports (for moderators)
   */
  getGroupReports(groupId: string): Observable<GroupReport[]> {
    return this.http.get<ApiResponse<GroupReport[]>>(`${this.apiUrl}/${groupId}/reports`)
      .pipe(map(response => response.data || []));
  }

  /**
   * Check if user can manage group
   */
  canManageGroup(group: Group): boolean {
    const currentUser = this.authService.currentUser();
    if (!currentUser) return false;

    return group.ownerId === currentUser.id || group.moderatorIds.includes(currentUser.id);
  }

  /**
   * Check if user is group member
   */
  isGroupMember(groupId: string): boolean {
    return this._userGroups().some(group => group.id === groupId);
  }

  /**
   * Get group categories
   */
  getGroupCategories(): Observable<string[]> {
    return this.http.get<ApiResponse<string[]>>(`${this.apiUrl}/categories`)
      .pipe(map(response => response.data || []));
  }

  /**
   * Get popular groups
   */
  getPopularGroups(limit: number = 10): Observable<Group[]> {
    const params = new HttpParams().set('limit', limit.toString());

    return this.http.get<ApiResponse<Group[]>>(`${this.apiUrl}/popular`, { params })
      .pipe(map(response => response.data || []));
  }

  /**
   * Get recommended groups
   */
  getRecommendedGroups(limit: number = 10): Observable<Group[]> {
    const params = new HttpParams().set('limit', limit.toString());

    return this.http.get<ApiResponse<Group[]>>(`${this.apiUrl}/recommended`, { params })
      .pipe(map(response => response.data || []));
  }
}