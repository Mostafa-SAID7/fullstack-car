using Domain.Base;
using Domain.Enums.Community.News;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.News
{
    public class ArticleShare : BaseEntity
    {
        public SharePlatform Platform { get; set; }
        public DateTime SharedAt { get; set; } = DateTime.UtcNow;
        public string? ShareUrl { get; set; }

        // Foreign Keys
        public Guid ArticleId { get; set; }
        public Guid? UserId { get; set; } // Nullable for anonymous shares

        // Navigation Properties
        public virtual Article Article { get; set; } = null!;
        public virtual ApplicationUser? User { get; set; }
    }
}