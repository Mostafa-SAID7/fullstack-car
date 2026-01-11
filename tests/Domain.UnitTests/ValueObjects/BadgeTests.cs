using Domain.Enums.Community.QA;
using Domain.ValueObjects.Community;
using FluentAssertions;
using Xunit;

namespace Domain.UnitTests.ValueObjects
{
    public class BadgeTests
    {
        [Fact]
        public void Badge_Constructor_SetsPropertiesCorrectly()
        {
            // Arrange
            var badgeType = BadgeType.Helpful;
            var name = "Helpful";
            var description = "Received multiple upvotes for helpful answers";
            var iconUrl = "/badges/helpful.svg";
            var category = "Technology";

            // Act
            var badge = new Badge(badgeType, name, description, iconUrl, category);

            // Assert
            badge.Type.Should().Be(badgeType);
            badge.Name.Should().Be(name);
            badge.Description.Should().Be(description);
            badge.IconUrl.Should().Be(iconUrl);
            badge.Category.Should().Be(category);
            badge.EarnedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
        }

        [Fact]
        public void CreateContributorBadge_ReturnsCorrectBadge()
        {
            // Act
            var badge = Badge.CreateContributorBadge();

            // Assert
            badge.Type.Should().Be(BadgeType.Contributor);
            badge.Name.Should().Be("Contributor");
            badge.Description.Should().Be("Made your first contribution to the community");
            badge.IconUrl.Should().Be("/badges/contributor.svg");
            badge.Category.Should().BeNull();
        }

        [Fact]
        public void CreateHelpfulBadge_ReturnsCorrectBadge()
        {
            // Act
            var badge = Badge.CreateHelpfulBadge();

            // Assert
            badge.Type.Should().Be(BadgeType.Helpful);
            badge.Name.Should().Be("Helpful");
            badge.Description.Should().Be("Received multiple upvotes for helpful answers");
            badge.IconUrl.Should().Be("/badges/helpful.svg");
        }

        [Fact]
        public void CreateKnowledgeableBadge_WithCategory_ReturnsCorrectBadge()
        {
            // Arrange
            var category = "Technology";

            // Act
            var badge = Badge.CreateKnowledgeableBadge(category);

            // Assert
            badge.Type.Should().Be(BadgeType.Knowledgeable);
            badge.Name.Should().Be("Knowledgeable");
            badge.Description.Should().Be($"Demonstrated expertise in {category}");
            badge.Category.Should().Be(category);
        }

        [Fact]
        public void CreateExpertBadge_WithCategory_ReturnsCorrectBadge()
        {
            // Arrange
            var category = "Database Design";

            // Act
            var badge = Badge.CreateExpertBadge(category);

            // Assert
            badge.Type.Should().Be(BadgeType.Expert);
            badge.Name.Should().Be("Expert");
            badge.Description.Should().Be($"Recognized expert in {category}");
            badge.Category.Should().Be(category);
        }

        [Theory]
        [InlineData(100, BadgeType.Reputation100, "Getting Started", "Reached 100 reputation points")]
        [InlineData(500, BadgeType.Reputation500, "Rising Star", "Reached 500 reputation points")]
        [InlineData(1000, BadgeType.Reputation1000, "Reputation Contributor", "Reached 1,000 reputation points")]
        [InlineData(2500, BadgeType.Reputation2500, "Reputation Specialist", "Reached 2,500 reputation points")]
        [InlineData(5000, BadgeType.Reputation5000, "Reputation Expert", "Reached 5,000 reputation points")]
        [InlineData(10000, BadgeType.Reputation10000, "Reputation Master", "Reached 10,000 reputation points")]
        public void CreateReputationMilestoneBadge_ValidReputation_ReturnsCorrectBadge(
            int reputation, BadgeType expectedType, string expectedName, string expectedDescription)
        {
            // Act
            var badge = Badge.CreateReputationMilestoneBadge(reputation);

            // Assert
            badge.Type.Should().Be(expectedType);
            badge.Name.Should().Be(expectedName);
            badge.Description.Should().Be(expectedDescription);
        }

        [Fact]
        public void CreateReputationMilestoneBadge_InvalidReputation_ThrowsException()
        {
            // Arrange
            var invalidReputation = 50;

            // Act & Assert
            var action = () => Badge.CreateReputationMilestoneBadge(invalidReputation);
            action.Should().Throw<ArgumentException>()
                .WithMessage($"Invalid reputation milestone: {invalidReputation}");
        }

        [Fact]
        public void Badge_Equality_SameBadges_AreEqual()
        {
            // Arrange
            var badge1 = Badge.CreateHelpfulBadge();
            var badge2 = Badge.CreateHelpfulBadge();

            // Act & Assert
            badge1.Should().Be(badge2);
            badge1.GetHashCode().Should().Be(badge2.GetHashCode());
        }

        [Fact]
        public void Badge_Equality_DifferentBadges_AreNotEqual()
        {
            // Arrange
            var badge1 = Badge.CreateHelpfulBadge();
            var badge2 = Badge.CreateContributorBadge();

            // Act & Assert
            badge1.Should().NotBe(badge2);
        }

        [Fact]
        public void Badge_Equality_SameTypeWithDifferentCategories_AreNotEqual()
        {
            // Arrange
            var badge1 = Badge.CreateKnowledgeableBadge("Technology");
            var badge2 = Badge.CreateKnowledgeableBadge("Database Design");

            // Act & Assert
            badge1.Should().NotBe(badge2);
        }
    }
}