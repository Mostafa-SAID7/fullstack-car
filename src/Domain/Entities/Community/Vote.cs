using Domain.Base;
using Domain.Enums.Community;
using Domain.Entities.Identity;

namespace Domain.Entities.Community
{
    public class Vote : BaseAuditableEntity
    {
        public VoteType VoteType { get; set; }
        public string ContentType { get; set; } = string.Empty; // "Question", "Answer", "Post", etc.
        public Guid ContentId { get; set; }

        // Foreign Keys
        public Guid UserId { get; set; }

        // Navigation Properties
        public virtual ApplicationUser User { get; set; } = null!;
    }
}
