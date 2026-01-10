using Domain.Base;
using Domain.Entities.Identity;
using Domain.ValueObjects.Community.Social;
using Domain.DomainEvents.Community;
using Domain.Enums.Community.Social;
using Domain.Exceptions;
using NotificationType = Domain.Enums.Community.Social.NotificationType;

namespace Domain.Entities.Community.Social
{
    public class UserProfile : BaseEntity
    {
        public Guid UserId { get; private set; }
        public ProfileInformation ProfileInfo { get; private set; }
        public ProfilePrivacySettings PrivacySettings { get; private set; }
        public NotificationPreferences NotificationPreferences { get; private set; }
        public bool IsPrivateProfile { get; private set; }
        public DateTime? LastActiveAt { get; private set; }
        public int FollowersCount { get; private set; }
        public int FollowingCount { get; private set; }
        public int PostsCount { get; private set; }

        // Navigation Properties
        public virtual ApplicationUser User { get; private set; } = null!;

        private UserProfile() 
        {
            ProfileInfo = ProfileInformation.CreateEmpty();
            PrivacySettings = ProfilePrivacySettings.CreateDefault();
            NotificationPreferences = NotificationPreferences.CreateDefault();
        }

        public UserProfile(
            Guid userId,
            ProfileInformation profileInfo,
            ProfilePrivacySettings? privacySettings = null,
            NotificationPreferences? notificationPreferences = null,
            bool isPrivateProfile = false)
        {
            UserId = userId;
            ProfileInfo = profileInfo ?? throw new ArgumentNullException(nameof(profileInfo));
            PrivacySettings = privacySettings ?? ProfilePrivacySettings.CreateDefault();
            NotificationPreferences = notificationPreferences ?? NotificationPreferences.CreateDefault();
            IsPrivateProfile = isPrivateProfile;
            LastActiveAt = DateTime.UtcNow;
            FollowersCount = 0;
            FollowingCount = 0;
            PostsCount = 0;

            AddDomainEvent(new UserProfileCreatedEvent(Id, UserId));
        }

        public static UserProfile Create(
            Guid userId,
            string bio,
            string? location = null,
            string? website = null,
            DateTime? dateOfBirth = null,
            bool isPrivateProfile = false)
        {
            var profileInfo = new ProfileInformation(bio, location, website, dateOfBirth);
            return new UserProfile(userId, profileInfo, isPrivateProfile: isPrivateProfile);
        }

        public void UpdateProfileInformation(ProfileInformation profileInfo)
        {
            if (profileInfo == null)
                throw new ArgumentNullException(nameof(profileInfo));

            var oldProfileInfo = ProfileInfo;
            ProfileInfo = profileInfo;
            UpdatedAt = DateTime.UtcNow;

            AddDomainEvent(new UserProfileUpdatedEvent(Id, UserId, oldProfileInfo, profileInfo));
        }

        public void UpdateBio(string bio)
        {
            var updatedProfileInfo = ProfileInfo.UpdateBio(bio);
            UpdateProfileInformation(updatedProfileInfo);
        }

        public void UpdateLocation(string? location)
        {
            var updatedProfileInfo = ProfileInfo.UpdateLocation(location);
            UpdateProfileInformation(updatedProfileInfo);
        }

        public void UpdateWebsite(string? website)
        {
            var updatedProfileInfo = ProfileInfo.UpdateWebsite(website);
            UpdateProfileInformation(updatedProfileInfo);
        }

        public void UpdateDateOfBirth(DateTime? dateOfBirth)
        {
            var updatedProfileInfo = ProfileInfo.UpdateDateOfBirth(dateOfBirth);
            UpdateProfileInformation(updatedProfileInfo);
        }

        public void UpdateProfileImage(string? profileImageUrl)
        {
            var updatedProfileInfo = ProfileInfo.UpdateProfileImage(profileImageUrl);
            UpdateProfileInformation(updatedProfileInfo);
        }

        public void UpdateCoverImage(string? coverImageUrl)
        {
            var updatedProfileInfo = ProfileInfo.UpdateCoverImage(coverImageUrl);
            UpdateProfileInformation(updatedProfileInfo);
        }

        public void UpdatePrivacySettings(ProfilePrivacySettings privacySettings)
        {
            if (privacySettings == null)
                throw new ArgumentNullException(nameof(privacySettings));

            var oldPrivacySettings = PrivacySettings;
            PrivacySettings = privacySettings;
            UpdatedAt = DateTime.UtcNow;

            AddDomainEvent(new UserPrivacySettingsUpdatedEvent(Id, UserId, oldPrivacySettings, privacySettings));
        }

        public void UpdateNotificationPreferences(NotificationPreferences notificationPreferences)
        {
            if (notificationPreferences == null)
                throw new ArgumentNullException(nameof(notificationPreferences));

            var oldNotificationPreferences = NotificationPreferences;
            NotificationPreferences = notificationPreferences;
            UpdatedAt = DateTime.UtcNow;

            AddDomainEvent(new UserNotificationPreferencesUpdatedEvent(Id, UserId, oldNotificationPreferences, notificationPreferences));
        }

        public void SetPrivateProfile(bool isPrivate)
        {
            if (IsPrivateProfile == isPrivate)
                return;

            IsPrivateProfile = isPrivate;
            UpdatedAt = DateTime.UtcNow;

            // Update privacy settings to match profile privacy
            if (isPrivate)
            {
                PrivacySettings = ProfilePrivacySettings.CreatePrivate();
            }

            AddDomainEvent(new UserProfilePrivacyChangedEvent(Id, UserId, isPrivate));
        }

        public void UpdateLastActiveAt()
        {
            LastActiveAt = DateTime.UtcNow;
        }

        public void IncrementFollowersCount()
        {
            FollowersCount++;
            UpdatedAt = DateTime.UtcNow;
        }

        public void DecrementFollowersCount()
        {
            if (FollowersCount > 0)
            {
                FollowersCount--;
                UpdatedAt = DateTime.UtcNow;
            }
        }

        public void IncrementFollowingCount()
        {
            FollowingCount++;
            UpdatedAt = DateTime.UtcNow;
        }

        public void DecrementFollowingCount()
        {
            if (FollowingCount > 0)
            {
                FollowingCount--;
                UpdatedAt = DateTime.UtcNow;
            }
        }

        public void IncrementPostsCount()
        {
            PostsCount++;
            UpdatedAt = DateTime.UtcNow;
        }

        public void DecrementPostsCount()
        {
            if (PostsCount > 0)
            {
                PostsCount--;
                UpdatedAt = DateTime.UtcNow;
            }
        }

        public bool CanViewProfile(Guid? viewerId, bool isViewerFriend = false)
        {
            // Owner can always view their own profile
            if (viewerId == UserId)
                return true;

            // Check privacy settings
            return PrivacySettings.ProfileVisibility switch
            {
                PrivacyLevel.Public => true,
                PrivacyLevel.Friends => isViewerFriend,
                PrivacyLevel.Private => false,
                _ => false
            };
        }

        public bool CanViewPosts(Guid? viewerId, bool isViewerFriend = false)
        {
            // Owner can always view their own posts
            if (viewerId == UserId)
                return true;

            // Check privacy settings
            return PrivacySettings.PostsVisibility switch
            {
                PrivacyLevel.Public => true,
                PrivacyLevel.Friends => isViewerFriend,
                PrivacyLevel.Private => false,
                _ => false
            };
        }

        public bool CanViewFriendsList(Guid? viewerId, bool isViewerFriend = false)
        {
            // Owner can always view their own friends list
            if (viewerId == UserId)
                return true;

            // Check privacy settings
            return PrivacySettings.FriendsListVisibility switch
            {
                PrivacyLevel.Public => true,
                PrivacyLevel.Friends => isViewerFriend,
                PrivacyLevel.Private => false,
                _ => false
            };
        }

        public bool CanSendDirectMessage(Guid senderId, bool isSenderFriend = false)
        {
            // Can't send message to yourself
            if (senderId == UserId)
                return false;

            // Check if direct messages are allowed
            if (!PrivacySettings.AllowDirectMessages)
                return false;

            // If profile is private, only friends can send messages
            if (IsPrivateProfile && !isSenderFriend)
                return false;

            return true;
        }

        public bool CanTag(Guid taggerId, bool isTaggerFriend = false)
        {
            // Can't tag yourself
            if (taggerId == UserId)
                return false;

            // Check if tagging is allowed
            if (!PrivacySettings.AllowTagging)
                return false;

            // If profile is private, only friends can tag
            if (IsPrivateProfile && !isTaggerFriend)
                return false;

            return true;
        }

        public bool IsNotificationAllowed(NotificationType notificationType)
        {
            return NotificationPreferences.IsNotificationAllowed(notificationType, DateTime.UtcNow);
        }

        public void ValidateProfileCompleteness()
        {
            if (!ProfileInfo.IsProfileComplete())
            {
                throw new DomainException("Profile must have a bio, location, and profile image to be considered complete");
            }
        }

        public int? GetAge()
        {
            return ProfileInfo.GetAge();
        }

        public bool IsActive()
        {
            if (!LastActiveAt.HasValue)
                return false;

            // Consider user active if they were online in the last 30 days
            return LastActiveAt.Value > DateTime.UtcNow.AddDays(-30);
        }

        public bool IsOnline()
        {
            if (!LastActiveAt.HasValue)
                return false;

            // Consider user online if they were active in the last 15 minutes
            return LastActiveAt.Value > DateTime.UtcNow.AddMinutes(-15);
        }
    }
}