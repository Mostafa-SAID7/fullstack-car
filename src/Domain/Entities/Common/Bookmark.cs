using Domain.Base;
using Domain.Enums.Common;
using Domain.Entities.Identity;

namespace Domain.Entities.Common
{
    public class Bookmark : BaseAuditableEntity
    {
        public Guid UserId { get; set; }
        
        // Generic Content Reference
        public ContentType ContentType { get; set; }
        public Guid ContentId { get; set; }
        
        public string? Folder { get; set; }
        public string? Notes { get; set; }

        // Navigation Properties
        public virtual ApplicationUser User { get; set; } = null!;
    }
}
