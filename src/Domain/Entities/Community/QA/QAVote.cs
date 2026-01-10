using Domain.Base;
using Domain.Enums.Community.QA;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.QA
{
    public class QAVote : BaseAuditableEntity
    {
        public VoteType VoteType { get; set; }
        public string ContentType { get; set; } = string.Empty; // "Question" or "Answer"
        public Guid ContentId { get; set; }

        // Foreign Keys
        public Guid UserId { get; set; }

        // Navigation Properties
        public virtual ApplicationUser User { get; set; } = null!;
    }
}