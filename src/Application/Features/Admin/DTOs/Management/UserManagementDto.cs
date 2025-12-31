using Domain.Enums.Identity;

namespace Application.Features.Admin.DTOs.Management
{
    public class AdminUserDto
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

    public class UserStatisticsDto
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

    public class UserActivityDto
    {
        public Guid Id { get; set; }
        public string ActivityType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string IpAddress { get; set; } = string.Empty;
        public string UserAgent { get; set; } = string.Empty;
        public Dictionary<string, object> Metadata { get; set; } = new();
    }

    public class UserReportDto
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

    // Request DTOs
    public class SuspendUserRequest
    {
        public string Reason { get; set; } = string.Empty;
        public int? DurationDays { get; set; }
        public bool NotifyUser { get; set; } = true;
    }

    public class BanUserRequest
    {
        public string Reason { get; set; } = string.Empty;
        public string Duration { get; set; } = "Permanent"; // "Permanent", "30Days", "7Days", etc.
        public bool DeleteContent { get; set; } = false;
        public bool NotifyUser { get; set; } = true;
    }

    public class DeleteUserRequest
    {
        public string Reason { get; set; } = string.Empty;
        public bool DeleteContent { get; set; } = false;
        public bool TransferContent { get; set; } = false;
        public Guid? TransferToUserId { get; set; }
    }

    public class SendMessageRequest
    {
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Priority { get; set; } = "Normal"; // "Low", "Normal", "High", "Critical"
        public string MessageType { get; set; } = "Info"; // "Info", "Warning", "Alert"
        public bool RequireAcknowledgment { get; set; } = false;
    }

    public class UpdateUserRolesRequest
    {
        public List<string> Roles { get; set; } = new();
        public string Reason { get; set; } = string.Empty;
    }

    public class ImpersonateUserRequest
    {
        public string Reason { get; set; } = string.Empty;
        public int DurationMinutes { get; set; } = 30;
    }
}
    // Role Management DTOs
    public class RoleDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<string> Permissions { get; set; } = new();
        public int UserCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool IsSystemRole { get; set; }
    }

    public class CreateRoleRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<string> Permissions { get; set; } = new();
    }

    public class UpdateRoleRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<string> Permissions { get; set; } = new();
    }

    public class PermissionDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public bool IsSystemPermission { get; set; }
    }