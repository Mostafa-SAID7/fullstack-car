import { Component, Input, Output, EventEmitter, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfile, ConnectionStatus } from '../../../../core/models/user-profile.model';
import { UserProfileService } from '../../../../core/services/user-profile.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full">
      <!-- Cover Photo -->
      <div class="relative w-full h-64 sm:h-80 rounded-b-[2.5rem] overflow-hidden shadow-2xl border-b border-white/5">
        <div class="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-600/20 to-primary/20 flex items-center justify-center">
          <div 
            class="w-full h-full bg-cover bg-center"
            [style.background-image]="profile?.coverImageUrl ? 'url(' + profile?.coverImageUrl + ')' : 'url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1500)'">
          </div>
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        <!-- Cover Photo Edit Button (Own Profile) -->
        <div *ngIf="isOwnProfile()" class="absolute top-4 right-4">
          <button 
            (click)="onCoverImageEdit()"
            class="px-4 py-2 bg-black/40 backdrop-blur-md text-white rounded-xl text-sm font-medium hover:bg-black/60 transition-all flex items-center gap-2">
            <i class="fas fa-camera"></i>
            Edit Cover
          </button>
        </div>

        <!-- Profile Info Overlay -->
        <div class="absolute bottom-8 left-8 right-8 flex flex-col sm:flex-row items-center sm:items-end gap-6">
          <!-- Avatar -->
          <div class="relative">
            <div class="w-32 h-32 sm:w-40 sm:h-40 rounded-[2rem] bg-card border-4 border-background shadow-2xl overflow-hidden flex items-center justify-center group cursor-pointer transition-transform hover:scale-105 active:scale-95"
                 [class.cursor-default]="!isOwnProfile()">
              <img 
                *ngIf="profile?.profileImageUrl" 
                [src]="profile?.profileImageUrl"
                [alt]="profile?.firstName + ' ' + profile?.lastName"
                class="w-full h-full object-cover">
              <span 
                *ngIf="!profile?.profileImageUrl" 
                class="text-primary text-4xl font-black italic">
                {{ profile?.firstName?.[0] }}{{ profile?.lastName?.[0] }}
              </span>
              
              <!-- Edit Overlay (Own Profile) -->
              <div 
                *ngIf="isOwnProfile()"
                (click)="onProfileImageEdit()"
                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                <i class="fas fa-camera text-white text-2xl"></i>
              </div>
            </div>
            
            <!-- Online Status -->
            <div 
              *ngIf="profile?.isOnline && shouldShowOnlineStatus()"
              class="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-background shadow-lg shadow-emerald-500/20">
            </div>
            
            <!-- Verification Badge -->
            <div 
              *ngIf="profile?.isVerified"
              class="absolute -top-1 -right-1 w-8 h-8 bg-blue-500 rounded-full border-4 border-background shadow-lg flex items-center justify-center">
              <i class="fas fa-check text-white text-xs"></i>
            </div>
          </div>

          <!-- Name & Meta Info -->
          <div class="flex-1 text-center sm:text-left pb-2">
            <div class="flex items-center justify-center sm:justify-start gap-3 mb-2">
              <h1 class="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-lg">
                {{ profile?.firstName }} {{ profile?.lastName }}
              </h1>
              <span 
                *ngIf="profile?.isVerified"
                class="inline-flex items-center px-2 py-1 bg-blue-500/20 backdrop-blur-md text-blue-100 text-xs font-bold rounded-full">
                <i class="fas fa-check-circle mr-1"></i>
                Verified
              </span>
            </div>
            
            <div class="flex items-center justify-center sm:justify-start gap-4 text-white/80 font-bold text-sm mb-2">
              <span class="flex items-center gap-1.5">
                <i class="fas fa-calendar text-primary"></i> 
                Joined {{ formatJoinDate(profile?.joinedAt) }}
              </span>
              <span *ngIf="profile?.location" class="hidden sm:inline w-1 h-1 bg-white/40 rounded-full"></span>
              <span *ngIf="profile?.location" class="flex items-center gap-1.5">
                <i class="fas fa-map-marker-alt text-primary"></i> 
                {{ profile?.location }}
              </span>
            </div>
            
            <!-- Bio -->
            <p 
              *ngIf="profile?.bio" 
              class="text-white/90 text-sm max-w-md mx-auto sm:mx-0 leading-relaxed">
              {{ profile?.bio }}
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pb-2">
            <!-- Own Profile Actions -->
            <ng-container *ngIf="isOwnProfile()">
              <button
                (click)="onEditProfile()"
                class="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/30 hover:bg-primary/90 hover:-translate-y-0.5 active:scale-95 transition-all">
                Edit Profile
              </button>
            </ng-container>
            
            <!-- Other User Actions -->
            <ng-container *ngIf="!isOwnProfile() && profile">
              <!-- Friend Actions -->
              <button
                *ngIf="!connectionStatus?.isFriend && !connectionStatus?.friendRequestSent && !connectionStatus?.friendRequestReceived"
                (click)="onSendFriendRequest()"
                [disabled]="isLoading()"
                class="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/30 hover:bg-primary/90 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50">
                <i class="fas fa-user-plus mr-2"></i>
                Add Friend
              </button>
              
              <button
                *ngIf="connectionStatus?.friendRequestSent"
                disabled
                class="px-6 py-2.5 bg-gray-500 text-white rounded-xl font-bold text-sm opacity-50 cursor-not-allowed">
                <i class="fas fa-clock mr-2"></i>
                Request Sent
              </button>
              
              <button
                *ngIf="connectionStatus?.friendRequestReceived"
                (click)="onAcceptFriendRequest()"
                class="px-6 py-2.5 bg-green-500 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-green-600 hover:-translate-y-0.5 active:scale-95 transition-all">
                <i class="fas fa-check mr-2"></i>
                Accept Request
              </button>
              
              <button
                *ngIf="connectionStatus?.isFriend"
                (click)="onRemoveFriend()"
                class="px-6 py-2.5 bg-red-500 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-red-600 hover:-translate-y-0.5 active:scale-95 transition-all">
                <i class="fas fa-user-minus mr-2"></i>
                Remove Friend
              </button>
              
              <!-- Follow Actions -->
              <button
                *ngIf="!connectionStatus?.isFollowing"
                (click)="onFollowUser()"
                [disabled]="isLoading()"
                class="px-6 py-2.5 bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-blue-600 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50">
                <i class="fas fa-plus mr-2"></i>
                Follow
              </button>
              
              <button
                *ngIf="connectionStatus?.isFollowing"
                (click)="onUnfollowUser()"
                class="px-6 py-2.5 bg-gray-500 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-gray-600 hover:-translate-y-0.5 active:scale-95 transition-all">
                <i class="fas fa-check mr-2"></i>
                Following
              </button>
            </ng-container>
            
            <!-- More Actions Menu -->
            <div class="relative">
              <button
                (click)="toggleMoreMenu()"
                class="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-all flex items-center justify-center">
                <i class="fas fa-ellipsis-h"></i>
              </button>
              
              <!-- More Menu Dropdown -->
              <div 
                *ngIf="showMoreMenu()"
                class="absolute right-0 top-12 w-48 bg-card border border-border rounded-xl shadow-xl z-50 py-2">
                <button
                  (click)="onShareProfile()"
                  class="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center gap-3">
                  <i class="fas fa-share-alt text-muted-foreground"></i>
                  Share Profile
                </button>
                
                <ng-container *ngIf="!isOwnProfile()">
                  <button
                    (click)="onBlockUser()"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center gap-3 text-red-500">
                    <i class="fas fa-ban text-red-500"></i>
                    Block User
                  </button>
                  
                  <button
                    (click)="onReportUser()"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center gap-3 text-red-500">
                    <i class="fas fa-flag text-red-500"></i>
                    Report User
                  </button>
                </ng-container>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="grid grid-cols-4 gap-4 mt-6 max-w-2xl mx-auto px-4">
        <div class="bg-card/50 backdrop-blur-xl border border-border/40 p-4 rounded-2xl text-center shadow-lg hover:border-primary/20 transition-all group">
          <div class="text-xl font-black text-foreground group-hover:text-primary transition-colors">
            {{ formatNumber(profile?.postsCount || 0) }}
          </div>
          <div class="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Posts</div>
        </div>
        
        <div class="bg-card/50 backdrop-blur-xl border border-border/40 p-4 rounded-2xl text-center shadow-lg hover:border-primary/20 transition-all group cursor-pointer"
             (click)="onViewConnections('friends')">
          <div class="text-xl font-black text-foreground group-hover:text-primary transition-colors">
            {{ formatNumber(profile?.friendsCount || 0) }}
          </div>
          <div class="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Friends</div>
        </div>
        
        <div class="bg-card/50 backdrop-blur-xl border border-border/40 p-4 rounded-2xl text-center shadow-lg hover:border-primary/20 transition-all group cursor-pointer"
             (click)="onViewConnections('followers')">
          <div class="text-xl font-black text-foreground group-hover:text-primary transition-colors">
            {{ formatNumber(profile?.followersCount || 0) }}
          </div>
          <div class="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Followers</div>
        </div>
        
        <div class="bg-card/50 backdrop-blur-xl border border-border/40 p-4 rounded-2xl text-center shadow-lg hover:border-primary/20 transition-all group cursor-pointer"
             (click)="onViewConnections('following')">
          <div class="text-xl font-black text-foreground group-hover:text-primary transition-colors">
            {{ formatNumber(profile?.followingCount || 0) }}
          </div>
          <div class="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Following</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-header-gradient {
      background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%);
    }
  `]
})
export class ProfileHeaderComponent {
  @Input() profile: UserProfile | null = null;
  @Input() connectionStatus: ConnectionStatus | null = null;

  @Output() editProfile = new EventEmitter<void>();
  @Output() profileImageEdit = new EventEmitter<void>();
  @Output() coverImageEdit = new EventEmitter<void>();
  @Output() sendFriendRequest = new EventEmitter<void>();
  @Output() acceptFriendRequest = new EventEmitter<void>();
  @Output() removeFriend = new EventEmitter<void>();
  @Output() followUser = new EventEmitter<void>();
  @Output() unfollowUser = new EventEmitter<void>();
  @Output() blockUser = new EventEmitter<void>();
  @Output() reportUser = new EventEmitter<void>();
  @Output() shareProfile = new EventEmitter<void>();
  @Output() viewConnections = new EventEmitter<'friends' | 'followers' | 'following'>();

  private authService = inject(AuthService);
  private userProfileService = inject(UserProfileService);

  showMoreMenu = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  isOwnProfile = computed(() => {
    const currentUser = this.authService.currentUser();
    return currentUser && this.profile && currentUser.id === this.profile.id;
  });

  toggleMoreMenu(): void {
    this.showMoreMenu.update(show => !show);
  }

  shouldShowOnlineStatus(): boolean {
    if (this.isOwnProfile()) return true;
    if (!this.profile) return false;
    return this.profile.privacySettings.onlineStatusVisibility === 'public' ||
      (this.profile.privacySettings.onlineStatusVisibility === 'friends' && !!this.connectionStatus?.isFriend);
  }

  formatJoinDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  // Event handlers
  onEditProfile(): void {
    this.editProfile.emit();
  }

  onProfileImageEdit(): void {
    this.profileImageEdit.emit();
  }

  onCoverImageEdit(): void {
    this.coverImageEdit.emit();
  }

  onSendFriendRequest(): void {
    this.isLoading.set(true);
    this.sendFriendRequest.emit();
    // Loading will be reset by parent component
  }

  onAcceptFriendRequest(): void {
    this.acceptFriendRequest.emit();
  }

  onRemoveFriend(): void {
    this.removeFriend.emit();
  }

  onFollowUser(): void {
    this.isLoading.set(true);
    this.followUser.emit();
  }

  onUnfollowUser(): void {
    this.unfollowUser.emit();
  }

  onBlockUser(): void {
    this.showMoreMenu.set(false);
    this.blockUser.emit();
  }

  onReportUser(): void {
    this.showMoreMenu.set(false);
    this.reportUser.emit();
  }

  onShareProfile(): void {
    this.showMoreMenu.set(false);
    this.shareProfile.emit();
  }

  onViewConnections(type: 'friends' | 'followers' | 'following'): void {
    this.viewConnections.emit(type);
  }
}