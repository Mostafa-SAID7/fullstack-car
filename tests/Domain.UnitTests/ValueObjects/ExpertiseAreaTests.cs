using Domain.ValueObjects.Community;
using FluentAssertions;
using Xunit;

namespace Domain.UnitTests.ValueObjects
{
    public class ExpertiseAreaTests
    {
        [Fact]
        public void ExpertiseArea_Constructor_SetsPropertiesCorrectly()
        {
            // Arrange
            var category = "Technology";
            var displayName = "Web Development";
            var answerCount = 15;
            var acceptedAnswerCount = 10;
            var averageRating = 4.5m;
            var responseRate = 85.5m;
            var isVerified = true;

            // Act
            var expertiseArea = new ExpertiseArea(
                category, displayName, answerCount, acceptedAnswerCount, 
                averageRating, responseRate, isVerified);

            // Assert
            expertiseArea.Category.Should().Be(category);
            expertiseArea.DisplayName.Should().Be(displayName);
            expertiseArea.AnswerCount.Should().Be(answerCount);
            expertiseArea.AcceptedAnswerCount.Should().Be(acceptedAnswerCount);
            expertiseArea.AverageRating.Should().Be(averageRating);
            expertiseArea.ResponseRate.Should().Be(responseRate);
            expertiseArea.IsVerified.Should().Be(isVerified);
            expertiseArea.LastActivity.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
        }

        [Fact]
        public void ExpertiseArea_DefaultConstructor_SetsDefaultValues()
        {
            // Arrange
            var category = "Database Design";
            var displayName = "SQL Server";

            // Act
            var expertiseArea = new ExpertiseArea(category, displayName);

            // Assert
            expertiseArea.Category.Should().Be(category);
            expertiseArea.DisplayName.Should().Be(displayName);
            expertiseArea.AnswerCount.Should().Be(0);
            expertiseArea.AcceptedAnswerCount.Should().Be(0);
            expertiseArea.AverageRating.Should().Be(0m);
            expertiseArea.ResponseRate.Should().Be(0m);
            expertiseArea.IsVerified.Should().BeFalse();
        }

        [Fact]
        public void UpdateStats_ReturnsNewInstanceWithUpdatedStats()
        {
            // Arrange
            var originalArea = new ExpertiseArea("Technology", "Web Development", 5, 3, 4.0m, 60.0m);
            var newAnswerCount = 15;
            var newAcceptedCount = 10;
            var newRating = 4.5m;
            var newResponseRate = 85.0m;

            // Act
            var updatedArea = originalArea.UpdateStats(newAnswerCount, newAcceptedCount, newRating, newResponseRate);

            // Assert
            updatedArea.Should().NotBeSameAs(originalArea);
            updatedArea.Category.Should().Be(originalArea.Category);
            updatedArea.DisplayName.Should().Be(originalArea.DisplayName);
            updatedArea.AnswerCount.Should().Be(newAnswerCount);
            updatedArea.AcceptedAnswerCount.Should().Be(newAcceptedCount);
            updatedArea.AverageRating.Should().Be(newRating);
            updatedArea.ResponseRate.Should().Be(newResponseRate);
            updatedArea.IsVerified.Should().Be(originalArea.IsVerified);
        }

        [Fact]
        public void MarkAsVerified_ReturnsNewInstanceWithVerifiedStatus()
        {
            // Arrange
            var originalArea = new ExpertiseArea("Technology", "Web Development", 15, 10, 4.5m, 85.0m, false);

            // Act
            var verifiedArea = originalArea.MarkAsVerified();

            // Assert
            verifiedArea.Should().NotBeSameAs(originalArea);
            verifiedArea.IsVerified.Should().BeTrue();
            verifiedArea.Category.Should().Be(originalArea.Category);
            verifiedArea.DisplayName.Should().Be(originalArea.DisplayName);
            verifiedArea.AnswerCount.Should().Be(originalArea.AnswerCount);
            verifiedArea.AcceptedAnswerCount.Should().Be(originalArea.AcceptedAnswerCount);
            verifiedArea.AverageRating.Should().Be(originalArea.AverageRating);
            verifiedArea.ResponseRate.Should().Be(originalArea.ResponseRate);
        }

        [Theory]
        [InlineData(10, 4.0, 70.0, true)]  // Meets all criteria
        [InlineData(15, 4.5, 85.0, true)]  // Exceeds all criteria
        [InlineData(9, 4.0, 70.0, false)]  // Below accepted answer threshold
        [InlineData(10, 3.9, 70.0, false)] // Below rating threshold
        [InlineData(10, 4.0, 69.0, false)] // Below response rate threshold
        [InlineData(5, 3.5, 50.0, false)]  // Below all thresholds
        public void IsExpertLevel_ReturnsCorrectValue(
            int acceptedAnswerCount, decimal averageRating, decimal responseRate, bool expectedResult)
        {
            // Arrange
            var expertiseArea = new ExpertiseArea(
                "Technology", "Web Development", 20, acceptedAnswerCount, averageRating, responseRate);

            // Act
            var result = expertiseArea.IsExpertLevel;

            // Assert
            result.Should().Be(expectedResult);
        }

        [Theory]
        [InlineData(50, 4.5, 85.0, true)]  // Meets all criteria
        [InlineData(100, 4.8, 95.0, true)] // Exceeds all criteria
        [InlineData(49, 4.5, 85.0, false)] // Below accepted answer threshold
        [InlineData(50, 4.4, 85.0, false)] // Below rating threshold
        [InlineData(50, 4.5, 84.0, false)] // Below response rate threshold
        [InlineData(25, 4.0, 70.0, false)] // Below all thresholds
        public void IsMasterLevel_ReturnsCorrectValue(
            int acceptedAnswerCount, decimal averageRating, decimal responseRate, bool expectedResult)
        {
            // Arrange
            var expertiseArea = new ExpertiseArea(
                "Technology", "Web Development", 100, acceptedAnswerCount, averageRating, responseRate);

            // Act
            var result = expertiseArea.IsMasterLevel;

            // Assert
            result.Should().Be(expectedResult);
        }

        [Fact]
        public void ExpertiseArea_Equality_SameCategoryAndDisplayName_AreEqual()
        {
            // Arrange
            var area1 = new ExpertiseArea("Technology", "Web Development", 10, 5, 4.0m, 70.0m);
            var area2 = new ExpertiseArea("Technology", "Web Development", 15, 8, 4.5m, 80.0m);

            // Act & Assert
            area1.Should().Be(area2);
            area1.GetHashCode().Should().Be(area2.GetHashCode());
        }

        [Fact]
        public void ExpertiseArea_Equality_DifferentCategory_AreNotEqual()
        {
            // Arrange
            var area1 = new ExpertiseArea("Technology", "Web Development");
            var area2 = new ExpertiseArea("Database Design", "Web Development");

            // Act & Assert
            area1.Should().NotBe(area2);
        }

        [Fact]
        public void ExpertiseArea_Equality_DifferentDisplayName_AreNotEqual()
        {
            // Arrange
            var area1 = new ExpertiseArea("Technology", "Web Development");
            var area2 = new ExpertiseArea("Technology", "Mobile Development");

            // Act & Assert
            area1.Should().NotBe(area2);
        }

        [Fact]
        public void ExpertiseArea_Constructor_NullCategory_ThrowsException()
        {
            // Arrange
            string? category = null;
            var displayName = "Web Development";

            // Act & Assert
            var action = () => new ExpertiseArea(category!, displayName);
            action.Should().Throw<ArgumentNullException>()
                .WithParameterName("category");
        }

        [Fact]
        public void ExpertiseArea_Constructor_NullDisplayName_ThrowsException()
        {
            // Arrange
            var category = "Technology";
            string? displayName = null;

            // Act & Assert
            var action = () => new ExpertiseArea(category, displayName!);
            action.Should().Throw<ArgumentNullException>()
                .WithParameterName("displayName");
        }
    }
}