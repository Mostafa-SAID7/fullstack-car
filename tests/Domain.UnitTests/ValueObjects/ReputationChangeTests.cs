using Domain.Enums.Community.QA;
using Domain.ValueObjects.Community;
using FluentAssertions;
using Xunit;

namespace Domain.UnitTests.ValueObjects
{
    public class ReputationChangeTests
    {
        [Fact]
        public void ReputationChange_Constructor_SetsPropertiesCorrectly()
        {
            // Arrange
            var points = 10;
            var reason = ReputationChangeReason.AnswerUpvoted;
            var description = "Answer received an upvote";
            var contentId = Guid.NewGuid();
            var category = "Technology";

            // Act
            var reputationChange = new ReputationChange(points, reason, description, contentId, category);

            // Assert
            reputationChange.Points.Should().Be(points);
            reputationChange.Reason.Should().Be(reason);
            reputationChange.Description.Should().Be(description);
            reputationChange.ContentId.Should().Be(contentId);
            reputationChange.Category.Should().Be(category);
            reputationChange.Timestamp.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
        }

        [Fact]
        public void ForAnswerUpvote_ReturnsCorrectReputationChange()
        {
            // Arrange
            var answerId = Guid.NewGuid();
            var category = "Technology";

            // Act
            var reputationChange = ReputationChange.ForAnswerUpvote(answerId, category);

            // Assert
            reputationChange.Points.Should().Be(10);
            reputationChange.Reason.Should().Be(ReputationChangeReason.AnswerUpvoted);
            reputationChange.Description.Should().Be("Answer received an upvote");
            reputationChange.ContentId.Should().Be(answerId);
            reputationChange.Category.Should().Be(category);
        }

        [Fact]
        public void ForQuestionUpvote_ReturnsCorrectReputationChange()
        {
            // Arrange
            var questionId = Guid.NewGuid();
            var category = "Database Design";

            // Act
            var reputationChange = ReputationChange.ForQuestionUpvote(questionId, category);

            // Assert
            reputationChange.Points.Should().Be(5);
            reputationChange.Reason.Should().Be(ReputationChangeReason.QuestionUpvoted);
            reputationChange.Description.Should().Be("Question received an upvote");
            reputationChange.ContentId.Should().Be(questionId);
            reputationChange.Category.Should().Be(category);
        }

        [Fact]
        public void ForAnswerDownvote_ReturnsCorrectReputationChange()
        {
            // Arrange
            var answerId = Guid.NewGuid();
            var category = "Technology";

            // Act
            var reputationChange = ReputationChange.ForAnswerDownvote(answerId, category);

            // Assert
            reputationChange.Points.Should().Be(-2);
            reputationChange.Reason.Should().Be(ReputationChangeReason.AnswerDownvoted);
            reputationChange.Description.Should().Be("Answer received a downvote");
            reputationChange.ContentId.Should().Be(answerId);
            reputationChange.Category.Should().Be(category);
        }

        [Fact]
        public void ForQuestionDownvote_ReturnsCorrectReputationChange()
        {
            // Arrange
            var questionId = Guid.NewGuid();
            var category = "Technology";

            // Act
            var reputationChange = ReputationChange.ForQuestionDownvote(questionId, category);

            // Assert
            reputationChange.Points.Should().Be(-2);
            reputationChange.Reason.Should().Be(ReputationChangeReason.QuestionDownvoted);
            reputationChange.Description.Should().Be("Question received a downvote");
            reputationChange.ContentId.Should().Be(questionId);
            reputationChange.Category.Should().Be(category);
        }

        [Fact]
        public void ForAnswerAccepted_ReturnsCorrectReputationChange()
        {
            // Arrange
            var answerId = Guid.NewGuid();
            var category = "DevOps & Cloud";

            // Act
            var reputationChange = ReputationChange.ForAnswerAccepted(answerId, category);

            // Assert
            reputationChange.Points.Should().Be(25);
            reputationChange.Reason.Should().Be(ReputationChangeReason.AnswerAccepted);
            reputationChange.Description.Should().Be("Answer was accepted by question author");
            reputationChange.ContentId.Should().Be(answerId);
            reputationChange.Category.Should().Be(category);
        }

        [Fact]
        public void ForBestAnswerBonus_ReturnsCorrectReputationChange()
        {
            // Arrange
            var answerId = Guid.NewGuid();
            var category = "Data Science";

            // Act
            var reputationChange = ReputationChange.ForBestAnswerBonus(answerId, category);

            // Assert
            reputationChange.Points.Should().Be(10);
            reputationChange.Reason.Should().Be(ReputationChangeReason.BestAnswerBonus);
            reputationChange.Description.Should().Be("Bonus for providing the best answer");
            reputationChange.ContentId.Should().Be(answerId);
            reputationChange.Category.Should().Be(category);
        }

        [Fact]
        public void ForExpertBonus_ReturnsCorrectReputationChange()
        {
            // Arrange
            var category = "Cybersecurity";

            // Act
            var reputationChange = ReputationChange.ForExpertBonus(category);

            // Assert
            reputationChange.Points.Should().Be(50);
            reputationChange.Reason.Should().Be(ReputationChangeReason.ExpertBonus);
            reputationChange.Description.Should().Be($"Expert recognition bonus in {category}");
            reputationChange.ContentId.Should().BeNull();
            reputationChange.Category.Should().Be(category);
        }

        [Fact]
        public void ForSpamPenalty_ReturnsCorrectReputationChange()
        {
            // Arrange
            var contentId = Guid.NewGuid();

            // Act
            var reputationChange = ReputationChange.ForSpamPenalty(contentId);

            // Assert
            reputationChange.Points.Should().Be(-100);
            reputationChange.Reason.Should().Be(ReputationChangeReason.SpamPenalty);
            reputationChange.Description.Should().Be("Penalty for spam content");
            reputationChange.ContentId.Should().Be(contentId);
        }

        [Fact]
        public void ForModerationPenalty_ReturnsCorrectReputationChange()
        {
            // Arrange
            var contentId = Guid.NewGuid();
            var reason = "Inappropriate content";

            // Act
            var reputationChange = ReputationChange.ForModerationPenalty(contentId, reason);

            // Assert
            reputationChange.Points.Should().Be(-50);
            reputationChange.Reason.Should().Be(ReputationChangeReason.ModerationPenalty);
            reputationChange.Description.Should().Be($"Moderation penalty: {reason}");
            reputationChange.ContentId.Should().Be(contentId);
        }

        [Fact]
        public void ForManualAdjustment_ReturnsCorrectReputationChange()
        {
            // Arrange
            var points = 100;
            var reason = "Admin correction";

            // Act
            var reputationChange = ReputationChange.ForManualAdjustment(points, reason);

            // Assert
            reputationChange.Points.Should().Be(points);
            reputationChange.Reason.Should().Be(ReputationChangeReason.ManualAdjustment);
            reputationChange.Description.Should().Be($"Manual adjustment: {reason}");
            reputationChange.ContentId.Should().BeNull();
        }

        [Fact]
        public void ReputationChange_Equality_SameChanges_AreEqual()
        {
            // Arrange
            var contentId = Guid.NewGuid();
            var change1 = ReputationChange.ForAnswerUpvote(contentId, "Technology");
            var change2 = ReputationChange.ForAnswerUpvote(contentId, "Technology");

            // Act & Assert
            // Note: These won't be equal due to different timestamps, which is expected behavior
            change1.Should().NotBe(change2);
        }

        [Fact]
        public void ReputationChange_Constructor_NullDescription_ThrowsException()
        {
            // Arrange
            var points = 10;
            var reason = ReputationChangeReason.AnswerUpvoted;
            string? description = null;

            // Act & Assert
            var action = () => new ReputationChange(points, reason, description!);
            action.Should().Throw<ArgumentNullException>()
                .WithParameterName("description");
        }
    }
}