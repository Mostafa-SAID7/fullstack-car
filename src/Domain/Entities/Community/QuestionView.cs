using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community
{
    public class QuestionView : BaseEntity
    {
        public DateTime ViewedAt { get; set; } = DateTime.UtcNow;
        public string? IpAddress { get; set; }
        public string? UserAgent { get; set; }

        // Foreign Keys
        public Guid QuestionId { get; set; }
        public Guid? UserId { get; set; } // Nullable for anonymous views

        // Navigation Properties
        public virtual Question Question { get; set; } = null!;
        public virtual ApplicationUser? User { get; set; }
    }
}
