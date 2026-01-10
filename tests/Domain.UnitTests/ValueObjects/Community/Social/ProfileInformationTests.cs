using Domain.ValueObjects.Community.Social;
using FluentAssertions;
using Xunit;

namespace Domain.UnitTests.ValueObjects.Community.Social
{
    public class ProfileInformationTests
    {
        [Fact]
        public void Constructor_WithValidData_ShouldCreateProfileInformation()
        {
            // Arrange
            var bio = "This is my bio";
            var location = "New York";
            var website = "https://example.com";
            var dateOfBirth = new DateTime(1990, 1, 1);
            var profileImageUrl = "https://example.com/profile.jpg";
            var coverImageUrl = "https://example.com/cover.jpg";

            // Act
            var profileInfo = new ProfileInformation(bio, location, website, dateOfBirth, profileImageUrl, coverImageUrl);

            // Assert
            profileInfo.Bio.Should().Be(bio);
            profileInfo.Location.Should().Be(location);
            profileInfo.Website.Should().Be(website);
            profileInfo.DateOfBirth.Should().Be(dateOfBirth.Date);
            profileInfo.ProfileImageUrl.Should().Be(profileImageUrl);
            profileInfo.CoverImageUrl.Should().Be(coverImageUrl);
        }

        [Fact]
        public void Constructor_WithEmptyBio_ShouldSetEmptyString()
        {
            // Act
            var profileInfo = new ProfileInformation("");

            // Assert
            profileInfo.Bio.Should().Be("");
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("   ")]
        public void Constructor_WithInvalidLocation_ShouldSetNull(string? location)
        {
            // Act
            var profileInfo = new ProfileInformation("Bio", location);

            // Assert
            profileInfo.Location.Should().BeNull();
        }

        [Fact]
        public void Constructor_WithBioTooLong_ShouldThrowException()
        {
            // Arrange
            var longBio = new string('a', 501);

            // Act & Assert
            Assert.Throws<ArgumentException>(() => new ProfileInformation(longBio));
        }

        [Fact]
        public void Constructor_WithLocationTooLong_ShouldThrowException()
        {
            // Arrange
            var longLocation = new string('a', 101);

            // Act & Assert
            Assert.Throws<ArgumentException>(() => new ProfileInformation("Bio", longLocation));
        }

        [Theory]
        [InlineData("example.com")]
        [InlineData("http://example.com")]
        [InlineData("https://example.com")]
        public void Constructor_WithValidWebsite_ShouldNormalizeUrl(string website)
        {
            // Act
            var profileInfo = new ProfileInformation("Bio", website: website);

            // Assert
            profileInfo.Website.Should().StartWith("https://");
        }

        [Theory]
        [InlineData("invalid-url")]
        [InlineData("ftp://example.com")]
        public void Constructor_WithInvalidWebsite_ShouldThrowException(string website)
        {
            // Act & Assert
            Assert.Throws<ArgumentException>(() => new ProfileInformation("Bio", website: website));
        }

        [Fact]
        public void Constructor_WithDateOfBirthTooOld_ShouldThrowException()
        {
            // Arrange
            var tooOldDate = DateTime.Today.AddYears(-121);

            // Act & Assert
            Assert.Throws<ArgumentException>(() => new ProfileInformation("Bio", dateOfBirth: tooOldDate));
        }

        [Fact]
        public void Constructor_WithDateOfBirthTooYoung_ShouldThrowException()
        {
            // Arrange
            var tooYoungDate = DateTime.Today.AddYears(-12);

            // Act & Assert
            Assert.Throws<ArgumentException>(() => new ProfileInformation("Bio", dateOfBirth: tooYoungDate));
        }

        [Fact]
        public void Constructor_WithInvalidImageUrl_ShouldThrowException()
        {
            // Act & Assert
            Assert.Throws<ArgumentException>(() => new ProfileInformation("Bio", profileImageUrl: "invalid-url"));
        }

        [Fact]
        public void UpdateBio_WithValidBio_ShouldReturnNewInstance()
        {
            // Arrange
            var originalProfileInfo = new ProfileInformation("Original bio");
            var newBio = "Updated bio";

            // Act
            var updatedProfileInfo = originalProfileInfo.UpdateBio(newBio);

            // Assert
            updatedProfileInfo.Bio.Should().Be(newBio);
            updatedProfileInfo.Should().NotBeSameAs(originalProfileInfo);
        }

        [Fact]
        public void UpdateLocation_WithValidLocation_ShouldReturnNewInstance()
        {
            // Arrange
            var originalProfileInfo = new ProfileInformation("Bio");
            var newLocation = "San Francisco";

            // Act
            var updatedProfileInfo = originalProfileInfo.UpdateLocation(newLocation);

            // Assert
            updatedProfileInfo.Location.Should().Be(newLocation);
            updatedProfileInfo.Should().NotBeSameAs(originalProfileInfo);
        }

        [Fact]
        public void GetAge_WithValidDateOfBirth_ShouldCalculateCorrectly()
        {
            // Arrange
            var dateOfBirth = DateTime.Today.AddYears(-25);
            var profileInfo = new ProfileInformation("Bio", dateOfBirth: dateOfBirth);

            // Act
            var age = profileInfo.GetAge();

            // Assert
            age.Should().Be(25);
        }

        [Fact]
        public void GetAge_WithoutDateOfBirth_ShouldReturnNull()
        {
            // Arrange
            var profileInfo = new ProfileInformation("Bio");

            // Act
            var age = profileInfo.GetAge();

            // Assert
            age.Should().BeNull();
        }

        [Fact]
        public void IsProfileComplete_WithAllRequiredFields_ShouldReturnTrue()
        {
            // Arrange
            var profileInfo = new ProfileInformation(
                "Bio", 
                "Location", 
                profileImageUrl: "https://example.com/profile.jpg");

            // Act
            var isComplete = profileInfo.IsProfileComplete();

            // Assert
            isComplete.Should().BeTrue();
        }

        [Fact]
        public void IsProfileComplete_WithMissingFields_ShouldReturnFalse()
        {
            // Arrange
            var profileInfo = new ProfileInformation("Bio");

            // Act
            var isComplete = profileInfo.IsProfileComplete();

            // Assert
            isComplete.Should().BeFalse();
        }

        [Fact]
        public void CreateEmpty_ShouldCreateEmptyProfileInformation()
        {
            // Act
            var profileInfo = ProfileInformation.CreateEmpty();

            // Assert
            profileInfo.Bio.Should().Be(string.Empty);
            profileInfo.Location.Should().BeNull();
            profileInfo.Website.Should().BeNull();
            profileInfo.DateOfBirth.Should().BeNull();
            profileInfo.ProfileImageUrl.Should().BeNull();
            profileInfo.CoverImageUrl.Should().BeNull();
        }

        [Fact]
        public void Equals_WithSameValues_ShouldReturnTrue()
        {
            // Arrange
            var profileInfo1 = new ProfileInformation("Bio", "Location");
            var profileInfo2 = new ProfileInformation("Bio", "Location");

            // Act & Assert
            profileInfo1.Should().Be(profileInfo2);
        }

        [Fact]
        public void Equals_WithDifferentValues_ShouldReturnFalse()
        {
            // Arrange
            var profileInfo1 = new ProfileInformation("Bio1", "Location");
            var profileInfo2 = new ProfileInformation("Bio2", "Location");

            // Act & Assert
            profileInfo1.Should().NotBe(profileInfo2);
        }
    }
}