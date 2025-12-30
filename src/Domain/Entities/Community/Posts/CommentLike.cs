using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Posts
{
    public class CommentLike : BaseEntity
    {
        public Guid UserId { get; set; }
        public Guid CommentId { get; set; }

        // Navigation Properties
        public virtual ApplicationUser User { get; set; } = null!;
        public virtual Comment Comment { get; set; } = null!;
    }
}
