namespace Application.Features.Community.Events.Models
{
    public class EventAttendanceStats
    {
        public int TotalAttendees { get; set; }
        public int GoingCount { get; set; }
        public int MaybeCount { get; set; }
        public int NotGoingCount { get; set; }
        public int PendingApprovalCount { get; set; }
        public int CheckedInCount { get; set; }
        public double AttendanceRate { get; set; }
    }
}
