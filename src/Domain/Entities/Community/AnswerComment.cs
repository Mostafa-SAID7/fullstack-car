using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community
{
    public class AnswerComment : BaseAuditableEntity
    {
        public string Content { get; set; } = string.Empty;
        public new bool IsDeleted { get; set; } = false;
        public new DateTime? DeletedAt { get; set; }

        // Foreign Keys
        public Guid AnswerId { get; set; }
        public Guid UserId { get; set; }

        // Navigation Properties
        public virtual Answer Answer { get; set; } = null!;
        public virtual ApplicationUser User { get; set; } = null!;
    }
}
