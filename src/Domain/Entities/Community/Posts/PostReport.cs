using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Posts
{
    public class PostReport : BaseAuditableEntity
    {
        public Guid PostId { get; set; }
        public Guid UserId { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;

        // Navigation Properties
        public virtual Post Post { get; set; } = null!;
        public virtual User User { get; set; } = null!;
    }
}
