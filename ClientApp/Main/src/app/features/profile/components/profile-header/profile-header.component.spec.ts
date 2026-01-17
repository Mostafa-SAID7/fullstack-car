import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileHeaderComponent } from './profile-header.component';
import { UserProfileService } from '../../../../core/services/user-profile.service';
import { AuthService } from '../../../../core/services/auth.service';
import { UserProfile, ConnectionStatus } from '../../../../core/models/user-profile.model';
import { signal } from '@angular/core';

describe('ProfileHeaderComponent', () => {
  let component: ProfileHeaderComponent;
  let fixture: ComponentFixture<ProfileHeaderComponent>;
  let mockUserProfileService: any;
  let mockAuthService: any;

  const mockProfile: UserProfile = {
    id: 'test-user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    bio: 'Test user profile',
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
  };

  const mockConnectionStatus: ConnectionStatus = {
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

  beforeEach(async () => {
    const userProfileServiceSpy = {
      getCurrentProfile: () => Promise.resolve(mockProfile)
    };
    
    const authServiceSpy = {
      currentUser: signal({ 
        id: 'current-user-id', 
        firstName: 'Current', 
        lastName: 'User', 
        email: 'current@example.com', 
        roles: [],
        isActive: true,
        isEmailConfirmed: true,
        status: 1,
        createdAt: '2023-01-01T00:00:00Z'
      })
    };

    await TestBed.configureTestingModule({
      imports: [ProfileHeaderComponent],
      providers: [
        { provide: UserProfileService, useValue: userProfileServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileHeaderComponent);
    component = fixture.componentInstance;
    mockUserProfileService = TestBed.inject(UserProfileService) as any;
    mockAuthService = TestBed.inject(AuthService) as any;

    // Set up component inputs
    component.profile = mockProfile;
    component.connectionStatus = mockConnectionStatus;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user profile information', () => {
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('John Doe');
    expect(compiled.textContent).toContain('San Francisco, CA');
    expect(compiled.textContent).toContain('Test user profile');
  });

  it('should show verification badge for verified users', () => {
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const verificationBadge = compiled.querySelector('[class*="verified"]');
    expect(verificationBadge).toBeTruthy();
  });

  it('should display correct stats', () => {
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('45'); // posts count
    expect(compiled.textContent).toContain('234'); // friends count
    expect(compiled.textContent).toContain('1.3K'); // followers count (formatted)
    expect(compiled.textContent).toContain('890'); // following count
  });

  it('should emit editProfile event when edit button is clicked', () => {
    const emitSpy = spyOn(component.editProfile, 'emit');
    
    component.onEditProfile();
    
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit sendFriendRequest event when add friend button is clicked', () => {
    const emitSpy = spyOn(component.sendFriendRequest, 'emit');
    
    component.onSendFriendRequest();
    
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit followUser event when follow button is clicked', () => {
    const emitSpy = spyOn(component.followUser, 'emit');
    
    component.onFollowUser();
    
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should format numbers correctly', () => {
    expect(component.formatNumber(1250)).toBe('1.3K');
    expect(component.formatNumber(1000000)).toBe('1.0M');
    expect(component.formatNumber(500)).toBe('500');
  });

  it('should format join date correctly', () => {
    const formattedDate = component.formatJoinDate('2023-01-15T00:00:00Z');
    expect(formattedDate).toBe('Jan 2023');
  });

  it('should determine if profile is own profile correctly', () => {
    // Create a new signal with the same ID as the profile
    const currentUserSignal = signal({ 
      id: 'test-user-1', 
      firstName: 'John', 
      lastName: 'Doe', 
      email: 'john.doe@example.com', 
      roles: [],
      isActive: true,
      isEmailConfirmed: true,
      status: 1,
      createdAt: '2023-01-01T00:00:00Z'
    });
    
    // Mock the authService currentUser signal
    mockAuthService.currentUser = currentUserSignal;
    
    fixture.detectChanges();
    
    expect(component.isOwnProfile()).toBe(true);
  });

  it('should show online status when appropriate', () => {
    expect(component.shouldShowOnlineStatus()).toBe(true);
  });
});