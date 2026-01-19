using Domain.Base;
using Domain.Entities.Identity;
using Domain.Enums.Common;

namespace Domain.Entities.Common
{
    public class ContentHistory : BaseEntity
    {
        public Domain.Enums.Common.ContentType ContentType { get; set; }
        public Guid ContentId { get; set; }
        
        public string Content { get; set; } = string.Empty;
        public int Version { get; set; }
        public string EditReason { get; set; } = string.Empty;
        
        public Guid EditedByUserId { get; set; }
        public DateTime EditedAt { get; set; }

        // Navigation Properties
        public virtual ApplicationUser EditedByUser { get; set; } = null!;
    }
}
