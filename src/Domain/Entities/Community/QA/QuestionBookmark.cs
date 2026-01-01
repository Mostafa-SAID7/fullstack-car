using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.QA
{
    public class QuestionBookmark : BaseEntity
    {
        public DateTime BookmarkedAt { get; set; } = DateTime.UtcNow;
        public string? Notes { get; set; }

        // Foreign Keys
        public Guid QuestionId { get; set; }
        public Guid UserId { get; set; }

        // Navigation Properties
        public virtual Question Question { get; set; } = null!;
        public virtual ApplicationUser User { get; set; } = null!;
    }
}