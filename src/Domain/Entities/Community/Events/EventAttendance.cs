using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Events
{
    public class EventAttendance : BaseEntity
    {
        public Guid EventId { get; set; }
        public Guid UserId { get; set; }
        public string AttendanceType { get; set; } = "Going"; // Going, Maybe, NotGoing
        public DateTime ResponseDate { get; set; } = DateTime.UtcNow;
        public string? Notes { get; set; }
        public bool IsApproved { get; set; } = true;
        public DateTime? ApprovedAt { get; set; }
        public Guid? ApprovedBy { get; set; }
        public bool CheckedIn { get; set; } = false;
        public DateTime? CheckedInAt { get; set; }

        // Navigation Properties
        public virtual Event Event { get; set; } = null!;
        public virtual ApplicationUser User { get; set; } = null!;
        public virtual ApplicationUser? ApprovedByUser { get; set; }
    }
}