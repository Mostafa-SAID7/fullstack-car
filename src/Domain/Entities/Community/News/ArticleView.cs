using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.News
{
    public class ArticleView : BaseEntity
    {
        public DateTime ViewedAt { get; set; } = DateTime.UtcNow;
        public string? IpAddress { get; set; }
        public string? UserAgent { get; set; }
        public string? Referrer { get; set; }

        // Foreign Keys
        public Guid ArticleId { get; set; }
        public Guid? UserId { get; set; } // Nullable for anonymous views

        // Navigation Properties
        public virtual Article Article { get; set; } = null!;
        public virtual ApplicationUser? User { get; set; }
    }
}