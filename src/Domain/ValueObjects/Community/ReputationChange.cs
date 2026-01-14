using Domain.Base;
using Domain.Enums.Community.QA;

namespace Domain.ValueObjects.Community
{
    public class ReputationChange : ValueObject
    {
        public int Points { get; private set; }
        public ReputationChangeReason Reason { get; private set; }
        public string Description { get; private set; }
        public DateTime Timestamp { get; private set; }
        public Guid? ContentId { get; private set; }
        public string? Category { get; private set; }

        private ReputationChange()
    {
        Description = string.Empty;
    } // For EF Core

        public ReputationChange(
            int points, 
            ReputationChangeReason reason, 
            string description, 
            Guid? contentId = null, 
            string? category = null)
        {
            Points = points;
            Reason = reason;
            Description = description ?? throw new ArgumentNullException(nameof(description));
            Timestamp = DateTime.UtcNow;
            ContentId = contentId;
            Category = category;
        }

        public static ReputationChange ForAnswerUpvote(Guid answerId, string category) => new(
            10, 
            ReputationChangeReason.AnswerUpvoted, 
            "Answer received an upvote", 
            answerId, 
            category
        );

        public static ReputationChange ForQuestionUpvote(Guid questionId, string category) => new(
            5, 
            ReputationChangeReason.QuestionUpvoted, 
            "Question received an upvote", 
            questionId, 
            category
        );

        public static ReputationChange ForAnswerDownvote(Guid answerId, string category) => new(
            -2, 
            ReputationChangeReason.AnswerDownvoted, 
            "Answer received a downvote", 
            answerId, 
            category
        );

        public static ReputationChange ForQuestionDownvote(Guid questionId, string category) => new(
            -2, 
            ReputationChangeReason.QuestionDownvoted, 
            "Question received a downvote", 
            questionId, 
            category
        );

        public static ReputationChange ForAnswerAccepted(Guid answerId, string category) => new(
            25, 
            ReputationChangeReason.AnswerAccepted, 
            "Answer was accepted by question author", 
            answerId, 
            category
        );

        public static ReputationChange ForBestAnswerBonus(Guid answerId, string category) => new(
            10, 
            ReputationChangeReason.BestAnswerBonus, 
            "Bonus for providing the best answer", 
            answerId, 
            category
        );

        public static ReputationChange ForExpertBonus(string category) => new(
            50, 
            ReputationChangeReason.ExpertBonus, 
            $"Expert recognition bonus in {category}", 
            null, 
            category
        );

        public static ReputationChange ForSpamPenalty(Guid contentId) => new(
            -100, 
            ReputationChangeReason.SpamPenalty, 
            "Penalty for spam content", 
            contentId
        );

        public static ReputationChange ForModerationPenalty(Guid contentId, string reason) => new(
            -50, 
            ReputationChangeReason.ModerationPenalty, 
            $"Moderation penalty: {reason}", 
            contentId
        );

        public static ReputationChange ForManualAdjustment(int points, string reason) => new(
            points, 
            ReputationChangeReason.ManualAdjustment, 
            $"Manual adjustment: {reason}"
        );

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Points;
            yield return Reason;
            yield return Description;
            yield return Timestamp;
            yield return ContentId ?? Guid.Empty;
            yield return Category ?? string.Empty;
        }
    }
}