namespace Application.Features.Admin.Management.Users.Reports.Models
{
    public class UserReport
    {
        public Guid Id { get; set; }
        public Guid ReportedUserId { get; set; }
        public Guid ReporterId { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime ReportedAt { get; set; }
        public bool IsResolved { get; set; }
        public DateTime? ResolvedAt { get; set; }
        public Guid? ResolvedBy { get; set; }
        public string? Resolution { get; set; }
    }

    public class UserReportDetail : UserReport
    {
        public string ReporterName { get; set; } = string.Empty;
        public string ReportedUserName { get; set; } = string.Empty;
        public List<string> Evidence { get; set; } = new();
        public string AdminNotes { get; set; } = string.Empty;
    }

    public class UserReportStatistics
    {
        public int TotalReports { get; set; }
        public int ResolvedReports { get; set; }
        public int PendingReports { get; set; }
        public int DismissedReports { get; set; }
        public Dictionary<string, int> ReportsByCategory { get; set; } = new();
        public Dictionary<string, int> ReportsByStatus { get; set; } = new();
        public double AverageResolutionTime { get; set; }
    }
}
