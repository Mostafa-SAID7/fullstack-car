using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Groups
{
    public class GroupInvitation : BaseEntity
    {
        public Guid GroupId { get; set; }
        public Guid? InvitedUserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = "Member";
        public string? Message { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Accepted, Rejected, Expired
        public DateTime InvitedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ExpiresAt { get; set; }
        public DateTime? AcceptedAt { get; set; }
        public string InvitationToken { get; set; } = string.Empty;

        // Foreign Keys
        public Guid InvitedBy { get; set; }

        // Navigation Properties
        public virtual Group Group { get; set; } = null!;
        public virtual ApplicationUser InvitedByUser { get; set; } = null!;
        public virtual ApplicationUser? InvitedUser { get; set; }
    }
}