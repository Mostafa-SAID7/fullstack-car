using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Events
{
    public class Event : BaseAuditableEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string Category { get; set; } = string.Empty;
        public string EventType { get; set; } = "General";
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Location { get; set; }
        public bool IsOnline { get; set; } = false;
        public string? OnlineLink { get; set; }
        public int? MaxAttendees { get; set; }
        public bool RequireApproval { get; set; } = false;
        public bool IsPublic { get; set; } = true;
        public bool IsActive { get; set; } = true;
        public bool IsFeatured { get; set; } = false;
        public string Status { get; set; } = "Active"; // Active, Cancelled, Completed
        public int AttendeeCount { get; set; } = 0;
        public decimal? Price { get; set; }
        public string? Currency { get; set; }
        public List<string> Tags { get; set; } = new();

        // Generic Content Reference
        public Domain.Enums.Common.ContentType? TargetContentType { get; set; }
        public Guid? TargetId { get; set; }

        // Foreign Keys
        public Guid OrganizerId { get; set; }

        // Navigation Properties
        public virtual ApplicationUser Organizer { get; set; } = null!;
        public virtual ICollection<EventAttendance> Attendances { get; set; } = new List<EventAttendance>();
        public virtual ICollection<EventComment> Comments { get; set; } = new List<EventComment>();
        public virtual ICollection<EventInvitation> Invitations { get; set; } = new List<EventInvitation>();
        public virtual ICollection<EventUpdate> Updates { get; set; } = new List<EventUpdate>();
    }
}