using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Pages
{
    public class PageCommentLike : BaseEntity
    {
        public DateTime LikedAt { get; set; } = DateTime.UtcNow;

        // Foreign Keys
        public Guid CommentId { get; set; }
        public Guid UserId { get; set; }

        // Navigation Properties
        public virtual PageComment Comment { get; set; } = null!;
        public virtual ApplicationUser User { get; set; } = null!;
    }
}