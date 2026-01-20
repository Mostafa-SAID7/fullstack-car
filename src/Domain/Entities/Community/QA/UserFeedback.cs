using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.QA
{
    public class UserFeedback : BaseAuditableEntity
    {
        public Guid UserId { get; set; }
        public string FeedbackType { get; set; } = string.Empty; // "SatisfactionSurvey", "BugReport", "FeatureRequest", etc.
        public string Category { get; set; } = string.Empty;
        public double Rating { get; set; }
        public string? Comments { get; set; }
        public string? AdditionalData { get; set; } // JSON for additional structured data
        public bool IsResolved { get; set; } = false;
        public DateTime? ResolvedAt { get; set; }
        public Guid? ResolvedByUserId { get; set; }

        // Navigation Properties
        public virtual ApplicationUser User { get; set; } = null!;
        public virtual ApplicationUser? ResolvedByUser { get; set; }
    }
}