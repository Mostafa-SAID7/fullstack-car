using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community
{
    public class CommunityUserActivity : BaseEntity
    {
        public string ActivityType { get; set; } = string.Empty; // QuestionAsked, AnswerGiven, VoteCast, AnswerAccepted, PostCreated, etc.
        public Guid ContentId { get; set; }
        public string? Category { get; set; }
        public int ReputationChange { get; set; } = 0;

        // Foreign Keys
        public Guid UserId { get; set; }

        // Navigation Properties
        public virtual ApplicationUser User { get; set; } = null!;
    }
}
