using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Events
{
    public class EventCommentLike : BaseEntity
    {
        public Guid CommentId { get; set; }
        public Guid UserId { get; set; }
        public DateTime LikedAt { get; set; }

        // Navigation properties
        public virtual EventComment Comment { get; set; } = null!;
        public virtual ApplicationUser User { get; set; } = null!;
    }
}