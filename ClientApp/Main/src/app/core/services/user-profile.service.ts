import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, finalize, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  UserProfile,
  UpdateProfileRequest,
  UpdatePrivacySettingsRequest,
  UpdatePreferencesRequest,
  SocialConnection,
  FollowRequest,
  UserSearchResult,
  ProfileActivity,
  ProfileStats,
  BlockUserRequest,
  ReportUserRequest
} from '../../features/profile/models/user-profile.model';
import { PaginatedResult } from '../models/result.model';
import { ToastService } from './toast.service';
import { LoadingService } from '../../shared/services/loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private loadingService = inject(LoadingService);

  private readonly apiUrl = `${environment.apiUrl}/api/profile`;

  // Reactive state
  private currentProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentProfile$ = this.currentProfileSubject.asObservable();

  private connectionsSubject = new BehaviorSubject<SocialConnection[]>([]);
  public connections$ = this.connectionsSubject.asObservable();

  private followRequestsSubject = new BehaviorSubject<FollowRequest[]>([]);
  public followRequests$ = this.followRequestsSubject.asObservable();

  // Signals for reactive UI
  currentProfile = signal<UserProfile | null>(null);
  isLoading = signal<boolean>(false);

  // Computed values
  isProfileComplete = computed(() => {
    const profile = this.currentProfile();
    return profile && profile.bio && profile.location && profile.profileImageUrl;
  });

  constructor() {
    // Subscribe to profile changes
    this.currentProfile$.subscribe(profile => {
      this.currentProfile.set(profile);
    });
  }

  // Profile Management
  getCurrentProfile(): Observable<UserProfile> {
    this.isLoading.set(true);

    return this.http.get<UserProfile>(`${this.apiUrl}/me`).pipe(
      tap(profile => {
        this.currentProfileSubject.next(profile);
      }),
      catchError(error => {
        this.toastService.error('Failed to load profile', error.message);
        return throwError(() => error);
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  getProfile(userId: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${userId}`).pipe(
      catchError(error => {
        this.toastService.error('Failed to load user profile', error.message);
        return throwError(() => error);
      })
    );
  }

  updateProfile(request: UpdateProfileRequest): Observable<UserProfile> {
    this.loadingService.show('update-profile', 'Updating profile...');

    return this.http.put<UserProfile>(`${this.apiUrl}/me`, request).pipe(
      tap(profile => {
        this.currentProfileSubject.next(profile);
        this.toastService.success('Profile updated successfully');
      }),
      catchError(error => {
        this.toastService.error('Failed to update profile', error.message);
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide('update-profile'))
    );
  }

  updatePrivacySettings(request: UpdatePrivacySettingsRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/me/privacy`, request).pipe(
      tap(profile => {
        this.currentProfileSubject.next(profile);
        this.toastService.success('Privacy settings updated');
      }),
      catchError(error => {
        this.toastService.error('Failed to update privacy settings', error.message);
        return throwError(() => error);
      })
    );
  }

  updatePreferences(request: UpdatePreferencesRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/me/preferences`, request).pipe(
      tap(profile => {
        this.currentProfileSubject.next(profile);
        this.toastService.success('Preferences updated');
      }),
      catchError(error => {
        this.toastService.error('Failed to update preferences', error.message);
        return throwError(() => error);
      })
    );
  }

  uploadProfileImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);

    this.loadingService.show('upload-image', 'Uploading image...');

    return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/me/image`, formData).pipe(
      tap(response => {
        const currentProfile = this.currentProfileSubject.value;
        if (currentProfile) {
          currentProfile.profileImageUrl = response.imageUrl;
          this.currentProfileSubject.next(currentProfile);
        }
        this.toastService.success('Profile image updated');
      }),
      catchError(error => {
        this.toastService.error('Failed to upload image', error.message);
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide('upload-image'))
    );
  }

  uploadCoverImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);

    this.loadingService.show('upload-cover', 'Uploading cover image...');

    return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/me/cover`, formData).pipe(
      tap(response => {
        const currentProfile = this.currentProfileSubject.value;
        if (currentProfile) {
          currentProfile.coverImageUrl = response.imageUrl;
          this.currentProfileSubject.next(currentProfile);
        }
        this.toastService.success('Cover image updated');
      }),
      catchError(error => {
        this.toastService.error('Failed to upload cover image', error.message);
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide('upload-cover'))
    );
  }

  // Social Connections
  getConnections(type: 'friends' | 'followers' | 'following', pageNumber: number = 1, pageSize: number = 20): Observable<PaginatedResult<SocialConnection>> {
    const params = new HttpParams()
      .set('type', type)
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedResult<SocialConnection>>(`${this.apiUrl}/me/connections`, { params }).pipe(
      tap(result => {
        if (type === 'friends') {
          this.connectionsSubject.next(result.items);
        }
      }),
      catchError(error => {
        this.toastService.error(`Failed to load ${type}`, error.message);
        return throwError(() => error);
      })
    );
  }

  getUserConnections(userId: string, type: 'friends' | 'followers' | 'following', pageNumber: number = 1, pageSize: number = 20): Observable<PaginatedResult<SocialConnection>> {
    const params = new HttpParams()
      .set('type', type)
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedResult<SocialConnection>>(`${this.apiUrl}/${userId}/connections`, { params }).pipe(
      catchError(error => {
        this.toastService.error(`Failed to load user ${type}`, error.message);
        return throwError(() => error);
      })
    );
  }

  // Friend System
  sendFriendRequest(userId: string, message?: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/friends/request`, { userId, message }).pipe(
      tap(() => {
        this.toastService.success('Friend request sent');
      }),
      catchError(error => {
        this.toastService.error('Failed to send friend request', error.message);
        return throwError(() => error);
      })
    );
  }

  acceptFriendRequest(requestId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/friends/accept/${requestId}`, {}).pipe(
      tap(() => {
        this.toastService.success('Friend request accepted');
        this.refreshFriendRequests();
      }),
      catchError(error => {
        this.toastService.error('Failed to accept friend request', error.message);
        return throwError(() => error);
      })
    );
  }

  declineFriendRequest(requestId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/friends/decline/${requestId}`, {}).pipe(
      tap(() => {
        this.toastService.success('Friend request declined');
        this.refreshFriendRequests();
      }),
      catchError(error => {
        this.toastService.error('Failed to decline friend request', error.message);
        return throwError(() => error);
      })
    );
  }

  removeFriend(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/friends/${userId}`).pipe(
      tap(() => {
        this.toastService.success('Friend removed');
        this.refreshConnections();
      }),
      catchError(error => {
        this.toastService.error('Failed to remove friend', error.message);
        return throwError(() => error);
      })
    );
  }

  // Follow System
  followUser(userId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/follow/${userId}`, {}).pipe(
      tap(() => {
        this.toastService.success('User followed');
      }),
      catchError(error => {
        this.toastService.error('Failed to follow user', error.message);
        return throwError(() => error);
      })
    );
  }

  unfollowUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/follow/${userId}`).pipe(
      tap(() => {
        this.toastService.success('User unfollowed');
      }),
      catchError(error => {
        this.toastService.error('Failed to unfollow user', error.message);
        return throwError(() => error);
      })
    );
  }

  getFollowRequests(pageNumber: number = 1, pageSize: number = 20): Observable<PaginatedResult<FollowRequest>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedResult<FollowRequest>>(`${this.apiUrl}/follow/requests`, { params }).pipe(
      tap(result => {
        this.followRequestsSubject.next(result.items);
      }),
      catchError(error => {
        this.toastService.error('Failed to load follow requests', error.message);
        return throwError(() => error);
      })
    );
  }

  // User Search and Discovery
  searchUsers(query: string, pageNumber: number = 1, pageSize: number = 20): Observable<PaginatedResult<UserSearchResult>> {
    const params = new HttpParams()
      .set('query', query)
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedResult<UserSearchResult>>(`${this.apiUrl}/search`, { params }).pipe(
      catchError(error => {
        this.toastService.error('Failed to search users', error.message);
        return throwError(() => error);
      })
    );
  }

  getSuggestedUsers(pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<UserSearchResult>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedResult<UserSearchResult>>(`${this.apiUrl}/suggestions`, { params }).pipe(
      catchError(error => {
        this.toastService.error('Failed to load suggested users', error.message);
        return throwError(() => error);
      })
    );
  }

  // Profile Activity
  getProfileActivity(userId?: string, pageNumber: number = 1, pageSize: number = 20): Observable<PaginatedResult<ProfileActivity>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    const url = userId ? `${this.apiUrl}/${userId}/activity` : `${this.apiUrl}/me/activity`;

    return this.http.get<PaginatedResult<ProfileActivity>>(url, { params }).pipe(
      catchError(error => {
        this.toastService.error('Failed to load activity', error.message);
        return throwError(() => error);
      })
    );
  }

  getProfileStats(userId?: string): Observable<ProfileStats> {
    const url = userId ? `${this.apiUrl}/${userId}/stats` : `${this.apiUrl}/me/stats`;

    return this.http.get<ProfileStats>(url).pipe(
      catchError(error => {
        this.toastService.error('Failed to load profile stats', error.message);
        return throwError(() => error);
      })
    );
  }

  // Blocking and Reporting
  blockUser(request: BlockUserRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/block`, request).pipe(
      tap(() => {
        this.toastService.success('User blocked');
      }),
      catchError(error => {
        this.toastService.error('Failed to block user', error.message);
        return throwError(() => error);
      })
    );
  }

  unblockUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/block/${userId}`).pipe(
      tap(() => {
        this.toastService.success('User unblocked');
      }),
      catchError(error => {
        this.toastService.error('Failed to unblock user', error.message);
        return throwError(() => error);
      })
    );
  }

  reportUser(request: ReportUserRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/report`, request).pipe(
      tap(() => {
        this.toastService.success('User reported');
      }),
      catchError(error => {
        this.toastService.error('Failed to report user', error.message);
        return throwError(() => error);
      })
    );
  }

  // Helper methods
  private refreshConnections(): void {
    this.getConnections('friends').subscribe();
  }

  private refreshFriendRequests(): void {
    // Refresh friend requests from the friend service
    // This would typically be handled by the existing FriendService
  }

  /**
   * Get the current user profile (helper for backward compatibility)
   */
  getCurrentUser(): UserProfile | null {
    return this.currentProfile();
  }
}