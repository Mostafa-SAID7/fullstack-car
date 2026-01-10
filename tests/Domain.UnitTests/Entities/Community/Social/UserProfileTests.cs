using Domain.Entities.Community.Social;
using Domain.ValueObjects.Community.Social;
using Domain.Enums.Community.Social;
using Domain.Exceptions;
using FluentAssertions;
using Xunit;

namespace Domain.UnitTests.Entities.Community.Social
{
    public class UserProfileTests
    {
        private readonly Guid _userId = Guid.NewGuid();

        [Fact]
        public void Create_WithValidData_ShouldCreateUserProfile()
        {
            // Arrange
            var bio = "This is my bio";
            var location = "New York";
            var website = "https://example.com";
            var dateOfBirth = new DateTime(1990, 1, 1);

            // Act
            var profile = UserProfile.Create(_userId, bio, location, website, dateOfBirth);

            // Assert
            profile.Should().NotBeNull();
            profile.UserId.Should().Be(_userId);
            profile.ProfileInfo.Bio.Should().Be(bio);
            profile.ProfileInfo.Location.Should().Be(location);
            profile.ProfileInfo.Website.Should().Be(website);
            profile.ProfileInfo.DateOfBirth.Should().Be(dateOfBirth.Date);
            profile.IsPrivateProfile.Should().BeFalse();
            profile.FollowersCount.Should().Be(0);
            profile.FollowingCount.Should().Be(0);
            profile.PostsCount.Should().Be(0);
        }

        [Fact]
        public void Create_WithPrivateProfile_ShouldSetPrivacyCorrectly()
        {
            // Arrange & Act
            var profile = UserProfile.Create(_userId, "Bio", isPrivateProfile: true);

            // Assert
            profile.IsPrivateProfile.Should().BeTrue();
        }

        [Fact]
        public void UpdateBio_WithValidBio_ShouldUpdateSuccessfully()
        {
            // Arrange
            var profile = UserProfile.Create(_userId, "Original bio");
            var newBio = "Updated bio";

            // Act
            profile.UpdateBio(newBio);

            // Assert
            profile.ProfileInfo.Bio.Should().Be(newBio);
            profile.UpdatedAt.Should().NotBeNull();
        }

        [Fact]
        public void UpdateLocation_WithValidLocation_ShouldUpdateSuccessfully()
        {
            // Arrange
            var profile = UserProfile.Create(_userId, "Bio");
            var newLocation = "San Francisco";

            // Act
            profile.UpdateLocation(newLocation);

            // Assert
            profile.ProfileInfo.Location.Should().Be(newLocation);
        }

        [Fact]
        public void SetPrivateProfile_WhenChangingPrivacy_ShouldUpdateCorrectly()
        {
            // Arrange
            var profile = UserProfile.Create(_userId, "Bio", isPrivateProfile: false);

            // Act
            profile.SetPrivateProfile(true);

            // Assert
            profile.IsPrivateProfile.Should().BeTrue();
            profile.PrivacySettings.ProfileVisibility.Should().Be(PrivacyLevel.Private);
        }

        [Fact]
        public void IncrementFollowersCount_ShouldIncreaseCount()
        {
            // Arrange
            var profile = UserProfile.Create(_userId, "Bio");
            var initialCount = profile.FollowersCount;

            // Act
            profile.IncrementFollowersCount();

            // Assert
            profile.FollowersCount.Should().Be(initialCount + 1);
        }

        [Fact]
        public void DecrementFollowersCount_WhenCountIsZero_ShouldRemainZero()
        {
            // Arrange
            var profile = UserProfile.Create(_userId, "Bio");

            // Act
            profile.DecrementFollowersCount();

            // Assert
            profile.FollowersCount.Should().Be(0);
        }

        [Fact]
        public void DecrementFollowersCount_WhenCountIsPositive_ShouldDecrease()
        {
            // Arrange
            var profile = UserProfile.Create(_userId, "Bio");
            profile.IncrementFollowersCount();
            profile.IncrementFollowersCount();

            // Act
            profile.DecrementFollowersCount();

            // Assert
            profile.FollowersCount.Should().Be(1);
        }

        [Fact]
        public void CanViewProfile_WhenOwner_ShouldReturnTrue()
        {
            // Arrange
            var profile = UserProfile.Create(_userId, "Bio", isPrivateProfile: true);

            // Act
            var canView = profile.CanViewProfile(_userId);

            // Assert
            canView.Should().BeTrue();
        }

        [Fact]
        public void CanViewProfile_WhenPublicProfile_ShouldReturnTrue()
        {
            // Arrange
            var profile = UserProfile.Create(_userId, "Bio", isPrivateProfile: false);
            var viewerId = Guid.NewGuid();

            // Act
            var canView = profile.CanViewProfile(viewerId);

            // Assert
            canView.Should().BeTrue();
        }

        [Fact]
        public void CanViewProfile_WhenPrivateProfileAndNotFriend_ShouldReturnFalse()
        {
            // Arrange
            var profile = UserProfile.Create(_userId, "Bio", isPrivateProfile: true);
            var viewerId = Guid.NewGuid();

            // Act
            var canView = profile.CanViewProfile(viewerId, isViewerFriend: false);

            // Assert
            canView.Should().BeFalse();
        }

        [Fact]
        public void CanViewProfile_WhenPrivateProfileAndIsFriend_ShouldReturnTrue()
        {
            // Arrange
            var profile = UserProfile.Create(_userId, "Bio", isPrivateProfile: true);
            var viewerId = Guid.NewGuid();

            // Act
            var canView = profile.CanViewProfile(viewerId, isViewerFriend: true);

            // Assert
            canView.Should().BeTrue();
        }

        [Fact]
        public void CanSendDirectMessage_ToSelf_ShouldReturnFalse()
        {
            // Arrange
            var profile = UserProfile.Create(_userId, "Bio");

            // Act
            var canSend = profile.CanSendDirectMessage(_userId);

            // Assert
            canSend.Should().BeFalse();
        }

        [Fact]
        public void CanSendDirectMessage_WhenDirectMessagesDisabled_ShouldReturnFalse()
        {
            // Arrange
            var profile = UserProfile.Create(_userId, "Bio");
            var privacySettings = profile.PrivacySettings.UpdateDirectMessageSettings(false);
            profile.UpdatePrivacySettings(privacySettings);
            var senderId = Guid.NewGuid();

            // Act
            var canSend = profile.CanSendDirectMessage(senderId);

            // Assert
            canSend.Should().BeFalse();
        }

        [Fact]
        public void CanSendDirectMessage_WhenAllowed_ShouldReturnTrue()
        {
            // Arrange
            var profile = UserProfile.Create(_userId, "Bio");
            var senderId = Guid.NewGuid();

            // Act
            var canSend = profile.CanSendDirectMessage(senderId);

            // Assert
            canSend.Should().BeTrue();
        }

        [Fact]
        public void GetAge_WithValidDateOfBirth_ShouldCalculateCorrectly()
        {
            // Arrange
            var dateOfBirth = DateTime.Today.AddYears(-25);
            var profile = UserProfile.Create(_userId, "Bio", dateOfBirth: dateOfBirth);

            // Act
            var age = profile.GetAge();

            // Assert
            age.Should().Be(25);
        }

        [Fact]
        public void GetAge_WithoutDateOfBirth_ShouldReturnNull()
        {
            // Arrange
            var profile = UserProfile.Create(_userId, "Bio");

            // Act
            var age = profile.GetAge();

            // Assert
            age.Should().BeNull();
        }

        [Fact]
        public void IsActive_WhenRecentlyActive_ShouldReturnTrue()
        {
            // Arrange
            var profile = UserProfile.Create(_userId, "Bio");
            profile.UpdateLastActiveAt();

            // Act
            var isActive = profile.IsActive();

            // Assert
            isActive.Should().BeTrue();
        }

        [Fact]
        public void IsOnline_WhenRecentlyActive_ShouldReturnTrue()
        {
            // Arrange
            var profile = UserProfile.Create(_userId, "Bio");
            profile.UpdateLastActiveAt();

            // Act
            var isOnline = profile.IsOnline();

            // Assert
            isOnline.Should().BeTrue();
        }

        [Fact]
        public void UpdateLastActiveAt_ShouldUpdateTimestamp()
        {
            // Arrange
            var profile = UserProfile.Create(_userId, "Bio");
            var originalTime = profile.LastActiveAt;

            // Act
            Thread.Sleep(10); // Small delay to ensure different timestamp
            profile.UpdateLastActiveAt();

            // Assert
            profile.LastActiveAt.Should().BeAfter(originalTime!.Value);
        }
    }
}