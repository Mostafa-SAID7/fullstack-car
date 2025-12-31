using Domain.Enums.Identity;

namespace Application.Features.Admin.Management.Models
{
    // User management models
    public class AdminUser
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName => $"{FirstName} {LastName}".Trim();
        public string Email { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime JoinDate { get; set; }
        public DateTime? LastLogin { get; set; }
        public int PostsCount { get; set; }
        public int GroupsCount { get; set; }
        public int ReviewsCount { get; set; }
        public List<string> Roles { get; set; } = new();
        public UserStatus UserStatus { get; set; }
        public DateTime? SuspendedUntil { get; set; }
        public string? SuspensionReason { get; set; }
    }

    public class UserStatistics
    {
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public int SuspendedUsers { get; set; }
        public int BannedUsers { get; set; }
        public int NewUsersThisMonth { get; set; }
        public double UserGrowthRate { get; set; }
        public int VerifiedUsers { get; set; }
        public int UnverifiedUsers { get; set; }
        public Dictionary<string, int> UsersByRole { get; set; } = new();
        public Dictionary<string, int> UsersByStatus { get; set; } = new();
    }

    public class UserActivity
    {
        public Guid Id { get; set; }
        public string ActivityType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string IpAddress { get; set; } = string.Empty;
        public string UserAgent { get; set; } = string.Empty;
        public Dictionary<string, object> Metadata { get; set; } = new();
    }

    public class UserReport
    {
        public Guid Id { get; set; }
        public Guid ReportedUserId { get; set; }
        public string ReportedUserName { get; set; } = string.Empty;
        public Guid ReporterId { get; set; }
        public string ReporterName { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public bool IsResolved { get; set; }
        public string? Resolution { get; set; }
        public Guid? ResolvedBy { get; set; }
        public DateTime? ResolvedAt { get; set; }
    }

    public class UserAction
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public Dictionary<string, object> Data { get; set; } = new();
    }

    public class Impersonation
    {
        public string Token { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public string TargetUserId { get; set; } = string.Empty;
        public string TargetUserName { get; set; } = string.Empty;
    }
}