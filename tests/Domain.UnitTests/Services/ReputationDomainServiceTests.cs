using Domain.Entities.Community.QA;
using Domain.Enums.Community.QA;
using Domain.Interfaces;
using Domain.Services;
using Domain.ValueObjects.Community;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Domain.UnitTests.Services
{
    public class ReputationDomainServiceTests
    {
        private readonly Mock<IRepository<UserReputation>> _userReputationRepositoryMock;
        private readonly Mock<IRepository<QAUserActivity>> _activityRepositoryMock;
        private readonly Mock<ILogger<ReputationDomainService>> _loggerMock;
        private readonly ReputationDomainService _service;

        public ReputationDomainServiceTests()
        {
            _userReputationRepositoryMock = new Mock<IRepository<UserReputation>>();
            _activityRepositoryMock = new Mock<IRepository<QAUserActivity>>();
            _loggerMock = new Mock<ILogger<ReputationDomainService>>();
            
            _service = new ReputationDomainService(
                _userReputationRepositoryMock.Object,
                _activityRepositoryMock.Object,
                _loggerMock.Object);
        }

        [Fact]
        public async Task CalculateReputationChangeAsync_AnswerGiven_ReturnsCorrectPoints()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var activityType = ActivityType.AnswerGiven;

            // Act
            var result = await _service.CalculateReputationChangeAsync(activityType, userId);

            // Assert
            result.Should().Be(5);
        }

        [Fact]
        public async Task CalculateReputationChangeAsync_AnswerAccepted_ReturnsCorrectPoints()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var activityType = ActivityType.AnswerAccepted;

            // Act
            var result = await _service.CalculateReputationChangeAsync(activityType, userId);

            // Assert
            result.Should().Be(25);
        }

        [Fact]
        public async Task CalculateReputationChangeAsync_WithExpertBonus_ReturnsIncreasedPoints()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var category = "Technology";
            var activityType = ActivityType.AnswerGiven;

            // Setup user reputation with expertise area
            var userReputation = new UserReputation
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ReputationScore = 1000,
                ExpertiseAreas = "[{\"Category\":\"Technology\",\"DisplayName\":\"Technology\",\"AnswerCount\":15,\"AcceptedAnswerCount\":10,\"AverageRating\":4.5,\"ResponseRate\":85.0,\"IsVerified\":true}]"
            };

            _userReputationRepositoryMock.Setup(r => r.GetAllAsync())
                .ReturnsAsync(new List<UserReputation> { userReputation });

            // Act
            var result = await _service.CalculateReputationChangeAsync(activityType, userId, category: category);

            // Assert
            result.Should().Be(6); // 5 * 1.2 = 6 (20% expert bonus)
        }

        [Fact]
        public async Task UpdateUserReputationAsync_NewUser_CreatesUserReputation()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var reputationChange = ReputationChange.ForAnswerUpvote(Guid.NewGuid(), "Technology");

            _userReputationRepositoryMock.Setup(r => r.GetAllAsync())
                .ReturnsAsync(new List<UserReputation>());

            _userReputationRepositoryMock.Setup(r => r.AddAsync(It.IsAny<UserReputation>()))
                .ReturnsAsync((UserReputation ur) => ur);

            _userReputationRepositoryMock.Setup(r => r.UpdateAsync(It.IsAny<UserReputation>()))
                .Returns(Task.CompletedTask);

            _activityRepositoryMock.Setup(r => r.AddAsync(It.IsAny<QAUserActivity>()))
                .ReturnsAsync((QAUserActivity qa) => qa);

            // Act
            var result = await _service.UpdateUserReputationAsync(userId, reputationChange);

            // Assert
            result.Should().NotBeNull();
            result.UserId.Should().Be(userId);
            result.ReputationScore.Should().Be(10); // Points from upvote
            result.UpvotesReceived.Should().Be(1);

            _userReputationRepositoryMock.Verify(r => r.AddAsync(It.IsAny<UserReputation>()), Times.Once);
            _userReputationRepositoryMock.Verify(r => r.UpdateAsync(It.IsAny<UserReputation>()), Times.Once);
            _activityRepositoryMock.Verify(r => r.AddAsync(It.IsAny<QAUserActivity>()), Times.Once);
        }

        [Fact]
        public async Task UpdateUserReputationAsync_ExistingUser_UpdatesReputation()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var existingReputation = new UserReputation
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ReputationScore = 100,
                UpvotesReceived = 5
            };

            var reputationChange = ReputationChange.ForAnswerUpvote(Guid.NewGuid(), "Technology");

            _userReputationRepositoryMock.Setup(r => r.GetAllAsync())
                .ReturnsAsync(new List<UserReputation> { existingReputation });

            _userReputationRepositoryMock.Setup(r => r.UpdateAsync(It.IsAny<UserReputation>()))
                .Returns(Task.CompletedTask);

            _activityRepositoryMock.Setup(r => r.AddAsync(It.IsAny<QAUserActivity>()))
                .ReturnsAsync((QAUserActivity qa) => qa);

            // Act
            var result = await _service.UpdateUserReputationAsync(userId, reputationChange);

            // Assert
            result.Should().NotBeNull();
            result.ReputationScore.Should().Be(110); // 100 + 10
            result.UpvotesReceived.Should().Be(6); // 5 + 1

            _userReputationRepositoryMock.Verify(r => r.UpdateAsync(It.IsAny<UserReputation>()), Times.Once);
            _activityRepositoryMock.Verify(r => r.AddAsync(It.IsAny<QAUserActivity>()), Times.Once);
        }

        [Fact]
        public async Task CheckForNewBadgesAsync_ReputationMilestone_ReturnsNewBadge()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var userReputation = new UserReputation
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ReputationScore = 500,
                BadgesEarned = "[]" // No existing badges
            };

            _userReputationRepositoryMock.Setup(r => r.GetAllAsync())
                .ReturnsAsync(new List<UserReputation> { userReputation });

            // Act
            var result = await _service.CheckForNewBadgesAsync(userId);

            // Assert
            result.Should().NotBeEmpty();
            result.Should().Contain(b => b.Type == BadgeType.Reputation100);
            result.Should().Contain(b => b.Type == BadgeType.Reputation500);
        }

        [Fact]
        public async Task CheckForNewBadgesAsync_FirstAnswer_ReturnsFirstAnswerBadge()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var userReputation = new UserReputation
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ReputationScore = 50,
                AnswersGiven = 1,
                BadgesEarned = "[]"
            };

            _userReputationRepositoryMock.Setup(r => r.GetAllAsync())
                .ReturnsAsync(new List<UserReputation> { userReputation });

            // Act
            var result = await _service.CheckForNewBadgesAsync(userId);

            // Assert
            result.Should().Contain(b => b.Type == BadgeType.FirstAnswer);
        }

        [Fact]
        public async Task AwardBadgeAsync_NewBadge_AddsBadgeToUser()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var userReputation = new UserReputation
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ReputationScore = 100,
                BadgesEarned = "[]"
            };

            var badge = Badge.CreateHelpfulBadge();

            _userReputationRepositoryMock.Setup(r => r.GetAllAsync())
                .ReturnsAsync(new List<UserReputation> { userReputation });

            _userReputationRepositoryMock.Setup(r => r.UpdateAsync(It.IsAny<UserReputation>()))
                .Returns(Task.CompletedTask);

            _activityRepositoryMock.Setup(r => r.AddAsync(It.IsAny<QAUserActivity>()))
                .ReturnsAsync((QAUserActivity qa) => qa);

            // Act
            var result = await _service.AwardBadgeAsync(userId, badge);

            // Assert
            result.Should().NotBeNull();
            result.BadgesEarned.Should().Contain("Helpful");

            _userReputationRepositoryMock.Verify(r => r.UpdateAsync(It.IsAny<UserReputation>()), Times.Once);
            _activityRepositoryMock.Verify(r => r.AddAsync(It.IsAny<QAUserActivity>()), Times.Once);
        }

        [Fact]
        public async Task HasBadgeAsync_UserHasBadge_ReturnsTrue()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var badge = Badge.CreateHelpfulBadge();
            var userReputation = new UserReputation
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ReputationScore = 100,
                BadgesEarned = $"[{System.Text.Json.JsonSerializer.Serialize(badge)}]"
            };

            _userReputationRepositoryMock.Setup(r => r.GetAllAsync())
                .ReturnsAsync(new List<UserReputation> { userReputation });

            // Act
            var result = await _service.HasBadgeAsync(userId, BadgeType.Helpful);

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public async Task CanUserDownvoteAsync_SufficientReputation_ReturnsTrue()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var userReputation = new UserReputation
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ReputationScore = 200 // Above 125 threshold
            };

            _userReputationRepositoryMock.Setup(r => r.GetAllAsync())
                .ReturnsAsync(new List<UserReputation> { userReputation });

            // Act
            var result = await _service.CanUserDownvoteAsync(userId);

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public async Task CanUserDownvoteAsync_InsufficientReputation_ReturnsFalse()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var userReputation = new UserReputation
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ReputationScore = 50 // Below 125 threshold
            };

            _userReputationRepositoryMock.Setup(r => r.GetAllAsync())
                .ReturnsAsync(new List<UserReputation> { userReputation });

            // Act
            var result = await _service.CanUserDownvoteAsync(userId);

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public async Task GetRequiredReputationForPrivilegeAsync_ValidPrivilege_ReturnsCorrectAmount()
        {
            // Arrange
            var privilegeName = "Downvote";

            // Act
            var result = await _service.GetRequiredReputationForPrivilegeAsync(privilegeName);

            // Assert
            result.Should().Be(125);
        }

        [Fact]
        public async Task RecordActivityAsync_ValidActivity_CreatesActivity()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var contentId = Guid.NewGuid();
            var activityType = ActivityType.AnswerGiven;
            var category = "Technology";
            var reputationChange = 5;

            _activityRepositoryMock.Setup(r => r.AddAsync(It.IsAny<QAUserActivity>()))
                .ReturnsAsync((QAUserActivity qa) => qa);

            // Act
            var result = await _service.RecordActivityAsync(userId, activityType, contentId, category, reputationChange);

            // Assert
            result.Should().NotBeNull();
            result.UserId.Should().Be(userId);
            result.ContentId.Should().Be(contentId);
            result.ActivityType.Should().Be(activityType.ToString());
            result.Category.Should().Be(category);
            result.ReputationChange.Should().Be(reputationChange);

            _activityRepositoryMock.Verify(r => r.AddAsync(It.IsAny<QAUserActivity>()), Times.Once);
        }
    }
}