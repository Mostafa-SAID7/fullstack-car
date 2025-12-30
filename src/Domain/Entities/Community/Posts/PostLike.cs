using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Posts
{
    public class PostLike : BaseEntity
    {
        public Guid UserId { get; set; }
        public Guid PostId { get; set; }

        // Navigation Properties
        public virtual ApplicationUser User { get; set; } = null!;
        public virtual Post Post { get; set; } = null!;
    }
}
