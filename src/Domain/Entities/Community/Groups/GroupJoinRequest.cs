using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Groups
{
    public class GroupJoinRequest : BaseEntity
    {
        public Guid GroupId { get; set; }
        public Guid UserId { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? AdditionalInfo { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ProcessedAt { get; set; }
        public Guid? ProcessedBy { get; set; }
        public string? ProcessingReason { get; set; }
        public string? RejectionReason { get; set; }

        // Navigation Properties
        public virtual Group Group { get; set; } = null!;
        public virtual ApplicationUser User { get; set; } = null!;
        public virtual ApplicationUser? ProcessedByUser { get; set; }
    }
}