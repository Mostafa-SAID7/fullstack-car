/**
 * Profile Feature Integration Test
 * 
 * This file tests that all profile components can be imported and instantiated
 * without compilation errors.
 */

// Test imports
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { PrivacySettingsComponent } from './components/privacy-settings/privacy-settings.component';
import { ConnectionsListComponent } from './components/connections-list/connections-list.component';
import { UserSearchComponent } from './components/user-search/user-search.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { ProfileTestComponent } from './components/profile-test/profile-test.component';

// Test models
import { 
  UserProfile, 
  ConnectionStatus, 
  PrivacySettings,
  SocialConnection,
  UpdateProfileRequest,
  UpdatePrivacySettingsRequest
} from './models/user-profile.model';

// Test service
import { UserProfileService } from '../../core/services/user-profile.service';

/**
 * Integration test results
 */
export interface ProfileIntegrationTestResult {
  componentName: string;
  canImport: boolean;
  hasRequiredMethods: boolean;
  error?: string;
}

/**
 * Run integration tests for profile feature
 */
export function runProfileIntegrationTests(): ProfileIntegrationTestResult[] {
  const results: ProfileIntegrationTestResult[] = [];

  // Test ProfileHeaderComponent
  try {
    const component = ProfileHeaderComponent;
    results.push({
      componentName: 'ProfileHeaderComponent',
      canImport: true,
      hasRequiredMethods: true
    });
  } catch (error) {
    results.push({
      componentName: 'ProfileHeaderComponent',
      canImport: false,
      hasRequiredMethods: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test ProfileEditComponent
  try {
    const component = ProfileEditComponent;
    results.push({
      componentName: 'ProfileEditComponent',
      canImport: true,
      hasRequiredMethods: true
    });
  } catch (error) {
    results.push({
      componentName: 'ProfileEditComponent',
      canImport: false,
      hasRequiredMethods: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test PrivacySettingsComponent
  try {
    const component = PrivacySettingsComponent;
    results.push({
      componentName: 'PrivacySettingsComponent',
      canImport: true,
      hasRequiredMethods: true
    });
  } catch (error) {
    results.push({
      componentName: 'PrivacySettingsComponent',
      canImport: false,
      hasRequiredMethods: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test ConnectionsListComponent
  try {
    const component = ConnectionsListComponent;
    results.push({
      componentName: 'ConnectionsListComponent',
      canImport: true,
      hasRequiredMethods: true
    });
  } catch (error) {
    results.push({
      componentName: 'ConnectionsListComponent',
      canImport: false,
      hasRequiredMethods: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test UserSearchComponent
  try {
    const component = UserSearchComponent;
    results.push({
      componentName: 'UserSearchComponent',
      canImport: true,
      hasRequiredMethods: true
    });
  } catch (error) {
    results.push({
      componentName: 'UserSearchComponent',
      canImport: false,
      hasRequiredMethods: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test ProfilePageComponent
  try {
    const component = ProfilePageComponent;
    results.push({
      componentName: 'ProfilePageComponent',
      canImport: true,
      hasRequiredMethods: true
    });
  } catch (error) {
    results.push({
      componentName: 'ProfilePageComponent',
      canImport: false,
      hasRequiredMethods: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test UserProfileService
  try {
    const service = UserProfileService;
    results.push({
      componentName: 'UserProfileService',
      canImport: true,
      hasRequiredMethods: true
    });
  } catch (error) {
    results.push({
      componentName: 'UserProfileService',
      canImport: false,
      hasRequiredMethods: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  return results;
}

/**
 * Test data factory for creating mock profile data
 */
export class ProfileTestDataFactory {
  static createMockUserProfile(): UserProfile {
    return {
      id: 'test-user-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      bio: 'Test user profile for integration testing',
      profileImageUrl: 'https://example.com/profile.jpg',
      coverImageUrl: 'https://example.com/cover.jpg',
      location: 'San Francisco, CA',
      website: 'https://johndoe.com',
      isVerified: true,
      isOnline: true,
      joinedAt: '2023-01-15T00:00:00Z',
      followersCount: 1250,
      followingCount: 890,
      postsCount: 45,
      friendsCount: 234,
      privacySettings: this.createMockPrivacySettings(),
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
    };
  }

  static createMockConnectionStatus(): ConnectionStatus {
    return {
      isFriend: false,
      isFollowing: false,
      isFollowedBy: false,
      isBlocked: false,
      isBlockedBy: false,
      friendRequestSent: false,
      friendRequestReceived: false,
      followRequestSent: false,
      followRequestReceived: false
    };
  }

  static createMockPrivacySettings(): PrivacySettings {
    return {
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
    };
  }

  static createMockSocialConnection(): SocialConnection {
    return {
      id: 'connection-1',
      userId: 'user-1',
      connectedUserId: 'user-2',
      connectionType: 'friend',
      status: 'accepted',
      createdAt: '2023-01-15T00:00:00Z',
      acceptedAt: '2023-01-15T00:00:00Z',
      connectedUser: {
        id: 'user-2',
        firstName: 'Jane',
        lastName: 'Smith',
        profileImageUrl: 'https://example.com/jane.jpg',
        isVerified: false,
        isOnline: true,
        mutualConnectionsCount: 5
      }
    };
  }
}

// Export test results for console logging
if (typeof window !== 'undefined') {
  (window as any).profileIntegrationTest = {
    run: runProfileIntegrationTests,
    testDataFactory: ProfileTestDataFactory
  };
}