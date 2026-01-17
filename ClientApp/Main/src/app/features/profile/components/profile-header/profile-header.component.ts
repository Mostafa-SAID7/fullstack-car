import { Component, Input, Output, EventEmitter, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfile, ConnectionStatus } from '../../../../core/models/user-profile.model';
import { UserProfileService } from '../../../../core/services/user-profile.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.css']
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