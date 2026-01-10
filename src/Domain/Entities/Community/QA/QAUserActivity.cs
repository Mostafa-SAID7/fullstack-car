using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.QA
{
    public class QAUserActivity : BaseEntity
    {
        public string ActivityType { get; set; } = string.Empty; // QuestionAsked, AnswerGiven, VoteCast, AnswerAccepted
        public Guid ContentId { get; set; }
        public string? Category { get; set; }
        public int ReputationChange { get; set; } = 0;

        // Foreign Keys
        public Guid UserId { get; set; }

        // Navigation Properties
        public virtual ApplicationUser User { get; set; } = null!;
    }
}