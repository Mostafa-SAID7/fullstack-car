using Domain.Enums.Identity;

namespace Application.Features.Admin.Management.DTOs.Requests
{
    public class GetUsersRequest
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SearchTerm { get; set; }
        public UserStatus? Status { get; set; }
        public string? Role { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string SortBy { get; set; } = "CreatedAt";
        public string SortDirection { get; set; } = "desc";
    }

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

    public class GetUserReportsRequest
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public Guid? ReportedUserId { get; set; }
        public Guid? ReporterId { get; set; }
        public string? Category { get; set; }
        public bool? IsResolved { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
}