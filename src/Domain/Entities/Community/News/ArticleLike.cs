using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.News
{
    public class ArticleLike : BaseEntity
    {
        public DateTime LikedAt { get; set; } = DateTime.UtcNow;

        // Foreign Keys
        public Guid ArticleId { get; set; }
        public Guid UserId { get; set; }

        // Navigation Properties
        public virtual Article Article { get; set; } = null!;
        public virtual ApplicationUser User { get; set; } = null!;
    }
}
