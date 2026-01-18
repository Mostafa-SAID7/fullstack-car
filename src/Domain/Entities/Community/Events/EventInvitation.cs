using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Events
{
    public class EventInvitation : BaseEntity
    {
        public Guid EventId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? Message { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Accepted, Rejected, Cancelled
        public DateTime InvitedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ExpiresAt { get; set; }
        public DateTime? RespondedAt { get; set; }
        public Guid InvitedBy { get; set; }

        // Navigation Properties
        public virtual Event Event { get; set; } = null!;
        public virtual ApplicationUser InvitedByUser { get; set; } = null!;
    }
}