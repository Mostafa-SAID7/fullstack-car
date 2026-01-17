import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, catchError, of } from 'rxjs';
import { 
  UserProfile, 
  ConnectionStatus, 
  UpdateProfileRequest, 
  UpdatePrivacySettingsRequest,
  BlockUserRequest,
  ReportUserRequest
} from '../../../../core/models/user-profile.model';
import { UserProfileService } from '../../../../core/services/user-profile.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ProfileHeaderComponent } from '../../components/profile-header/profile-header.component';
import { ProfileEditComponent } from '../../components/profile-edit/profile-edit.component';
import { PrivacySettingsComponent } from '../../components/privacy-settings/privacy-settings.component';
import { ConnectionsListComponent } from '../../components/connections-list/connections-list.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    ProfileHeaderComponent,
    ProfileEditComponent,
    PrivacySettingsComponent,
    ConnectionsListComponent
  ],
  template: `
    <div class="min-h-screen bg-background">
      <!-- Loading State -->
      <div *ngIf="isLoading()" class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
      
      <!-- Error State -->
      <div *ngIf="error()" class="flex items-center justify-center min-h-screen">
        <div class="text-center max-w-md">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-exclamation-triangle text-red-500 text-xl"></i>
          </div>
          <h2 class="text-xl font-bold mb-2">Profile Not Found</h2>
          <p class="text-muted-foreground mb-6">{{ error() }}</p>
          <button
            (click)="goBack()"
            class="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors">
            Go Back
          </button>
        </div>
      </div>
      
      <!-- Profile Content -->
      <div *ngIf="profile() && !isLoading()" class="pb-8">
        <!-- Profile Header -->
        <app-profile-header
          [profile]="profile()"
          [connectionStatus]="connectionStatus()"
          (editProfile)="showEditProfile()"
          (profileImageEdit)="showProfileImageUpload()"
          (coverImageEdit)="showCoverImageUpload()"
          (sendFriendRequest)="sendFriendRequest()"
          (acceptFriendRequest)="acceptFriendRequest()"
          (removeFriend)="removeFriend()"
          (followUser)="followUser()"
          (unfollowUser)="unfollowUser()"
          (blockUser)="showBlockUserDialog()"
          (reportUser)="showReportUserDialog()"
          (shareProfile)="shareProfile()"
          (viewConnections)="showConnections($event)">
        </app-profile-header>
        
        <!-- Profile Content Tabs -->
        <div class="max-w-6xl mx-auto px-4 mt-8">
          <!-- Tab Navigation -->
          <div class="flex gap-1 mb-8 bg-secondary/30 p-1 rounded-2xl w-fit">
            <button
              *ngFor="let tab of profileTabs"
              (click)="setActiveTab(tab.id)"
              [class]="getTabClasses(tab.id)"
              class="px-6 py-2.5 rounded-xl font-medium text-sm transition-all">
              <i [class]="tab.icon + ' mr-2'"></i>
              {{ tab.label }}
            </button>
          </div>
          
          <!-- Tab Content -->
          <div [ngSwitch]="activeTab()">
            <!-- Posts Tab -->
            <div *ngSwitchCase="'posts'" class="space-y-6">
              <div class="text-center py-12">
                <div class="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <i class="fas fa-file-alt text-muted-foreground text-xl"></i>
                </div>
                <h3 class="text-lg font-semibold mb-2">Posts Coming Soon</h3>
                <p class="text-muted-foreground">User posts will be displayed here.</p>
              </div>
            </div>
            
            <!-- About Tab -->
            <div *ngSwitchCase="'about'" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Basic Information -->
              <div class="bg-card border border-border rounded-2xl p-6">
                <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                  <i class="fas fa-user text-primary"></i>
                  Basic Information
                </h3>
                
                <div class="space-y-4">
                  <div *ngIf="profile()?.bio" class="flex gap-3">
                    <i class="fas fa-quote-left text-muted-foreground mt-1"></i>
                    <div>
                      <p class="text-sm text-muted-foreground">Bio</p>
                      <p class="font-medium">{{ profile()?.bio }}</p>
                    </div>
                  </div>
                  
                  <div *ngIf="profile()?.location" class="flex gap-3">
                    <i class="fas fa-map-marker-alt text-muted-foreground mt-1"></i>
                    <div>
                      <p class="text-sm text-muted-foreground">Location</p>
                      <p class="font-medium">{{ profile()?.location }}</p>
                    </div>
                  </div>
                  
                  <div *ngIf="profile()?.website" class="flex gap-3">
                    <i class="fas fa-globe text-muted-foreground mt-1"></i>
                    <div>
                      <p class="text-sm text-muted-foreground">Website</p>
                      <a [href]="profile()?.website" target="_blank" 
                         class="font-medium text-primary hover:underline">
                        {{ profile()?.website }}
                      </a>
                    </div>
                  </div>
                  
                  <div class="flex gap-3">
                    <i class="fas fa-calendar text-muted-foreground mt-1"></i>
                    <div>
                      <p class="text-sm text-muted-foreground">Joined</p>
                      <p class="font-medium">{{ formatJoinDate(profile()?.joinedAt) }}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Activity Stats -->
              <div class="bg-card border border-border rounded-2xl p-6">
                <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                  <i class="fas fa-chart-line text-primary"></i>
                  Activity Stats
                </h3>
                
                <div class="grid grid-cols-2 gap-4">
                  <div class="text-center p-4 bg-secondary/30 rounded-xl">
                    <div class="text-2xl font-bold text-primary">{{ profile()?.postsCount || 0 }}</div>
                    <div class="text-sm text-muted-foreground">Posts</div>
                  </div>
                  
                  <div class="text-center p-4 bg-secondary/30 rounded-xl">
                    <div class="text-2xl font-bold text-blue-500">{{ profile()?.friendsCount || 0 }}</div>
                    <div class="text-sm text-muted-foreground">Friends</div>
                  </div>
                  
                  <div class="text-center p-4 bg-secondary/30 rounded-xl">
                    <div class="text-2xl font-bold text-green-500">{{ profile()?.followersCount || 0 }}</div>
                    <div class="text-sm text-muted-foreground">Followers</div>
                  </div>
                  
                  <div class="text-center p-4 bg-secondary/30 rounded-xl">
                    <div class="text-2xl font-bold text-purple-500">{{ profile()?.followingCount || 0 }}</div>
                    <div class="text-sm text-muted-foreground">Following</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Friends Tab -->
            <div *ngSwitchCase="'friends'" class="space-y-6">
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-bold">Friends ({{ profile()?.friendsCount || 0 }})</h3>
                <button
                  (click)="showConnections('friends')"
                  class="px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors">
                  View All
                </button>
              </div>
              
              <!-- Friends preview will be implemented here -->
              <div class="text-center py-12">
                <div class="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <i class="fas fa-users text-muted-foreground text-xl"></i>
                </div>
                <h3 class="text-lg font-semibold mb-2">Friends Preview</h3>
                <p class="text-muted-foreground">Click "View All" to see all friends.</p>
              </div>
            </div>
            
            <!-- Media Tab -->
            <div *ngSwitchCase="'media'" class="space-y-6">
              <div class="text-center py-12">
                <div class="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <i class="fas fa-photo-video text-muted-foreground text-xl"></i>
                </div>
                <h3 class="text-lg font-semibold mb-2">Media Coming Soon</h3>
                <p class="text-muted-foreground">User media will be displayed here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Modals -->
      
      <!-- Edit Profile Modal -->
      <app-profile-edit
        *ngIf="showEditProfileModal()"
        [profile]="profile()"
        (save)="updateProfile($event)"
        (cancel)="hideEditProfile()"
        (profileImageUpload)="uploadProfileImage($event)"
        (coverImageUpload)="uploadCoverImage($event)">
      </app-profile-edit>
      
      <!-- Privacy Settings Modal -->
      <app-privacy-settings
        *ngIf="showPrivacySettingsModal()"
        [privacySettings]="profile()?.privacySettings || null"
        (save)="updatePrivacySettings($event)"
        (cancel)="hidePrivacySettings()">
      </app-privacy-settings>
      
      <!-- Connections Modal -->
      <app-connections-list
        *ngIf="showConnectionsModal()"
        [connectionType]="activeConnectionType()"
        [userId]="isOwnProfile() ? undefined : profile()?.id"
        (close)="hideConnections()"
        (viewProfile)="navigateToProfile($event)"
        (sendMessage)="sendMessage($event)"
        (blockUser)="blockUser($event)"
        (reportUser)="reportUser($event)">
      </app-connections-list>
      
      <!-- Block User Confirmation -->
      <div *ngIf="showBlockDialog()" 
           class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-card border border-border rounded-2xl p-6 w-full max-w-md">
          <h3 class="text-lg font-semibold mb-4">Block User</h3>
          <p class="text-muted-foreground mb-6">
            Are you sure you want to block {{ profile()?.firstName }} {{ profile()?.lastName }}? 
            They won't be able to see your profile or contact you.
          </p>
          
          <div class="flex gap-3">
            <button
              (click)="hideBlockUserDialog()"
              class="flex-1 px-4 py-2.5 text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </button>
            <button
              (click)="confirmBlockUser()"
              class="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors">
              Block User
            </button>
          </div>
        </div>
      </div>
      
      <!-- Report User Modal -->
      <div *ngIf="showReportDialog()" 
           class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-card border border-border rounded-2xl p-6 w-full max-w-md">
          <h3 class="text-lg font-semibold mb-4">Report User</h3>
          <p class="text-muted-foreground mb-4">
            Why are you reporting {{ profile()?.firstName }} {{ profile()?.lastName }}?
          </p>
          
          <div class="space-y-2 mb-6">
            <label *ngFor="let reason of reportReasons" 
                   class="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
              <input type="radio" [(ngModel)]="selectedReportReason" [value]="reason.value" 
                     class="w-4 h-4 text-primary">
              <div>
                <div class="font-medium">{{ reason.label }}</div>
                <div class="text-sm text-muted-foreground">{{ reason.description }}</div>
              </div>
            </label>
          </div>
          
          <div class="flex gap-3">
            <button
              (click)="hideReportUserDialog()"
              class="flex-1 px-4 py-2.5 text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </button>
            <button
              (click)="confirmReportUser()"
              [disabled]="!selectedReportReason"
              class="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Report User
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfilePageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userProfileService = inject(UserProfileService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  
  // State
  profile = signal<UserProfile | null>(null);
  connectionStatus = signal<ConnectionStatus | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  
  // UI State
  activeTab = signal<string>('posts');
  showEditProfileModal = signal<boolean>(false);
  showPrivacySettingsModal = signal<boolean>(false);
  showConnectionsModal = signal<boolean>(false);
  activeConnectionType = signal<'friends' | 'followers' | 'following'>('friends');
  showBlockDialog = signal<boolean>(false);
  showReportDialog = signal<boolean>(false);
  selectedReportReason = signal<string>('');
  
  // Profile tabs
  profileTabs = [
    { id: 'posts', label: 'Posts', icon: 'fas fa-file-alt' },
    { id: 'about', label: 'About', icon: 'fas fa-info-circle' },
    { id: 'friends', label: 'Friends', icon: 'fas fa-users' },
    { id: 'media', label: 'Media', icon: 'fas fa-photo-video' }
  ];
  
  // Report reasons
  reportReasons = [
    { value: 'spam', label: 'Spam', description: 'Unwanted commercial content or repetitive posts' },
    { value: 'harassment', label: 'Harassment', description: 'Bullying, threats, or abusive behavior' },
    { value: 'inappropriate-content', label: 'Inappropriate Content', description: 'Content that violates community guidelines' },
    { value: 'fake-account', label: 'Fake Account', description: 'Impersonation or fake profile' },
    { value: 'other', label: 'Other', description: 'Other reason not listed above' }
  ];
  
  // Computed values
  isOwnProfile = computed(() => {
    const currentUser = this.authService.currentUser();
    return currentUser && this.profile() && currentUser.id === this.profile()?.id;
  });
  
  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        const userId = params['id'];
        if (userId) {
          return this.userProfileService.getProfile(userId);
        } else {
          return this.userProfileService.getCurrentProfile();
        }
      }),
      catchError(error => {
        this.error.set(error.message || 'Failed to load profile');
        return of(null);
      })
    ).subscribe(profile => {
      if (profile) {
        this.profile.set(profile);
        this.connectionStatus.set(profile.connectionStatus || null);
      }
      this.isLoading.set(false);
    });
  }
  
  // Tab management
  setActiveTab(tabId: string): void {
    this.activeTab.set(tabId);
  }
  
  getTabClasses(tabId: string): string {
    const isActive = this.activeTab() === tabId;
    return isActive 
      ? 'bg-primary text-white shadow-lg' 
      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50';
  }
  
  // Profile editing
  showEditProfile(): void {
    this.showEditProfileModal.set(true);
  }
  
  hideEditProfile(): void {
    this.showEditProfileModal.set(false);
  }
  
  updateProfile(request: UpdateProfileRequest): void {
    this.userProfileService.updateProfile(request).subscribe({
      next: (updatedProfile) => {
        this.profile.set(updatedProfile);
        this.hideEditProfile();
      },
      error: () => {
        // Error handling is done in the service
      }
    });
  }
  
  uploadProfileImage(file: File): void {
    this.userProfileService.uploadProfileImage(file).subscribe({
      next: () => {
        // Profile is updated in the service
        this.userProfileService.getCurrentProfile().subscribe(profile => {
          this.profile.set(profile);
        });
      }
    });
  }
  
  uploadCoverImage(file: File): void {
    this.userProfileService.uploadCoverImage(file).subscribe({
      next: () => {
        // Profile is updated in the service
        this.userProfileService.getCurrentProfile().subscribe(profile => {
          this.profile.set(profile);
        });
      }
    });
  }
  
  // Privacy settings
  showPrivacySettings(): void {
    this.showPrivacySettingsModal.set(true);
  }
  
  hidePrivacySettings(): void {
    this.showPrivacySettingsModal.set(false);
  }
  
  updatePrivacySettings(request: UpdatePrivacySettingsRequest): void {
    this.userProfileService.updatePrivacySettings(request).subscribe({
      next: (updatedProfile) => {
        this.profile.set(updatedProfile);
        this.hidePrivacySettings();
      }
    });
  }
  
  // Connections
  showConnections(type: 'friends' | 'followers' | 'following'): void {
    this.activeConnectionType.set(type);
    this.showConnectionsModal.set(true);
  }
  
  hideConnections(): void {
    this.showConnectionsModal.set(false);
  }
  
  navigateToProfile(userId: string): void {
    this.hideConnections();
    this.router.navigate(['/profile', userId]);
  }
  
  sendMessage(userId: string): void {
    // Navigate to messaging or open message modal
    this.toastService.info('Messaging feature coming soon');
  }
  
  // Social actions
  sendFriendRequest(): void {
    const profileId = this.profile()?.id;
    if (profileId) {
      this.userProfileService.sendFriendRequest(profileId).subscribe({
        next: () => {
          // Update connection status
          this.connectionStatus.update(status => ({
            ...status!,
            friendRequestSent: true
          }));
        }
      });
    }
  }
  
  acceptFriendRequest(): void {
    // This would need the request ID, which should be available in the connection status
    this.toastService.info('Friend request accepted');
  }
  
  removeFriend(): void {
    const profileId = this.profile()?.id;
    if (profileId && confirm('Are you sure you want to remove this friend?')) {
      this.userProfileService.removeFriend(profileId).subscribe({
        next: () => {
          this.connectionStatus.update(status => ({
            ...status!,
            isFriend: false
          }));
        }
      });
    }
  }
  
  followUser(): void {
    const profileId = this.profile()?.id;
    if (profileId) {
      this.userProfileService.followUser(profileId).subscribe({
        next: () => {
          this.connectionStatus.update(status => ({
            ...status!,
            isFollowing: true
          }));
        }
      });
    }
  }
  
  unfollowUser(): void {
    const profileId = this.profile()?.id;
    if (profileId) {
      this.userProfileService.unfollowUser(profileId).subscribe({
        next: () => {
          this.connectionStatus.update(status => ({
            ...status!,
            isFollowing: false
          }));
        }
      });
    }
  }
  
  // Block user
  showBlockUserDialog(): void {
    this.showBlockDialog.set(true);
  }
  
  hideBlockUserDialog(): void {
    this.showBlockDialog.set(false);
  }
  
  confirmBlockUser(): void {
    const profileId = this.profile()?.id;
    if (profileId) {
      const request: BlockUserRequest = {
        userId: profileId,
        reason: 'User blocked from profile'
      };
      
      this.userProfileService.blockUser(request).subscribe({
        next: () => {
          this.hideBlockUserDialog();
          this.router.navigate(['/']);
        }
      });
    }
  }
  
  blockUser(userId: string): void {
    const request: BlockUserRequest = {
      userId,
      reason: 'User blocked from connections'
    };
    
    this.userProfileService.blockUser(request).subscribe();
  }
  
  // Report user
  showReportUserDialog(): void {
    this.showReportDialog.set(true);
  }
  
  hideReportUserDialog(): void {
    this.showReportDialog.set(false);
    this.selectedReportReason.set('');
  }
  
  confirmReportUser(): void {
    const profileId = this.profile()?.id;
    const reason = this.selectedReportReason();
    
    if (profileId && reason) {
      const request: ReportUserRequest = {
        userId: profileId,
        reason: reason as any,
        description: `User reported from profile page`
      };
      
      this.userProfileService.reportUser(request).subscribe({
        next: () => {
          this.hideReportUserDialog();
        }
      });
    }
  }
  
  reportUser(userId: string): void {
    const request: ReportUserRequest = {
      userId,
      reason: 'other',
      description: 'User reported from connections'
    };
    
    this.userProfileService.reportUser(request).subscribe();
  }
  
  // Profile image uploads
  showProfileImageUpload(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        this.uploadProfileImage(file);
      }
    };
    input.click();
  }
  
  showCoverImageUpload(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        this.uploadCoverImage(file);
      }
    };
    input.click();
  }
  
  // Share profile
  shareProfile(): void {
    const profile = this.profile();
    if (profile) {
      const url = `${window.location.origin}/profile/${profile.id}`;
      const text = `Check out ${profile.firstName} ${profile.lastName}'s profile`;
      
      if (navigator.share) {
        navigator.share({
          title: `${profile.firstName} ${profile.lastName}`,
          text,
          url
        });
      } else {
        navigator.clipboard.writeText(url).then(() => {
          this.toastService.success('Profile link copied to clipboard');
        });
      }
    }
  }
  
  // Helper methods
  formatJoinDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  }
  
  goBack(): void {
    this.router.navigate(['/']);
  }
}