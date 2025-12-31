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
        public bool IsResolved { get; set; } = false;
        public string? Resolution { get; set; }
        public Guid? ResolvedBy { get; set; }
        public DateTime? ResolvedAt { get; set; }

        // Navigation Properties
        public virtual Post Post { get; set; } = null!;
        public virtual ApplicationUser User { get; set; } = null!;
        public virtual ApplicationUser? Resolver { get; set; }
    }
}
