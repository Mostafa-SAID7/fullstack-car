using Domain.Enums.Community.Posts;

namespace Application.Features.Admin.Moderation.DTOs
{
    public class ContentModerationDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty; // "Post", "Comment", "Review", "Group"
        public string Author { get; set; } = string.Empty;
        public string AuthorEmail { get; set; } = string.Empty;
        public Guid AuthorId { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; } = string.Empty;
        public int ReportCount { get; set; }
        public List<ContentReportDto> Reports { get; set; } = new();
        public ModerationHistoryDto? LastModeration { get; set; }
    }

    public class ContentReportDto
    {
        public Guid Id { get; set; }
        public Guid ContentId { get; set; }
        public string ContentType { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public Guid ReporterId { get; set; }
        public string ReporterName { get; set; } = string.Empty;
        public string ReporterEmail { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public bool IsResolved { get; set; }
        public string? Resolution { get; set; }
        public Guid? ResolvedBy { get; set; }
        public string? ResolvedByName { get; set; }
        public DateTime? ResolvedAt { get; set; }
        public string Priority { get; set; } = "Normal"; // "Low", "Normal", "High", "Critical"
    }

    public class ModerationHistoryDto
    {
        public Guid Id { get; set; }
        public Guid ContentId { get; set; }
        public string ContentType { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty; // "Approved", "Rejected", "Deleted", "Flagged"
        public string Reason { get; set; } = string.Empty;
        public Guid ModeratorId { get; set; }
        public string ModeratorName { get; set; } = string.Empty;
        public DateTime ActionDate { get; set; }
        public Dictionary<string, object> Metadata { get; set; } = new();
    }

    public class ModerationStatsDto
    {
        public int TotalReports { get; set; }
        public int PendingReports { get; set; }
        public int ResolvedReports { get; set; }
        public int TotalFlaggedContent { get; set; }
        public int PendingApprovals { get; set; }
        public int ApprovedToday { get; set; }
        public int RejectedToday { get; set; }
        public Dictionary<string, int> ReportsByCategory { get; set; } = new();
        public Dictionary<string, int> ContentByStatus { get; set; } = new();
        public List<TopReporterDto> TopReporters { get; set; } = new();
        public List<TopReportedUserDto> TopReportedUsers { get; set; } = new();
    }

    public class TopReporterDto
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int ReportCount { get; set; }
        public double AccuracyRate { get; set; }
    }

    public class TopReportedUserDto
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int ReportCount { get; set; }
        public int ViolationCount { get; set; }
    }

    // Request DTOs
    public class ApproveContentRequest
    {
        public string? Notes { get; set; }
        public bool NotifyAuthor { get; set; } = true;
    }

    public class RejectContentRequest
    {
        public string Reason { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public bool NotifyAuthor { get; set; } = true;
        public bool DeleteContent { get; set; } = false;
        public bool WarnUser { get; set; } = false;
    }

    public class ResolveReportRequest
    {
        public string Action { get; set; } = string.Empty; // "approve", "remove", "warn_user", "suspend_user", "ban_user"
        public string Notes { get; set; } = string.Empty;
        public bool NotifyReporter { get; set; } = true;
        public bool NotifyReported { get; set; } = true;
        public int? SuspensionDays { get; set; }
    }

    public class BulkModerationRequest
    {
        public List<Guid> ContentIds { get; set; } = new();
        public string Action { get; set; } = string.Empty; // "approve", "reject", "delete", "flag"
        public string Reason { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public bool NotifyAuthors { get; set; } = true;
    }

    public class ContentFilterRequest
    {
        public string? ContentType { get; set; }
        public string? Status { get; set; }
        public string? Category { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public Guid? AuthorId { get; set; }
        public Guid? ModeratorId { get; set; }
        public int? MinReports { get; set; }
        public string? Priority { get; set; }
        public bool? HasMedia { get; set; }
        public string? SearchTerm { get; set; }
    }

    public class AutoModerationRuleDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public List<string> Keywords { get; set; } = new();
        public List<string> Patterns { get; set; } = new();
        public string Action { get; set; } = string.Empty; // "flag", "auto_reject", "require_approval"
        public int Severity { get; set; } = 1; // 1-5
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid CreatedBy { get; set; }
        public string CreatedByName { get; set; } = string.Empty;
    }

    public class BulkModerationResult
    {
        public int TotalProcessed { get; set; }
        public int Successful { get; set; }
        public int Failed { get; set; }
        public List<string> Errors { get; set; } = new();
        public Dictionary<string, int> ActionCounts { get; set; } = new();
    }
}
