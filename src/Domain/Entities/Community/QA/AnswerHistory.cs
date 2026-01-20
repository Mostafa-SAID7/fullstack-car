using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.QA
{
    public class AnswerHistory : BaseAuditableEntity
    {
        public Guid AnswerId { get; set; }
        public string Content { get; set; } = string.Empty;
        public string ChangeReason { get; set; } = string.Empty;
        public string EditReason { get; set; } = string.Empty; // Alias for ChangeReason
        public new int Version { get; set; }
        public Guid EditedByUserId { get; set; }
        public DateTime EditedAt { get; set; }

        // Navigation Properties
        public virtual Answer Answer { get; set; } = null!;
        public virtual ApplicationUser EditedByUser { get; set; } = null!;
    }
}