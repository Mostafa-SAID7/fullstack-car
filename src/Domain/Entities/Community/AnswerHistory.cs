using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community
{
    public class AnswerHistory : BaseEntity
    {
        public Guid AnswerId { get; set; }
        public string Content { get; set; } = string.Empty;
        public int Version { get; set; }
        public string EditReason { get; set; } = string.Empty;
        public Guid EditedByUserId { get; set; }
        public DateTime EditedAt { get; set; }

        // Navigation Properties
        public virtual Answer Answer { get; set; } = null!;
        public virtual ApplicationUser EditedByUser { get; set; } = null!;
    }
}
