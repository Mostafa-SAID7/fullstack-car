using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Reviews
{
    public class ReviewCommentLike : BaseEntity
    {
        public DateTime LikedAt { get; set; } = DateTime.UtcNow;

        // Foreign Keys
        public Guid CommentId { get; set; }
        public Guid UserId { get; set; }

        // Navigation Properties
        public virtual ReviewComment Comment { get; set; } = null!;
        public virtual ApplicationUser User { get; set; } = null!;
    }
}
