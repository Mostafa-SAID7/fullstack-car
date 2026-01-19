using Domain.Base;
using Domain.Enums.Common;
using Domain.Entities.Identity;

namespace Domain.Entities.Common
{
    public class View : BaseEntity
    {
        public DateTime ViewedAt { get; set; } = DateTime.UtcNow;
        public string? IpAddress { get; set; }
        public string? UserAgent { get; set; }
        
        // Generic Content Reference
        public Domain.Enums.Common.ContentType ContentType { get; set; }
        public Guid ContentId { get; set; }
        
        // Foreign Keys
        public Guid? UserId { get; set; } // Nullable for anonymous views

        // Navigation Properties
        public virtual ApplicationUser? User { get; set; }
    }
}
