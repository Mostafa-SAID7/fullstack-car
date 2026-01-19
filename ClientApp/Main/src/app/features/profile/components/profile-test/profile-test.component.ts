import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfile, ConnectionStatus } from '../../models/user-profile.model';
import { UserProfileService } from '../../../../core/services/user-profile.service';
import { ProfileHeaderComponent } from '../profile-header/profile-header.component';

@Component({
  selector: 'app-profile-test',
  standalone: true,
  imports: [CommonModule, ProfileHeaderComponent],
  template: `
    <div class="p-8">
      <h1 class="text-2xl font-bold mb-6">Profile Components Test</h1>
      
      <!-- Test Profile Header -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Profile Header Component</h2>
        <app-profile-header
          [profile]="testProfile()"
          [connectionStatus]="testConnectionStatus()"
          (editProfile)="onEditProfile()"
          (sendFriendRequest)="onSendFriendRequest()"
          (followUser)="onFollowUser()"
          (shareProfile)="onShareProfile()">
        </app-profile-header>
      </div>
      
      <!-- Test Results -->
      <div class="bg-card border border-border rounded-xl p-6">
        <h3 class="text-lg font-semibold mb-4">Test Results</h3>
        <div class="space-y-2">
          <div *ngFor="let result of testResults()" 
               [class]="result.success ? 'text-green-600' : 'text-red-600'">
            {{ result.message }}
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileTestComponent implements OnInit {
  private userProfileService = inject(UserProfileService);
  
  testProfile = signal<UserProfile>({
    id: 'test-user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    bio: 'Test user profile for component testing',
    profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    coverImageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=300&fit=crop',
    location: 'San Francisco, CA',
    website: 'https://johndoe.com',
    isVerified: true,
    isOnline: true,
    joinedAt: '2023-01-15T00:00:00Z',
    followersCount: 1250,
    followingCount: 890,
    postsCount: 45,
    friendsCount: 234,
    privacySettings: {
      profileVisibility: 'public',
      emailVisibility: 'friends',
      phoneVisibility: 'private',
      locationVisibility: 'public',
      birthdateVisibility: 'friends',
      onlineStatusVisibility: 'public',
      allowFriendRequests: true,
      allowFollowing: true,
      allowDirectMessages: true,
      allowTagging: true,
      showActivityStatus: true,
      searchableByEmail: false,
      searchableByPhone: false
    },
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'America/Los_Angeles',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      marketingEmails: false,
      activityDigest: 'weekly',
      autoPlayVideos: true,
      showOnlineStatus: true
    }
  });
  
  testConnectionStatus = signal<ConnectionStatus>({
    isFriend: false,
    isFollowing: false,
    isFollowedBy: false,
    isBlocked: false,
    isBlockedBy: false,
    friendRequestSent: false,
    friendRequestReceived: false,
    followRequestSent: false,
    followRequestReceived: false
  });
  
  testResults = signal<Array<{message: string, success: boolean}>>([]);
  
  ngOnInit(): void {
    this.runTests();
  }
  
  private runTests(): void {
    const results: Array<{message: string, success: boolean}> = [];
    
    // Test 1: Profile data loading
    try {
      const profile = this.testProfile();
      if (profile && profile.firstName && profile.lastName) {
        results.push({ message: '✓ Profile data loaded successfully', success: true });
      } else {
        results.push({ message: '✗ Profile data loading failed', success: false });
      }
    } catch (error) {
      results.push({ message: '✗ Profile data loading error: ' + error, success: false });
    }
    
    // Test 2: Connection status
    try {
      const status = this.testConnectionStatus();
      if (status && typeof status.isFriend === 'boolean') {
        results.push({ message: '✓ Connection status initialized', success: true });
      } else {
        results.push({ message: '✗ Connection status initialization failed', success: false });
      }
    } catch (error) {
      results.push({ message: '✗ Connection status error: ' + error, success: false });
    }
    
    // Test 3: Profile service injection
    try {
      if (this.userProfileService) {
        results.push({ message: '✓ UserProfileService injected successfully', success: true });
      } else {
        results.push({ message: '✗ UserProfileService injection failed', success: false });
      }
    } catch (error) {
      results.push({ message: '✗ UserProfileService injection error: ' + error, success: false });
    }
    
    this.testResults.set(results);
  }
  
  // Event handlers for testing
  onEditProfile(): void {
    console.log('Edit profile clicked');
    this.addTestResult('Edit profile event triggered', true);
  }
  
  onSendFriendRequest(): void {
    console.log('Send friend request clicked');
    this.addTestResult('Send friend request event triggered', true);
  }
  
  onFollowUser(): void {
    console.log('Follow user clicked');
    this.addTestResult('Follow user event triggered', true);
  }
  
  onShareProfile(): void {
    console.log('Share profile clicked');
    this.addTestResult('Share profile event triggered', true);
  }
  
  private addTestResult(message: string, success: boolean): void {
    this.testResults.update(results => [
      ...results,
      { message: `✓ ${message}`, success }
    ]);
  }
}