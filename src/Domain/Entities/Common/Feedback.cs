using Domain.Base;
using Domain.Enums.Common;
using Domain.Entities.Identity;

namespace Domain.Entities.Common
{
    public class Feedback : BaseAuditableEntity
    {
        public Guid UserId { get; set; }
        public string FeedbackType { get; set; } = string.Empty; // "General", "Satisfaction", "BugReport", etc.
        public int Rating { get; set; } // 1-5 scale
        public string? Comment { get; set; }
        public string? Category { get; set; }
        
        // Generic Content Reference
        public Domain.Enums.Common.ContentType? ContentType { get; set; }
        public Guid? ContentId { get; set; }
        
        public string? Metadata { get; set; }
        
        // Navigation Properties
        public virtual ApplicationUser User { get; set; } = null!;
    }
}
