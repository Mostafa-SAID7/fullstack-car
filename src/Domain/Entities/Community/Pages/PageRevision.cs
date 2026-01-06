using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Pages
{
    public class PageRevision : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Summary { get; set; }
        public int VersionNumber { get; set; }
        public new DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsPublished { get; set; } = false;

        // Foreign Keys
        public Guid PageId { get; set; }
        public Guid UserId { get; set; }

        // Navigation Properties
        public virtual Page Page { get; set; } = null!;
        public virtual ApplicationUser User { get; set; } = null!;
    }
}
