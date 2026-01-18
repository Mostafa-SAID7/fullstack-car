using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Groups
{
    public class GroupEvent : BaseAuditableEntity
    {
        public Guid GroupId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Location { get; set; }
        public string EventType { get; set; } = "General";
        public bool IsOnline { get; set; } = false;
        public string? OnlineLink { get; set; }
        public int? MaxAttendees { get; set; }
        public bool RequireApproval { get; set; } = false;
        public string Status { get; set; } = "Active";
        public string? ImageUrl { get; set; }
        public List<string> Tags { get; set; } = new();

        // Foreign Keys
        public Guid CreatedBy { get; set; }

        // Navigation Properties
        public virtual Group Group { get; set; } = null!;
        public virtual ApplicationUser Creator { get; set; } = null!;
        public virtual ICollection<GroupEventAttendance> Attendances { get; set; } = new List<GroupEventAttendance>();
    }
}