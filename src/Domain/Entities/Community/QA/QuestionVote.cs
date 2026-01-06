using Domain.Base;
using Domain.Enums.Community.QA;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.QA
{
    public class QuestionVote : BaseEntity
    {
        public VoteType VoteType { get; set; }

        // Foreign Keys
        public Guid QuestionId { get; set; }
        public Guid UserId { get; set; }

        // Navigation Properties
        public virtual Question Question { get; set; } = null!;
        public virtual ApplicationUser User { get; set; } = null!;
    }
}
