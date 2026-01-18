using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Groups
{
    public class GroupEventAttendance : BaseEntity
    {
        public Guid EventId { get; set; }
        public Guid UserId { get; set; }
        public string AttendanceType { get; set; } = "Going"; // Going, Maybe, NotGoing
        public DateTime ResponseDate { get; set; } = DateTime.UtcNow;
        public string? Notes { get; set; }
        public bool IsApproved { get; set; } = true;
        public DateTime? ApprovedAt { get; set; }
        public bool IsGoing => AttendanceType == "Going";

        // Navigation Properties
        public virtual GroupEvent Event { get; set; } = null!;
        public virtual ApplicationUser User { get; set; } = null!;
    }
}