using Domain.Base;
using Domain.Enums.Shared;
using Domain.Entities.Identity;

namespace Domain.Entities.Shared
{
    public class Notification : BaseAuditableEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public NotificationType Type { get; set; }
        public bool IsRead { get; set; } = false;
        public string? TargetUrl { get; set; } // URL to navigate when clicked
        
        // Relationship
        public Guid UserId { get; set; }
        public virtual User User { get; set; } = null!;
        
        // Optional: Source user (who triggered the notification)
        public Guid? SourceUserId { get; set; }
        public virtual User? SourceUser { get; set; }
    }
}
